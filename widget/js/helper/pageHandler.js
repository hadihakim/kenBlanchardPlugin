const pageHandler = () => {
  const graphicalSummariesFirstPage = (data, container) => {
    const template = document.getElementById("graphicalSummariesFirstPage");
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let description = nodesClone.querySelectorAll(".description");
    let chaptersList = nodesClone.querySelectorAll(".chapters-list");
    topImage[0].style.backgroundImage = `url('${cropImage(data.image)}')`;
    title[0].innerText = data.title;
    description[0].innerText = data.description;
    data.chapters.forEach((chapter) => {
      let li = document.createElement("li");
      li.classList.add("chapter-item");
      let innerHTML = `
            <h6 class="chapter-title">${chapter.title}</h6>
            <div class="sub-chapter-item">
              <span class="chapter-subtitle">${chapter.subTitle}</span>
              ${
                chapter.premium
                  ? '<label for="searchInput" class="material-icons icon">lock</label>'
                  : ""
              }

            </div>
            <div class="bar"></div>
            `;
      li.innerHTML = innerHTML;
      chaptersList[0].appendChild(li);
      li.addEventListener("click", () => {
        buildfire.history.push("page detail from chapter",{id:data.id});
        graphicalSummariesSecondPage(chapter, container);
      });
    });

    container.appendChild(nodesClone);
		setAppTheme();
	};

  const graphicalSummariesSecondPage = (data, container) => {
    container.innerHTML = "";
    const template = document.getElementById("graphicalSummariesSecondPage");
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let subtitle = nodesClone.querySelectorAll(".subtitle");
    let startChapter = nodesClone.getElementById("startChapter");
    startChapter.addEventListener("click", () => {
      graphicalSummariesThirdPage(data, container);
    });
    topImage[0].src = cropImage(data.image);
    title[0].innerText = data.title;
    subtitle[0].innerText = data.subTitle;
    container.appendChild(nodesClone);
	setAppTheme();

  };

  const graphicalSummariesThirdPage = (data, container) => {
    container.innerHTML = "";
    const template = document.getElementById("graphicalSummariesThirdPage");
    const nodesClone = template.content.cloneNode(true);
    const splideList = nodesClone.querySelectorAll(".splide__list");
    data.pages.forEach((page) => {
      let li = document.createElement("li");
      li.classList.add("splide__slide");
      let innerHTML = `
            <div class="content-item">
                <img
                  src="${cropImage(page.pageImage)}"
                  alt=""
                  class="top-image"
                />
                <div class="text-content">
                  <p>
                    ${page.pageContent}
                  </p>
                </div>
              </div>
            `;
      li.innerHTML = innerHTML;
      splideList[0].appendChild(li);
    });
    container.appendChild(nodesClone);
    splideInit();
		setAppTheme();
	};

  const graphicalSummariesFourthPage = () => {
    container.innerHTML = "";
    const template = document.getElementById("graphicalSummariesFourthPage");
    const nodesClone = template.content.cloneNode(true);
    container.appendChild(nodesClone);
		setAppTheme();
	};

  return {
    graphicalSummariesFirstPage,
    graphicalSummariesSecondPage,
    graphicalSummariesThirdPage,
    graphicalSummariesFourthPage,
  };
};
