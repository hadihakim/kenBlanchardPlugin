const AssetsList = {

    uiElements: {},
    resultTable: {},

    init() {
        this._initUIElements();
        this._initResultTable();
        this._initSearch();
        this._toggleDropdown(true);
        AssetsBulkActionsUI.init();
    },

    _initUIElements() {
        this.uiElements = {
            searchText: document.getElementById('assets-search-input'),
            searchBtn: document.getElementById('assets-search-btn'),
            tableList: document.getElementById('tableAssetsList'),
            emptyStateList: document.getElementById('emptyStateAssets'),
            dropDown: document.getElementById('add-assets-dropdown'),
            dropDownItems: document.querySelectorAll('#add-assets-dropdown li'),
            addBtn: document.getElementById('addBtnAssets'),
        }

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
                let item = AssetsDetails.create({ type: assetType });
                AssetsDetails.init(item, { target: "assets", isNew: true });
            });
        });

    },

    _initResultTable() {
        this.resultTable = new SearchTableAssets("tableAssetsList", searchTableAssetsConfig);
        this.resultTable.sort = { "_buildfire.index.text": 1 }
        this.resultTable.onFetchState("loading");
        TopicsList.refresh(() => {
            this.resultTable.search(Assets.getSearchFilter(this.uiElements.searchText.value));
        });
    },

    _initSearch() {
        this.uiElements.searchBtn.addEventListener('click', () => {
            this.resultTable.refresh(Assets.getSearchFilter(this.uiElements.searchText.value));
        });

        this.uiElements.searchText.addEventListener("keypress", (event) => {
            if (event.key === "Enter") this.resultTable.refresh(Assets.getSearchFilter(this.uiElements.searchText.value));
        });
    },

    _toggleDropdown(forceClose) {
        if (this.uiElements.dropDown.classList.contains("open") || forceClose) {
            this.uiElements.dropDown.classList.remove("open");
        } else this.uiElements.dropDown.classList.add("open");
    },

}

const AssetsDetails = {

    uiElements: {},
    imageHolder: null,
    _tagifyTags: null,

    init(item, options) {

        this.activeItem = {...item };
        this.options = options;
        this.activeTr = options.activeTr || null;
        this.target = options.target || "assets";

        this._loadUI();
        this._initUIElements();

        // fill meta data
        this._fillMetaUIFields(item);

        // WYSIWYG editor(s) init
        wysiwygAssets.init(item, item.type);

        // Asset specific fields
        this._fillAssetUIFields(item);

    },

    save() {
        // set meta data (common fields)
        this.activeItem.meta.title = this.uiElements.title.value;
        this.activeItem.meta.topics = this._getSelectedTopics();
        this.activeItem.meta.description = this.uiElements.description.value;
        this.activeItem.meta.duration = this.uiElements.duration ? Utils.hhmmssToNum(this.uiElements.duration.value) : 0;

        // asset specific fields
        this.activeItem.url = this.uiElements.url ? this.uiElements.url.value : null;
        // media specific fields
        this.activeItem.checkList = (ListItemsUI.list && ListItemsUI.list.items) || [];
        // book summary specific items
        this.activeItem.chapters = (listOfChapters.list && listOfChapters.list.items) || [];

        // disable save button while saving
        this.uiElements.saveBtn.setAttribute("disabled", "disabled")

        this._saveOrUpdate((err, res) => {
            if (err) console.log(err)
            else {
                this.activeItem.id = res.id;
                // update state
                state.settings.assets_info[res.id] = {
                    meta: res.meta,
                    type: res.type
                };
                this._closeAndReturn(this.target); // return to assets list UI or to section details or ...
            }
        });

    },

    create(asset) {
        switch (asset.type) {
            case "audio":
                return new Audio(asset);
            case "video":
                return new Video(asset);
            case "article":
                return new Article(asset);
            case "summary":
                return new Summary(asset);
            case "book":
                return new Book(asset);
            case "action-item":
                return new ActionItem(asset);
            default:
                console.log("Unknown asset type");
                break;
        }
    },

    cancel() {
        Views().closeCurrentPage(this.breadCrumb.length - 2);
    },

    _loadUI() {
        let addOrEditAsset = (this.activeItem.id) ? "Edit" : "Add";
        let addOrEditSection = this.options.isNew ? "New" : "Edit";
        let assetTitles = {
            audio: "Audio",
            video: "Video",
            article: "Article",
            summary: "Book Summary",
            book: "PDF",
        }
        let breadCrumb = [];
        let assetTitle = `${addOrEditAsset} ${assetTitles[this.activeItem.type]}`;

        if (this.target == "assets")
            breadCrumb = ["Assets", assetTitle];
        else {
            // if section title is set, add it to breadcrumb, otherwise add new/Edit Section
            let sectionTitle = SectionsDetails.validTitle() || `${addOrEditSection} Section`;
            breadCrumb = ["Sections", sectionTitle, assetTitle];
        }

        this.breadCrumb = breadCrumb;
        // we are using same template for audio and video, since they have the exact same design and functionalities for now
        let templateName = ["audio", "video"].includes(this.activeItem.type) ? "media" : this.activeItem.type;
        Views().loadSubPage(`addEditTemplate-${templateName}`, breadCrumb);
    },

    _saveOrUpdate(callback) {
        let assetItem = this.create(this.activeItem);

        if (this.activeItem.id) Assets.update(this.activeItem.id, assetItem, callback)
        else Assets.add(assetItem, callback)
    },

    // prefill UI with meta fields values if we are editing an asset (common for all asset types) 
    _fillMetaUIFields(item) {
        this.uiElements.title.value = item.meta.title || "";
        this.uiElements.description.value = item.meta.description || "";
        if (this.uiElements.duration) this.uiElements.duration.value = Utils.numToHHMMSS(item.meta.duration);

        this._initImageHolder(item); // display image

        // check if title empty
        this._toggleSaveButton();
        this.uiElements.title.addEventListener('input', () => { this._toggleSaveButton() });

        // fill duration and topics
        if (this.uiElements.duration) HtmlDurationPicker.refresh();
        this._displayTopics();
    },

    // prefill UI with asset type specific fields values if we are editing an asset
    _fillAssetUIFields(item) {
        switch (item.type) {
            case "article":
                // URL 
                this.uiElements.url.value = item.url || "";

                // toggle keytakeaways 
                this.uiElements.toggleTakeAways.checked = (typeof item.showKeyTakeaways === 'undefined') ? false : item.showKeyTakeaways;
                this.uiElements.toggleTakeAways.onchange = () => { this._toggleTakeAways() };
                break;
            case "audio":
            case "video":
                this.uiElements.toggleDetails.checked = (typeof item.showDetails === 'undefined') ? false : item.showDetails;
                this.uiElements.toggleDetails.onchange = () => {
                    this._toggleDetails()
                };

                this.uiElements.toggleTranscript.checked = (typeof item.showTranscript === 'undefined') ? false : item.showTranscript;
                this.uiElements.toggleTranscript.onchange = () => { this._toggleTranscript() };

                this.uiElements.toggleCheckList.checked = (typeof item.showCheckList === 'undefined') ? false : item.showCheckList;
                this.uiElements.toggleCheckList.onchange = () => { this._toggleCheckList() };
                break;
            case "book":
                // URL 
                this.uiElements.url.value = item.url || "";
                break;
            default:
                break;
        }

        this._toggleSaveButton();

    },

    _initUIElements() {
        this.uiElements = {
            title: document.getElementById('mediaTitle'),
            description: document.getElementById('mediaDesc'),
            duration: document.getElementById('mediaDur'),
            topicsContainer: document.getElementById('assetTopicsContainer'),
            topicsEmptyState: document.getElementById('assetTopicsEmptyState'),
            saveBtn: document.getElementById('saveAsset'),
            url: document.getElementById('mediaURL'),
            toggleTakeAways: document.getElementById("toggleKeyTakeAways"),
            toggleDetails: document.getElementById("toggleDetails"),
            toggleTranscript: document.getElementById("toggleTranscript"),
            toggleCheckList: document.getElementById("toggleCheckList"),
        }

        // if audio or video, add task list modal button
        if (["audio", "video"].includes(this.activeItem.type)) {
            ListItemsUI.init("media-container");
        }
        // if book summary, init dropdown
        if (this.activeItem.type == "summary") listOfChapters.init("summary-container");

        // book summary, does not have URL field
        if (this.uiElements.url) this.uiElements.url.addEventListener('input', () => { this._toggleSaveButton() });

    },

    _closeAndReturn(target) {
        switch (target) {
            case "assets":
                Views().closeCurrentPage(0);
                AssetsList.resultTable.refresh({});
                break;
            case "sections":
                Views().closeCurrentPage(1);
                SectionsDetails.addOrUpdateAsset(this.activeItem);
                SectionsDetails.resultTable.refresh({});
                break;

            default: // action item (without sub-page)
                SectionsDetails.addOrUpdateAsset(this.activeItem);
                SectionsDetails.resultTable.refresh({});
                break;
        }
    },

    _displayTopics() {
        this._toggleTopicsEmptyState(!state.settings.topics.length);
        state.settings.topics.forEach((topic, index) => {
            let topicCol = Utils.createUIElement({ elementType: 'div', classArray: ['col-xs-6'], parent: this.uiElements.topicsContainer })
            let checkBoxContainer = Utils.createUIElement({ elementType: 'div', classArray: ['checkbox', 'checkbox-primary'], parent: topicCol })
            Utils.createUIElement({ elementType: 'input', classArray: ['checkbox', 'checkbox-primary'], parent: checkBoxContainer, attrObj: { type: 'checkbox', value: topic.id, id: `asset-topic-${topic.id}`, [this._isActiveTopic(topic.id) ? "checked" : "checkedHolder"]: "checked" } })
            Utils.createUIElement({ elementType: 'label', classArray: ['checkbox', 'checkbox-primary'], parent: checkBoxContainer, attrObj: { for: `asset-topic-${topic.id}` }, innerHTML: topic.title });
        });
    },

    _toggleTakeAways() {
        this.activeItem.showKeyTakeaways = this.uiElements.toggleTakeAways.checked;
    },

    _toggleDetails() {
        this.activeItem.showDetails = this.uiElements.toggleDetails.checked;
    },

    _toggleTranscript() {
        this.activeItem.showTranscript = this.uiElements.toggleTranscript.checked;
    },

    _toggleCheckList() {
        this.activeItem.showCheckList = this.uiElements.toggleCheckList.checked;
    },

    _initImageHolder(item) {
        let thumbTitle = (["audio", "video"].includes(this.activeItem.type) ? "Media Thumbnail" : "Cover Image")
        this.imageHolder = new buildfire.components.images.thumbnail(".thumbnail-picker-assets", {
            imageUrl: '',
            title: thumbTitle,
            dimensionsLabel: "Recommended 1200x675",
            multiSelection: false
        });

        this.imageHolder.onChange = (imageUrl) => {
            this.activeItem.meta.image = imageUrl;
        };

        this.imageHolder.onDelete = () => {
            this.activeItem.meta.image = "";
        };

        this.imageHolder.init(".thumbnail-picker-assets");
        if (item.id && item.meta.image) this.imageHolder.loadbackground(item.meta.image);

    },

    _isActiveTopic(topicId) {
        return this.activeItem.meta.topics.indexOf(topicId) > -1;
    },

    _toggleTopicsEmptyState(show) {
        if (show) this.uiElements.topicsEmptyState.classList.remove('hidden');
        else this.uiElements.topicsEmptyState.classList.add('hidden');
    },

    _getSelectedTopics() {
        return [...state.settings.topics].filter((topic, index) => {
            return document.getElementById(`asset-topic-${topic.id}`).checked;
        }).map(topic => topic.id);
    },

    _toggleSaveButton() {
        let disabled = (this.activeItem.type == "book" && !this.uiElements.url.value) ||
            (this.activeItem.type == "summary" && !listOfChapters.list.items.length) ||
            (!this.uiElements.title.value)

        if (disabled) this.uiElements.saveBtn.setAttribute("disabled", "disabled")
        else this.uiElements.saveBtn.removeAttribute("disabled")
    }

}

const AssetsBulkActionsUI = {
    uiElements: {},

    init() {
        this._initUIElements();
        this._toggleDropdown(true);
    },

    _initUIElements() {
        this.uiElements = {
            dropDown: document.getElementById('assets-bulk-dropdown'),
            dropDownTemplate: document.getElementById('assets-bulk-dropdown-template'),
            importeAssets: document.getElementById('assets-bulk-import')
        }

        // Add event listeners
        this.uiElements.dropDown.addEventListener('click', (event) => {
            event.stopPropagation();
            this._toggleDropdown();
        })

        this.uiElements.dropDownTemplate.addEventListener('click', (event) => {
            event.stopPropagation();
            AssetBulkActions.downloadTemplate();
        })

        this.uiElements.importeAssets.addEventListener('click', (event) => {
            const fileInput = document.querySelector("#assets-file-input");
            event.stopPropagation();
            fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                fileInput.value = "";
                AssetBulkActions.importCSV(file);
            }
        })

        // close dropdown when clicked outside 
        document.body.addEventListener('click', () => {
            this._toggleDropdown(true);
        });

    },

    _toggleDropdown(forceClose) {
        if (this.uiElements.dropDown.classList.contains("open") || forceClose) {
            this.uiElements.dropDown.classList.remove("open");
        } else this.uiElements.dropDown.classList.add("open");
    },

}

const AssetBulkActions = {
    _importErrors: [],

    init() {
        this._importErrors = [];
    },

    downloadTemplate() {
        const templateHeader = {
            id: 'id',
            type: 'type',
            title: "title",
            description: "short description",
            image: "image url",
            topics: "topics",
            duration: "duration",
            createdOn: "createdOn",
            url: "url",
            showKeyTakeaways: "showKeyTakeaways",
            keyTakeAways: "keyTakeAways",
            showTranscript: "showTranscript",
            transcript: "transcript",
            showShortcuts: "showShortcuts",
            shortcuts: "shortcuts",
            details: "details",
            fullArticle: "fullArticle",
            chapters: "chapters"
        };

        const templateData = [{
            id: '',
            type: '',
            title: "",
            description: "",
            image: "",
            topics: "",
            duration: "600 (i.e 10 minutes)",
            createdOn: "",
            url: "",
            showKeyTakeaways: "",
            keyTakeAways: "",
            showTranscript: "",
            transcript: "",
            showShortcuts: "",
            shortcuts: "[{title, timeStamp}]",
            details: "",
            fullArticle: "",
            chapters: "[{title, subtitle, premium, pages: [{pageImage, pageContent}] }]",
        }];

        AssetsBulkActionsUI._toggleDropdown(true);
        const csv = csvHelper.jsonToCsv(templateData, templateHeader);
        csvHelper.downloadCsv(csv, 'template.csv');
    },

    importCSV(file) {
        this._importErrors = [];

        csvHelper.readCSVFile(file, (err, result) => {

            let importedAssets = result.reduce((validAssets, currentAsset, lineNumber) => {
                // filter bad data rows
                let errorsFound = this._validateRow(currentAsset);
                if (!errorsFound.length) {
                    let row = this._cleanRow(currentAsset);
                    let asset = AssetsDetails.create(row);
                    // creating Asset index
                    asset._buildfire.index = Assets.buildIndex(asset);
                    validAssets.push(asset);
                } else this._importErrors.push({ line: lineNumber, errors: errorsFound });
                return validAssets;
            }, []);

            const importDialog = this._showImportDialog({
                title: 'Importing Assets',
                message: 'We’re importing your Assets, please wait.'
            });

            let dialogBody = importDialog.container.querySelector('.progress-message');
            // nothing to import or error parsing CSV  or all rows are invalid
            if (!importedAssets.length) return this._showImportResult(importedAssets, importDialog);
            // some rows are valid
            Assets.bulkAdd(importedAssets, (err, result) => {
                if (err) {
                    dialogBody.innerHTML = "An error occured during the import";
                } else {
                    this._showImportResult(importedAssets, importDialog);
                    AssetsList.resultTable.refresh({});
                    // update state with newly inserted assets
                    result.forEach(asset => {
                        state.settings.assets_info[asset.id] = {
                            meta: asset.meta,
                            type: asset.type
                        };
                    })
                }
            })
        })
    },

    _showImportDialog({ title, message }) {
        const importDialog = new Modal("modal", 'bulkImportTemplate');
        importDialog.container.querySelector('.progress-message').innerHTML = message;
        importDialog.showDialog({
            title: title,
            hideDelete: true,
            hideCancel: false,
            hideSave: true,
            hideFooter: true
        });
        return importDialog;
    },

    _showImportResult(importedAssets, importDialog) {
        let importErrors = this._importErrors;
        let dialogBody = importDialog.container.querySelector('.progress-message');
        let bulkImportReport = `${importedAssets.length} asset(s) were imported successfully <br/>`;
        if (importErrors.length) {
            bulkImportReport += `${importErrors.length} asset(s) were not imported due to error(s) <br/>` +
                `<hr/>` +
                `<div class="errors-list">` +
                `<ul>` +
                importErrors.map(error => `<li><blockquote>Line ${error.line+2}: 
                        ${error.errors.map(e => '<p class="bf-text-danger margin-top-ten padding-left-thirty">'+e+'</p>').join('')}</blockquote></li>`).join('') +
                `</ul>` +
                `</div>`;
        }

        dialogBody.innerHTML = bulkImportReport;
    },

    _validateRow(row) {
        let errors = [];
        if (!row.title || !row.title.trim()) errors.push('Asset Title should be set');
        if (!row.type || !row.type.trim()) errors.push('Asset Type should be set');
        if (!row.duration && !isNaN(row.duration)) errors.push('Asset Duration should be a number in seconds');

        try {
            // check if there is any chapter without title
            if (row.chapters) {
                let chapters = JSON.parse(row.chapters);
                if (chapters.some(chapter => !chapter.title))
                    errors.push('All Chapters should have a title');

                // check if chapter has any page without image and without content
                if (chapters.some(chapter => (!chapter.pages || !chapter.pages.length ||
                        chapter.pages.some(page => !page.pageImage && !page.pageContent))))
                    errors.push('All Chapters should have at least one page with image and content');
            }

            // check if there is any shortcut without title
            if (row.shortcuts) {
                let shortcuts = JSON.parse(row.shortcuts || []);
                if (shortcuts.some(shortcut => !shortcut.title || !shortcut.timeStamp))
                    errors.push('All Shortcuts should have a title and timeStamp');
            }
        } catch (error) {
            errors.push('Make sure you have valid JSON in the chapters and shortcuts fields');
        }

        // check if article has at least url or fullArticle
        if (!row.url && !row.fullArticle && row.type === 'article')
            errors.push('Article should have at least url or fullArticle set');

        return errors;
    },

    _cleanRow(row) {
        // trim all values
        for (let key in row) row[key] = row[key].trim();

        // convert topics to array
        // replace topics name with id from settings and remove non existent topics
        if (row.topics) row.topics = row.topics.
        split(',').
        filter(topic => state.settings.topics.findIndex(t => t.title.toLowerCase() === topic.toLowerCase()) > -1).
        map(topic => state.settings.topics.find(t => t.title.toLowerCase() === topic.toLowerCase()).id)

        // if duration is not set replace it by zero
        row.duration = parseInt(row.duration || 0, 10);

        // convert chapters to array
        if (row.chapters) row.chapters = JSON.parse(row.chapters);

        // convert shortcuts to array
        if (row.shortcuts) row.shortcuts = JSON.parse(row.shortcuts);

        row.createdOn = new Date();
        row.createdBy = authManager.currentUser.email;

        // add Meta data
        row.meta = {
            title: row.title,
            description: row.description || '',
            image: row.image || '',
            topics: row.topics || [],
            duration: row.duration,
            createdOn: row.createdOn
        }

        return row;
    },

}

const AssetsDialog = {
    modal: null,
    init() {
        this.showDialog();
        this._initUIElements();
        this._initResultTable();
        this._initSearch();
        this._toggleSaveButton();
    },

    showDialog() {
        this.modal = new Modal("modal", 'assetsModalTemplate');
        this.modal.showDialog({
            title: 'Assets',
            hideClose: false,
            hideCancel: false,
            saveText: "Select",
            hideSave: false,
            primarySaveBtn: true,
            hideFooter: false
        });
    },

    _save() {
        // call on add on remove AssetList.result table
        SectionsDetails.resultTable.refresh({});
        SectionsDetails.toggleSaveButton();
        this.modal.close();
    },

    _initResultTable() {
        this.resultTable = new SearchTableAssetsModal("tableAssetsModalList", searchTableExistingAssetsConfig);
        this.resultTable.sort = { "_buildfire.index.string1": -1 }
        this.resultTable.onFetchState("loading");
        this.resultTable.search(Assets.getSearchFilter(this.uiElements.searchText.value));
    },

    _initSearch() {
        this.uiElements.searchBtn.addEventListener('click', () => {
            this.resultTable.refresh(Assets.getSearchFilter(this.uiElements.searchText.value));
        });

        this.uiElements.searchText.addEventListener("keypress", (event) => {
            if (event.key === "Enter") this.resultTable.refresh(Assets.getSearchFilter(this.uiElements.searchText.value));
        });
    },

    _initUIElements() {
        this.uiElements = {
            searchText: document.getElementById('assets-modal-search-input'),
            searchBtn: document.getElementById('assets-modal-search-btn'),
            tableList: document.getElementById('tableAssetsModalList'),
            emptyStateList: document.getElementById('emptyStateAssetsModal'),
        }

        // add event listeners to modal save button
        this.modal.btnSave.onclick = () => {
            this._save();
        };
    },

    _toggleSaveButton() {
        if (SectionsDetails.sectionAssets.length > 0)
            this.modal.btnSave.removeAttribute("disabled")
        else this.modal.btnSave.setAttribute("disabled", "disabled")
    }

}

const ChapterDetails = {

    uiElements: {},
    imageHolder: null,

    init(item, index, divRow) {

        this.item = {...item } || {};
        this.index = index;
        this.divRow = divRow;

        this._loadUI();
        this._initUIElements();
        this._fillUIFields(this.item);
    },

    save() {
        this.item.title = this.uiElements.title.value;
        this.item.subTitle = this.uiElements.subTitle.value;
        let chapter = new SummaryChapter(this.item);
        if (!this.divRow)
            listOfChapters.list.addItem(chapter, () => {}) // addItem() auto update the list
        else {
            listOfChapters.list.items[this.index] = chapter; // update the list
            listOfChapters.list._injectItemElements(this.item, this.index, this.divRow);
        }
        AssetsDetails.activeItem.chapters = listOfChapters.list.items;
        listOfChapters._updateEmptyState();
        AssetsDetails._toggleSaveButton();
        this._closeAndReturn();
    },

    cancel() {
        Views().closeCurrentPage(this.breadCrumb.length - 2);
    },

    _loadUI() {

        let addOrEdit = (this.divRow) ? "Edit" : "Add";
        let breadCrumb = [...AssetsDetails.breadCrumb, `${addOrEdit} Chapter`]

        this.breadCrumb = breadCrumb;
        Views().loadSubPage("addEditTemplate-summary-chapter", breadCrumb);
    },

    // prefill UI with asset type specific fields values if we are editing an asset
    _fillUIFields(item) {
        this.uiElements.title.value = item.title || "";
        this.uiElements.subTitle.value = item.subTitle || "";
        this._toggleSaveButton();
    },

    _initUIElements() {
        this.uiElements = {
            title: document.getElementById('chapterTitle'),
            subTitle: document.getElementById('chapterSubTitle'),
            saveBtn: document.getElementById('saveChapter'),
        }

        // Cover Image
        this._initImageHolder(this.item); // display image

        // List
        listOfPages.init("chapter-container");

        this.uiElements.title.addEventListener('input', () => { this._toggleSaveButton() });

    },

    _closeAndReturn() {
        breadCrumbIndex = (AssetsDetails.target == "assets") ? 1 : 2;
        Views().closeCurrentPage(breadCrumbIndex);
    },

    _initImageHolder(item) {
        let thumbTitle = "Cover Image";
        this.imageHolder = new buildfire.components.images.thumbnail(".thumbnail-picker-chapters", {
            imageUrl: '',
            title: thumbTitle,
            dimensionsLabel: "Recommended 1200x675",
            multiSelection: false
        });

        this.imageHolder.onChange = (imageUrl) => {
            this.item.chapterImage = imageUrl;
        };

        this.imageHolder.onDelete = () => {
            this.item.chapterImage = "";
        };

        this.imageHolder.init(".thumbnail-picker-chapters");
        if (item.chapterImage) this.imageHolder.loadbackground(item.chapterImage);
    },

    _toggleSaveButton() {
        let disabled = (!this.uiElements.title.value || listOfPages.list.items.length == 0);

        if (disabled) this.uiElements.saveBtn.setAttribute("disabled", "disabled")
        else this.uiElements.saveBtn.removeAttribute("disabled")
    }

}

const PageDetails = {

    uiElements: {},
    imageHolder: null,

    init(item, index, divRow) {

        this.item = {...item } || {};
        this.index = index;
        this.divRow = divRow;

        this._loadUI();
        this._initUIElements();

        // WYSIWYG editor(s) init
        wysiwygAssets.init(this.item, "summary-page", () => { this._toggleSaveButton() });

        this._fillUIFields(this.item);
    },

    save() {
        let page = new SummaryPage(this.item);
        if (!this.divRow)
            listOfPages.list.addItem(page, () => {}) // addItem() auto update the list
        else {
            listOfPages.list.items[this.index] = page; // update the list
            listOfPages.list._injectItemElements(this.item, this.index, this.divRow)
        }

        listOfPages._updateEmptyState();
        ChapterDetails.item.pages = listOfPages.list.items;
        ChapterDetails._toggleSaveButton();
        this._closeAndReturn();
    },

    cancel() {
        Views().closeCurrentPage(this.breadCrumb.length - 2);
    },

    _loadUI() {

        let addOrEdit = (this.divRow) ? "Edit" : "Add";
        let breadCrumb = [...ChapterDetails.breadCrumb, `${addOrEdit} Page`]

        this.breadCrumb = breadCrumb;
        Views().loadSubPage("addEditTemplate-summary-page", breadCrumb);
    },

    // prefill UI with asset type specific fields values if we are editing
    _fillUIFields(item) {
        this._toggleSaveButton();
    },

    _initUIElements() {
        this.uiElements = {
            saveBtn: document.getElementById('savePage'),
        }

        // Cover Image
        this._initImageHolder(this.item); // display image
    },

    _closeAndReturn() {
        breadCrumbIndex = (AssetsDetails.target == "assets") ? 2 : 3;
        Views().closeCurrentPage(breadCrumbIndex);
    },

    _initImageHolder(item) {
        let thumbTitle = "Cover Image";
        this.imageHolder = new buildfire.components.images.thumbnail(".thumbnail-picker-summary-page", {
            imageUrl: '',
            title: thumbTitle,
            dimensionsLabel: "Recommended 1200x675",
            multiSelection: false
        });

        this.imageHolder.onChange = (imageUrl) => {
            this.item.pageImage = imageUrl;
            this._toggleSaveButton();
        };

        this.imageHolder.onDelete = () => {
            this.item.pageImage = "";
            this._toggleSaveButton();
        };

        this.imageHolder.init(".thumbnail-picker-summary-page");
        if (item.pageImage) this.imageHolder.loadbackground(item.pageImage);
    },

    _toggleSaveButton() {
        let disabled = (!this.item.pageContent && !this.item.pageImage)

        if (disabled) this.uiElements.saveBtn.setAttribute("disabled", "disabled")
        else this.uiElements.saveBtn.removeAttribute("disabled")
    }

}

const ListItemsUI = {
    uiElements: {},

    init(target) {
        this.target = target;
        this._initUIElements();
        this._initList();
    },

    _sort(field, sortDirection, text) {
        let sortedList = Utils.sortObjectArray(this.list.items, field, sortDirection);
        this.list.render(sortedList);
        this.uiElements.dropDownTxt.innerHTML = text;
    },

    _initList() {
        this._updateEmptyState("loading");

        // init list based on target
        switch (this.target) {
            case "media-container":
                this.list = new checkListUI(`.${this.target} .sortable-List-container`);
                this.list.init(AssetsDetails.activeItem.checkList);
                break;
            case "summary-container":
                this.list = new chaptersListUI(`.${this.target} .sortable-List-container`);
                this.list.init(AssetsDetails.activeItem.chapters);
                break;
            case "chapter-container":
                this.list = new pagesListUI(`.${this.target} .sortable-List-container`);
                this.list.init(ChapterDetails.item.pages || []);
                break;
        }
        if (!this.list.items.length) return this._updateEmptyState("empty");

        this._updateEmptyState();
    },

    _initUIElements() {
        this.uiElements = {
            addBtn: document.querySelector(`.${this.target} .add-List-item-btn`),
            sortableList: document.querySelector(`.${this.target} .sortable-List-container`),
            emptyState: document.querySelector(`.${this.target} .emptyStateList`),
            dropDown: document.querySelector(`.${this.target} .list-sort-dropdown`),
            dropDownTxt: document.querySelector(`.${this.target} .list-sort-txt`),
            dropDownItems: document.querySelectorAll(`.${this.target} .list-sort-dropdown li`),
        }

        this._initDropDown();

        this.uiElements.addBtn.onclick = () => {
            if (this.target == "media-container") CheckListDialog.init();
            else if (this.target == "summary-container") ChapterDetails.init(new SummaryChapter());
            else if (this.target == "chapter-container") PageDetails.init(new SummaryPage());
        };

    },

    _initDropDown() {

        this._toggleDropdown(true);

        // Add event listeners
        this.uiElements.dropDown.addEventListener('click', (event) => {
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
                let sortType = event.currentTarget.getAttribute('data-sort');
                sortType == "newest" ? this._sort('createdOn', 'desc', 'Newest First') :
                    this._sort('createdOn', 'asc', 'Oldest First');
            });
        });
    },

    _toggleDropdown(forceClose) {
        if (this.uiElements.dropDown.classList.contains("open") || forceClose) {
            this.uiElements.dropDown.classList.remove("open");
        } else this.uiElements.dropDown.classList.add("open");
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

const listOfChapters = {...ListItemsUI };
const listOfPages = {...ListItemsUI };

const CheckListDialog = {
    modal: null,
    init(item, index, divRow) {
        this.item = item || {}; // taskname and timestamp
        this.index = index;
        this.divRow = divRow;

        this.showDialog();
        this._initUIElements();
        this._fillMetaUIFields();
    },

    showDialog() {
        this.modal = new Modal("modal", 'checkListModalTemplate');
        this.modal.showDialog({
            title: 'Add Task',
            hideClose: false,
            hideCancel: false,
            saveText: "Save",
            hideSave: false,
            hideFooter: false
        });
    },

    save() {
        // call on add on remove AssetList.result table
        this.item.title = this.uiElements.title.value;
        this.item.timeStamp = Utils.hhmmssToNum(this.uiElements.timeStamp.value);
        (!this.divRow) ? ListItemsUI.list.addItem(new MediaCheckList(this.item), () => {}): ListItemsUI.list._injectItemElements(this.item, this.index, this.divRow);
        ListItemsUI._updateEmptyState();
        this.modal.close();
    },

    // prefill UI with fields values if we are editing 
    _fillMetaUIFields() {
        this.uiElements.title.value = this.item.title || "";
        this.uiElements.timeStamp.value = Utils.numToHHMMSS(this.item.timeStamp || 0);

        // check if title empty
        this._toggleSaveButton();
        this.uiElements.title.addEventListener('input', () => { this._toggleSaveButton() });

        // fill duration
        setTimeout(() => {
            HtmlDurationPicker.refresh();
        }, 100);
    },

    _initResultTable() {
        this.resultTable = new SearchTableAssetsModal("tableAssetsModalList", searchTableExistingAssetsConfig);
        this.resultTable.sort = { "_buildfire.index.string1": -1 }
        this.resultTable.onFetchState("loading");
        this.resultTable.search(Assets.getSearchFilter(this.uiElements.searchText.value));
    },

    _initUIElements() {
        this.uiElements = {
            title: document.getElementById('checklist-modal-taskname'),
            timeStamp: document.getElementById('checklist-modal-timestamp'),
        }

        // add event listeners to modal save button
        this.modal.btnSave.onclick = () => {
            this.save();
        };
    },

    _toggleSaveButton() {
        if (!this.uiElements.title.value)
            this.modal.btnSave.setAttribute("disabled", "disabled")
        else this.modal.btnSave.removeAttribute("disabled")
    }

}

const wysiwygAssets = {
    _typingInterval: 500,
    _timeout: 0,
    _editors: {
        "article": [{ selector: '#wysiwygArticle', field: 'fullArticle' },
            { selector: '#wysiwygTakeAways', field: 'keyTakeAways' }
        ],
        "media": [
            { selector: '#wysiwygTranscript', field: 'transcript' },
            { selector: '#wysiwygMediaDetails', field: 'details' }
        ],
        "summary": [{ selector: '#wysiwygSummaryDescription', field: 'fullDescription' }],
        "summary-page": [{ selector: '#wysiwygSummaryPage', field: 'pageContent' }],
    },

    init(item, type, callback = () => {}) {
        // if audio or video, type is unified as media
        this.type = ["audio", "video"].includes(type) ? "media" : type;

        // if page does not have a wysiwyg field, return
        if (!this._editors[this.type]) return;

        this.item = item || {};

        this.callback = callback;

        // destroy any previous wysiwyg instance
        this.destroy();

        // loop through all editors and init them using the _editors options
        this._editors[this.type].forEach(editor => {
            this._create(editor);
        });
    },

    _create(options) {
        tinymce.init({
            selector: options.selector,
            setup: (editor) => {
                editor.on("init", (e) => {
                    editor.setContent(this.item[options.field] || "");
                });

                editor.on("change keyup", (e) => {
                    this.item[options.field] = editor.getContent();
                    this.callback();
                });
            },
        });
    },

    destroy() {
        // loop through all editors and destroy them
        this._editors[this.type].forEach(editor => {
            tinymce.remove(editor.selector);
        });
    },

    _debounce(func, wait) {
        executedFunction = (...args) => {
            const later = () => {
                clearTimeout(this._timeout);
                func(...args);
            };

            clearTimeout(this._timeout);
            this._timeout = setTimeout(later, wait);
        };
        executedFunction();
    }
}