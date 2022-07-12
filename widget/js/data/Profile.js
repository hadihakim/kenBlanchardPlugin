class Profile {
    constructor(data = {}) {
        this.assets = data.assets || {};
        this.badges = data.badges || [];
        this.assessments = data.assessments || {};
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
    }
}