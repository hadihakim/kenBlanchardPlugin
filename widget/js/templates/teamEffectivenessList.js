
class TeamEffectivenessList {
    static state = {
        data: [],
        archivedData: [],
        ArchivedDrawerOptions: [Strings.ARCHIVED_DRAWER_OP1, Strings.ARCHIVED_DRAWER_OP2],
        ActiveDrawerOptions: [Strings.ACTIVE_DRAWER_OP1, Strings.ACTIVE_DRAWER_OP2, Strings.ACTIVE_DRAWER_OP3],
        tabs: ['active', 'archived'],
        selectedNav: 'tab-0',
        page: 1,
        pageSize: 7,
        fetchNext: false,
        scrollTime: 300,
    }

    static pointers = {
        teamEffectiveness_PageContainer: "teamEffectiveness_PageContainer",
        teamEffectiveness_tabHandler: "teamEffectiveness_tabHandler",
        teamEffectiveness_Template: "teamEffectiveness_Template",
        teamEffectiveness_ListContainer: "teamEffectiveness_ListContainer",
        teamEffectivenessArchived_ListContainer: "teamEffectivenessArchived_ListContainer",
    }

    static setStates = async(options) => {
        this.loadTabs();
        let activeContainer = document.getElementById(this.pointers.teamEffectiveness_ListContainer);
        let archiveContainer = document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer);

        Skeleton.verticalSeeAll_Skeleton(activeContainer);
        Skeleton.verticalSeeAll_Skeleton(archiveContainer);

        this.state = { ...this.state, ...options };

        let myTopic = HandleAPI.getDataByID(options.id, 'topic');
        await this.setUserAssetsToSpecificTopic(myTopic.id);
    }

    static setUserAssetsToSpecificTopic = async (topic) => {
        this.state.data = [];
        this.state.archivedData = [];
        for (const asset in UserProfile.state.data.assets) {
            let myAsset = await HandleAPI.getDataByID(asset, 'assets_info');
            myAsset = { ...myAsset.data, ...UserProfile.state.data.assets[asset] };
            let returnObj = {
                id: asset,
                title: myAsset.meta.title,
                imageUrl: Utilities.cropImage(myAsset.meta.image),
                percentage: this.setProgressCard_Bard(myAsset.progress),
            }
            if (myAsset?.meta?.topics?.includes(topic) && !myAsset?.isArchived && myAsset?.type === MyList?.listState?.type) {
                this.state.data.push(returnObj);
            }
            if (myAsset?.meta?.topics?.includes(topic) && myAsset?.isArchived && myAsset?.type === MyList?.listState?.type) {
                this.state.archivedData.push(returnObj);
            }
        }
    }

    static setProgressCard_Bard = (progress) => {
        let progressBar = document.createElement('div');
        progressBar.style.width = `${progress || 20}%`;
        progressBar.setAttribute('id', 'filled');
        progressBar.setAttribute('class', 'infoTheme');
        return progressBar;
    }

    static deleteItem = (id) => {
       delete UserProfile.state.data.assets[id];
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

        HandleAPI.deleteAsset(id);
    }

    static moveToArchive = (id) => {
        UserProfile.state.data.assets[id].isArchived=true;
        let newActiveData = this.state.data.filter(item => {
            if (item.id != id)
                return item
            else
                this.state.archivedData.push(item)
        })
        this.state.data = newActiveData;
        this.init();
        HandleAPI.setAssetArchiveStatus(id,true);
    }

    static moveToActive = (id) => {
        UserProfile.state.data.assets[id].isArchived=false;
        let newArchivedData = this.state.archivedData.filter(item => {
            if (item.id != id)
                return item
            else
                this.state.data.push(item)
        })
        this.state.archivedData = newArchivedData;
        this.init();
        HandleAPI.setAssetArchiveStatus(id,false);
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
                        case "Remove":
                            this.deleteItem(id);
                            break;
                        case "Archive":
                            this.moveToArchive(id);
                            break;
                        case "Reset":
                            this.resetItem(id);

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
                    if(cardOption===this.state.ArchivedDrawerOptions[0])
                    {
                        return { text: `${cardOption}`,type:cardOption}
                    }else{
                        return { text: `${cardOption} ${MyList.listState.type}`,type:cardOption}
                    }
                })
            },
            (err, result) => {
                if (err) return console.error(err);
                if (result) {
                    console.log("🚀 ~ file: teamEffectivenessList.js ~ line 182 ~ TeamEffectivenessList ~ result", result)
                    buildfire.components.drawer.closeDrawer();
                    this.confirmMessage(id, result.type.trim(" "), 'Are you sure you want to remove this course? This will permanently delete the course from your list!')
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
      
         //render empty stat if there are no active item available
        if(this.state.data.length<=0){
            Utilities.showEmpty(document.getElementById(this.pointers.teamEffectiveness_ListContainer),Strings.EMPTY_ACTIVE_LIST_HEADER,Strings.EMPTY_ACTIVE_LIST_BODY);
            return;
        }
          // activeCard
        for (let i = firstIndex; i < lastIndex; i++) {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let titleCard = nodesClone.querySelectorAll(".title");
            let bar = nodesClone.querySelector("#bar");
            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = bar.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            // filledData.innerHTML = this.state.data[i].percentage;

            imageContainer.setAttribute('style', `background-image: url('${this.state.data[i].imageUrl}')`);
            bar.appendChild(this.state.data[i].percentage);

            titleContainer.innerHTML = this.state.data[i].title;

            document.getElementById(this.pointers.teamEffectiveness_ListContainer).appendChild(nodesClone);

            imageContainer.addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(this.state.data[i].id, "assets_info")
                Navigation.openCourseDetails(this.state.data[i].title, "from active-card")
            })
            titleCard[0].addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(this.state.data[i].id, "assets_info")
                Navigation.openCourseDetails(this.state.data[i].title, "from active-card")
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
        //render empty stat if there are no archives item available
        if(this.state.archivedData.length<=0){
            Utilities.showEmpty(document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer),Strings.EMPTY_ARCHIVE_LIST_HEADER,Strings.EMPTY_ARCHIVE_LIST_BODY);
            return;
        }
        if (lastIndex > this.state.archivedData.length)
            lastIndex = this.state.archivedData.length;

        this.state.page += 1;
      
        for (let i = firstIndex; i < lastIndex; i++) {

            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let titleCard = nodesClone.querySelectorAll(".title");
            let bar = nodesClone.querySelector("#bar");
            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = bar.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            imageContainer.setAttribute('style', `background-image: url('${this.state.archivedData[i].imageUrl}')`);
            bar.appendChild(this.state.archivedData[i].percentage);

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
    static lazyLoadHandler = Utilities._debounce(e => {
        this.lazyLoad(e)
    }, this.state.scrollTime);
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