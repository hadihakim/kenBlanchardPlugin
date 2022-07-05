class SeeAll {
  static state = {
    title: "see all",
    data: fakeData,
    userData: config.userConfig,
    apiData:fakeData,
    pageType: "seeAll",
    duration: true,
  };
  static pointers = {
    searchBar: "searchBar",
    searchSortIcon: "sortIcon",
    searchFilterIcon: "filterIcon",
    seeAllContainer: "seeAllContainer",
    seeAllTemplate:"seeAllTemplate",
  };

  static setData = (data) => {
    this.state = data;
  };

  static seeAllCardsRender = (apiData, container, durationState, callback) => {
    container=document.getElementById(container);
    if (config.renderedCard === 0) {
      config.page = 1;
      config.lastIndex = 0;
      container.innerHTML = "";
    }
    const seeAllTemplate = document.getElementById(this.pointers.seeAllTemplate);

    
    let assetsInfo = [];
    let assets = this.state.data.assets || [];
    assets.forEach((assetId) => {
      let assetData = apiData.data.assets_info[assetId];
      assetData.id = assetId;
      assetsInfo.push(assetData);
    });
    // sort
    assetsInfo = Search.sort(assetsInfo, Search.state.sortType);

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
        if (config.renderedCard == 0) {
          openEmptySearch();
        } else {
          openSeeAll();
        }
        return;
      } else {
        let topicIdArray = assetsInfo[lastIndex].meta.topics;
        let printCard = false;
        topicIdArray.forEach((topicId) => {
          let data = apiData.data.topics.find(({ id }) => id === topicId);
          if (
            (Search.state.filterArr.includes(data.title) ||
              Search.state.filterArr.length === 0) &&
            Search.hasSearch(assetsInfo[lastIndex])
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
          let card = nodesClone.querySelectorAll(".mdc-card");
          description[0].innerText = assetsInfo[lastIndex].meta.description;
          image[0].style.backgroundImage = `url('${cropImage(
            assetsInfo[lastIndex].meta.image,
            "full_width",
            "4:3"
          )}')`;
          let id = assetsInfo[lastIndex].id;
          title[0].innerText = assetsInfo[lastIndex].meta.title;
          if (durationState && assetsInfo[lastIndex].meta.duration > 0) {
            duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
                                    <span class="schedule-text">
                                ${timeConvert(
                                  assetsInfo[lastIndex].meta.duration
                                )}</span>`;
          }
          card[0].addEventListener("click", () => {
            openDetails(id);
          });
          container.appendChild(nodesClone);
        }
      }
    }
    setAppTheme();
  };

  static init() {
    this.seeAllCardsRender(
      this.state.apiData,
      this.pointers.seeAllContainer,
      this.state.duration,
      () => {}
    );
  }
}