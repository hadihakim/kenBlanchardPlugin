class Asset {
    constructor(data = {}) {
        this.meta = new AssetMeta(data);
        this.premium = (typeof data.premium === 'undefined') ? true : data.premium;
        this.isActive = (typeof data.isActive === 'undefined') ? true : data.isActive;
        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || new Date();
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this._buildfire = data._buildfire || {};
    }

}

class AssetMeta {
    constructor(data = {}) {
        data.meta = data.meta || {};
        this.title = data.meta.title || "";
        this.description = data.meta.description || "";
        this.image = data.meta.image || "";
        this.topics = data.meta.topics || [];
        this.duration = data.meta.duration || 0;
        this.actionType = data.meta.actionType || "";
        this.actionData = data.meta.actionData || {};
        this.createdOn = data.createdOn || new Date();
    }
}

class MediaCheckList {
    constructor(data = {}) {
        this.title = data.title || "";
        this.timeStamp = data.timeStamp || 0;
        this.createdOn = data.createdOn || new Date();
    }
}

class Media extends Asset {
    constructor(data = {}) {
        super(data);
        this.url = data.url || "";
        this.details = data.details || "";
        this.showDetails = (typeof data.showDetails === 'undefined') ? false : data.showDetails;
        this.transcript = data.transcript || "";
        this.showTranscript = (typeof data.showTranscript === 'undefined') ? false : data.showTranscript;
        this.checkList = (data.checkList || []).map(shortcut => new MediaCheckList(shortcut));
        this.showCheckList = (typeof data.showCheckList === 'undefined') ? false : data.showCheckList;
    }
}

class Audio extends Media {
    constructor(data = {}) {
        super(data);
        this.type = "audio";
    }
}

class Video extends Media {
    constructor(data = {}) {
        super(data);
        this.type = "video";
    }
}

class Article extends Asset {
    constructor(data = {}) {
        super(data);
        this.type = "article";
        this.url = data.url || "";
        this.keyTakeAways = data.keyTakeAways || "";
        this.showKeyTakeaways = (typeof data.showKeyTakeaways === 'undefined') ? false : data.showKeyTakeaways;
        this.fullArticle = data.fullArticle || ""
    }
}


class Book extends Asset {
    constructor(data = {}) {
        super(data);
        this.type = "book";
        this.url = data.url || "";
    }
}


class ActionItem extends Asset {
    constructor(data = {}) {
        super(data);
        this.type = "action-item";
    }
}

class Course extends Asset {
    constructor(data = {}) {
        super(data);
        this.type = "course";
        this.lessons = (data.lessons || []).map(lesson => new Lesson(lesson));
    }
}

class Lesson {
    constructor(data = {}) {
        this.title = data.title || "";
        this.subTitle = data.subTitle || "";
        this.assets = data.assets || [];
    }

}

class Summary extends Asset {
    constructor(data = {}) {
        super(data);
        this.type = "summary";
        this.fullDescription = data.fullDescription || "";
        this.chapters = (data.chapters || []).map(chapter => new SummaryChapter(chapter));
    }
}

class SummaryChapter {
    constructor(data = {}) {
        this.title = data.title || "";
        this.chapterImage = data.chapterImage || "";
        this.subTitle = data.subTitle || "";
        this.premium = (typeof data.premium === 'undefined') ? true : data.premium;
        this.pages = (data.pages || []).map(page => new SummaryPage(page));
        this.createdOn = data.createdOn || new Date();
    }
}

class SummaryPage {
    constructor(data = {}) {
        this.pageImage = data.pageImage || "";
        this.pageContent = data.pageContent || "";
        this.createdOn = data.createdOn || new Date();
    }
}