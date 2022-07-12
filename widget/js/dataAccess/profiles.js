class Profiles {
    /**
     * Get Database Tag
     */
    static get TAG() {
        return "profiles";
    }

    /**
     * get user profile
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static get = (callback) => {
        buildfire.userData.get(Profiles.TAG, function(err, res) {
            if (err) callback(err);
            else {
                // Analytics
                Analytics.growthProfileViews();
                // first set
                if (JSON.stringify(res.data) == "{}") {
                    let data = new Profile();
                    data.createdOn = new Date();
                    data.createdBy = authManager.currentUser.email;
                    Profiles.save(data, callback);
                } else callback(null, new Profile(res.data));
            }
        });
    };

    /**
     * This will create a new Profile
     * @param {Object} profile the new profile object to be added
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static save = (data, callback) => {
        data.lastUpdatedOn = new Date();
        data.lastUpdatedBy = authManager.currentUser.email;
        buildfire.userData.save(
            data,
            Profiles.TAG,
            (error, record) => {
                if (error) return callback(error);
                return callback(null, data);
            }
        )
    }

    /**
     * This will insert one new Object based on the item param
     * property could be one of the following Profile properties (assets, assestments, badges)
     * @param {string} property the property that we are going to insert a new item (assets, assestments, badges)
     * @param {Object} data the object to be added
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static insertUniqueArrayItem = (property, data, callback) => {
        data.createdBy = authManager.currentUser.email;
        data.createdOn = new Date();

        let cmd = {
            $addToSet: {
                [property]: data
            }
        };

        buildfire.userData.save(cmd, Profiles.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will update a new Object based on the item param
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {Number} index index of the object to be updated : (assets[index] or assessments[index]...)
     * @param {string} property the property that we are going to insert a new item (assets, assestments, badges)
     * @param {Object} data the object that will replace the existing one
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static updateArrayItemByIndex = (index, property, data, callback) => {
        data.lastUpdatedOn = new Date();
        data.lastUpdatedBy = authManager.currentUser.email;

        const cmd = {
            $set: {
                [property + "." + index]: data
            },
        };
        buildfire.userData.save(cmd, Profiles.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will update a new Object based on the item param
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {string} id id of the object to be updated : (assets[index] or assessments[index]...)
     * @param {string} property the property that we are going to insert a new item (assets, assestments, badges)
     * @param {Object} data the object that will replace the existing one
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static updateArrayItemById = (id, property, data, callback) => {
        data.lastUpdatedOn = new Date();
        data.lastUpdatedBy = authManager.currentUser.email;
        const search = {
            [property + ".id"]: id
        };
        const cmd = {
            $set: {
                [property + ".$"]: data
            },
        };
        buildfire.userData.searchAndUpdate(
            search,
            cmd,
            Profiles.TAG,
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, data);
            }
        );
    };

    static savePropertyData = (property, id, data, callback) => {
        const cmd = {
            $set: {
                [property + "." + id]: data
            },
        };
        buildfire.userData.save(cmd, Profiles.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    static deleteProperty = (property, id, callback) => {
        const cmd = {
            $unset: {
                [property + "." + id]: 1
            },
        };
        buildfire.userData.save(cmd, Profiles.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    };

    static updateAssetProgress(assetId, progress, callback) {
        return Profiles.savePropertyData("assets", `${assetId}.progress`, progress, callback)
    }

    static resetAssetProgress(assetId, callback) {
        return Profiles.savePropertyData("assets", `${assetId}.progress`, 0, (err, res) => {
            if (err) return callback(err, null);
            Analytics.resetAssetCall();
            callback(null, res);
        })
    }

    static deleteAsset(assetId, callback) {
        return Profiles.deleteProperty("assets", assetId, (err, res) => {
            if (err) return callback(err, null);
            Analytics.deleteAssetCall();
            callback(null, res);
        })
    }

    static setAssetArchiveStatus(assetId, isArchived, callback) {
        return Profiles.savePropertyData("assets", `${assetId}.isArchived`, isArchived, (err, res) => {
            if (err) return callback(err, null);
            Analytics.archiveAssetCall();
            callback(null, res);
        })
    }

    static addBadge(badgeId, callback) {
        return Profiles.insertUniqueArrayItem("badges", badgeId, callback)
    }

    static saveAssessment(assessmentId, result, callback) {
        return Profiles.savePropertyData("assessments", `${assessmentId}.result`, result, callback)
    }

    static retakeAssessment(assessmentId, callback) {
        return Profiles.savePropertyData("assessments", `${assessmentId}.retake`, true, callback)
    }
}