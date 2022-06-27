"use strict";

const { getAppTheme, setAppTheme, initBack, scrollFcn } = utilities();

const {
	filterAndPrintData,
	seeAllCardsRender,
	trendingRender,
} = templates();

// control variables
let currentPage = 1;
const limit = 10;
let total = 0;


const seeAllBtnAction = (title) => {
	mainContainer.addEventListener('scroll', scrollFcn);

	scrollTop();
	document.getElementById("seeAllContainer").innerHTML = "";
	config.activeSeeAll = title;
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
		() => { }
	);
	seeAllContainer.classList.remove("hidden");
	config.isSeeAllScreen = true;
};

const cardRender = (sectionId, data) => {
	const sectionsContainer = document.getElementById(sectionId);
	data.forEach((element) => {
		if (element.id === "explore") {
			const container = document.getElementById(element.containerId);
			seeAllCardsRender(fakeData, container, element.duration, () => { });
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
			filterAndPrintData(fakeData, container, element.duration, element.title, element.id);
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
}

init();
