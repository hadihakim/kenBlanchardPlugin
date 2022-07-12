class Stat {
    constructor(data = {}) {
        // hashmap of all assets with corresponding view count
        this.views = data.views || {};
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}