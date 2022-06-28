"use strict";

const { getAppTheme, setAppTheme, initBack, scrollFcn } = utilities();

const { filterAndPrintData, seeAllCardsRender, trendingRender,detailsRender } = templates();

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

const seeAllBtnAction = (sectionId) => {
  mainContainer.addEventListener("scroll", scrollFcn);
  scrollTop();
  document.getElementById("seeAllContainer").innerHTML = "";
  config.activeSeeAll = sectionId;
  let mainPage = document.getElementById("mainPage");
  let seeAllContainer = document.getElementById("seeAllContainer");
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
    () => {}
  );
  seeAllContainer.classList.remove("hidden");
  config.isSeeAllScreen = true;
};

const cardRender = (sectionId, data) => {
  const sectionsContainer = document.getElementById(sectionId);
  data.forEach((element) => {
    if (element.id === "explore") {
      const container = document.getElementById(element.containerId);
      seeAllCardsRender(fakeData, container, element.duration, () => {});
    } else {
      let sectionInnerHTML;
      if (element.title != "Just for you") {
        sectionInnerHTML = `
				<div class="container-header">
					<p class="title headerText-AppTheme">${element.title}</p>
					<span class="seeAll-btn info-link-AppTheme" onclick=" seeAllBtnHelper('${element.containerId})')">${element.seeAllBtn}</span>
				</div>
					<div id="${element.containerId}" class="${element.containerClassName}">
				</div>
				  `;
      } else {
        sectionInnerHTML = `
				<p class="sectionTitle headerText-AppTheme">${element.title}</p>
					<div id="${element.containerId}"></div>
				`;
      }
      ui.createElement(
        "section",
        sectionsContainer,
        sectionInnerHTML,
        element.className,
        element.id
      );
      const container = document.getElementById(element.containerId);
      filterAndPrintData(
        fakeData,
        container,
        element.duration,
        element.title,
        element.id
      );
    }
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

function openDetails(id) {
  console.log(id);
  pageDetails.innerHTML=""
  detailsRender(pageDetails, id);
  mainPage.classList.add("hidden");
  userContainer.classList.add("hidden");
  sortIcon.classList.remove("hidden");
  subPage.classList.add("hidden");
  seeAllContainer.classList.add("hidden");
  pageDetails.classList.remove("hidden");
  buildfire.history.push("Details Page");
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
  cardRender("sectionsContainer", config.sectionConfig);
  cardRender("exploreContainer", config.exploreConfig);
  trendingRender(fakeData, "trendingContainer");
  setAppTheme();
  initBack();
};

init();
