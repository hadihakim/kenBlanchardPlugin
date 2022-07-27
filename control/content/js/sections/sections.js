const SectionsList = {
    uiElements: {},

    init() {
        this._initUIElements();
        this._initList();

        this.uiElements.addBtn.addEventListener('click', () => {
            Views().loadSubPage("addEditTemplate-section", ["Sections", "New Section"]);
            SectionsDetails.init(new Section());
        });
    },

    _initList() {
        this.list = new sectionsListUI('#sections-list');
        this._updateEmptyState("loading");
        this.list.init(state.settings.sections);
        if (!state.settings.sections.length) return this._updateEmptyState("empty");

        this._updateEmptyState();
    },

    _initUIElements() {
        this.uiElements = {
            addBtn: document.getElementById('add-section-btn'),
            sortableList: document.getElementById('sortable-list-sections'),
            emptyState: document.getElementById('emptyStateSections'),
        }
    },

    _updateEmptyState(state) {
        if (state == "loading") {
            this.uiElements.emptyState.innerHTML = `<h4> Loading... </h4>`;
            this.uiElements.emptyState.classList.remove('hidden');
        } else if (state == "empty") {
            this.uiElements.emptyState.innerHTML = `<h4>You haven't added anything yet</h4>`;
            this.uiElements.emptyState.classList.remove('hidden');
        } else {
            this.uiElements.emptyState.classList.add('hidden');
        }
    }
}

const SectionsDetails = {
    uiElements: {},
    sectionAssets: [],
    divRow: null,
    sectionIndex: null,

    init(section, sectionIndex = null, divRow = null) {
        this.activeSection = section;
        this.sectionAssets = this.activeSection.assets.filter((assetId, index) => {
            return state.settings.assets_info[assetId]; // check if asset exists in settings - 
        }).map(assetId => {
            let asset = state.settings.assets_info[assetId];
            asset.id = assetId;
            return asset;
        }); // now, we are sure that asset exists in settings

        this.sectionIndex = sectionIndex;
        this.divRow = divRow;

        // breadCrumb
        breadCrumbTitle = (this.activeSection.title) ? this.activeSection.title : (this.activeSection.id) ? "Edit Section" : "New Section";
        Views().loadSubPage("addEditTemplate-section", ["Sections", breadCrumbTitle]);

        this._initUIElements();
        this._initResultTable();
        this._initSearch();
        this.toggleSaveButton();
    },

    refresh(callback) {
        callback(null, this.sectionAssets);
    },


    save() {
        this.activeSection.title = this.uiElements.title.value;
        // section layout already updated
        this.activeSection.assets = this.sectionAssets.map(asset => asset.id);

        if (this.activeSection.id)
            Settings.updateSection(this.activeSection.id, this.activeSection, (err, res) => {
                if (err) console.log(err)
                else {
                    // update section in state settings
                    let sectionIndex = state.settings.sections.findIndex(section => section.id == this.activeSection.id);
                    state.settings.sections[sectionIndex] = this.activeSection;
                    // update section in list
                    SectionsList.list.sortableList.injectItemElements(this.activeSection, this.sectionIndex, this.divRow); // update list
                    Views().closeAllSubPages();
                }
            })
        else {
            Settings.addSection(this.activeSection, (err, res) => {
                if (err) console.log(err)
                else {
                    // push new section to state settings
                    state.settings.sections.push(this.activeSection);
                    SectionsList.list.sortableList.append(this.activeSection);
                    SectionsList._updateEmptyState(); // update empty state f first item
                    Views().closeAllSubPages();
                }
            })
        }
    },

    cancel() {
        Views().closeAllSubPages();
    },

    addOrUpdateAsset(asset) {
        // check if asset exists in section assets list, update. if not, add it
        let assetIndex = this.sectionAssets.findIndex(item => item.id == asset.id);
        let asset_info = state.settings.assets_info[asset.id];
        asset_info.id = asset.id;

        if (assetIndex == -1) {
            this.sectionAssets.push(asset_info);
        } else {
            this.sectionAssets[assetIndex] = asset_info;
        }
        this.toggleSaveButton();
    },

    deleteAsset(assetId) {
        // check if asset exists in settings, delete
        let assetIndex = this.sectionAssets.findIndex(item => item.id == assetId);
        if (assetIndex > -1) {
            this.sectionAssets.splice(assetIndex, 1);
        }
    },

    getAssetTopicsTitles(topics) {
        return state.settings.topics.filter((topic, index) => {
            return topics.includes(topic.id);
        }).map(topic => topic.title);
    },

    _initUIElements() {
        this.uiElements = {
            title: document.getElementById('section-title'),
            searchText: document.getElementById('section-assets-search-input'),
            searchBtn: document.getElementById('section-assets-search-btn'),
            addBtnModal: document.getElementById('addBtnAssetsModal'),
            saveBtn: document.getElementById('save-section'),
            sectionLayoutsContainer: document.getElementById('section-layouts'),
            sectionLayouts: document.querySelectorAll('#section-layouts a'),
            sectionLayoutPreview: document.getElementById('selected-layout-preview'),
            dropDown: document.getElementById('add-assets-dropdown'),
            dropDownItems: document.querySelectorAll('#add-assets-dropdown li'),
            addBtn: document.getElementById('addBtnAssets'),
        }

        // set layout preview
        this.uiElements.sectionLayouts.forEach(l => { l.classList.remove('selected'); });
        this.uiElements.sectionLayoutsContainer.querySelector(`[data-layout="${this.activeSection.layout}"]`).classList.add('selected');
        this.uiElements.sectionLayoutPreview.src = `../assets/images/section-layout-${this.activeSection.layout}.png`;

        // set Section title
        this.uiElements.title.value = this.activeSection.title;

        this.uiElements.sectionLayouts.forEach(layout => {
            layout.addEventListener('click', this._handleLayoutChange.bind(this));
        });

        // Add event listeners
        this.uiElements.addBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            this._toggleDropdown();
        });

        // close dropdown when clicked outside 
        document.body.addEventListener('click', () => {
            this._toggleDropdown(true);
        });

        // add event listener to dropdown items based on data-type
        this.uiElements.dropDownItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                this._toggleDropdown(true);
                let assetType = event.currentTarget.getAttribute('data-type');

                if (assetType == "action-item") {
                    this.addOrEditActionItem("sections");
                } else if (assetType == "course") {
                    let item = CourseDetails.create({ type: "course" });
                    CourseDetails.init(item, { target: "sections", isNew: true });
                } else {
                    let item = AssetsDetails.create({ type: assetType });
                    AssetsDetails.init(item, { target: "sections", isNew: true });
                }

            });
        });

        // add asset from modal (load existing assets)
        this.uiElements.addBtnModal.onclick = () => {
            // send to the modal the already selected assets list
            searchTableExistingAssetsConfig.options.checkedItems = this.sectionAssets;
            AssetsDialog.init();
        };

        this.uiElements.title.addEventListener('input', () => { this.toggleSaveButton() });

    },

    addOrEditActionItem(target, actionItem = { meta: { actionData: { action: "linkToApp" } } }) {
        buildfire.actionItems.showDialog(actionItem.meta.actionData, { showIcon: true },
            (err, result) => {
                if (err) return console.error(err);
                if (result) {
                    let assetData = {
                        type: "action-item",
                        meta: {
                            title: result.title,
                            image: result.iconUrl,
                            actionData: result,
                            actionType: ''
                        },
                        createdOn: new Date(),
                    }
                    let asset = AssetsDetails.create(assetData);
                    asset.id = actionItem.id || null;

                    // getting the buildfire plugin name based on instance ID
                    if (target == "assets") {
                        AssetsList.resultTable.onFetchState("loading");
                        AssetsList.resultTable.tbody.innerHTML = "";

                    } else {
                        SectionsDetails.resultTable.onFetchState("loading");
                        SectionsDetails.resultTable.tbody.innerHTML = "";
                    }
                    buildfire.pluginInstance.get(asset.meta.actionData.instanceId, (err, instance) => {
                        if (err) return console.error(err);
                        if (instance) {
                            asset.meta.actionType = instance.title;
                            AssetsDetails.activeItem = asset; // asset details

                            AssetsDetails._saveOrUpdate((err, res) => {
                                if (err) console.log(err)
                                else {
                                    AssetsDetails.activeItem.id = res.id;
                                    // update state
                                    state.settings.assets_info[res.id] = {
                                        meta: res.meta,
                                        type: res.type
                                    };
                                    AssetsDetails._closeAndReturn(target); // return to assets list UI or to section details or ...
                                }
                            });
                        }
                    });

                }
            }
        );
    },

    _handleLayoutChange(event) {
        const layoutItem = event.currentTarget
        const layout = layoutItem.getAttribute('data-layout');
        this.activeSection.layout = layout;

        this.uiElements.sectionLayouts.forEach(l => { l.classList.remove('selected'); });
        layoutItem.classList.add('selected');
        this.uiElements.sectionLayoutPreview.src = `../assets/images/section-layout-${layout}.png`;
    },

    _initResultTable() {
        searchTableSectionAssetsConfig.options.editOrNew = this.activeSection.id ? "Edit" : "New";
        this.resultTable = new SearchTableSectionAssets("tableSectionAssetsList", searchTableSectionAssetsConfig);
        this.resultTable.sort = { "meta.title": -1 }
        this.resultTable.search("");
    },

    _initSearch() {
        this.uiElements.searchBtn.addEventListener('click', () => {
            this.resultTable.refresh({ searchText: this.uiElements.searchText.value });
        });

        this.uiElements.searchText.addEventListener("keypress", (event) => {
            if (event.key === "Enter") this.resultTable.refresh({ searchText: this.uiElements.searchText.value });
        });
    },

    _toggleDropdown(forceClose) {
        if (this.uiElements.dropDown.classList.contains("open") || forceClose) {
            this.uiElements.dropDown.classList.remove("open");
        } else this.uiElements.dropDown.classList.add("open");
    },

    validTitle() {
        // check if the title is valid and not empty
        return (this.uiElements.title.value.trim().length > 0) ? this.uiElements.title.value : "";
    },

    toggleSaveButton() {
        if (this.sectionAssets.length > 0 && this.validTitle())
            this.uiElements.saveBtn.removeAttribute("disabled")
        else this.uiElements.saveBtn.setAttribute("disabled", "disabled")
    }
}