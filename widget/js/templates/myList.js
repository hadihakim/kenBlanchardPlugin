
class MyList {

    static listState = {
        title: "My List",
        data: [{
            title: "Another article",
            subTitle: '3 Taken On  •  15 In Total',
            description: "sfdfsdfsdf sdf sdf",
            image: "https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88",
            topics: ["00236b7b-15a3-4e5f-a5ab-fc014ed652b3"],
            duration: 0,
            createdOn: "2022-06-22T16:30:22.260Z"
        },
        {
            title: "Another article",
            subTitle: '3 Taken On  •  15 In Total',
            description: "sfdfsdfsdf sdf sdf",
            image: "https://images.unsplash.com/photo-1551818176-60579e574b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDA1fDB8MXxzZWFyY2h8MjN8fHdpZGV8ZW58MHx8fHwxNjU0Nzg0Njg3&ixlib=rb-1.2.1&q=80&w=1080&func=bound&width=88",
            topics: ["00236b7b-15a3-4e5f-a5ab-fc014ed652b3"],
            duration: 0,
            createdOn: "2022-06-22T16:30:22.260Z"
        }],
    }
    static pointers = {
        pagePointer: 'myList_PageContainer',
        listContainer: 'listViewContainer',
        barChart: 'myChart',
        averageProgress: 'myAverageProgress',
        percentageContainer: 'percentageContainer',
        template: 'myList_Template',
        averageLable:'averageLable'
    }

    static loadData = (options) => {
        this.listState = options;
    }

    static loadCharts = () => {
        // Bar chart
        var xValues = ["Italy", "France", "Spain"];
        var yValues = [5, 11, 3, 0];
        var barColors = ["#E4572E", "#57CC99", "#FFBA08"];

        new Chart(this.pointers.barChart, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues,
                    borderWidth: 0,
                    borderRadius: 4,
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: false,
                    text: "World Wine Production 2018"
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
                    backgroundColor: ["#0297A0", "#0000"],
                }
            ]
        };

        new Chart(this.pointers.averageProgress, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                legend: { display: false },
                title: {
                    display: false,
                    text: 'Average Progress'
                }
            },
        });

        document.getElementById(this.pointers.percentageContainer).innerHTML = `${percent}%`;
        document.getElementById(this.pointers.averageLable).innerHTML = 'Average Progress';
    }

    static loadList = () => {
        let listContainer = document.getElementById(this.pointers.listContainer);

        this.listState.data.forEach(card => {
            const myCard = document.getElementById(this.pointers.template);
            const nodesClone = myCard.content.cloneNode(true);

            let imageContainer = nodesClone.querySelector("#image");
            let titleContainer = nodesClone.querySelector("#title_text");
            let subTitleContainer = nodesClone.querySelector("#subTitle_text");
            let actionBtn = nodesClone.querySelector("#action");

            imageContainer.setAttribute( 'style', `background-image: url('${card.image}')` );
            titleContainer.innerHTML = card.title;
            subTitleContainer.innerHTML = card.subTitle;

            listContainer.appendChild(nodesClone);
        })

    }

    static init = () => {

    }
}