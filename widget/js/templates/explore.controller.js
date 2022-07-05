class Explore {
  static state = {
    data: fakeData,
    userData: config.userConfig,
  };

  static pointers = {
    userContainer: "userContainer",
    searchBar: "searchBar",
    searchSortIcon: "sortIcon",
    searchFilterIcon: "filterIcon",
    mainPage: "mainPage",
    sectionsContainer: "sectionsContainer",
    exploreButton: "exploreButton",
    explorePage: "explorePage",
    exploreContainer: "exploreContainer",
    trendingSection: "trendingSection",
    forYouTemplate: "forYouTemplate",
    recommendedTemplate: "recommendedTemplate",
  };

  static setPageData = (data) => {
    this.state = data;
  };
  static getDataById = (id) => {
    let data = this.state.data.data.sections.filter(
      (section) => section.id === id
    );
    return data[0];
  };
  static seeAllButton = (id) => {
    let data = this.getDataById(id);
    let seeAllState = {
      title: "see all",
      data: data,
      apiData:this.state.data,
      userData: config.userConfig,
      pageType: "seeAll",
      duration: true,
    };
    SeeAll.setData(seeAllState);
    Navigation.openSeeAll();
    config.searchFrom = "from-see-all"
    SeeAll.init();
  };

  static filterAndPrintData = (apiData, element, type) => {
    if (
      (type == "explore" && element.isExplore && element.isActive) ||
      (element.isActive && type !== "explore")
    ) {
      //   return;
      // id , containerId, duration, title, containerClassName, className, sectionContainer
      // id , id-container, title, type, layout, element.id
      let sectionsContainer = document.getElementById(`${element.id}-${type}`);
      let container = document.getElementById(
        `${element.id}-container-${type}`
      );
      container.innerHTML = "";
      let isEmpty = true;
      let assets = element.assets;
      let foundInSearch = 0;
      let renderArray = [];
      let topicConfig = false;
      let cardsNumber = 0;
      // Filtering section to compare it with sections comming from an api Data

      // Get assets_info and topic from api Data then render section
      assets.forEach((el) => {
        if (cardsNumber === config.cardsLimit) {
          return;
        }
        let topicTitle;
        let assets_info = apiData.data.assets_info[el];

        // assets_info.meta.topics.forEach((topic) =>
        for (let i = 0; i < assets_info.meta.topics.length; i++) {
          if (cardsNumber === config.cardsLimit) {
            return;
          }
          let data = apiData.data.topics.find(
            ({ id }) => id === assets_info.meta.topics[i]
          );
          topicTitle = data.title;
          if (
            Search.state.filterArr.includes(topicTitle) ||
            Search.state.filterArr.length == 0
          ) {
            topicConfig = true;
            break;
          } else {
            topicConfig = false;
          }
        }
        if (topicConfig) {
          cardsNumber += 1;
          isEmpty = false;
          if (Search.hasSearch(assets_info)) {
            renderArray.push({
              container,
              durationState: assets_info.meta.duration,
              assets_info,
              topicTitle,
              meta: assets_info.meta,
              layout: element.layout,
              id: el,
            });
            foundInSearch++;
          } else {
            foundInSearch--;
          }
          return;
        }
      });
      if (sectionsContainer) {
        if (isEmpty || foundInSearch < 0) {
          sectionsContainer.classList.add("hidden");
        } else {
          sectionsContainer.classList.remove("hidden");
          renderArray = Search.sort(renderArray, config.sortType);
          renderArray.forEach((element) => {
            if (element.layout !== "horizontal-1") {
              this.printRecommended(
                element.container,
                element.durationState,
                element.assets_info,
                element.topicTitle,
                element.id
              );
            } else {
              this.forYouRender(
                element.container,
                element.assets_info,
                element.id
              );
            }
          });
        }
      }
    }
  };

  static forYouRender = (container, assets_info, id) => {
    const template = document.getElementById(this.pointers.forYouTemplate);
    const firstClone = template.content.cloneNode(true);
    let title = firstClone.querySelectorAll(".card-Text-Header");
    let note = firstClone.querySelectorAll(".card-Text-Note");
    let image = firstClone.getElementById("card_body");
    let card = firstClone.querySelectorAll(".mdc-card");
    title[0].innerHTML = assets_info.meta.title;
    note[0].innerHTML = assets_info.meta.description;
    image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${Utilities.cropImage(assets_info.meta.image)}')`;

    card[0].addEventListener("click", () => {
      PageDetails.openDetails(id);
    });
    container.appendChild(firstClone);
    Utilities.setAppTheme();
  };

  static printRecommended = (
    container,
    durationState,
    assets_info,
    topicTitle,
    id
  ) => {
    const recommendedTemplate = document.getElementById(
      this.pointers.recommendedTemplate
    );
    const nodesClone = recommendedTemplate.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let category = nodesClone.querySelectorAll(".category");
    let title = nodesClone.querySelectorAll(".title");
    let duration = nodesClone.querySelectorAll(".duration");
    let card = nodesClone.querySelectorAll(".mdc-card");
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      assets_info.meta.image
    )}')`;
    category[0].innerText = topicTitle;
    title[0].innerText = assets_info.meta.title;
    if (durationState) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
					<span class="schedule-text">
						${Utilities.timeConvert(assets_info.meta.duration)}</span>`;
    }
    card[0].addEventListener("click", () => {
      PageDetails.openDetails(id);
    });
    container.appendChild(nodesClone);
    Utilities.setAppTheme();
  };

  static cardRender = (sectionId, type) => {
    const sectionsContainer = document.getElementById(sectionId);

    this.state.data.data.sections.forEach((element) => {
      let skeleton = "";
      if (
        (type == "explore" && element.isExplore && element.isActive) ||
        (element.isActive && type !== "explore")
      ) {
        let sectionInnerHTML;
        if (element.layout != "horizontal-1") {
          sectionInnerHTML = `
					<div class="container-header">
						<p class="title headerText-AppTheme">${
              type == "explore"
                ? "All"
                : type === "userActivityPage"
                ? "My"
                : "Recommended"
            } ${element.title}</p>
						<span class="seeAll-btn info-link-AppTheme" id="${element.id}_${type}">${
            Strings.SEE_ALL_TEXT
          }</span>
					</div>
						<div id="${`${element.id}-container-${type}`}" class="main">
					</div>
					  `;
          skeleton = "recommanded";
        } else {
          sectionInnerHTML = `
					<p class="sectionTitle headerText-AppTheme">${element.title}</p>
						<div id="${`${element.id}-container-${type}`}" class="main"></div>
					`;
          skeleton = "justForYou";
        }
        ui.createElement(
          "section",
          sectionsContainer,
          sectionInnerHTML,
          [element.layout],
          `${element.id}-${type}`
        );
        const container = document.getElementById(
          `${element.id}-container-${type}`
        );
        if (skeleton === "justForYou") {
          Skeleton.horizontal1_Skeleton(container);
        } else if (skeleton === "recommanded") {
          Skeleton.horizontal_Skeleton(container);
        }
        const myTimeout = setTimeout(() => {
          this.filterAndPrintData(this.state.data, element, type);
        }, 1000);
        let seeAllBtn = document.getElementById(`${element.id}_${type}`);
        if (seeAllBtn) {
          seeAllBtn.addEventListener("click", () => {
            this.seeAllButton(element.id);
          });
        }
      }
    });
  };

  static init = (type) => {
    if (type === "main") {
      this.cardRender(this.pointers.sectionsContainer, type);
      const exploreBtn = document.getElementById(this.pointers.exploreButton);
      exploreBtn.innerHTML = Strings.EXPLORE_BTN;
      exploreBtn.addEventListener("click", () => {
        buildfire.history.push("Home from Explore");
        Utilities.scrollTop();
        Navigation.openExplore();
      });
    } else {
      this.cardRender(this.pointers.exploreContainer, type);
    }
  };
}
