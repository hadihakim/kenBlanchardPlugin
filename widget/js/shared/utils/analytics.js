class Analytics {

    static get ASSET_STARTED() {
        return "newAssetStarted";
    }

    static get ASSET_VIEWED() {
        return "assetViewed";
    }

    static get SORT_BY_POPULARITY() {
        return "sortByPopularity";
    }

    static get SORT_BY_RECENT() {
        return "sortByRecent";
    }

    static get FILTER_BY_TOPICS() {
        return "filterByTopics";
    }

    static get ARCHIVE_ASSET() {
        return "archiveAsset";
    }

    static get RESET_ASSET() {
        return "resetAsset";
    }


    static get DELETE_ASSET() {
        return "deleteAsset";
    }

    static get GROWTH_PROFILE_VIEWS() {
        return "growthProfileViews";
    }

    static get USER_ASSETS_BY_TOPICS() {
        return "userAssetsByTopics";
    }

    // Register plugin events for analytics
    static registerEvent(title, key, description, silentNotification = true) {
        buildfire.analytics.registerEvent({ title, key, description }, { silentNotification });
    }

    static init() {
        this.registerEvent("Assets started", this.ASSET_STARTED, "")
        this.registerEvent("Archived Assets", this.ARCHIVE_ASSET, "")
        this.registerEvent("Reset Assets", this.RESET_ASSET, "")
        this.registerEvent("User Deleted Assets", this.DELETE_ASSET, "")
        this.registerEvent("Assets Views", this.ASSET_VIEWED, "")
        this.registerEvent("Sort Assets by Popularity", this.SORT_BY_POPULARITY, "")
        this.registerEvent("Sort Assets by Most recent", this.SORT_BY_RECENT, "")
        this.registerEvent("Filter Assets by Topics", this.FILTER_BY_TOPICS, "")
        this.registerEvent("View User Assets by Topics", this.USER_ASSETS_BY_TOPICS, "")
        this.registerEvent("Growth Profile Views", this.GROWTH_PROFILE_VIEWS, "")
    }

    static startAssetCall() {
        buildfire.analytics.trackAction(this.ASSET_STARTED);
    }

    static archiveAssetCall() {
        buildfire.analytics.trackAction(this.ARCHIVE_ASSET);
    }

    static resetAssetCall() {
        buildfire.analytics.trackAction(this.RESET_ASSET);
    }

    static deleteAssetCall() {
        buildfire.analytics.trackAction(this.DELETE_ASSET);
    }

    static assetsViews() {
        buildfire.analytics.trackAction(this.ASSET_VIEWED);
    }

    static sortByPopularityCalls() {
        buildfire.analytics.trackAction(this.SORT_BY_POPULARITY);
    }

    static sortByRecentCalls() {
        buildfire.analytics.trackAction(this.SORT_BY_RECENT);
    }

    static filterByTopicsCalls() {
        buildfire.analytics.trackAction(this.FILTER_BY_TOPICS);
    }

    static userAssetsByTopicsViews() {
        buildfire.analytics.trackAction(this.USER_ASSETS_BY_TOPICS);
    }

    static growthProfileViews() {
        buildfire.analytics.trackAction(this.GROWTH_PROFILE_VIEWS);
    }

}