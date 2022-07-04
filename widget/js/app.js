"use strict";

const {
  getAppTheme,
  setAppTheme,
  initBack,
  scrollNextPage,
  scrollTop,
  splideInit,
} = utilities();
// detailsRender

const {
  detailsRender,
  userProfile,
} = templates();

const {
  openMain,
  openExplore,
  openPageDetails,
  openSeeAll,
  openEmptySearch,
  seeAllBtnAction,
  openSearch,
  openUserProfile,
} = navigation();

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
  UserProfile.init();
  Explore.setPageData({data:fakeData,userData:config.userConfig});
  Explore.init("main");
  Explore.init("explore");
  Search.setData(fakeData);
  Search.init();
  initBack();
  MyList.loadCharts();
  MyList.loadList();
  setAppTheme();
};

init();
