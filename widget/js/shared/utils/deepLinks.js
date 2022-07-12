class Deeplink {

    static register(options, callback) {

        buildfire.deeplink.registerDeeplink(options, (err, result) => {
            let id = result && result.data && result.data.deeplinkId ? result.data.deeplinkId : null;
            let data = result && result.data ? result.data : null;
            if (err) return callback(err);
            return callback(null, { id, data })
        })
    }


}