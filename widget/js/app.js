"use strict";

const { getAppTheme, setAppTheme, initBack } = utilities();

const appConfig = {
	fetchingNextList: false,
	isSeeAllScreen: false,
	topics: []
}

const {
	filterAndPrintData,
	seeAllCardsRender,
	trendingRender,
} = templates();

const _fetchNextList = () => {
	if (appConfig.fetchingNextList) return;
	appConfig.fetchingNextList = true;
	seeAllCardsRender(fakeData, document.getElementById("seeAllContainer"), true, () => {
		appConfig.fetchingNextList = false;
	});
}

const seeAllBtnAction = (title) => {
  config.activeSeeAll=title;
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
  seeAllCardsRender(
    fakeData,
    document.getElementById("seeAllContainer"),
    true
  );
	_fetchNextList()
	seeAllContainer.classList.remove("hidden");
	appConfig.isSeeAllScreen = true;
};

const cardRender = (sectionId, data) => {
	const sectionsContainer = document.getElementById(sectionId);
	data.forEach((element) => {
		if (element.id === "explore") {
			const container = document.getElementById(element.containerId);
			seeAllCardsRender(fakeData, container, element.duration,"Default");
		} else {
			let sectionInnerHTML;
			if (element.title != "Just for you") {
				sectionInnerHTML = `
				<div class="container-header">
					<p class="title headerText-AppTheme">${element.title}</p>
					<span class="seeAll-btn info-link-AppTheme" onclick="seeAllBtnAction('${element.title}')">${element.seeAllBtn}</span>
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
			filterAndPrintData(fakeData, container, element.duration, element.title);
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
	initBack();
	mainContainer.onscroll = (e) => {
		//console.log( window.getComputedStyle(document.getElementById("seeAllContainer")).display);
		if (
			((((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) > 0.97) && !appConfig.fetchingNextList && appConfig.isSeeAllScreen)
		) {
			_fetchNextList();
		}
	};
}

init();
