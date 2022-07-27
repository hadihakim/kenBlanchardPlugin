class SearchTableHelper {
    constructor(tableId, config) {
        if (!config) throw "No config provided";
        if (!tableId) throw "No tableId provided";
        this.table = document.getElementById(tableId);
        if (!this.table) throw "Cant find table with ID that was provided";
        this.config = config;
        this.data = [];
        this.fetch = true;
        this.sort = {};
        this.searchText = {};
        this.commands = {};
        this.toggles = {};
        this.checks = {};
        this.init();
    }

    init() {
        this.table.innerHTML = "";
        this.renderHeader();
        this.renderBody();
    }

    renderHeader() {
        if (!this.config.columns) throw "No columns are indicated in the config";
        this.thead = this._create("thead", this.table, "", ["thead-scroll"]);
        this.config.columns.forEach((colConfig) => {
            let classes = [];
            if (colConfig.type == "date") classes = ["text-center"];
            else if (colConfig.type == "number") classes = ["text-right"];
            else if (colConfig.type == "toggle") classes = ["text-left"];
            else classes = ["text-left"];
            let th = this._create("th", this.thead, colConfig.header, classes);
            if (colConfig.sortBy) {
                const icon = this._create("span", th, "", [
                    "icon",
                    "icon-chevron-down",
                ]);
                const _t = this;
                th.addEventListener("click", function() {
                    // hide all other th sorting
                    //_t.thead.querySelectorAll('th span.icon').forEach(el => el.classList.add('hidden'));

                    if (_t.sort[colConfig.sortBy] && _t.sort[colConfig.sortBy] > 0) {
                        _t.sort = {
                            [colConfig.sortBy]: -1,
                        };
                        icon.classList.remove("hidden");
                        icon.classList.remove("icon-chevron-up");
                        icon.classList.add("icon-chevron-down");
                    } else {
                        //revert icon if previously sorted
                        for (let i = 0; i < _t.thead.children.length; i++) {
                            if (_t.thead.children[i].children[0]) {
                                _t.thead.children[i].children[0].classList.remove(
                                    "icon-chevron-up"
                                );
                                _t.thead.children[i].children[0].classList.add(
                                    "icon-chevron-down"
                                );
                            }
                        }
                        _t.sort = {
                            [colConfig.sortBy]: 1,
                        };
                        icon.classList.remove("hidden");
                        icon.classList.remove("icon-chevron-down");
                        icon.classList.add("icon-chevron-up");
                    }
                    _t._fetchPageOfData(_t.filter, 0);
                });
            }
            if (colConfig.width) th.style.width = colConfig.width;
        });

        if (this.config.options.showEditButton)
            this._create("th", this.thead, "", ["editColumn"]);

        if (this.config.options.showDeleteButton)
            this._create("th", this.thead, "", ["deleteColumn"]);
    }

    renderBody() {
        this.tbody = this._create("tbody", this.table);
        let t = this;
        this.tbody.onscroll = (e) => {
            if ((t.tbody.scrollTop + t.tbody.offsetHeight) / t.tbody.scrollHeight > 0.8) t._fetchNextPage();
        };
    }

    search(filter) {
        this.tbody.innerHTML = "";
        this.filter = filter;
        this._fetchPageOfData(this.filter, 0);
    }

    refresh = (filter) => {
        this.fetch = true;
        this.filter = filter;
        this.tbody.innerHTML = "";
        this._fetchPageOfData(filter, 0)
    }

    _fetchNextPage() {
        if (this.fetchingNextPage) return;
        this.fetchingNextPage = true;
        let t = this;
        this._fetchPageOfData(this.filter, this.pageIndex + 1, () => {
            t.fetchingNextPage = false;
        });
    }

    _fetchPageOfData(filter, pageIndex, callback) {
        if (pageIndex > 0 && this.endReached) return callback();
        this.pageIndex = pageIndex;
        let options = {
            filter: filter,
            sort: this.sort,
            page: pageIndex,
            pageSize: this.config.options.pageSize || 50,
        };

        this._onSearchSet(options, (e, results) => {
            if (e && callback) return callback(e);

            this.data = results;
            this.fetch = false;

            // sort
            let sortBy = Object.keys(this.sort)[0] || null;
            if (this.config.options.localData && sortBy) this._sortLocalData(sortBy, this.sort[sortBy]);

            if (!this.fetchingNextPage) this.tbody.innerHTML = "";

            // pagination & search in case localData
            let searchText = options.filter.searchText || "";
            let filteredRows = (this.config.options.localData) ?
                results.filter((row) => { // filter out rows that title does not have the search text
                    // check if title contains any word of the search text
                    let words = searchText.split(" ");
                    let found = false;
                    words.forEach((word) => {
                        if (Utils.traverseObject(row, this.config.options.itemTitleColumn).toLowerCase().indexOf(word.toLowerCase()) > -1) found = true;
                    });
                    return found;
                }) : results
            let paginatedRows = (this.config.options.localData) ?
                filteredRows.slice(options.page * options.pageSize, (options.page + 1) * options.pageSize) : //pagination
                results;

            let rows = (this.config.options.localData) ? paginatedRows : results;

            if (!pageIndex && !rows.length) this.onFetchState("empty");
            else this.onFetchState();

            rows.forEach((r) => this.renderRow(r));
            this._fixTheadWidth();
            this.endReached = (this.config.options.localData ? paginatedRows.length : results.length) < (this.config.options.pageSize || 50);
            if (callback) callback(e, results);
        });
    }

    _fixTheadWidth(table) {
        // fix thead width in case we have scroll bars
        const scrollBarWidth = this.tbody.offsetWidth - this.tbody.clientWidth;
        const padding = (this.tbody.scrollHeight > this.tbody.clientHeight) ? parseInt(scrollBarWidth) : 0;
        this.table.querySelector("thead").style.width = `calc(100% - ${padding}px)`;
    }

    _onCommand(obj, tr, command) {
        if (this.commands[command]) {
            this.commands[command](obj, tr);
        } else {
            console.log(`Command ${command} does not have any handler`);
        }
    }

    _onToggle(obj, tr, command) {
        if (this.toggles[command]) {
            this.toggles[command](obj, tr);
        } else {
            console.log(`toggles ${command} does not have any handler`);
        }
    }

    renderRow(obj, tr) {
        if (tr)
        //used to update a row
            tr.innerHTML = "";
        else tr = this._create("tr", this.tbody);
        tr.setAttribute("objId", obj.id);
        this.config.columns.forEach((colConfig) => {
            let classes = [];
            if (colConfig.type == "date") classes = ["text-center"];
            else if (colConfig.type == "number") classes = ["text-right"];
            else if (colConfig.type == "toggle") classes = ["text-left"];
            else if (colConfig.type == "boldText") classes = ["primary-color", "cursor-pointer"];
            else if (colConfig.type == "forCheckBox") classes = ["cursor-pointer"];
            else classes = ["text-left"];
            var td;
            let self = this;
            if (colConfig.type == "command") {
                td = this._create(
                    "td",
                    tr,
                    '<button class="btn btn-link">' + colConfig.text + "</button>", ["editColumn"]
                );
                td.onclick = (event) => {
                    event.preventDefault();
                    self._onCommand(obj, tr, colConfig.command);
                };
            } else if (colConfig.type == "image") {
                ///needed for the eval statement next
                let data = obj.data || obj;
                let imageURL = eval("`" + colConfig.data + "`");
                td = this._create(
                    "td",
                    tr,
                    `${this._renderImage(imageURL)}`, []
                );
            } else if (colConfig.type == "date") {
                ///needed for the eval statement next
                let data = obj.data || obj;
                let date = eval("`" + colConfig.data + "`");
                td = this._create(
                    "td",
                    tr,
                    `${this._renderDate(date)}`, classes
                );
            } else if (colConfig.type == "toggle") {
                td = this._create(
                    "td",
                    tr,
                    `<div class="button-switch"><input id="${colConfig.command}-${obj.id}" type="checkbox" ${obj[colConfig.toggleCol]?"checked":""}> <label for="${colConfig.command}-${obj.id}" class="label-success switch-btn-label"></label></div>`, ["text-left"]
                );
                td.querySelector("input[type=checkbox]").onclick = (event) => {
                    self._onToggle(obj, tr, colConfig.command);
                    let isToggled = (event.target.checked) ? colConfig.toggleOn : colConfig.toggleOff;
                    self.data[self.data.findIndex(el => el.id === obj.id)][colConfig.toggleCol] = isToggled;
                };
            } else if (colConfig.type == "checkBox") {
                td = this._create(
                    "td",
                    tr,
                    `<div class="margin-top-ten checkbox checkbox-primary"><input id="${colConfig.command}-${obj.id}" class="checkbox checkbox-primary" type="checkbox" ${this._isChecked(obj)}><label class="checkbox checkbox-primary"></label></div>`, ["text-left"]
                );
                td.querySelector("input[type=checkbox]").onclick = (event) => {
                    self.onToggleCheck(obj);
                };
            } else {
                var output = "";
                try {
                    ///needed for the eval statement next
                    var data = obj.data || obj;
                    output = eval("`" + colConfig.data + "`");
                } catch (error) {
                    console.log(error);
                }

                td = this._create("td", tr, output, [...classes, 'ellipsis']);

                // if colConfig.type == "boldText", make the whole row clickable
                if (colConfig.type == "boldText") td.onclick = () => { self.onEditRow(obj, tr); };
                if (colConfig.type == "forCheckBox") td.onclick = () => {
                    tr.querySelector("input[type=checkbox]").click();
                }

            }
            if (colConfig.width) td.style.width = colConfig.width;
        });

        let self = this;
        if (this.config.options.showEditButton) {
            let td = this._create(
                "td",
                tr,
                '<span class="btn--icon icon icon-pencil cursor-pointer"></span>', ["editColumn"]
            );
            td.onclick = () => {
                self.onEditRow(obj, tr);
            };
        }

        if (this.config.options.showDeleteButton) {
            let td = this._create(
                "td",
                tr,
                '<span class="btn--icon icon icon-cross2 cursor-pointer"></span>', ["deleteColumn"]
            );
            td.onclick = () => {
                let deleteOptions = {
                    title: `Delete ${self.config.options.itemName} ?`,
                    message: `Are you sure you want to delete ${Utils.traverseObject(obj, self.config.options.itemTitleColumn)} ${self.config.options.itemName} ?`,
                    confirmButton: { text: "Delete", type: "danger" },
                }

                buildfire.dialog.confirm(this.deleteDialogOptions || deleteOptions,
                    (e, isConfirmed) => {
                        if (e) console.error(e);

                        if (isConfirmed) {
                            tr.classList.add("hidden");
                            self._fixTheadWidth();
                            self.onDelete(obj,
                                (e) => {
                                    if (e) tr.classList.remove("hidden");
                                    else {
                                        self.data = self.data.filter((elem) => elem.id !== obj.id);
                                        if (!self.data.length) self.onFetchState("empty");
                                        self.onRowDeleted(obj, tr);
                                        self._fixTheadWidth();
                                    }
                                }
                            );
                        }
                    }
                );
            };
        }
        this.onRowAdded(obj, tr);
    }

    _sortLocalData(sortCol, direction) {
        this.data.sort((a, b) => {
            let colA = Utils.traverseObject(a, sortCol);
            let colB = Utils.traverseObject(b, sortCol);
            return direction * colA.toString().localeCompare(colB.toString());
        })
    }

    _isChecked(obj) {
        // check if obj.id match any of the checked items in config
        return this.config.options.checkedItems.find(el => el.id === obj.id) ? "checked" : "";
    }

    _create(elementType, appendTo, innerHTML, classNameArray) {
        let e = document.createElement(elementType);
        if (innerHTML) e.innerHTML = innerHTML;
        if (Array.isArray(classNameArray))
            classNameArray.forEach((c) => e.classList.add(c));
        if (appendTo) appendTo.appendChild(e);
        return e;
    }

    _onSearchSet = (options, callback) => {
        // if local Data, only fetch once or after performing a search
        // sorting, pagination and searching will be done localy
        if (!this.config.options.localData || this.fetch) {
            if (this.fetch) this.onFetchState("loading");
            this.onSearch(options, callback)
        } else callback(null, this.data)
    }

    _renderDate(dateString) {
        let date = new Date(dateString);
        let dateOptions = { month: 'short', year: 'numeric', day: 'numeric' };
        return date.toLocaleString('en-US', dateOptions)
    }

    _renderImage(image) {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.style.width = "60px";
        img.classList.add("border-radius-five");
        img.src = image ?
            this._cropImage(image, { width: 60, height: 33.5 }) :
            '../assets/images/noImage.png';
        div.appendChild(img);
        return div.innerHTML;
    }

    _cropImage(url, options) {
        if (!url) { return "" }
        return buildfire.imageLib.cropImage(url, options);
    }

    onSearch = (options, callback) => {}
    onDelete = (obj, callback) => {}
    onRowDeleted(obj, tr) {}
    onRowAdded(obj, tr) {}
    onEditRow(obj, tr) {}
    onFetchState(state) {}
    onCommand(command, cb) {
        this.commands[command] = cb;
    }

    onToggle(command, cb) {
        this.toggles[command] = cb;
    }

    onToggleCheck(obj) {
        console.log("You should handle onToggleCheck");
    }

}

class SearchTableTopics extends SearchTableHelper {
    constructor(tableId, config) {
        super(tableId, config);

        this.onToggle('toggleTrending', (obj, tr) => {
            let toggle = tr.querySelector("input[type=checkbox]");
            let isTrending = toggle.checked ? true : false;

            Settings.isTrendingTopic(obj.id, isTrending, (err, res) => {
                if (err) { //rollback
                    console.error(err)
                    toggle.checked = !isTrending;
                }
            });
        });
    }

    onDelete = (obj, callback) => {
        Settings.deleteTopic(obj.id, callback);
    }

    onEditRow = (obj, tr) => {
        Views().loadSubPage("addEditTemplate-topic", ["Topics", "Edit Topic"]);
        TopicsDetails.init(obj, tr);
    }

    onSearch = (options, callback) => {
        /* options = {filter, sort, page, pageSize=50} */
        TopicsList.refresh((error, res) => {
            callback(error, res);
        })
    }

    onFetchState = (fetchState) => {
        const emptyState = document.getElementById('emptyStateTopics');
        if (fetchState == "loading") {
            emptyState.innerHTML = `<h4> Loading... </h4>`;
            emptyState.classList.remove('hidden');
        } else if (fetchState == "empty") {
            emptyState.innerHTML = `<h4>You haven't added anything yet</h4>`;
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

}

class SearchTableAssets extends SearchTableHelper {
    constructor(tableId, config) {
        super(tableId, config);
        this.deleteDialogOptions = {
            title: `Delete Asset`,
            message: `Are you sure you want to delete this asset? This will permanently delete the asset from the system.`,
            confirmButton: { text: "Confirm", type: "danger" },
        }
    }

    onDelete = (obj, callback) => {
        Assets.delete(obj.id, callback);
    }

    onRowDeleted = (obj, tr) => {
        // update state
        delete state.settings.assets_info[obj.id]
    }

    onEditRow = (obj, tr) => {
        if (obj.type == "action-item") SectionsDetails.addOrEditActionItem("assets", obj);
        else if (obj.type == "course") CourseDetails.init(obj, { activeTr: tr, target: "assets", isNew: false });
        else AssetsDetails.init(obj, { activeTr: tr, target: "assets", isNew: false });
    }

    onSearch = (options, callback) => {
        /* options = {filter, sort, page, pageSize=50} */
        Assets.searchAndSort(options, (error, res) => {
            callback(error, res);
        })
    }

    onFetchState = (fetchState) => {
        const emptyState = document.getElementById('emptyStateAssets');
        if (fetchState == "loading") {
            emptyState.innerHTML = `<h4> Loading... </h4>`;
            emptyState.classList.remove('hidden');
        } else if (fetchState == "empty") {
            emptyState.innerHTML = `<h4>You haven't added anything yet</h4>`;
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

}

class SearchTableSectionAssets extends SearchTableHelper {
    constructor(tableId, config) {
        super(tableId, config);
        this.deleteDialogOptions = {
            title: `Remove Asset`,
            message: `Are you sure you want to remove this asset from the section? This will not permanently delete the asset. You will still be able to find this asset in the main Assets list.`,
            confirmButton: { text: "Confirm", type: "danger" },
        }
        this.editOrNew = config.options.editOrNew || "New";
    }

    onDelete = (obj, callback) => {
        SectionsDetails.deleteAsset(obj.id);
        callback(false);
    }

    onRowDeleted = (obj, tr) => {
        SectionsDetails.toggleSaveButton();
    }

    onEditRow = (obj, tr) => {
        //fetch the complete object from assets collection (not just the meta)
        Assets.get(obj.id, (err, res) => {
            if (err) return console.error(err);
            if (res.data.type == "action-item") SectionsDetails.addOrEditActionItem("sections", res.data);
            else if (res.data.type == "course") CourseDetails.init(res.data, { activeTr: tr, target: "sections", isNew: false });
            else AssetsDetails.init(res.data, { activeTr: tr, target: "sections", isNew: false });
        });
    }

    onSearch = (options, callback) => {
        /* options = {filter, sort, page, pageSize=50} */
        SectionsDetails.refresh((error, res) => {
            callback(error, res);
        })
    }

    onFetchState = (fetchState) => {
        const emptyState = document.getElementById('emptyStateSectionAssets');
        if (fetchState == "loading") {
            emptyState.innerHTML = `<h4> Loading... </h4>`;
            emptyState.classList.remove('hidden');
        } else if (fetchState == "empty") {
            emptyState.innerHTML = `<h4>You haven't added anything yet</h4>`;
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

}

class SearchTableAssetsModal extends SearchTableHelper {
    constructor(tableId, config) {
        super(tableId, config);
    }

    onDelete = (obj, callback) => {
        Assets.delete(obj.id, callback);
    }

    onRowDeleted = (obj, tr) => {}

    onEditRow = (obj, tr) => {}

    onSearch = (options, callback) => {
        /* options = {filter, sort, page, pageSize=50} */
        Assets.searchAndSort(options, (error, res) => {
            callback(error, res);
        })
    }

    onToggleCheck(obj) {
        // check if obj not already in checkedItems add it
        let assetIndex = this.config.options.checkedItems.findIndex(item => item.id == obj.id);
        let asset_info = state.settings.assets_info[obj.id];
        asset_info.id = obj.id;

        // toggle
        if (assetIndex == -1) {
            this.config.options.checkedItems.push(asset_info);
        } else {
            // remove from checkedItems
            this.config.options.checkedItems.splice(assetIndex, 1);
        }
        AssetsDialog._toggleSaveButton();
    }

    onFetchState = (fetchState) => {
        const emptyState = document.getElementById('emptyStateAssetsModal');
        if (fetchState == "loading") {
            emptyState.innerHTML = `<h4> Loading... </h4>`;
            emptyState.classList.remove('hidden');
        } else if (fetchState == "empty") {
            emptyState.innerHTML = `<h4>You haven't added anything yet</h4>`;
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

}