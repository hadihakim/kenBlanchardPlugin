"use strict";

const {
	getAppTheme,
	setAppTheme,
	initBack,
	scrollNextPage,
	hasSearch,
	setFilteredTopic,
	scrollTop,
	splideInit
} = utilities();
// detailsRender
const { filterAndPrintData, seeAllCardsRender, trendingRender, detailsRender } =
	templates();

const { openMain, openExplore, openPageDetails, openSeeAll, initMain, openEmptySearch, seeAllBtnAction } = navigation();
// control variables
let currentPage = 1;
const limit = 10;
let total = 0;

function openDetails(id) {
	if (!mainPage.classList.contains("hidden")) {
		buildfire.history.push("Home from See All");
	} else if (!seeAllContainer.classList.contains("hidden")) {
		buildfire.history.push("See All from Details");
	} else if (!explorePage.classList.contains("hidden")) {
		buildfire.history.push("Explore from Details");
	}
	pageDetails.innerHTML = "";
	openPageDetails(id);
	scrollTop();
	//   buildfire.history.push("See All from Details");
}

const init = () => {
	getAppTheme();
	initMain();
	initBack();
	setAppTheme();
};

init();
