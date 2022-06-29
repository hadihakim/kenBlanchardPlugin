"use strict";

const {
  getAppTheme,
  setAppTheme,
  initBack,
  scrollNextPage,
  hasSearch,
  setFilteredTopic,
  scrollTop,
} = utilities();
// detailsRender
const { filterAndPrintData, seeAllCardsRender, trendingRender, detailsRender } =
  templates();

// control variables
let currentPage = 1;
const limit = 10;
let total = 0;

const seeAllBtnHelper = (containerId) => {
  fakeData.data.sections.forEach((el) => {
    if (containerId.toLowerCase().includes(el.title.toLowerCase())) {
      seeAllBtnAction(el.id);
    }
  });
};

const seeAllBtnAction = (id) => {
  mainContainer.addEventListener("scroll", scrollNextPage);

  scrollTop();
  document.getElementById("seeAllContainer").innerHTML = "";
  config.activeSeeAll = id;
  if (!mainPage.classList.contains("hidden")) {
    buildfire.history.push("Home from See All");
    mainPage.classList.add("hidden");
    userContainer.classList.add("hidden");
    sortIcon.classList.remove("hidden");
  } else if (!subPage.classList.contains("hidden")) {
    buildfire.history.push("Explore from See All");
    subPage.classList.add("hidden");
  }
  seeAllCardsRender(
    fakeData,
    document.getElementById("seeAllContainer"),
    true,
    () => {}
  );
  seeAllContainer.classList.remove("hidden");
  config.isSeeAllScreen = true;
};

const cardRender = (sectionId, data, type) => {
  const sectionsContainer = document.getElementById(sectionId);

  data.forEach((element) => {
    if (
      (type == "explore" && element.layout == "horizontal-1") ||
      !element.isActive
    ) {
      return;
    }
    let sectionInnerHTML;
    if (element.layout != "horizontal-1") {
      sectionInnerHTML = `
				<div class="container-header">
					<p class="title headerText-AppTheme">${
            type == "explore" ? "All" : "Recommended"
          } ${element.title}</p>
					<span class="seeAll-btn info-link-AppTheme" onclick="seeAllBtnAction('${
            element.id
          }')">See All</span>
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
};

const exploreBtn = document.getElementById("exploreButton");
exploreBtn.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  subPage.classList.remove("hidden");
  userContainer.classList.add("hidden");
  sortIcon.classList.remove("hidden");
  buildfire.history.push("Home from Explore");
  scrollTop();
});

function openDetails(id) {
  if (!mainPage.classList.contains("hidden")) {
    buildfire.history.push("Home from See All");

  } else if (!seeAllContainer.classList.contains("hidden")) {
    buildfire.history.push("See All from Details");

  }
  pageDetails.innerHTML = "";

  detailsRender(pageDetails, id);
  searchBar.classList.add("hidden");
  mainPage.classList.add("hidden");
  userContainer.classList.add("hidden");
  sortIcon.classList.remove("hidden");
  subPage.classList.add("hidden");
  seeAllContainer.classList.add("hidden");
  pageDetails.classList.remove("hidden");
  scrollTop();
//   buildfire.history.push("See All from Details");

}

const getUser = (data) => {
  let userName = document.getElementById("userName");
  let userProfilePicture = document.getElementById("userProfilePicture");
  let userAchievementIcon = document.getElementById("userAchievementIcon");
  let growthProfile = document.getElementById("growthProfile");
  if (data.isLoggedIn) {
    let userAchievements = data.badges.filter((el) => el.active === true);
    userName.innerText = data.firstName + " " + data.lastName;
    growthProfile.innerText = data.growthProfile;
    userProfilePicture.src = data.profilePicture;
    userProfilePicture.alt = data.firstName;
    userAchievementIcon.src = userAchievements[0].achievementIcon;
    userAchievementIcon.alt = userAchievements[0].achievementTitle;
    config.filterArr = data.recommendedTags;
  } else {
    userProfilePicture.src = "../../../../styles/media/avatar-placeholder.png";
    userName.innerText = "Anonymous";
    growthProfile.innerText = "Profile Growth";
    userAchievementIcon.src = "../../../../styles/media/holder-1x1.png";
  }
};
const init = () => {
  getUser(config.userConfig);
  getAppTheme();
  cardRender("sectionsContainer", fakeData.data.sections, "main");
  cardRender("exploreContainer", fakeData.data.sections, "explore");
  trendingRender(fakeData, "trendingContainer");
  setFilteredTopic(fakeData);
  initBack();
  setAppTheme();
};

init();
