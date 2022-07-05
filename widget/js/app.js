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
  userProfile
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
  PageDetails.setState(id);
  PageDetails.init();
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
