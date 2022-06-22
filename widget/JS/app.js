"use strict";
// let dummyData = [];
// apiCall().then((res) => {
//   dummyData = res;
// });

const cardRender = () => {
  const sectionsContainer = document.getElementById("sectionsContainer");

  sectionConfig.forEach((element) => {
    let sectionInnerHTML = `
    <div class="container-header">
        <h1 class="title">${element.title}</h1>
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
    render2(dummyData, container, element.duration);
  });


  const exploreBtn=document.getElementById("exploreButton");
  exploreBtn.addEventListener("click",()=>{
    mainPage.classList.add("hidden");
    subPage.classList.remove("hidden");
    userContainer.classList.add("hidden");
    sortIcon.classList.remove("hidden");
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
    render2(dummyData, container, element.duration);
  });

};

const forYouContainer =document.getElementById("for-you-container");
forYouRender(dummyData,forYouContainer , false);


const trendingContainer= document.getElementById("trendingContainer");
trendingRender(dummyData, trendingContainer)

cardRender();
exploreRender();


