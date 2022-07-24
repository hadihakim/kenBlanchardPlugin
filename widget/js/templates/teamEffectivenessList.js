
class TeamEffectivenessList {
    static state = {
        data: [],
        archivedData: [],
        ArchivedDrawerOptions: ["Move to Active", "Remove Course"],
        ActiveDrawerOptions: ["Archive Course", "Reset Course", "Remove Course"],
        tabs: ['active', 'archived'],
        selectedNav: 'tab-0',
        page: 1,
        pageSize: 7,
        fetchNext: false,
        scrollTime:300,
    }

    static pointers = {
        teamEffectiveness_PageContainer: "teamEffectiveness_PageContainer",
        teamEffectiveness_tabHandler: "teamEffectiveness_tabHandler",
        teamEffectiveness_Template: "teamEffectiveness_Template",
        teamEffectiveness_ListContainer: "teamEffectiveness_ListContainer",
        teamEffectivenessArchived_ListContainer: "teamEffectivenessArchived_ListContainer",
    }

    static setStates = (options) => {
        // we will use the id to get the data from the api -->
        // calling the function
        // after getting the data we will set it to the state to use it in the loading list function
        this.state = {...this.state, ...options};
    }

    static deleteItem = (id) => {
        switch (this.state.selectedNav) {
            case 'tab-0':
                let newActiveState = this.state.data.filter(item => {
                    if (item.id != id)
                        return item
                })
                this.state.data = newActiveState;
                break;
            case 'tab-1':
                let newArchivedState = this.state.archivedData.filter(item => {
                    if (item.id != id)
                        return item
                })
                this.state.archivedData = newArchivedState;
                break;
            default:
                break;
        }
        this.init();
    }

    static moveToArchive = (id) => {
        let newActiveData = this.state.data.filter(item => {
            if (item.id != id)
                return item
            else
                this.state.archivedData.push(item)
        })
        this.state.data = newActiveData;
        this.init();
    }

    static moveToActive = (id) => {
        let newArchivedData = this.state.archivedData.filter(item => {
            if (item.id != id)
                return item
            else
                this.state.data.push(item)
        })
        this.state.archivedData = newArchivedData;
        this.init();
    }

    static resetItem = (id) => {
        let newActiveData = this.state.data.filter(item => {
            if (item.id === id) {
                item.taken = 0;
            }
            return item
        })
        this.state.data = newActiveData;
        this.init();
    }

    static confirmMessage = (id, title, message) => {
        buildfire.dialog.confirm(
            {
                title: title,
                message: message,
            },
            (err, isConfirmed) => {
                if (err) console.error(err);
                if (isConfirmed) {
                    switch (title) {
                        case "Move to Active":
                            this.moveToActive(id);
                            break;
                        case "Remove Course":
                            this.deleteItem(id);
                            break;
                        case "Archive Course":
                            this.moveToArchive(id);
                            break;
                        case "Reset Course":
                            this.resetItem(id);
                            break;
                        case "Remove Course":
                            this.deleteItem(id)
                            break;

                        default:
                            break;
                    }
                } else {
                    return false
                }
            }
        );
    }

    static openDrawer = (id, options) => {

        buildfire.components.drawer.open(
            {
                multiSelection: false,
                allowSelectAll: false,
                enableFilter: true,
                multiSelectionActionButton: { text: Strings.APPLY_SORT },
                isHTML: true,
                triggerCallbackOnUIDismiss: true,
                autoUseImageCdn: true,
                listItems: options.map((cardOption) => {
                    return { text: cardOption }
                })
            },
            (err, result) => {
                if (err) return console.error(err);
                if (result) {
                    buildfire.components.drawer.closeDrawer();
                    this.confirmMessage(id, result.text, 'Are you sure you want to remove this course? This will permanently delete the course from your list!')
                }
            });
    }

    static loadTabs = () => {
        document.getElementById(this.pointers.teamEffectiveness_tabHandler).innerHTML = '';
        this.state.tabs.forEach((tab, index) => {
            let button = document.createElement("button");
            button.classList.add("mdc-tab", "mdc-tab--active");
            button.setAttribute("role", "tab");
            button.setAttribute("aria-selected", "true");
            button.setAttribute("tabindex", index);
            let tabButtonContent = `
                              <span class="mdc-tab__content">
                                <span class="mdc-tab__text-label">${tab}</span>
                              </span>
                              <span class="mdc-tab-indicator">
                                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                              </span>
                              <span class="mdc-tab__ripple"></span>
                            `;
            button.innerHTML = tabButtonContent;
            button.setAttribute('id', `tab-${index}`)
            if (`tab-${index}` == this.state.selectedNav) {
                button.classList.add("selectedNav");
            }

            button.addEventListener('click', () => {
                let activeContainer = document.getElementById(this.pointers.teamEffectiveness_ListContainer);
                let archiveContainer = document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer);
                activeContainer.innerHTML = '';
                archiveContainer.innerHTML = '';

                this.state.page = 1;
                document.getElementById(this.state.selectedNav)?.classList.remove("selectedNav");
                this.state.selectedNav = `tab-${index}`;
                button.classList.add("selectedNav");
                if (tab == 'active') {
                    document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).classList.add("hidden");
                    document.getElementById(this.pointers.teamEffectiveness_ListContainer).classList.remove("hidden");
                    this.loadActiveList();
                } else if (tab == 'archived') {
                    document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).classList.remove("hidden");
                    document.getElementById(this.pointers.teamEffectiveness_ListContainer).classList.add("hidden");
                    this.loadArchivedList();
                }
            })
            document.getElementById(this.pointers.teamEffectiveness_tabHandler).appendChild(button);
        });
    }

    static loadActiveList = () => {

        let firstIndex = (this.state.page - 1) * this.state.pageSize;
        let lastIndex = this.state.page * this.state.pageSize;

        if (lastIndex > this.state.data.length)
            lastIndex = this.state.data.length;

        this.state.page += 1;

        // activeCard
        for (let i = firstIndex; i < lastIndex; i++) {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let titleCard = nodesClone.querySelectorAll(".title");
            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = nodesClone.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            let percentFilled = (this.state.data[i].taken / this.state.data[i].totaltasks) * 100;
            imageContainer.setAttribute('style', `background-image: url('${this.state.data[i].image}')`);
            filledData.setAttribute('style', `width: ${percentFilled}%`);
            titleContainer.innerHTML = this.state.data[i].title;

            document.getElementById(this.pointers.teamEffectiveness_ListContainer).appendChild(nodesClone);

            imageContainer.addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(this.state.data[i].id, "assets_info")
                Navigation.openCourseDetails(this.state.data[i].id,this.state.data[i].title, "from active-card")
            })
            titleCard[0].addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(this.state.data[i].id, "assets_info")
                Navigation.openCourseDetails(this.state.data[i].id, this.state.data[i].title, "from active-card")
            })
            actionBtn.addEventListener('click', () => {
                this.openDrawer(this.state.data[i].id, this.state.ActiveDrawerOptions);
            })
        }
        this.state.fetchNext = true;
        Utilities.setAppTheme();

    }

    static loadArchivedList = () => {

        let firstIndex = (this.state.page - 1) * this.state.pageSize;
        let lastIndex = this.state.page * this.state.pageSize;

        if (lastIndex > this.state.archivedData.length)
            lastIndex = this.state.archivedData.length;

        this.state.page += 1;

        for (let i = firstIndex; i < lastIndex; i++) {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = nodesClone.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            let percentFilled = (this.state.archivedData[i].taken / this.state.archivedData[i].totaltasks) * 100;
            imageContainer.setAttribute('style', `background-image: url('${this.state.archivedData[i].image}')`);
            filledData.setAttribute('style', `width: ${percentFilled}%`);
            titleContainer.innerHTML = this.state.archivedData[i].title;

            document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).appendChild(nodesClone);

            actionBtn.addEventListener('click', () => {
                this.openDrawer(this.state.archivedData[i].id, this.state.ArchivedDrawerOptions);
            })
        }
        this.state.fetchNext = true;
        Utilities.setAppTheme();

    }

    static lazyLoad = (e) => {
        if (((e.target.scrollTop + e.target.offsetHeight) / e.target.scrollHeight > 0.80) && this.state.fetchNext) {
            this.state.fetchNext = false;
            switch (this.state.selectedNav) {
                case 'tab-0':
                    this.loadActiveList();
                    break;
                case 'tab-1':
                    this.loadArchivedList();
                    break;
                default:
                    break;
            }
        }
    }
    static lazyLoadHandler=Utilities._debounce(e=>{
        this.lazyLoad(e)
      },this.state.scrollTime);
    static init = () => {
        let activeContainer = document.getElementById(this.pointers.teamEffectiveness_ListContainer);
        let archiveContainer = document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer);

        activeContainer.innerHTML = '';
        archiveContainer.innerHTML = '';
        this.state.page = 1;

        activeContainer.addEventListener('scroll', (e) => this.lazyLoadHandler(e));
        archiveContainer.addEventListener('scroll', (e) => this.lazyLoadHandler(e));
        
        this.loadTabs();

        switch (this.state.selectedNav) {
            case 'tab-0':
                this.loadActiveList();
                break;
            case 'tab-1':
                this.loadArchivedList();
                break;
            default:
                break;
        }

        Utilities.setAppTheme();
    }
}