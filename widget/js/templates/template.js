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
    setAppTheme();
  };

  const forYouRender = (container, assets_info) => {
    const template = document.getElementById("forYouTemplate");

    const firstClone = template.content.cloneNode(true);
    let title = firstClone.querySelectorAll(".card-Text-Header");
    let note = firstClone.querySelectorAll(".card-Text-Note");
    let image = firstClone.getElementById("card_body");
    title[0].innerHTML = assets_info.meta.title;
    note[0].innerHTML = assets_info.meta.description;
    image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(assets_info.meta.image)}')`;
    container.appendChild(firstClone);
    setAppTheme();
  };

  const detailsRender = (container, id) => {
    let data = fakeData.data.assets_info[id];
    const template = document.getElementById("detailsPageTemplate");
    const firstClone = template.content.cloneNode(true);
    let title = firstClone.querySelectorAll(".details-title");
    console.log("data====>", data);
    title[0].innerHTML = data.meta.title;
    container.appendChild(firstClone);
  };

  const filterAndPrintData = (apiData, element, type) => {
    if (type == "explore" && element.layout == "horizontal-1") {
      return;
    }
    // id , containerId, duration, title, containerClassName, className, sectionContainer
    // id , id-container, title, type, layout, element.id
    let sectionsContainer = document.getElementById(`${element.id}-${type}`);
    let container = document.getElementById(`${element.id}-container-${type}`);
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
            renderArray.push({
              container,
              durationState: assets_info.meta.duration,
              assets_info,
              topicTitle,
              meta: assets_info.meta,
              layout: element.layout,
            });
            foundInSearch++;
          } else {
            foundInSearch--;
          }
          return;
        }
      });
    });
    if (sectionsContainer) {
      if (isEmpty || foundInSearch < 0) {
        sectionsContainer.classList.add("hidden");
      } else {
        sectionsContainer.classList.remove("hidden");
        renderArray = sort(renderArray, config.sortType);
        renderArray.forEach((element) => {
          if (element.layout !== "horizontal-1") {
            printRecommended(
              element.container,
              element.durationState,
              element.assets_info,
              element.topicTitle
            );
          } else {
            forYouRender(element.container, element.assets_info);
          }
        });
      }
    }
  };

  const seeAllCardsRender = (apiData, container, durationState, callback) => {
    if (config.renderedCard === 0) {
      config.page = 1;
      config.lastIndex = 0;
      document.getElementById("seeAllContainer").innerHTML = "";
    }

    const seeAllTemplate = document.getElementById("seeAllTemplate");

    let sectionData =
      apiData.data.sections.find(({ id }) => id == config.activeSeeAll) || {};
    let assetsInfo = [];
    let ids = [];
    let assets = sectionData.assets || [];
    assets.forEach((assetId) => {
      let assetData = apiData.data.assets_info[assetId];
      assetData.id = assetId;
      console.log(assetId, "id");
      //   assetsInfo.push({data: apiData.data.assets_info[assetId] , id: assetId});
      assetsInfo.push(assetData);

      console.log(apiData.data.assets_info[assetId]);
      ids.push(assetId);
    });
    // sort
    assetsInfo = sort(assetsInfo, config.sortType);

    // let lastIndex = config.lastIndex;
    for (
      let lastIndex = config.lastIndex;
      lastIndex < lastIndex + config.pageSize;
      lastIndex++
    ) {
      if (
        config.renderedCard == config.pageSize * config.page ||
        lastIndex >= assetsInfo.length
      ) {
        config.lastIndex = lastIndex;
        callback();
        config.page++;
        return;
      } else {
        let topicIdArray = assetsInfo[lastIndex].meta.topics;
        let printCard = false;
        topicIdArray.forEach((topicId) => {
          let data = apiData.data.topics.find(({ id }) => id === topicId);
          if (
            (config.filterArr.includes(data.title) ||
              config.filterArr.length === 0) &&
            hasSearch(assetsInfo[lastIndex])
          ) {
            printCard = true;
          }
        });
        if (printCard) {
          config.renderedCard++;

          const nodesClone = seeAllTemplate.content.cloneNode(true);

          let image = nodesClone.querySelectorAll(".image");
          let title = nodesClone.querySelectorAll(".title");
          let duration = nodesClone.querySelectorAll(".duration");
          let description = nodesClone.querySelectorAll(".description");
          description[0].innerText = assetsInfo[lastIndex].meta.description;
          image[0].style.backgroundImage = `url('${cropImage(
            assetsInfo[lastIndex].meta.image,
            "full_width",
            "4:3"
          )}')`;
          let id = assetsInfo[lastIndex].id;
          title[0].innerText = assetsInfo[lastIndex].meta.title;
          if (durationState) {
            duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
								<span class="schedule-text">
							${timeConvert(assetsInfo[lastIndex].meta.duration)}</span>`;
          }
		  title[0].addEventListener("click", () => {
            openDetails(id);
          });
          container.appendChild(nodesClone);
        }
      }
    }
    setAppTheme();
  };

  const trendingRender = (apiData, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const trendingTemplate = document.getElementById("trendingTemplate");

    config.isTrending.forEach((trendingTopic) => {
      const nodesClone = trendingTemplate.content.cloneNode(true);
      let title = nodesClone.getElementById("trending-span");
      title.innerHTML = trendingTopic;
      container.appendChild(nodesClone);

      if (config.filterArr.indexOf(trendingTopic) > -1) {
        title.classList.add("selectedTrending");
      } else {
        title.classList.add("unSelectedTrending");
      }

      title.addEventListener("click", () => {
        if (config.filterArr.indexOf(trendingTopic) > -1) {
          title.classList.remove("selectedTrending");
          title.classList.add("unSelectedTrending");
          config.filterArr.splice(config.filterArr.indexOf(trendingTopic), 1);
        } else {
          title.classList.add("selectedTrending");
          title.classList.remove("unSelectedTrending");
          config.filterArr.push(trendingTopic);
        }

        fakeData.data.sections.forEach((element) => {
          filterAndPrintData(fakeData, element, "explore");
        });
      });
    });
    setAppTheme();
  };

  return {
    filterAndPrintData,
    seeAllCardsRender,
    trendingRender,
    detailsRender,
  };
};
