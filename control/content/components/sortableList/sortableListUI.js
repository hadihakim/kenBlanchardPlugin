class SortableListUI {
    constructor(elementId, options = {}) {
        this.container = document.querySelector(elementId);
        this.sortableList = null;
        this.options = options;
    }

    get items() {
        return this.sortableList.items;
    }

    /*
	This method will call the datastore to pull a single object
	it needs to have an array property called `items` each item need {title, imgUrl}
    */
    init(items) {
        this.container.innerHTML = "";
        this.render(items);
    }

    render(items) {
        if (!this.sortableList) {
            this.sortableList = new SortableList(this.container, items || [], this._injectItemElements, this.options);
            this.sortableList.onItemClick = this.onItemClick;
            this.sortableList.onDeleteItem = this.onDeleteItem;
            this.sortableList.onUpdateItem = this.onUpdateItem;
            this.sortableList.onOrderChange = this.onOrderChange;
            this.sortableList.onToggleChange = this.onToggleChange;
            this.sortableList.onImageClick = this.onImageClick;
        } else {
            this.sortableList.loadItems(items);
        }
    }

    // append new sortable item to the DOM
    _injectItemElements(item, index, divRow) {
        // function passed by constructor;
    }

    /**
     * Updates item in datastore and updates sortable list UI
     * @param {Object} item Item to be updated
     * @param {Number} index Array index of the item you are updating
     * @param {HTMLElement} divRow Html element (div) of the entire row that is being updated
     * @param {Function} callback Optional callback function
     */

    updateItem(item, index, divRow, callback) {
        this.sortableList.injectItemElements(item, index, divRow);
    }

    /**
     * This function adds item to datastore and updates sortable list UI
     * @param {Object} item Item to be added to datastore
     * @param {Function} callback Optional callback function
     */

    addItem(item, callback) {
        this.sortableList.append(item);
    }

    deleteItem(index, callback) {
        this.sortableList.items.splice(index, 1);
    }

    onItemClick(item, divRow) {}

    onUpdateItem(item, index, divRow) {
        console.log("onUpdateItem");
    }

    onDeleteItem(item, index, callback) {

    }

    onOrderChange(item, oldIndex, newIndex) {
        console.log("Order changed");
    }

    onToggleChange(item, divRow) {}

    onImageClick(item, index, divRow) {

    }
}

class sectionsListUI extends SortableListUI {
    constructor(elementId) {
        super(elementId, { isDraggable: true });
    }

    // append new sortable item to the DOM
    _injectItemElements(item, index, divRow) {
        if (!item) throw "Missing Item";
        divRow.innerHTML = "";
        divRow.setAttribute("arrayIndex", index);

        // Create the required DOM elements
        var moveHandle = document.createElement("span"),
            title = document.createElement("a"),
            deleteButton = document.createElement("span"),
            editButton = document.createElement("span"),
            toggleButton = document.createElement("div");

        // Add the required classes to the elements
        divRow.className = "d-item clearfix";
        moveHandle.className = "icon icon-menu cursor-grab";
        title.className = "title ellipsis item-title";

        deleteButton.className = "btn--icon icon icon-cross2";
        editButton.className = "btn--icon icon icon-pencil";
        title.innerHTML = item.title;

        toggleButton.classList.add('button-switch');
        toggleButton.classList.add('margin-zero');
        let toggleInput = document.createElement('div');
        toggleInput.innerHTML = `<input id="${item.id}" type="checkbox" />`;
        toggleInput.onclick = () => {}
        toggleInput = toggleInput.firstChild;

        toggleInput.checked = item.isActive;
        let toggleLabel = document.createElement('div');
        toggleLabel.innerHTML = `<label for="${item.id}" class="label-success"></label>`;
        toggleLabel = toggleLabel.firstChild;

        toggleInput.onclick = (event) => {
            console.log(event.target.checked);
            this.onToggleChange(item, event.target.checked, index, divRow);
        }

        toggleButton.appendChild(toggleInput);
        toggleButton.appendChild(toggleLabel);

        // Append elements to the DOM
        divRow.appendChild(moveHandle);

        divRow.appendChild(title);
        divRow.appendChild(toggleButton);
        divRow.appendChild(editButton);
        divRow.appendChild(deleteButton);



        title.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onItemClick(item, index, divRow);
            return false;
        };

        deleteButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            let t = this;
            this.onDeleteItem(item, index, confirmed => {
                if (confirmed) {
                    divRow.parentNode.removeChild(divRow);
                    t.reIndexRows();
                }
            });
            return false;
        };

        editButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onUpdateItem(item, index, divRow);
            return false;
        };
    }

    onOrderChange(item, oldIndex, newIndex) {
        state.settings.sections = this.items;
        Settings.reorderSections(state.settings.sections, () => {});
    }

    onToggleChange(item, isChecked, index, divRow) {
        let toggle = divRow.querySelector("input[type=checkbox]");
        let isActive = isChecked;
        state.settings.sections[index].isActive = isActive;

        Settings.isActiveSection(item.id, isActive, (err, res) => {
            if (err) { //rollback
                console.error(err)
                toggle.checked = !isActive;
                // order may changed, we should not rely on index after callback
                state.settings.sections.find(section => section.id === item.id).isActive = !isActive; // update state
            }
        });
    }

    onUpdateItem(item, index, divRow) {
        Views().loadSubPage("addEditTemplate-section", ["Sections", "Edit Section"]);
        SectionsDetails.init(item, index, divRow);
    }

    onItemClick(item, index, divRow) {
        SectionsDetails.init(item, index, divRow);
    }

    onDeleteItem(item, index, callback) {
        let deleteOptions = {
            title: `Delete Sections`,
            message: `Are you sure you want to delete section ${item.title} ?`,
            confirmButton: { text: "Delete", type: "danger" },
        }

        buildfire.dialog.confirm(deleteOptions, (e, isConfirmed) => {
            if (e) console.error(e);

            if (isConfirmed) {
                if (e) console.error(e);
                if (isConfirmed) {
                    Settings.deleteSection(item.id, (err, res) => {
                        if (err) return console.log(err);

                        state.settings.sections.splice(index, 1); //remove from state
                        if (!state.settings.sections.length) SectionsList._updateEmptyState("empty");
                        callback(item);
                    })
                }
            }
        });

    }
}

class checkListUI extends SortableListUI {
    constructor(elementId) {
        super(elementId, { isDraggable: true });
    }

    // append new sortable item to the DOM
    _injectItemElements(item, index, divRow) {
        if (!item) throw "Missing Item";
        divRow.innerHTML = "";
        divRow.setAttribute("arrayIndex", index);

        // Create the required DOM elements
        var moveHandle = document.createElement("span"),
            title = document.createElement("a"),
            timeStamp = document.createElement("a"),
            deleteButton = document.createElement("span"),
            editButton = document.createElement("span")

        // Add the required classes to the elements
        divRow.className = "d-item clearfix";
        moveHandle.className = "icon icon-menu cursor-grab";
        title.className = "title ellipsis item-title";
        timeStamp.className = "title text-right margin-right-thirty";

        deleteButton.className = "btn--icon icon icon-cross2";
        editButton.className = "btn--icon icon icon-pencil margin-left-thirty";
        title.innerHTML = item.title;
        timeStamp.innerHTML = Utils.numToHHMMSS(item.timeStamp);

        // Append elements to the DOM
        divRow.appendChild(moveHandle);

        divRow.appendChild(title);
        divRow.appendChild(timeStamp);
        divRow.appendChild(editButton);
        divRow.appendChild(deleteButton);



        title.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onItemClick(item, index, divRow);
            return false;
        };

        deleteButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            let t = this;
            this.onDeleteItem(item, index, confirmed => {
                if (confirmed) {
                    divRow.parentNode.removeChild(divRow);
                    t.reIndexRows();
                }
            });
            return false;
        };

        editButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onUpdateItem(item, index, divRow);
            return false;
        };
    }

    onOrderChange(item, oldIndex, newIndex) {
        ListItemsUI.uiElements.dropDownTxt.innerHTML = "Manually"
    }

    onToggleChange(item, isChecked, index, divRow) {

    }

    onUpdateItem(item, index, divRow) {
        CheckListDialog.init(item, index, divRow);
    }

    onItemClick(item, index, divRow) {
        CheckListDialog.init(item, index, divRow);
    }

    onDeleteItem(item, index, callback) {

        // update the list of items
        this.items.splice(index, 1);

        if (!this.items.length) ListItemsUI._updateEmptyState("empty");
        callback(item);


    }
}

class chaptersListUI extends SortableListUI {
    constructor(elementId) {
        super(elementId, { isDraggable: true });
    }

    // append new sortable item to the DOM
    _injectItemElements(item, index, divRow) {
        if (!item) throw "Missing Item";
        divRow.innerHTML = "";
        divRow.setAttribute("arrayIndex", index);

        // Create the required DOM elements
        var moveHandle = document.createElement("span"),
            title = document.createElement("span"),
            subTitle = document.createElement("span"),
            deleteButton = document.createElement("span"),
            editButton = document.createElement("span")

        // Add the required classes to the elements
        divRow.className = "d-item clearfix";
        moveHandle.className = "icon icon-menu cursor-grab";
        title.className = "text-primary flex-auto cursor-pointer";
        subTitle.className = "text-muted text-small";

        deleteButton.className = "btn--icon icon icon-cross2";
        editButton.className = "btn--icon icon icon-pencil margin-left-thirty";
        title.innerHTML = item.title;
        subTitle.innerHTML = "<br/>" + item.subTitle;

        // Append elements to the DOM
        title.appendChild(subTitle);
        divRow.appendChild(moveHandle);

        divRow.appendChild(title);
        divRow.appendChild(editButton);
        divRow.appendChild(deleteButton);



        title.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onItemClick(item, index, divRow);
            return false;
        };

        deleteButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            let t = this;
            this.onDeleteItem(item, index, confirmed => {
                if (confirmed) {
                    divRow.parentNode.removeChild(divRow);
                    t.reIndexRows();
                }
            });
            return false;
        };

        editButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onUpdateItem(item, index, divRow);
            return false;
        };
    }

    onOrderChange(item, oldIndex, newIndex) {
        listOfChapters.uiElements.dropDownTxt.innerHTML = "Manually"
    }

    onToggleChange(item, isChecked, index, divRow) {

    }

    onUpdateItem(item, index, divRow) {
        ChapterDetails.init(item, index, divRow);
    }

    onItemClick(item, index, divRow) {
        ChapterDetails.init(item, index, divRow);
    }

    onDeleteItem(item, index, callback) {

        // update the list of items
        this.items.splice(index, 1);

        if (!this.items.length) listOfChapters._updateEmptyState("empty");
        AssetsDetails._toggleSaveButton();
        callback(item);


    }
}

class pagesListUI extends SortableListUI {
    constructor(elementId) {
        super(elementId, { isDraggable: true });
    }

    // append new sortable item to the DOM
    _injectItemElements(item, index, divRow) {
        if (!item) throw "Missing Item";
        divRow.innerHTML = "";
        divRow.setAttribute("arrayIndex", index);

        // Create the required DOM elements
        var moveHandle = document.createElement("span"),
            title = document.createElement("span"),
            deleteButton = document.createElement("span"),
            editButton = document.createElement("span"),
            img = document.createElement("img");
        // Add the required classes to the elements
        divRow.className = "d-item clearfix";
        moveHandle.className = "icon icon-menu cursor-grab";
        title.className = "ellipsis item-title text-primary margin-left-ten flex-auto cursor-pointer";

        img.style.width = "60px";
        img.className = "border-radius-five  margin-left-ten";
        img.src = item.pageImage ?
            this._cropImage(item.pageImage, { width: 60, height: 33.5 }) :
            '../assets/images/noImage.png';

        deleteButton.className = "btn--icon icon icon-cross2";
        editButton.className = "btn--icon icon icon-pencil margin-left-thirty";

        // parsing the content html to plain text
        let content = item.pageContent;
        let contentText = content.replace(/<[^>]+>/g, '');
        title.innerHTML = contentText || "";

        // Append elements to the DOM
        divRow.appendChild(moveHandle);
        divRow.appendChild(img);

        divRow.appendChild(title);
        divRow.appendChild(editButton);
        divRow.appendChild(deleteButton);



        title.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onItemClick(item, index, divRow);
            return false;
        };

        deleteButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            let t = this;
            this.onDeleteItem(item, index, confirmed => {
                if (confirmed) {
                    divRow.parentNode.removeChild(divRow);
                    t.reIndexRows();
                }
            });
            return false;
        };

        editButton.onclick = () => {
            let index = divRow.getAttribute("arrayIndex"); /// it may have bee reordered so get value of current property
            index = parseInt(index);
            this.onUpdateItem(item, index, divRow);
            return false;
        };
    }

    _cropImage(url, options) {
        if (!url) {
            return "";
        }
        return buildfire.imageLib.cropImage(url, options);
    }

    onOrderChange(item, oldIndex, newIndex) {
        listOfPages.uiElements.dropDownTxt.innerHTML = "Manually"
    }

    onToggleChange(item, isChecked, index, divRow) {

    }

    onUpdateItem(item, index, divRow) {
        PageDetails.init(item, index, divRow);
    }

    onItemClick(item, index, divRow) {
        PageDetails.init(item, index, divRow);
    }

    onDeleteItem(item, index, callback) {

        // update the list of items
        this.items.splice(index, 1);

        if (!this.items.length) listOfPages._updateEmptyState("empty");
        ChapterDetails._toggleSaveButton();
        callback(item);

    }
}