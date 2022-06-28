"use strict";

let mySearchingPeriod;

function filterDrawer() {
	buildfire.components.drawer.open(
		{
			content: "Topics",
			multiSelection: true,
			allowSelectAll: true,
			multiSelectionActionButton: { text: "Apply" },
			enableFilter: true,
			isHTML: true,
			triggerCallbackOnUIDismiss: false,
			autoUseImageCdn: true,
			listItems: config.filterTopics.map((topic) => {
				return { text: topic, selected: config.filterArr.includes(topic) };
			}),
		},
		(err, result) => {
			if (err) return console.error(err);
			config.filterArr = [];
			result.forEach((topic) => {
				config.filterArr.push(topic.text);
			});

			fakeData.data.sections.forEach((element) => {
				filterAndPrintData(fakeData, element, 'main');
			})

			fakeData.data.sections.forEach((element) => {
				filterAndPrintData(fakeData, element, 'explore');
			})

			config.renderedCard = 0;
			if(!seeAllContainer.classList.contains("hidden")){
				seeAllCardsRender(
					fakeData,
					document.getElementById("seeAllContainer"),
					true,
					() => { }
				);
			}

			trendingRender(fakeData, "trendingContainer");
		}
	);
}

function sortDrawer() {
	buildfire.components.drawer.open(
		{
			content: "Sorting",
			multiSelection: false,
			allowSelectAll: false,
			enableFilter: true,
			multiSelectionActionButton: { text: "Apply" },
			isHTML: true,
			triggerCallbackOnUIDismiss: true,
			autoUseImageCdn: true,
			listItems: [
				{ text: "Default", selected: true },
				{ text: "Most Popular", selected: false },
				{ text: "Most Recent", selected: false },
			],
		},
		(err, result) => {
			if (err) return console.error(err);
			buildfire.components.drawer.closeDrawer();
			config.sortType = result.text;


			fakeData.data.sections.forEach((element) => {
				filterAndPrintData(fakeData, element, 'main');
			})

			fakeData.data.sections.forEach((element) => {
				filterAndPrintData(fakeData, element, 'explore');
			})

			config.renderedCard = 0;
			if(!seeAllContainer.classList.contains("hidden")){
				seeAllCardsRender(
					fakeData,
					document.getElementById("seeAllContainer"),
					true,
					() => { }
				);
			}
		}
	);
}

function search() {
	clearTimeout(mySearchingPeriod);
	mySearchingPeriod = setTimeout(() => {
		config.search = input.value;


		fakeData.data.sections.forEach((element) => {
			filterAndPrintData(fakeData, element, 'main');
		})

		fakeData.data.sections.forEach((element) => {
			filterAndPrintData(fakeData, element, 'explore');
		})

		config.renderedCard = 0;
		if(!seeAllContainer.classList.contains("hidden")){
			seeAllCardsRender(
				fakeData,
				document.getElementById("seeAllContainer"),
				true,
				() => { }
			);
		}
	}, 300);
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);

let input = document.getElementById("search-input");
input.addEventListener("keyup", search);
