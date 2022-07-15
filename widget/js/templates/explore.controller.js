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

  static seeAllButton = (id, title, type) => {
    let data = this.getDataById(id);
    let seeAllState = {
      title: "see all",
      data: data,
      apiData: this.state.data,
      userData: authManager.currentUser,
      pageType: "seeAll",
      duration: true,
    };

    Navigation.openSeeAll(type, title, seeAllState);
  };

  static filterAndPrintData = (apiData, element, type) => {
    if (
      // && element.isExplore
      (type == "explore" && element.isActive) ||
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
      let cardsNumber = 0;
      // Filtering section to compare it with sections comming from an api Data

      // Get assets_info and topic from api Data then render section
      assets.forEach((el) => {
        if (cardsNumber === config.cardsLimit) {
          return;
        }

        let assets_info = apiData.data.assets_info[el];
        let topicData = this.state.data.data.topics.find(
          ({ id }) => id === assets_info.meta.topics[0]
        );
        let topicTitle = topicData?.title || '  ';

        let topicConfig = HandleAPI.handleFilter(assets_info.meta.topics);
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
            if (element.layout === "horizontal") {
              this.printRecommended(
                element.container,
                element.durationState,
                element.assets_info,
                element.topicTitle,
                element.id
              );
            } else if (element.layout === "horizontal-1") {
              this.forYouRender(
                element.container,
                element.assets_info,
                element.id
              );
            } else {
              // description, image, title, id, duration, container
              let _options = {
                // assetsInfo[lastIndex].meta
                description: element.meta.description,
                image: element.meta.image,
                title: element.meta.title,
                id: element.id,
                duration: element.meta.duration,
                container: element.container,
              }
              this.vetricalRender(_options)
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
      Navigation.openPageDetails(id, assets_info.meta.title);
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
    // for demo
    let n = container.id.split("-");

    const recommendedTemplate = document.getElementById(
      this.pointers.recommendedTemplate
    );
    const nodesClone = recommendedTemplate.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    // for demo
    if (n[n.length - 1] === "userActivityPage") {
      let progressBar = nodesClone.querySelectorAll(".progressBar");
      let div = document.createElement("div");
      div.classList.add("card-progressBar");
      div.classList.add("holderPercentage");
      let percentageDiv = document.createElement("div");
      percentageDiv.style.width = `${Math.floor(Math.random() * 101)}%`;
      percentageDiv.classList.add("percentageDiv", "infoTheme")
      div.appendChild(percentageDiv);
      progressBar[0].appendChild(div);
    }
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
					<span class="schedule-text bodyText-AppTheme">
						${Utilities.timeConvert(assets_info.meta.duration, "sec")}</span>`;
    }
    card[0].addEventListener("click", () => {
      Navigation.openPageDetails(id, assets_info.meta.title);
    });
    container.appendChild(nodesClone);
    Utilities.setAppTheme();
  };

  static vetricalRender = (options) => {
    const nodesClone = seeAllTemplate.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let title = nodesClone.querySelectorAll(".title");
    let duration = nodesClone.querySelectorAll(".duration");
    let description = nodesClone.querySelectorAll(".description");
    let card = nodesClone.querySelectorAll(".mdc-card");
    description[0].innerText = options.description;
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      options.image,
      "full_width",
      "4:3"
    )}')`;
    let id = options.id;
    title[0].innerText = options.title;
    if (options.duration > 0) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
                                    <span class="schedule-text bodyText-AppTheme">
                                ${Utilities.timeConvert(options.duration, "sec")}</span>`;
    }
    card[0].addEventListener("click", () => {
      Navigation.openPageDetails(options.id, options.title);
    });
    options.container.appendChild(nodesClone);
    Utilities.setAppTheme();
  }

  static cardRender = (sectionId, type) => {
    const sectionsContainer = document.getElementById(sectionId);

    this.state.data.data.sections.forEach((element) => {
      let skeleton = "vertical";
      if (
        // && element.isExplore
        (type == "explore" && element.isActive) ||
        (element.isActive && type !== "explore")
      ) {
        if (type !== "userActivityPage" || element.layout !== "horizontal-1") {
          let sectionInnerHTML;
          if (element.layout === "horizontal") {
            sectionInnerHTML = `
					<div class="container-header">
						<p class="title headerText-AppTheme">${type == "explore"
                ? "All"
                : type === "userActivityPage"
                  ? "My"
                  : "Recommended"
              } ${element.title}</p>
						<span class="seeAll-btn defaultlink-AppTheme" id="${element.id}_${type}">${Strings.SEE_ALL_TEXT
              }</span>
					</div>
						<div id="${`${element.id}-container-${type}`}" class="main">
					</div>
					  `;
            skeleton = "recommanded";
          } else if (element.layout === "horizontal-1") {
            skeleton = "justForYou";
            sectionInnerHTML = `
					<p class="sectionTitle headerText-AppTheme">${element.title}</p>
						<div id="${`${element.id}-container-${type}`}" class="main"></div>
					`;
          } else {
            sectionInnerHTML = `
            <p class="sectionTitle headerText-AppTheme">${element.title}</p>
              <div id="${`${element.id}-container-${type}`}" class="main"></div>
            `;
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
          } else if (skeleton === "vertical") {
            Skeleton.verticalSeeAll_Skeleton(container);
          }
          const myTimeout = setTimeout(() => {
            this.filterAndPrintData(this.state.data, element, type);
          }, 1000);
          let seeAllBtn = document.getElementById(`${element.id}_${type}`);
          if (seeAllBtn) {
            seeAllBtn.addEventListener("click", () => {
              if (type === "userActivityPage") {
                let options = {
                  title: element.title,
                  data: myListData
                }
                Navigation.openUserList(options);
              } else {
                this.seeAllButton(element.id, element.title, type);
              }
            });

          }
        }
      }
    });
  };

  static init = (type) => {
    if (type === "main") {
      sectionsContainer.innerHTML = '';
      this.cardRender(this.pointers.sectionsContainer, type);
      const exploreBtn = document.getElementById(this.pointers.exploreButton);
      exploreBtn.innerHTML = Strings.EXPLORE_BTN;
      exploreBtn.addEventListener("click", () => {
        buildfire.history.push("Explore", {
          showLabelInTitlebar: true,
          from: "Home from Explore",

        });
        Utilities.scrollTop();
        Navigation.openExplore();
      });
    } else {
      this.cardRender(this.pointers.exploreContainer, type);
    }
  };
}
