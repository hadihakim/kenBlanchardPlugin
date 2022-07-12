class Setting {
    constructor(data = {}) {
        this.sections = data.sections || [];
        this.assets_info = data.assets_info || {};
        this.topics = data.topics || [];
        this.badges = data.badges || [];
        this.assessmentsGroups = data.assessmentsGroups || [];
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}

class Section {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.layout = data.layout || "horizontal";
        this.assets = data.assets || [];
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}

class Topic {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.image = data.image || "";
        this.order = data.order || 0;
        this.tag = data.tag || [];
        this.isTrending = (typeof data.isTrending === 'undefined') ? false : data.isTrending;
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}

class Badge {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.image = data.image || "";
        this.coursesNeeded = data.coursesNeeded || 0;
        this.assetsNeeded = data.assetsNeeded || 0;
        this.isPremium = (typeof data.isPremium === 'undefined') ? false : data.isPremium;
        this.isLogged = (typeof data.isLogged === 'undefined') ? true : data.isLogged;
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}

class AssessmentsGroup {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.assessments = data.assessments || [];
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || null;
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || null;
        this.lastUpdatedBy = data.lastUpdatedBy || null;
    }
}

class Assessment {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || null;
        this.InstanceId = data.InstanceId || null;
        this.rules = data.rules || [];
    }

}

class AssessmentRules {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.minScore = data.minScore || 0;
        this.maxScore = data.maxScore || 0;
    }
}