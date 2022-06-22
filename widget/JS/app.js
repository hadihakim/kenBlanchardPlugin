"use strict";

const exploreContainer = (sectionName) => {
	let mainContainer = document.getElementById("mainContainer");
	let seeAllContainer = document.getElementById("seeAllContainer");
	if (mainContainer.classList.contains("hidden")) {
		mainContainer.classList.remove("hidden");
		seeAllContainer.classList.add("hidden");
	} else {
		buildfire.history.push("Personal Home Page from See All")
		mainContainer.classList.add("hidden");
		seeAllContainer.classList.remove("hidden");
	}
	scrollTop();
};
const cardRender = () => {
	const sectionsContainer = document.getElementById("sectionsContainer");

	sectionConfig.forEach((element) => {
		if (element.id === "explore") {
			const container = document.getElementById(element.containerId);
			render3(fakeData, container, element.duration);
		} else {
			const sectionsContainer = document.getElementById("sectionsContainer");
			let sectionInnerHTML = `
      <div class="container-header">
          <p class="title">${element.title}</p>
          <span class="seeAll-btn" onclick="exploreContainer('${element.id}')">${element.seeAllBtn}</span>
      </div>
          <div id="${element.containerId}">
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
			render2(fakeData, container, element.duration);
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

const exploreRender = () => {
	const sectionsContainer = document.getElementById("exploreContainer");

	exploreConfig.forEach((element) => {
		let sectionInnerHTML = `
    <div class="container-header">
        <h3 class="cardTitle">${element.title}</h3>
        <span class="seeAll-btn">${element.seeAllBtn}</span>
    </div>
        <div id="${element.containerId}">
    </div>
`;

		ui.createElement(
			"section",
			sectionsContainer,
			sectionInnerHTML,
			element.className,
			element.id
		);

		const container = document.getElementById(
			element.containerId
		);
		render2(fakeData, container, element.duration);
	});

};

const forYouContainer = document.getElementById("for-you-container");
forYouRender(dummyData, forYouContainer, false);


const trendingContainer = document.getElementById("trendingContainer");
trendingRender(dummyData, trendingContainer)

cardRender();
exploreRender();


