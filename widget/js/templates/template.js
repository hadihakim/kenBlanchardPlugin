const { timeConvert, cropImage, sort } = utilities();
const templates = () => {
  const printRecommended = (
    container,
    durationState,
    assets_info,
    topicTitle
  ) => {
    const recommendedTemplate = document.getElementById("recommendedTemplate");
   
      const nodesClone = recommendedTemplate.content.cloneNode(true);
      let image = nodesClone.querySelectorAll(".image");
      let category = nodesClone.querySelectorAll(".category");
      let title = nodesClone.querySelectorAll(".title");
      let duration = nodesClone.querySelectorAll(".duration");
      image[0].style.backgroundImage = `url('${cropImage(
        assets_info.meta.image
      )}')`;
      category[0].innerText = topicTitle;
      title[0].innerText = assets_info.meta.title;
      if (durationState) {
        duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
					<span class="schedule-text">
						${timeConvert(assets_info.meta.duration)}</span>`;
      }
      container.appendChild(nodesClone);
    
  };

  const forYouRender = (container, assets_info) => {
    const template = document.getElementById("forYouTemplate");
    console.log(assets_info.meta.title.search(config.search));
 
      const firstClone = template.content.cloneNode(true);
      let title = firstClone.querySelectorAll(".card-Text-Header");
      let note = firstClone.querySelectorAll(".card-Text-Note");
      let image = firstClone.getElementById("card_body");
      title[0].innerHTML = assets_info.meta.title;
      note[0].innerHTML = assets_info.meta.description;
      image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(assets_info.meta.image)}')`;
      container.appendChild(firstClone);
    
  };

  const filterAndPrintData = (
    apiData,
    container,
    durationState,
    section,
    sectionsContainer
  ) => {
    sectionsContainer = document.getElementById(sectionsContainer);
    container.innerHTML = "";
    let isEmpty = true;
    let foundInSearch = 0;
    let assets = [];
    let renderArray = [];
    let topicConfig = false;
    let cardsNumber = 0;
    // Filtering section to compare it with sections comming from an api Data
    if (section !== "explore" && section !== "Just for you") {
      section = section.split(" ")[1];
    }
    // Get assets of the section from api Data
    apiData.data.sections.forEach((el) => {
      if (el.title === section) {
        assets = el.assets;
      }
    });

    // Get assets_info and topic from api Data then render section
    assets.forEach((el) => {
      if (cardsNumber === config.cardsLimit) {
        return;
      }
      let topicTitle;
      let assets_info = apiData.data.assets_info[el];

      assets_info.meta.topics.forEach((topic) => {
        if (cardsNumber === config.cardsLimit) {
          return;
        }
        let data = apiData.data.topics.find(({ id }) => id === topic);
        topicTitle = data.title;
        if (
          config.filterArr.includes(topicTitle) ||
          config.filterArr.length == 0
        ) {
          topicConfig = true;
          cardsNumber += 1;
        } else {
          topicConfig = false;
        }
        if (topicConfig) {
          isEmpty = false;
          if (hasSearch(assets_info)) {
            switch (section) {
              case "Just for you":
                forYouRender(container, assets_info);
                // renderArray.push({container,assets_info});
                break;
              case "explore":
                break;
              default:
                // printRecommended(
                //   container,
                //   durationState,
                //   assets_info,
                //   topicTitle
                // );
  
                renderArray.push({
                  container,
                  durationState,
                  assets_info,
                  topicTitle,
                  meta: assets_info.meta,
                });
                break;
            }
            foundInSearch++;

          } else {
            foundInSearch--;
          }
         
        }
      });
    });

    if (sectionsContainer) {
      if (isEmpty) {
        sectionsContainer.classList.add("hidden");
      } else if (foundInSearch < 0) {
        sectionsContainer.classList.add("hidden");
      } else {
        sectionsContainer.classList.remove("hidden");
        renderArray = sort(renderArray, config.sortType);
        console.log(renderArray);
        renderArray.forEach((element) => {
          if (section !== "Just for you") {
            printRecommended(
              element.container,
              element.durationState,
              element.assets_info,
              element.topicTitle
            );
          }
        });
      }
    }
  };

  const seeAllCardsRender = (apiData, container, durationState, callback) => {
    console.log(config.lastIndex, "TE");
    let coursesId = "";
    apiData.data.sections.forEach((element) => {
      if (
        element.title.toLowerCase() ===
        config.activeSeeAll.toLowerCase().split(" ")[1]
      ) {
        coursesId = element.id;
      }
    });
    let data = apiData.data.sections.filter((t) => t.id === coursesId);
    const recommendedTemplate = document.getElementById("seeAllTemplate");
    let assetsInfo = [];
    console.log(data, "data");
    let section = data[0] || {};
    if (config.renderedCard == (config.pageSize * config.page)) {
      return;
    }
    if (section.hasOwnProperty("assets")) {
      let assets = section.assets;
      assets.forEach((assetId) => {
        assetsInfo.push(apiData.data.assets_info[assetId]);
      });
    } else {
      return;
    }
    // sort
    assetsInfo = sort(assetsInfo, config.sortType);
    let lastIndex = config.lastIndex;
    for (let i = lastIndex; i < (lastIndex + config.pageSize); i++) {
      if (config.renderedCard >= (config.pageSize * config.page) || i >= assetsInfo.length) {
        return;
      } else {
        config.lastIndex = i;
        let topicIdArray = assetsInfo[i].meta.topics;
        topicIdArray.forEach((topicId) => {
          if (config.renderedCard >= (config.pageSize * config.page)) {
            return;
          }
          let data = apiData.data.topics.find(({ id }) => id === topicId);
          if (
           ( config.filterArr.includes(data.title) ||
            config.filterArr.length === 0) && hasSearch(assetsInfo[i])
          ) {
            config.renderedCard++;
            const nodesClone = recommendedTemplate.content.cloneNode(true);
            let image = nodesClone.querySelectorAll(".image");
            let title = nodesClone.querySelectorAll(".title");
            let duration = nodesClone.querySelectorAll(".duration");
            let description = nodesClone.querySelectorAll(".description");
            description[0].innerText = assetsInfo[i].meta.description;
            image[0].style.backgroundImage = `url('${cropImage(
              assetsInfo[i].meta.image,
              "full_width",
              "4:3"
            )}')`;
            title[0].innerText = assetsInfo[i].meta.title;
            if (durationState) {
              duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
            <span class="schedule-text">
              ${timeConvert(assetsInfo[i].meta.duration)}</span>`;
            }
          }
        });
      }
    }
    callback();
    if(config.lastIndex < assetsInfo.length) {
      config.page++;
    }
  };

  const trendingRender = (apiData, containerId) => {
    let data = apiData.data.topics;
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const trendingTemplate = document.getElementById("trendingTemplate");

    data.forEach((el) => {
      if (el.isTrending) {
        const nodesClone = trendingTemplate.content.cloneNode(true);
        let title = nodesClone.getElementById("trending-span");
        title.innerHTML = el.title;
        container.appendChild(nodesClone);

        if (config.filterArr.indexOf(el.title) > -1) {
          title.classList.add("selectedTrending");
        } else {
          title.classList.add("unSelectedTrending");
        }

        title.addEventListener("click", () => {
          if (config.filterArr.indexOf(el.title) > -1) {
            title.classList.remove("selectedTrending");
            title.classList.add("unSelectedTrending");
            config.filterArr.splice(config.filterArr.indexOf(el.title), 1);
          } else {
            title.classList.add("selectedTrending");
            title.classList.remove("unSelectedTrending");
            config.filterArr.push(el.title);
          }
          config.exploreConfig.forEach((element) => {
            const container = document.getElementById(element.containerId);
            filterAndPrintData(
              fakeData,
              document.getElementById(`${element.containerId}`),
              element.duration,
              element.title,
              element.id
            );
          });
        });
      }
    });
  };

  return { filterAndPrintData, seeAllCardsRender, trendingRender };
};
