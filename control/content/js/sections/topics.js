const TopicsList = {

    uiElements: {},
    resultTable: {},

    init() {
        this._initUIElements();
        this._initResultTable();

        this.uiElements.addTopicBtn.addEventListener('click', () => {
            Views().loadSubPage("addEditTemplate-topic", ["Topics", "Add Topic"])
            TopicsDetails.init(new Topic());
        });
    },


    refresh(callback) {
        Settings.getTopics((error, result) => {
            if (error) return callback(error, null);
            state.settings.topics = result;
            callback(error, result);
        })
    },


    _initUIElements() {
        this.uiElements.tableTopicsList = document.getElementById('tableTopicsList');
        this.uiElements.emptyStateTopics = document.getElementById('emptyStateTopics');
        this.uiElements.addTopicBtn = document.getElementById('addTopicBtn');
    },

    _initResultTable() {
        this.resultTable = new SearchTableTopics("tableTopicsList", searchTableTopicsConfig);
        this.resultTable.sort = { "title": -1 }
        this.resultTable.search("");
    },

}

const TopicsDetails = {

    uiElements: {},
    topicImageHolder: null,
    _tagifyTags: null,

    init(topic, tr) {
        this.activeTopic = topic;
        this.activeTr = tr;

        this._initUIElements();

        this.uiElements.topicTitle.value = topic.title || "";
        this.uiElements.topicTag.value = topic.tag || [];
        this._initImageHolder(topic);

        // check if title empty
        this._toggleSaveButton();
        this.uiElements.topicTitle.addEventListener('input', () => { this._toggleSaveButton() });

        this._tagify();

        // add initial tags if exists
        if (this.activeTopic.tag) this._tagifyTags.addTags(this.activeTopic.tag);

        this._tagifyTags.DOM.input.addEventListener('focus', () => {
            this._selectTags();
        })

    },

    save() {
        this.activeTopic.title = this.uiElements.topicTitle.value;
        this.activeTopic.tag = (this._tagifyTags.value.length) ? this._tagifyTags.value.map(tag => tag.value) : [];

        if (this.activeTopic.id)
            Settings.updateTopic(this.activeTopic.id, this.activeTopic, (err, res) => {
                if (err) console.log(err)
                else {
                    TopicsList.resultTable.renderRow(this.activeTopic, this.activeTr);
                    Views().closeAllSubPages();
                }
            })
        else {
            Settings.addTopic(this.activeTopic, (err, res) => {
                if (err) console.log(err)
                else {
                    Views().closeAllSubPages();
                    TopicsList.resultTable.refresh({});
                }
            })
        }
    },

    cancel() {
        Views().closeAllSubPages();
    },

    openAddTopicScreen() {
        Views().closeAllSubPages();
        Views().navigate('topics');
    },

    _initUIElements() {
        this.uiElements.topicTitle = document.getElementById('topicName');
        this.uiElements.topicTag = document.getElementById('topicTag');
        this.uiElements.saveTopic = document.getElementById('saveTopic');
    },

    _initImageHolder(topic) {
        this.topicImageHolder = new buildfire.components.images.thumbnail(".thumbnail-picker-topics", {
            imageUrl: '',
            title: "Topic Image",
            dimensionsLabel: "Recommended 1200x675",
            multiSelection: false
        });

        this.topicImageHolder.onChange = (imageUrl) => {
            this.activeTopic.image = imageUrl;
        };

        this.topicImageHolder.onDelete = () => {
            this.activeTopic.image = "";
        };

        this.topicImageHolder.init(".thumbnail-picker-topics");
        if (topic.id && topic.image) this.topicImageHolder.loadbackground(topic.image);
    },

    _tagify() {
        const tagifyOptions = { autocomplete: false, enforceWhitelist: false, userInput: false }
        this._tagifyTags = new Tagify(this.uiElements.topicTag, tagifyOptions);
        this._tagifyTags.on('remove', this._onAddRemoveTag.bind(this))
        this._tagifyTags.on('add', this._onAddRemoveTag.bind(this))
    },

    _onAddRemoveTag() {
        this._toggleSaveButton();
    },

    _selectTags() {
        buildfire.auth.showTagsSearchDialog(null, (err, result) => {
            if (err) return console.error(err);
            if (result) { // user clicked select tags and not cancel
                const inputTags = result.map(tag => tag.tagName);
                // reset tags
                this._tagifyTags.removeAllTags();
                // add tags and hide the buttons untill user remove all tags 
                if (inputTags && inputTags.length) {
                    this._tagifyTags.addTags(inputTags); // Multiple tags are now allowed
                }
            }
            this._toggleSaveButton();
        });
    },

    _toggleSaveButton() {
        if (this.uiElements.topicTitle.value) this.uiElements.saveTopic.removeAttribute("disabled")
        else this.uiElements.saveTopic.setAttribute("disabled", "disabled")
    }

}