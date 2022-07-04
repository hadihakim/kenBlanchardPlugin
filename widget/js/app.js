"use strict";

const {
  getAppTheme,
  setAppTheme,
  initBack,
  scrollNextPage,
  hasSearch,
  setFilteredTopic,
  scrollTop,
  splideInit,
} = utilities();
// detailsRender

const { filterAndPrintData, seeAllCardsRender, trendingRender, detailsRender , searchCardsRender,  userProfile} =
	templates();

const { openMain, openExplore, openPageDetails, openSeeAll, initMain, openEmptySearch, seeAllBtnAction, openSearch, openUserProfile } = navigation();


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

document.getElementById("userProfilePicture").addEventListener("click", () => {
  openUserProfile();
});
const init = () => {
  getAppTheme();
  initMain();
  initBack();
  MyList.loadCharts();
	MyList.loadList();
  setAppTheme();
};

init();
