class HandleAPI {
    
    static state = {
        data: fakeData,
        assets_info:fakeData.data.assets_info,
        sections:fakeData.data.sections,
        topics:fakeData.data.topics,
    }

    static getDataByID = (id, type) => {
        let returnedData = {};
        switch (type) {
            case "section":
                returnedData = this.state.assets_info[id] || {};
                break;
            case "assets_info":
                returnedData = this.state.assets_info[id] || {};
                break;
            case "topic":
                returnedData = this.state.assets_info[id] || {};
                break;
            default:
                break;
        }

        return returnedData;
    }


}