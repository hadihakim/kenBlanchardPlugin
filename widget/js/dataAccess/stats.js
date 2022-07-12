class Stats {
    /**
     * Get Database Tag
     */
    static get TAG() {
        return "stats";
    }

    /**
     * Get stats object
     * @param {Function} callback Callback for handling the response
     */
    static get = (callback) => {
        buildfire.publicData.get(Stats.TAG, function(err, res) {
            if (err) callback(err);
            else {
                // first set
                if (JSON.stringify(res.data) == "{}") {
                    let data = new Stat();
                    data.createdOn = new Date();
                    data.createdBy = authManager.currentUser.email;
                    Stats.save(data, callback);
                } else callback(null, new Stat(res.data));
            }
        });
    };

    /**
     * Save stats object
     * @param {Function} callback callback for handling response
     * @param {Object} data current stats data to be saved
     */
    static save = (data, callback) => {
        data.lastUpdatedOn = new Date();
        data.lastUpdatedBy = authManager.currentUser.email;
        buildfire.publicData.save(
            data,
            Stats.TAG,
            (error, record) => {
                if (error) return callback(error);
                return callback(null, data);
            }
        );
    };

    static incrementViews = (id, callback) => {
        const cmd = {
            $inc: {
                ["views." + id]: 1
            }
        };
        buildfire.publicData.save(cmd, Stats.TAG, (err, result) => {
            if (err) return callback(err, null);
            // Analytics
            Analytics.assetsViews();
            callback(null, result);
        });
    }
}