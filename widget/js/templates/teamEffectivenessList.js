
class TeamEffectivenessList {
    static state = {
        data: [
            {
                title: "Another article",
                description: "sfdfsdfsdf sdf sdf",
                image: "https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88",
                totaltasks: 15,
                taken: 10,
                id: "62b3439f864d49037aac9b27"
            },
            {
                title: "Article with keytakeaways",
                description: "short description for this asset with key takeaways bblasdsa dasd sad",
                image: "https://images.theconversation.com/files/137600/original/image-20160913-4948-6fyxz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop",
                totaltasks: 15,
                taken: 7,
                id: "62b3439f864d49037aac9b26"
            },
            {
                title: "Article two",
                description: "short description for this asset bblasdsa dasd sad",
                image: "https://www.thespruce.com/thmb/tClzdZVdo_baMV7YA_9HjggPk9k=/4169x2778/filters:fill(auto,1)/the-difference-between-trees-and-shrubs-3269804-hero-a4000090f0714f59a8ec6201ad250d90.jpg",
                totaltasks: 15,
                taken: 2,
                id: "62b3439f864d49037aac9b25"
            },
            {
                title: "Rose",
                description: "short description for this asset bblasdsa dasd sad",
                image: "https://th.bing.com/th/id/R.6e02493f35178458c092d5546a72ca06?rik=rDt%2bq%2bNkpy4RkA&pid=ImgRaw&r=0",
                totaltasks: 15,
                taken: 13,
                id: "62b3439f864d49037aac9b60"
            }
        ],
        archivedData: [
            {
                title: "Another article",
                description: "sfdfsdfsdf sdf sdf",
                image: "https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88",
                totaltasks: 15,
                taken: 10,
                id: "62b3439f864d49037aac9b27"
            },
            {
                title: "Article with keytakeaways",
                description: "short description for this asset with key takeaways bblasdsa dasd sad",
                image: "https://images.theconversation.com/files/137600/original/image-20160913-4948-6fyxz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop",
                totaltasks: 15,
                taken: 7,
                id: "62b3439f864d49037aac9b26"
            },
            {
                title: "Article two",
                description: "short description for this asset bblasdsa dasd sad",
                image: "https://www.thespruce.com/thmb/tClzdZVdo_baMV7YA_9HjggPk9k=/4169x2778/filters:fill(auto,1)/the-difference-between-trees-and-shrubs-3269804-hero-a4000090f0714f59a8ec6201ad250d90.jpg",
                totaltasks: 15,
                taken: 2,
                id: "62b3439f864d49037aac9b25"
            },
            {
                title: "Rose",
                description: "short description for this asset bblasdsa dasd sad",
                image: "https://th.bing.com/th/id/R.6e02493f35178458c092d5546a72ca06?rik=rDt%2bq%2bNkpy4RkA&pid=ImgRaw&r=0",
                totaltasks: 15,
                taken: 13,
                id: "62b3439f864d49037aac9b60"
            }
        ],
        ArchivedDrawerOptions: ["Move to Active", "Remove Course"],
        ActiveDrawerOptions: ["Archive Course", "Reset Course", "Remove Course"],
        tabs: ['active', 'archived'],
        selectedNav: 'tab-0'
    }
    static pointers = {
        teamEffectiveness_PageContainer: "teamEffectiveness_PageContainer",
        teamEffectiveness_tabHandler: "teamEffectiveness_tabHandler",
        teamEffectiveness_Template: "teamEffectiveness_Template",
        teamEffectiveness_ListContainer: "teamEffectiveness_ListContainer",
        teamEffectivenessArchived_ListContainer: "teamEffectivenessArchived_ListContainer",
    }

    static setStates = (options) => {
        this.state = options;
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
                    console.log(result);
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
                document.getElementById(this.state.selectedNav)?.classList.remove("selectedNav");
                this.state.selectedNav = `tab-${index}`;
                button.classList.add("selectedNav");
                if (tab == 'active') {
                    document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).classList.add("hidden");
                    document.getElementById(this.pointers.teamEffectiveness_ListContainer).classList.remove("hidden");
                } else if (tab == 'archived') {
                    document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).classList.remove("hidden");
                    document.getElementById(this.pointers.teamEffectiveness_ListContainer).classList.add("hidden");
                }
            })
            document.getElementById(this.pointers.teamEffectiveness_tabHandler).appendChild(button);
        });
    }

    static loadActiveList = () => {
        this.state.data.forEach(activeCard => {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let titleCard = nodesClone.querySelectorAll(".title");
            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = nodesClone.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            let percentFilled = (activeCard.taken / activeCard.totaltasks) * 100;
            imageContainer.setAttribute('style', `background-image: url('${activeCard.image}')`);
            filledData.setAttribute('style', `width: ${percentFilled}%`);
            titleContainer.innerHTML = activeCard.title;

            document.getElementById(this.pointers.teamEffectiveness_ListContainer).appendChild(nodesClone);

            imageContainer.addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(activeCard.id, "assets_info")
                CourseDetails.init(activeCard.id);
                Navigation.openCourseDetails(activeCard.id)
            })
            titleCard[0].addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(activeCard.id, "assets_info")
                CourseDetails.init(activeCard.id);
                Navigation.openCourseDetails(activeCard.id)
            })
            actionBtn.addEventListener('click', () => {
                this.openDrawer(activeCard.id, this.state.ActiveDrawerOptions);
            })
        })
    }

    static loadArchivedList = () => {
        this.state.archivedData.forEach(archivedCard => {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = nodesClone.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");

            let percentFilled = (archivedCard.taken / archivedCard.totaltasks) * 100;
            imageContainer.setAttribute('style', `background-image: url('${archivedCard.image}')`);
            filledData.setAttribute('style', `width: ${percentFilled}%`);
            titleContainer.innerHTML = archivedCard.title;

            document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).appendChild(nodesClone);

            actionBtn.addEventListener('click', () => {
                this.openDrawer(archivedCard.id, this.state.ArchivedDrawerOptions);
            })
        })
    }

    static init = () => {
        document.getElementById(this.pointers.teamEffectiveness_ListContainer).innerHTML = '';
        document.getElementById(this.pointers.teamEffectivenessArchived_ListContainer).innerHTML = '';

        // we will use the id to get the data from the api -->
        // calling the function
        // after getting the data we will set it to the state to use it in the loading list function
        this.loadTabs();
        this.loadActiveList();
        this.loadArchivedList();

        Utilities.setAppTheme();
    }
}