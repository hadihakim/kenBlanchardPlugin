class HandleAPI {

    static state = {
        data: fakeData,
        assets_info: fakeData.data.assets_info,
        sections: fakeData.data.sections,
        topics: fakeData.data.topics,
    }

    static getDataByID = (id, type) => {
        switch (type) {
            case "section":
                return new Promise((resolve, reject) => {
                    Assets.get(id, (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    })
                });
                break;
            case "assets_info":
                return new Promise((resolve, reject) => {
                    Assets.get(id, (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    })
                });
                break;
            case "topic":
                return new Promise((resolve, reject) => {
                    Assets.get(id, (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    })
                });
                break;
            default:
                break;
        }
    }


}