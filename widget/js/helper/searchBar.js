'use strict';


const scrollTop = () => {
	mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

let filterTopics = ['Coaching', 'Conflict','Customer Service','Change & Innovation',
'Diversity, Equity & Inclusion ', 'Change & Innovation', 'Leading People', 'Performance Management',
'Personal Effectiveness', 'Team Effectiveness', 'Working with Others','Trust' ]

function filterDrawer() {
	buildfire.components.drawer.open(
		{
			content: 'Topics',
			multiSelection: true,
			allowSelectAll: true,
			multiSelectionActionButton: { text: 'Apply' },
			enableFilter: true,
			isHTML: true,
			triggerCallbackOnUIDismiss: false,
			autoUseImageCdn: true,
			listItems: filterTopics.map(topic=>{
				return{text:topic, selected: config.filterArr.includes(topic)}
			})
		},
		(err, result) => {
			if (err) return console.error(err);
			config.filterArr = [];
			result.forEach(topic=>{
				config.filterArr.push(topic.text)
			})

			config.sectionConfig.forEach((el) => {
				filterAndPrintData(fakeData, document.getElementById(`${el.containerId}`), el.duration, el.title)
			})

			config.exploreConfig.forEach((element) => {
				filterAndPrintData(fakeData, document.getElementById(`${element.containerId}`), element.duration, element.title)
			})

			trendingRender(fakeData, "trendingContainer");
		}
	);
}

function sortDrawer() {
	buildfire.components.drawer.open(
		{
			content: 'Sorting',
			multiSelection: true,
			allowSelectAll: true,
			enableFilter: true,
			multiSelectionActionButton: { text: 'Apply' },
			isHTML: true,
			triggerCallbackOnUIDismiss: false,
			autoUseImageCdn: true,
			listItems: [
				{ text: 'Default', selected: false },
				{ text: 'Most Popular', selected: false },
				{ text: 'Most Recent', selected: false }
			]
		},
		(err, result) => {
			if (err) return console.error(err);
			console.log("Selected Contacts", result);
		}

	);
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);


