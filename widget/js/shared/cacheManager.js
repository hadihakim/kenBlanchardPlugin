let cacheManager = {
    platform: window.buildfire.getContext().device.platform,
    instanceId: window.buildfire.getContext().instanceId,
    pluginName: "privatePortalPlugin",
    indexDb: null,
    setItem: function (key, data, callback) {
      if (this.platform === "web") {
        let _this = this;
        this.initIndexDb(key, function () {
          _this.saveWeb(key, data, callback);
        });
      } else {
        this.saveMobile(key, data, callback);
      }
    },
    getItem: function (key, callback) {
      if (this.platform === "web") {
        let _this = this;
        this.initIndexDb(key, function () {
          _this.getWeb(key, callback);
        });
      } else {
        this.getMobile(key, callback);
      }
    },
    initIndexDb: function (key, callback) {
      const options = {
        dbName: `${this.instanceId}.${this.pluginName}.${key}.cache`,
        indexName: key,
        objectStoreName: `${key}.cache`,
      };
  
      const request = window.indexedDB.open(options.dbName, 1);
  
      let _this = this;
  
      request.onerror = function (event) {
        console.error("Error initialising indexedDB", event);
      };
  
      request.onupgradeneeded = function (event) {
        _this.indexDb = event.target.result;
        const objectStore = _this.indexDb.createObjectStore(
          options.objectStoreName
        );
        objectStore.createIndex(options.indexName, options.indexName, {
          unique: false,
        });
      };
  
      request.onsuccess = function () {
        _this.indexDb = request.result;
        callback(null);
      };
    },
    saveWeb: function (key, data, callback) {
      if (!this.indexDb)
        return console.error(
          "Error saving cache: db ref not found. Make sure to run initIndexDb first!"
        );
  
      const objectStoreName = `${key}.cache`;
      const cacheTransaction = this.indexDb.transaction(
        objectStoreName,
        "readwrite"
      );
      const cacheObjStore = cacheTransaction.objectStore(objectStoreName);
      const request = cacheObjStore.put(data, key);
  
      request.onerror = function (err) {
        callback(err);
      };
      request.onsuccess = function () {
        callback(null);
      };
    },
    getWeb: function (key, callback) {
      if (!this.indexDb)
        return callback(
          "Error getting cache: db ref not found. Make sure to run initIndexDb first!"
        );
      const objectStoreName = `${key}.cache`;
      try {
        const cacheTransaction = this.indexDb.transaction(
          objectStoreName,
          "readwrite"
        );
        const cacheObjStore = cacheTransaction.objectStore(objectStoreName);
        const request = cacheObjStore.get(key);
        request.onsuccess = function (event) {
          callback(null, event.target.result);
        };
      } catch (error) {
        // Key not set yet
        return callback(null, null);
      }
    },
    saveMobile: function (key, data, callback) {
      const options = {
        path: `/data/${this.instanceId}/`,
        fileName: `cache_${key}.txt`,
        content: data,
      };
  
      buildfire.services.fileSystem.fileManager.writeFileAsText(
        options,
        callback
      );
    },
    getMobile: function (key, callback) {
      const options = {
        path: `/data/${this.instanceId}/`,
        fileName: `cache_${key}.txt`,
      };
  
      function fileRead(err, data) {
        if (err || !data) return callback(err, null);
        return callback(null, data);
      }
  
      buildfire.services.fileSystem.fileManager.readFileAsText(options, fileRead);
    },
  };