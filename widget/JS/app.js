"use strict";

const exploreContainer = (sectionName) => {
  let mainContainer = document.getElementById("mainContainer");
  let exploreContainer = document.getElementById("seeAllContainer");
  if (mainContainer.classList.contains("hidden")) {
    mainContainer.classList.remove("hidden");
    exploreContainer.classList.add("hidden");
  } else {
    mainContainer.classList.add("hidden");
    exploreContainer.classList.remove("hidden");
  }
};
const render = () => {
  sectionConfig.forEach((element) => {
    if (element.id === "explore") {
      const container = document.getElementById(element.containerId);
      render3(fakeData, container, element.duration);
    } else {
      const sectionsContainer = document.getElementById("sectionsContainer");
      let sectionInnerHTML = `
      <div class="container-header">
          <h1 class="title">${element.title}</h1>
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
};

forYouRender(dummyData, document.getElementById("for-you-container"), false);
render();
