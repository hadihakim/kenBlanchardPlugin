"use strict";

const { getAppTheme, setAppTheme } = utilities();

const appConfig = {
  fetchingNextList: false,
  isSeeAllScreen: false,
}

const {
	forYouRender,
	recommendedCardRender,
	seeAllCardsRender,
	trendingRender,
} = templates();
const seeAllBtnAction = () => {
	let mainContainer = document.getElementById("mainPage");
	let seeAllContainer = document.getElementById("seeAllContainer");
	if (!mainContainer.classList.contains("hidden")) {
		buildfire.history.push("Personal Home Page from See All");
		mainContainer.classList.add("hidden");
		userContainer.classList.add("hidden");
		sortIcon.classList.remove("hidden");
	} else if (!subPage.classList.contains("hidden")) {
		buildfire.history.push("Explore page");
		subPage.classList.add("hidden");
	}
  scrollTop();
	seeAllContainer.classList.remove("hidden");
  appConfig.isSeeAllScreen = true;
};

const cardRender = (sectionId, data) => {
	const sectionsContainer = document.getElementById(sectionId);
	data.forEach((element) => {
		if (element.id === "explore") {
			const container = document.getElementById(element.containerId);
			seeAllCardsRender(fakeData, container, element.duration, ()=>{});
		} else if (element.id === "for-you-section") {
			let sectionInnerHTML = `
			<p class="sectionTitle headerText-AppTheme">${element.title}</p>
			<div id="${element.containerId}"></div>
  `;
			ui.createElement(
				"section",
				sectionsContainer,
				sectionInnerHTML,
				element.className,
				element.id
			);
			const container = document.getElementById(element.containerId);
			forYouRender(fakeData, container, element.duration);
		} else {
			let sectionInnerHTML = `
      <div class="container-header">
          <p class="title headerText-AppTheme">${element.title}</p>
          <span class="seeAll-btn info-link-AppTheme" onclick="seeAllBtnAction('${element.id}')">${element.seeAllBtn}</span>
      </div>
          <div id="${element.containerId}" class="${element.containerClassName}">
      </div>
  `;

			ui.createElement(
				"section",
				sectionsContainer,
				sectionInnerHTML,
				element.className,
				element.id
			);

			const container = document.getElementById(element.containerId);
			recommendedCardRender(fakeData, container, element.duration);
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



const init = () => {
	getAppTheme();
	cardRender("sectionsContainer", config.sectionConfig);
	cardRender("exploreContainer", config.exploreConfig);
	trendingRender(fakeData, "trendingContainer");
	setAppTheme();
  mainContainer.onscroll = (e) => {
    if(appConfig.isSeeAllScreen) {
      //console.log( window.getComputedStyle(document.getElementById("seeAllContainer")).display);
      if (
      (((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) === 1)
    ) {
      _fetchNextList();
    }
    } 
  };

  function _fetchNextList() {
    if (config.fetchingNextList) return;
    config.fetchingNextList = true;
    seeAllCardsRender(fakeData, document.getElementById("seeAllContainer"), true, () => {
      config.fetchingNextList = false;
    });
  }
}

init();
