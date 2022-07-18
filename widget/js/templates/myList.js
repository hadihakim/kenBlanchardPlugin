
class MyList {

    static listState = {
        progressChart: null,
        barChart: null,
        includeArchived: false,
        type: 'course',
        title: "My List",
        data: [],
        page: 1,
        pageSize: 7,
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
        userProfileTemplate: 'userProfileTemplate'
    }

    static setData = (options) => {
        this.listState = { ...this.listState, ...options };
    }

    static loadCharts = () => {
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

    static loadList = () => {
        let listContainer = document.getElementById(this.pointers.listContainer);

        // this.listState.data.assets.forEach(async asset => {
        //     let assetData = await HandleAPI.getDataByID(asset, 'assets_info');
        //     assetData.data.meta.topics.forEach(async topic => {
        //         let topicData = await HandleAPI.getDataByID(topic, 'topic');
        //         console.log('topic data ->', topicData);
        //     })
        // })

        let firstIndex = (this.listState.page - 1) * this.listState.pageSize;
        let lastIndex = this.listState.page * this.listState.pageSize;
        this.listState.page += 1;

        if (lastIndex > this.listState.data.length)
            lastIndex = this.listState.data.length;

        for (let i = firstIndex; i < lastIndex; i++) {

            if ((this.listState.data[i].archived && this.listState.includeArchived) || !this.listState.data[i].archived) {
                const myCard = document.getElementById(this.pointers.template);
                const nodesClone = myCard.content.cloneNode(true);

                let imageContainer = nodesClone.querySelector("#image");
                let titleContainer = nodesClone.querySelector("#title_text");
                let subTitleContainer = nodesClone.querySelector("#subTitle_text");
                let actionBtn = nodesClone.querySelectorAll(".myCard");

                imageContainer.setAttribute('style', `background-image: url('${this.listState.data[i].image}')`);
                titleContainer.innerHTML = this.listState.data[i].title;
                subTitleContainer.innerHTML = this.listState.data[i].subTitle;

                listContainer.appendChild(nodesClone);

                actionBtn[0].addEventListener('click', () => {
                    let _options = {
                        title: this.listState.data[i].title,
                        id: this.listState.data[i].id,
                        activeData:activeTeamList,
                        archiveData:archiveTeamList
                    }
                    Navigation.openTeamEffectivenessList(_options);
                })
            } else {
                lastIndex += 1;
                if (lastIndex > this.listState.data.length)
                    lastIndex = this.listState.data.length;
            }
        }
        this.listState.fetchNext = true;
        Utilities.setAppTheme();
    }

    static lazyLoad = (e) => {
        if (((e.target.scrollTop + e.target.offsetHeight) / e.target.scrollHeight > 0.80) && this.listState.fetchNext) {
            this.listState.fetchNext = false;
            this.loadList();
        }
    }

    static destroy = () => {
        if (this.listState.barChart)
            this.listState.barChart.destroy();
        if (this.listState.progressChart)
            this.listState.progressChart.destroy();

        this.listState.page = 1;
        this.listState.pageSize = 7;
        this.listState.fetchNext = false;
    }

    static initArchived = (e) => {
        this.listState.includeArchived = e.target.checked;
        this.listState.page = 1;

        document.getElementById(this.pointers.listContainer).innerHTML = "";
        this.loadList();

        Utilities.setAppTheme();
    }

    static init = () => {
        // should be organized

        this.destroy();

        document.getElementById(this.pointers.includeArchived).addEventListener('click', (e) => this.initArchived(e))

        let listContainer = document.getElementById(this.pointers.listContainer);
        listContainer.innerHTML = "";
        listContainer.addEventListener('scroll', (e) => this.lazyLoad(e))
        
        let userProfileContainer = document.getElementById(this.pointers.userProfileContainer);
        userProfileContainer.innerHTML = '';

        const myContainer = document.getElementById(this.pointers.userProfileTemplate);
        const nodesClone = myContainer.content.cloneNode(true);

        userProfileContainer.appendChild(nodesClone);

        if (this.listState.type == 'course')
            this.loadCharts();

        this.loadList();
    }
}