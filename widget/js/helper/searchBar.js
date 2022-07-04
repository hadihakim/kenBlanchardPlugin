"use strict";

let mySearchingPeriod;
const { horizontal1_Skeleton, horizontal_Skeleton, verticalSeeAll_Skeleton } = skeleton();

function filterDrawer() {
	config.renderedCard = 0;
	config.page = 1;
	config.lastIndex = 0;
	buildfire.components.drawer.open(
		{
			content: Strings.FILTER_TITLE,
			multiSelection: true,
			allowSelectAll: true,
			multiSelectionActionButton: { text: Strings.APPLY_FILTER },
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
			if (result) {
				config.filterArr = [];
				result.forEach((topic) => {
					config.filterArr.push(topic.text);
				});

				//////////////////////////////////////////////////////
				fakeData.data.sections.forEach((element) => {
					const container = document.getElementById(`${element.id}-container-main`);
					if (element.layout == "horizontal-1") {
						horizontal1_Skeleton(container);
					}
					else {
						horizontal_Skeleton(container);
					}
					const myTimeout = setTimeout(() => { filterAndPrintData(fakeData, element, 'main') }, 1000);

				})

				fakeData.data.sections.forEach((element) => {
					if (element.isExplore) {
						const container = document.getElementById(`${element.id}-container-explore`);
						if (element.layout == "horizontal-1") {
							horizontal1_Skeleton(container);
						}
						else {
							horizontal_Skeleton(container);
						}
					}
					const myTimeout = setTimeout(() => { filterAndPrintData(fakeData, element, 'explore') }, 1000);

				})



				config.renderedCard = 0;
				if(!seeAllContainer.classList.contains("hidden")){
				if (config.searchFrom == "from-explore" || config.searchFrom == "from-main") {
					verticalSeeAll_Skeleton(seeAllContainer);
					const myTimeout = setTimeout(() => {
						searchCardsRender(fakeData, seeAllContainer, () => { })
					}, 1000);
			
				} else if (config.searchFrom == "from-see-all") {
					verticalSeeAll_Skeleton(seeAllContainer);
					const myTimeout = setTimeout(() => {
						seeAllCardsRender(
							fakeData,
							seeAllContainer,
							true,
							() => { }
						);
					}, 1000);
				}
			}

				trendingRender(fakeData, "trendingContainer");
				//////////////////////////////////////////////////////

			}
		}
	);
}

function sortDrawer() {
	config.renderedCard = 0;
	config.page = 1;
	config.lastIndex = 0;
	config.renderedCard = 0;
	buildfire.components.drawer.open(
		{
			content: Strings.SORT_TITLE,
			multiSelection: false,
			allowSelectAll: false,
			enableFilter: true,
			multiSelectionActionButton: { text: Strings.APPLY_SORT },
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
			if (result) {
				buildfire.components.drawer.closeDrawer();
				config.sortType = result.text;
				////////////////////////////////////////////////////////////////////////////////////
				fakeData.data.sections.forEach((element) => {
					const container = document.getElementById(`${element.id}-container-main`);
					if (element.layout == "horizontal-1") {
						horizontal1_Skeleton(container);
					}
					else {
						horizontal_Skeleton(container);
					}
					const myTimeout = setTimeout(() => { filterAndPrintData(fakeData, element, 'main') }, 1000);

				})

				fakeData.data.sections.forEach((element) => {
					if (element.isExplore) {
						const container = document.getElementById(`${element.id}-container-explore`);
						if (element.layout == "horizontal-1") {
							horizontal1_Skeleton(container);
						}
						else {
							horizontal_Skeleton(container);
						}
					}
					const myTimeout = setTimeout(() => { filterAndPrintData(fakeData, element, 'explore') }, 1000);

				})


				if(!seeAllContainer.classList.contains("hidden")){
				if (config.searchFrom == "from-explore" || config.searchFrom == "from-main") {
					verticalSeeAll_Skeleton(seeAllContainer);
					const myTimeout = setTimeout(() => {
						searchCardsRender(fakeData, seeAllContainer, () => { })
					}, 1000);
	
				} else if (config.searchFrom == "from-see-all") {
					verticalSeeAll_Skeleton(seeAllContainer);
					const myTimeout = setTimeout(() => {
						seeAllCardsRender(
							fakeData,
							seeAllContainer,
							true,
							() => { }
						);
					}, 1000);
				}
			}

				//////////////////////////////////////////////////////////////////////////

			}
		}
	);
}

function search() {
	config.renderedCard = 0;
	config.page = 1;
	config.lastIndex = 0;
	config.renderedCard = 0;
	clearTimeout(mySearchingPeriod);
	mySearchingPeriod = setTimeout(() => {
		config.search = input.value;
		//////////////////////////////////////////////////////////////////////////////////
		// fakeData.data.sections.forEach((element) => {
		// 	filterAndPrintData(fakeData, element, 'main');
		// })
		// fakeData.data.sections.forEach((element) => {
		// 	filterAndPrintData(fakeData, element, 'explore');
		// })

		if (config.searchFrom == "from-explore" || config.searchFrom == "from-main") {
			openSearch();
			verticalSeeAll_Skeleton(seeAllContainer);
				const myTimeout = setTimeout(() => {
					searchCardsRender(fakeData, seeAllContainer, () => { })
				}, 1000);
		
			
			
		} else if (config.searchFrom == "from-see-all") {
			verticalSeeAll_Skeleton(seeAllContainer);
			const myTimeout = setTimeout(() => {
				seeAllCardsRender(
					fakeData,
					seeAllContainer,
					true,
					() => { }
				);
			}, 1000);
		}
	}, 300);
	/////////////////////////////////////////////////////////////////////
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);

let input = document.getElementById("search-input");
input.addEventListener("keyup", search);
