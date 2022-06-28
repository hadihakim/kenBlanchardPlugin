"use strict";

const {
	getAppTheme,
	setAppTheme,
	initBack,
	scrollNextPage,
	hasSearch,
	setFilteredTopic,
	scrollTop
} = utilities();

const {
	filterAndPrintData,
	seeAllCardsRender,
	trendingRender
} = templates();

// control variables
let currentPage = 1;
const limit = 10;
let total = 0;


const seeAllBtnAction = (id) => {
	mainContainer.addEventListener('scroll', scrollNextPage);

	scrollTop();
	document.getElementById("seeAllContainer").innerHTML = "";
	config.activeSeeAll = id;
	if (!mainPage.classList.contains("hidden")) {
		buildfire.history.push("Personal Home Page from See All");
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		sortIcon.classList.remove("hidden");
	} else if (!subPage.classList.contains("hidden")) {
		buildfire.history.push("Explore page");
		subPage.classList.add("hidden");
	}
	seeAllCardsRender(
		fakeData,
		document.getElementById("seeAllContainer"),
		true,
		() => { }
	);
	seeAllContainer.classList.remove("hidden");
	config.isSeeAllScreen = true;
};

const cardRender = (sectionId, data, type) => {
	const sectionsContainer = document.getElementById(sectionId);

	data.forEach((element) => {
		if ((type == 'explore' && element.layout == "horizontal-1") || !element.isActive) {
			return;
		}
		let sectionInnerHTML;
		if (element.layout != "horizontal-1") {
			sectionInnerHTML = `
				<div class="container-header">
					<p class="title headerText-AppTheme">${type == 'explore' ? 'All' : 'Recommended'} ${element.title}</p>
					<span class="seeAll-btn info-link-AppTheme" onclick="seeAllBtnAction('${element.id}')">See All</span>
				</div>
					<div id="${`${element.id}-container-${type}`}" class="main">
				</div>
				  `;
		} else {
			sectionInnerHTML = `
				<p class="sectionTitle headerText-AppTheme">${element.title}</p>
					<div id="${`${element.id}-container-${type}`}" class="main"></div>
				`;
		}
		ui.createElement(
			"section",
			sectionsContainer,
			sectionInnerHTML,
			[element.layout],
			`${element.id}-${type}`
		);
		filterAndPrintData(fakeData, element, type);
	});

	const exploreBtn = document.getElementById("exploreButton");
	exploreBtn.addEventListener("click", () => {
		mainPage.classList.add("hidden");
		subPage.classList.remove("hidden");
		userContainer.classList.add("hidden");
		sortIcon.classList.remove("hidden");
		buildfire.history.push("Personal Home Page");
		scrollTop();
	});
};

const init = () => {
	getAppTheme();
	setFilteredTopic(fakeData);
	cardRender("sectionsContainer", fakeData.data.sections, "main");
	cardRender("exploreContainer", fakeData.data.sections, "explore");
	trendingRender(fakeData, "trendingContainer");
	initBack();
	setAppTheme();
}

init();
