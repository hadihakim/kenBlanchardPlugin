class Settings {
    /**
     * Get Database Tag
     */
    static get TAG() {
        return "settings";
    }

    /**
     * Get settings object
     * @param {Function} callback Callback for handling the response
     */
    static get = (callback) => {
        buildfire.datastore.get(Settings.TAG, function(err, res) {
            if (err) callback(err);
            else {
                // first set
                if (JSON.stringify(res.data) == "{}") {
                    let data = new Setting();
                    data.createdOn = new Date();
                    data.createdBy = authManager.currentUser.email;
                    Settings.save(data, callback);
                } else callback(null, new Setting(res.data));
            }
        });
    };

    /**
     * Save settings object
     * @param {Function} callback callback for handling response
     * @param {Object} data current setting data to be saved
     */
    static save = (data, callback) => {
        data.lastUpdatedOn = new Date();
        data.lastUpdatedBy = authManager.currentUser.email;
        buildfire.datastore.save(
            data,
            Settings.TAG,
            (error, record) => {
                if (error) return callback(error);
                return callback(null, data);
            }
        );
    };

    /**
     * This will insert one new Object based on the item param
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {string} property the property that we are going to insert a new item (sections, topics, featured, insights)
     * @param {Object} data the object to be added
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static insertArrayItem = (property, data, callback) => {
        data.createdBy = authManager.currentUser.email;
        data.createdOn = new Date();
        data.id = Utils.generateUUID();
        let cmd = {
            $push: {
                [property]: data
            }
        };

        buildfire.datastore.save(cmd, Settings.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will update a new Object based on the item param
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {Number} index index of the object to be updated : (sections[index] or topics[index]...)
     * @param {string} property the property that we are to update an item (sections, topics, featured, insights)
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
        buildfire.datastore.save(cmd, Settings.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will update a new Object based on the item param
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {string} id id of the object to be updated inside the item (sections or topics or ...)
     * @param {string} property the property that we are to update an item (sections, topics, featured, insights)
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
        buildfire.datastore.searchAndUpdate(
            search,
            cmd,
            Settings.TAG,
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, data);
            }
        );
    };

    /**
     * This will delete an array item
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {string} id id of the object to be updated inside the item (sections or topics or ...)
     * @param {string} property the property that we are going to delete an item (sections, topics, featured, insights)
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static deleteArrayItemById = (id, property, callback) => {
        const cmd = {
            $pull: {
                [property]: { id: id }
            },
        };
        buildfire.datastore.save(
            cmd,
            Settings.TAG,
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    };

    /**
     * This will update the whole property object with new data
     * property could be one of the following settings properties (sections, topics, featured, insights.assestments, insights.assestments)
     * @param {string} property the property that we are going to update (sections, topics, featured, insights)
     * @param {Object} data the complete property data (array of items)
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static updateArray = (property, data, callback) => {
        const cmd = {
            $set: {
                [property]: data,
                lastUpdatedOn: new Date(),
                lastUpdatedBy: authManager.currentUser.email,
            },
        };
        buildfire.datastore.save(cmd, Settings.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will sync/add asset meta into settings
     * assets meta is a hashmap in the form of: [asset_id:{assetData},...]
     * @param {string} id asset id
     * @param {Object} data asset data
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static saveAssetMeta = (data, callback) => {
        const assetInfo = {
            type: data.type,
            meta: data.meta,
        }
        const cmd = {
            $set: {
                ["assets_info." + data.id]: assetInfo
            },
        };
        buildfire.datastore.save(cmd, Settings.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, data);
        });
    };

    /**
     * This will sync/delete asset meta from datastore settings
     * assets meta is a hashmap in the form of: [asset_id:{assetData},...]
     * @param {string} id asset id
     * @param {Object} data asset data
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static deleteAssetMeta = (id, callback) => {
        const cmd = {
            $unset: {
                ["assets_info." + id]: 1
            },
        };
        buildfire.datastore.save(cmd, Settings.TAG, (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    };


    /**
     * This will retrieve settings data from cache
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static getFromCache = (callback) => {
        cacheManager.getItem("settings", (error, result) => {
            if (error) return callback(error, null);

            return callback(null, result);
        });
    };

    /**
     * This will save settings data to cache
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static saveToCache = (callback) => {
        cacheManager.setItem("settings", (error, result) => {
            if (error) return callback(error, null);

            return callback(null, result);
        });
    };

    /**
     * 
     * Sections
     */

    static getSections = (callback) => {
        buildfire.datastore.search({ fields: ["sections"] },
            Settings.TAG, (err, res) => {
                if (err) callback(err);
                else callback(null, res[0].data.sections);
            })
    }

    static addSection = (section, callback) => {
        return Settings.insertArrayItem("sections", section, callback)
    }

    static updateSection = (id, section, callback) => {
        return Settings.updateArrayItemById(id, "sections", section, callback)
    }

    static deleteSection = (id, callback) => {
        return Settings.deleteArrayItemById(id, "sections", callback)
    }

    static reorderSections = (sections, callback) => {
        return Settings.updateArray("sections", sections, callback)
    }

    /**
     * This will enable / disable a section
     * @param {String} id id of the section
     * @param {Boolean}  isActive status
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static isActiveSection = (id, isActive, callback) => {
        const search = {
            ["sections.id"]: id
        };
        const cmd = {
            $set: {
                ["sections.$.isActive"]: isActive,
                ["sections.$.lastUpdatedOn"]: new Date(),
                ["sections.$.lastUpdatedBy"]: authManager.currentUser.email,
            },
        };
        buildfire.datastore.searchAndUpdate(
            search,
            cmd,
            Settings.TAG,
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    };

    /**
     * 
     * Topics
     */

    static getTopics = (callback) => {
        buildfire.datastore.search({ fields: ["topics"] },
            Settings.TAG, (err, res) => {
                if (err) callback(err);
                else callback(null, res[0].data.topics);
            })
    };

    static addTopic = (topic, callback) => {
        return Settings.insertArrayItem("topics", topic, callback)
    }

    static updateTopic = (id, topic, callback) => {
        return Settings.updateArrayItemById(id, "topics", topic, callback)
    }

    static deleteTopic = (id, callback) => {
        return Settings.deleteArrayItemById(id, "topics", callback)
    }

    static reorderTopics = (topics, callback) => {
        return Settings.updateArray("topics", topics, callback)
    }

    /**
     * This will set a topic trending property
     * @param {String} id id of the topic
     * @param {Boolean} isTrending trending status
     * @param {Function} callback callback function to process the response by passing a new object or error description if any
     */
    static isTrendingTopic = (id, isTrending, callback) => {
        const search = {
            ["topics.id"]: id
        };
        const cmd = {
            $set: {
                ["topics.$.isTrending"]: isTrending,
                ["topics.$.lastUpdatedOn"]: new Date(),
                ["topics.$.lastUpdatedBy"]: authManager.currentUser.email,
            },
        };
        buildfire.datastore.searchAndUpdate(
            search,
            cmd,
            Settings.TAG,
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    };

    /**
     * 
     * Assessments Groups
     */
    static addAssessmentsGroup = (assesstmentsGroup, callback) => {
        return Settings.insertArrayItem("assessmentsGroups", assesstmentsGroup, callback)
    }

    static updateAssessmentsGroup = (id, assesstmentsGroup, callback) => {
        return Settings.updateArrayItemById(id, "assessmentsGroups", assesstmentsGroup, callback)
    }

    static deleteAssessmentsGroup = (id, callback) => {
        return Settings.deleteArrayItemById(id, "assessmentsGroups", callback)
    }

    static reorderAssessmentsGroup = (assessmentsGroups, callback) => {
        return Settings.updateArray("assessmentsGroups", assessmentsGroups, callback)
    }


    /**
     * 
     * Badges
     */
    static addBadge = (badge, callback) => {
        return Settings.insertArrayItem("badges", badge, callback)
    }

    static updateBadge = (id, badge, callback) => {
        return Settings.updateArrayItemById(id, "badges", badge, callback)
    }

    static deleteBadge = (id, callback) => {
        return Settings.deleteArrayItemById(id, "badges", callback)
    }


}