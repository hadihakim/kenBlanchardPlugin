
class MyList {

    static listState = {
        progressChart: null,
        barChart: null,
        includeArchived: false,
        type: 'course',
        title: "My List",
        data: [],
        page: 1,
        pageSize: 12,
        fetchNext: false,
    }

    static pointers = {
        pagePointer: 'myList_PageContainer',
        includeArchived: 'includeAchived-option',
        listContainer: 'listViewContainer',
        barChart: 'myChart',
        averageProgress: 'myAverageProgress',
        percentageContainer: 'percentageContainer',
        template: 'myList_Template',
        averageLable: 'averageLable',
        userProfileContainer: 'userProfile',
        userProfileTemplate: 'userProfileTemplate',
        chartDiv: 'myListChartContainer'
    }
    // set state data to run the list and charts 
    static setData = async (options) => {
        document.getElementById(this.pointers.chartDiv).classList.add('hidden');
        document.getElementById(this.pointers.listContainer).style.height = '100vh';
        Skeleton.verticalSeeAll_Skeleton(listViewContainer);

        await HandleAPI.getUserTopicsInfo(options.type).then(myTopics => {
            options.data = this.handleTakenNumber(options.data, myTopics, options.type);
        })

        this.listState = { ...this.listState, ...options };
    }
    // manage topic objects to be ready to print out in the list 
    // allTopics is the all topics that will be printed in the list 
    // myTopics is the all user topics to calculate the number of taken topics
    static handleTakenNumber = (allTopics, myTopics, type) => {
        let myTopicsToRender = [];
        for (const topic in allTopics) {
            let returnedTopic = {
                id: allTopics[topic].id,
                title: allTopics[topic].title,
                imageUrl: Utilities.cropImage(allTopics[topic].image),
                subtitle: '',
                action: {
                    icon: 'material-icons icon',
                    iconTextContent: 'chevron_right'
                }
            }
            let topicNumber = myTopics.find((topicNumberObj) => topicNumberObj._id === topic);
            let userTakenOn = this.calculateTaken(topicNumber._id, type);
            returnedTopic.description = `${userTakenOn} Taken On  <span class="material-icons dotIcon">fiber_manual_record</span>  ${topicNumber?.count || 0} In Total`;
            myTopicsToRender.push(returnedTopic);
        }
        return myTopicsToRender;
    }
    // calculate the total number of assets that user had taken per each topic 
    static calculateTaken = (id, type) => {
        let userTakenOn = 0;
        for (const asset in UserProfile.state.data.assets) {
            if (HandleAPI?.state?.assets_info[asset]?.type === type && HandleAPI?.state.assets_info[asset]?.meta?.topics?.includes(id))
                userTakenOn += 1;
        }
        return userTakenOn;
    }
    // function to delete charts 
    static destroy = () => {
        if (this.listState.barChart)
            this.listState.barChart.destroy();
        if (this.listState.progressChart)
            this.listState.progressChart.destroy();

        this.listState.page = 1;
        this.listState.pageSize = 12;
        this.listState.fetchNext = false;
    }
    // run all charts in the course list 
    static loadCharts = () => {
        this.destroy();
        // Bar chart
        var xValues = [["Just", "Started"], ["In", "Progress"], "Completed"];
        var yValues = [5, 11, 3];
        var barColors = ["#E4572E", "#57CC99", "#FFBA08"];

        this.listState.barChart = new Chart(this.pointers.barChart, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues,
                    borderWidth: 0,
                    radius: 4,
                    barThickness: 40,
                }]
            },
            options: {
                borderRadius: 4,
                plugins: {
                    legend: {
                        display: false,
                    },

                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 10,
                            }
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 10,
                            }
                        }
                    },

                }
            }
        });

        // Progress Chart
        let percent = 71;
        const data = {
            labels: ["Average Progress", ""],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [percent / 100, 1 - percent / 100],
                    backgroundColor: [Utilities.state.appTheme.colors.primaryTheme, "#0000"],
                    borderWidth: 4
                }
            ]
        };

        this.listState.progressChart = new Chart(this.pointers.averageProgress, {
            type: 'doughnut',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        document.getElementById(this.pointers.percentageContainer).innerHTML = `${percent}%`;
        document.getElementById(this.pointers.averageLable).innerHTML = Strings.USER_PROFILE_AVERAGE_CHART_TEXT;
    }
    // print the list of all topics by using BuildFire list
    static loadList = () => {
        const listView = new buildfire.components.listView(this.pointers.listContainer);

        // load list
        let cardsToPrint = this.cardsToPrint();

        listView.loadListViewItems(cardsToPrint);

        // event on click
        listView.onItemClicked = item => {
            let _options = {
                title: item.title,
                id: item.id,
                activeData: activeTeamList,
                archiveData: archiveTeamList
            }
            Navigation.openTeamEffectivenessList(_options);
        };

        // on add button clicked
        listView.onAddButtonClicked = () => {
            console.log('button clicked');
        };
        // on action button clicked
        listView.onItemActionClicked = item => {
            let _options = {
                title: item.title,
                id: item.id,
            }
            Navigation.openTeamEffectivenessList(_options);
        };
    }
    // set the active cards in the list
    static cardsToPrint = () => {
        let firstIndex = (this.listState.page - 1) * this.listState.pageSize;
        let lastIndex = this.listState.page * this.listState.pageSize;
        if (lastIndex > this.listState.data.length)
            lastIndex = this.listState.data.length;
        this.listState.page += 1;

        let newCards = [];
        for (let i = firstIndex; i < lastIndex; i++) {
            newCards.push(this.listState.data[i]);
        }

        return newCards;
    }
    // add new cards to the bottom of the page when the user  scroll down
    static lazyLoad = (e) => {
        if (((e.target.scrollTop + e.target.offsetHeight) / e.target.scrollHeight > 0.80) && this.listState.fetchNext) {
            this.listState.fetchNext = false;
            this.loadList();
        }
    }
    // function to manage view and hide archived items in the list 
    static initArchived = (e) => {
        this.listState.includeArchived = e.target.checked;

        this.initList();

        Utilities.setAppTheme();
    }
    // set page, pageSize, to be ready to print the list
    static initList = () => {
        this.listState.page = 1;
        this.listState.pageSize = 12;

        let listContainer = document.getElementById(this.pointers.listContainer);
        listContainer.innerHTML = "";
        listContainer.addEventListener('scroll', (e) => this.lazyLoad(e));

        if (this.listState.type == 'course') {
            document.getElementById(this.pointers.chartDiv).classList.remove('hidden');
            document.getElementById(this.pointers.listContainer).style.height = '70vh';
            this.loadCharts();
        }
        else {
            document.getElementById(this.pointers.chartDiv).classList.add('hidden');
            document.getElementById(this.pointers.listContainer).style.height = '100vh';
        }

        this.loadList();
    }
    static init = () => {
        document.getElementById(this.pointers.includeArchived).addEventListener('click', (e) => this.initArchived(e))

        let userProfileContainer = document.getElementById(this.pointers.userProfileContainer);
        userProfileContainer.innerHTML = '';

        const myContainer = document.getElementById(this.pointers.userProfileTemplate);
        const nodesClone = myContainer.content.cloneNode(true);

        userProfileContainer.appendChild(nodesClone);

        this.initList();
    }
}