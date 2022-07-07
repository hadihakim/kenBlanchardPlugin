
class TeamEffectivenessList {
    static state = {
        data: [
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 10,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 7,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 2,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 13,
                id: "62b3439f864d49037aac9b27"
            }
        ],
        archivedData: [
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 10,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 7,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 2,
                id: "62b3439f864d49037aac9b27"
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 13,
                id: "62b3439f864d49037aac9b27"
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

    static confirmMessage = (title, message) => {
        buildfire.dialog.confirm(
            {
                title: title,
                message: message,
            },
            (err, isConfirmed) => {
                if (err) console.error(err);
                    console.log(err);
                if (isConfirmed) {
                    return true
                } else {
                    return false
                }
            }
        );
    }

    static openDrawer = (page) => {
        let options = [];
        if (page == this.state.tabs[0]) {
            options = this.state.ActiveDrawerOptions;
        } else if (page == this.state.tabs[1]) {
            options = this.state.ArchivedDrawerOptions;
        }
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
                    let confirmed = this.confirmMessage(result.text, 'Are you sure you want to remove this course? This will permanently delete the course from your list!')
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
                CourseDetails.init(courseData);
                Navigation.openCourseDetails(activeCard.id)
            })
            titleCard[0].addEventListener('click', () => {
                let courseData = HandleAPI.getDataByID(activeCard.id, "assets_info")
                CourseDetails.init(courseData);
                Navigation.openCourseDetails(activeCard.id)
            })
            actionBtn.addEventListener('click', () => {
                this.openDrawer(this.state.tabs[0]);
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
                this.openDrawer(this.state.tabs[1]);
            })
        })
    }

    static init = (id) => {
        document.getElementById(this.pointers.teamEffectiveness_ListContainer).innerHTML = '';

        // we will use the id to get the data from the api -->
        // calling the function
        // after getting the data we will set it to the state to use it in the loading list function
        this.loadTabs();
        this.loadActiveList();
        this.loadArchivedList();
    }
}