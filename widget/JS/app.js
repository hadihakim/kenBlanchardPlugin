"use strict";
// let dummyData = [];
// apiCall().then((res) => {
//   dummyData = res;
// });

const render = () => {
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
};

forYouRender(dummyData, document.getElementById("for-you-container"), false);
render();

