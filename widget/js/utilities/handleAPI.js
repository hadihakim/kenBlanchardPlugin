class HandleAPI {

    static state = {
        data: fakeData,
        assets_info: fakeData.data.assets_info,
        sections: fakeData.data.sections,
        topics: fakeData.data.topics,
    }

    static setState = (options) => {
        this.state = {...this.state, ...options};
    }

    static getDataByID = (id, type) => {
        switch (type) {
            case "section":
                // return new Promise((resolve, reject) => {
                //     Assets.get(id, (err, res) => {
                //         if (err) reject(err);
                //         resolve(res);
                //     })
                // });
                let mySection;
                this.state.data.sections.forEach(section=>{
                    if(section.id === id){
                        mySection = section;
                        return;
                    }
                })
                return mySection;
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
                // return new Promise((resolve, reject) => {
                //     Assets.get(id, (err, res) => {
                //         if (err) reject(err);
                //         resolve(res);
                //     })
                // });
                let myTopic;
                this.state.data.topics.forEach(topic=>{
                    if(topic.id === id){
                        myTopic = topic.title;
                        return;
                    }
                })
                return myTopic;
                break;
            default:
                break;
        }
    }

    static getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            Profiles.get((err, res) => {
                if (err) reject(err)
                console.log("Profiles.get",res);
                resolve(res)
            })
        });
    }

    static getSettingsData = () => {
        return new Promise(function (resolve, reject) {
            authManager.enforceLogin();
            if (!authManager.currentUser) {
                Settings.get((err, res) => {
                    if (err) reject(err);

                    let options = {
                        data:res, 
                        assets_info:res.assets_info,
                        sections:res.sections,
                        topics:res.topics
                    }
                    console.log("options", options);
                    HandleAPI.setState(options);
                    resolve(res);
                })
            }
        });
    }

    static getStats=()=>{
        return new Promise((resolve, reject) =>{
            Stats.get(async (err, res) => {
                if (err) reject(err);
                console.log("stats", res);
                resolve(res);
            })
        });
    }

    static handleFilter = (topics, idx=0) => {
        let result;
        if (idx < topics.length) {
          result = this.handleFilter(topics, idx+1)
        }
    
        let topicData = this.state.topics.find(
          ({ id }) => id === topics[idx]
        );
    
        return (
          Search.state.filterArr.includes(topicData?.title) ||
          Search.state.filterArr.length == 0 ||
          result
        )
      }
}