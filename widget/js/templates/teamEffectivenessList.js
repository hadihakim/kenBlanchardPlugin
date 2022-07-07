
class TeamEffectivenessList {
    static state = {
        data: [
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 10
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 7
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 2
            },
            {
                image: 'https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88',
                title: 'Becoming a Mentor',
                totaltasks: 15,
                taken: 13
            }
        ],
        tabs: ['active', 'archived']
    }
    static pointers = {
        teamEffectiveness_PageContainer: "teamEffectiveness_PageContainer",
        teamEffectiveness_tabHandler: "teamEffectiveness_tabHandler",
        teamEffectiveness_ListContainer: "teamEffectiveness_ListContainer",
        teamEffectiveness_Template: "teamEffectiveness_Template",
    }

    static setStates = (options) => {
        this.state = options;
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
            document.getElementById(this.pointers.teamEffectiveness_tabHandler).appendChild(button);
        });
    }

    static loadList = () => {
        this.state.data.forEach(activeCard => {
            const nodesClone = document.getElementById(this.pointers.teamEffectiveness_Template).content.cloneNode(true);

            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let filledData = nodesClone.querySelector("#filled");
            let actionBtn = nodesClone.querySelector("#action");


            let percentFilled = (activeCard.taken / activeCard.totaltasks) * 100;
            imageContainer.setAttribute('style', `background-image: url('${activeCard.image}')`);
            filledData.setAttribute('style', `width: ${percentFilled}%`);
            titleContainer.innerHTML = activeCard.title;

            document.getElementById(this.pointers.teamEffectiveness_ListContainer).appendChild(nodesClone);

        })
    }

    static init = (id) => {
        document.getElementById(this.pointers.teamEffectiveness_ListContainer).innerHTML = '';

        // we will use the id to get the data from the api -->
        // calling the function
        // after getting the data we will set it to the state to use it in the loading list function
        this.loadTabs();
        this.loadList();
    }
}