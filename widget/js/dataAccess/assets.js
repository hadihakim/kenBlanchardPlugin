class Assets {
    /**
     * Get Database Tag
     */
    static get TAG() {
        return "assets";
    }

    /**
     * get an asset based on provided Id
     * @param {string} id asset Id
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static get = (id, callback) => {
        buildfire.publicData.getById(id, Assets.TAG, (err, result) => {
            if (err) return callback(err, null);
            result.data.id = result.id || null;
            callback(null, result);
        });
    };

    /**
     * This will insert one new Asset
     * It should sync the asset meta with datastore settings.assets_info
     * @param {Object} asset the new asset object to be added
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static add = (asset, callback) => {
        asset.createdBy = authManager.currentUser.email;
        asset.createdOn = new Date();
        asset.meta.createdOn = asset.createdOn;

        asset._buildfire.index = Assets.buildIndex(asset);

        buildfire.publicData.insert(asset, Assets.TAG, (error, record) => {
            if (error) return callback(error);
            // push the asset meta to datastore Settings
            asset.id = record.id;
            Settings.saveAssetMeta(asset, callback);
        });
    };

    /**
     * This will delete one Asset
     * It will sync/delete the asset meta from the datastore as well
     * @param {String} id id of asset to be deleted
     * @param {Function} callback callback function to process the response by passing a new asset object or error description if any
     */
    static delete = (id, callback) => {
        buildfire.publicData.delete(id, Assets.TAG, (error, response) => {
            if (error) return callback(error, null);
            // delete the asset meta from the datastore settings
            Settings.deleteAssetMeta(id, callback);
        });
    };

    /**
     * This will update an Asset
     * It will sync/delete the asset meta from the datastore as well
     * @param {String} id id of asset to be deleted
     * @param {Function} callback callback function to process the response by passing a new asset object or error description if any
     */
    static update = (id, updatedAsset, callback) => {
        updatedAsset.updatedOn = new Date();
        updatedAsset.updatedBy = authManager.currentUser.email;
        updatedAsset._buildfire.index = Assets.buildIndex(updatedAsset);
        buildfire.publicData.update(
            id,
            updatedAsset,
            Assets.TAG,
            (error, response) => {
                if (error) return callback(error, null);
                // update the assert meta inside datastore settings
                updatedAsset.id = id;
                Settings.saveAssetMeta(updatedAsset, callback);
            }
        );
    };

    /**
     * This will Update asset popularity (when asset is viewed by someone)
     * @param {string} id the id of the asset
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static incrementViews = (id, callback) => {
        return Stats.incrementViews(id, callback);
    };

    /**
     * This will generate the search filters used for searchAndSortAssets
     * @param {Object} options {searchText, sortType, topics, page}
     */
    static getSearchFilter = (searchText) => {
        let searchTerms = [];
        let filter = {
            "_buildfire.index.date1": {
                "$not": {
                    "$type": "null"
                }
            },
        };

        if (searchText) {
            searchTerms = searchText.trim().split(" ");
            filter.$or = searchTerms.map((item) => {
                const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").toLowerCase();
                return { "_buildfire.index.text": { $regex: escapedItem, $options: "i" } };
            });
        }

        return filter;
    }

    /**
     * Moved to local search. using Stats.views to sort assets locally
     * This will get all available assets based on search text, sortTye and topic filters
     * @param {Function} callback callback function to process the response
     * @param {Object} searchOptions {searchText, sortType, topics, page}
     */
    static searchAndSort = (searchOptions, callback) => {

        buildfire.publicData.search(searchOptions, Assets.TAG, (error, records) => {
            if (error) return callback(error);

            let assets = records.map(record => {
                record.data.id = record.id;
                return record.data;
            });

            return callback(null, assets || []);
        });
    };

    static getAssetTypetPerTopicsStats(assetType, callback) {
        let cmd = {
            pipelineStages: [{
                    $match: {
                        "_buildfire.index.string1": assetType,
                    }
                },
                {
                    $unwind: {
                        path: "$meta.topics"
                    }
                },
                {
                    $group: {
                        "_id": "$meta.topics",
                        "count": {
                            $sum: 1
                        }
                    }
                }
            ]
        }

        buildfire.publicData.aggregate(cmd, Assets.TAG, (err, result) => {
            if (err) return callback(err, null);
            // analytics
            Analytics.userAssetsByTopicsViews();
            callback(null, result);
        });
    }

    static bulkAdd(assets, callback) {
        buildfire.publicData.bulkInsert(assets, Assets.TAG, (error, result) => {
            if (error) return callback(error, null);
            // sync the asset meta to datastore settings
            const newDataCount = result.data.length;
            let newAssets = [];
            // calculating how many itteration we need to cover all the assets by page of 50
            let itteration = Math.ceil(newDataCount / 50);
            let skip = 0;

            for (let i = 0; i < itteration; i++) {
                // calculating the number of items in each itteration
                let limit = (i === itteration - 1) ? newDataCount % 50 : 50; // if itteration is last one, then we need to get the remaining items
                skip = i * 50;

                let searchOptions = { skip, limit: limit, sort: { "_buildfire.index.date1": -1 } };
                Assets.searchAndSort(searchOptions, (err, importedAssets) => {
                    if (err) return callback(err, null);
                    importedAssets.forEach(asset => {
                        newAssets.push(asset);
                        Settings.saveAssetMeta(asset, () => {});
                    });
                    // last itteration, call the callback
                    if (i === itteration - 1) return callback(null, newAssets);
                });
            }

        });
    }



    /**
     * Builds index
     * @param {Object} data data for which index will be built
     */
    static buildIndex = (data) => {
        const index = {
            date1: data.createdOn,
            string1: data.type,
            text: (data.meta.title + " " + data.meta.description).toLowerCase(),
        };
        return index;
    };
}