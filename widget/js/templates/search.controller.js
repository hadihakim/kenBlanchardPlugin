class Search {
  static state = {
    data: fakeData,
    trendingArr: [],
    filterArr: [],
    filterTopic: [],
    sortType: "Default",
    page: 1,
    pageSize: 6,
    searchTime: 300,
    renderedCards: [],
    fetchNext: true,
    emptySearch:true,
    searchText:""
  };

  static pointers = {
    searchBar: "searchBar",
    searchIcon: "searchIcon",
    searchInput: "search-input",
    sortIcon: "sortIcon",
    filterIcon: "filterIcon",
    seeAllContainer: "seeAllContainer",
    trendingContainer: "trendingContainer",
    trendingTemplate: "trendingTemplate",
    seeAllTemplate: "seeAllTemplate",
    mainContainer: "mainContainer",
    searchContainer: "searchContainer",
    dot: "dot",
  };

  static setData = (data) => {
    this.setFilteredTopic(data);
    this.state.data = data;
  };

  static hasSearch = (data) => {
    return (
      this.state.searchText == "" ||
      data.meta.title.toLowerCase().search(this.state.searchText.toLowerCase()) >= 0 ||
      data.meta.description.toLowerCase().search(this.state.searchText.toLowerCase()) >=
      0
    );
  };

  static setFilteredTopic = (apiData) => {
    apiData.data.topics.forEach((topic) => {
      if (topic.isActive) {
        this.state.filterTopic.push(topic.title);
      }
      if (topic.isTrending) {
        this.state.trendingArr.push(topic.title);
      }
    });
  };

  static sort = (data, type = this.state.sortType) => {
    if (type === "Most Recent") {
      data.sort((a, b) => {
        if (a.meta.createdOn < b.meta.createdOn) {
          return -1;
        }
        if (a.meta.createdOn > b.meta.createdOn) {
          return 1;
        }
      });
    }
    return data;
  };

  static trendingRender = () => {
    const container = document.getElementById(this.pointers.trendingContainer);
    if (container) {
      container.innerHTML = "";
      const trendingTemplate = document.getElementById(
        this.pointers.trendingTemplate
      );

      this.state.trendingArr.forEach((trendingTopic) => {
        const nodesClone = trendingTemplate.content.cloneNode(true);
        let title = nodesClone.getElementById("trending-span");
        title.innerHTML = trendingTopic;
        container.appendChild(nodesClone);

        if (this.state.filterArr.indexOf(trendingTopic) > -1) {
          title.classList.add("selectedTrending");
        } else {
          title.classList.add("unSelectedTrending");
        }

        title.addEventListener("click", () => {
          if (this.state.filterArr.indexOf(trendingTopic) > -1) {
            title.classList.remove("selectedTrending");
            title.classList.add("unSelectedTrending");
            this.state.filterArr.splice(
              this.state.filterArr.indexOf(trendingTopic),
              1
            );
          } else {
            title.classList.add("selectedTrending");
            title.classList.remove("unSelectedTrending");
            this.state.filterArr.push(trendingTopic);
          }
          this.state.data.data.sections.forEach((element) => {
            if (element.isExplore) {
              const container = document.getElementById(
                `${element.id}-container-explore`
              );
              if (element.layout == "horizontal-1") {
                Skeleton.horizontal1_Skeleton(container);
              } else {
                Skeleton.horizontal_Skeleton(container);
              }
            }
            const myTimeout = setTimeout(() => {
              Explore.filterAndPrintData(this.state.data, element, "explore");
            }, 1000);
          });
        });
      });
      Utilities.setAppTheme();
    }
  };

  static filterDrawer = () => {
    config.renderedCard = 0;
    config.page = 1;
    config.lastIndex = 0;
    buildfire.components.drawer.open(
      {
        content: Strings.FILTER_TITLE,
        multiSelection: true,
        allowSelectAll: true,
        multiSelectionActionButton: { text: Strings.APPLY_FILTER },
        enableFilter: true,
        isHTML: true,
        triggerCallbackOnUIDismiss: false,
        autoUseImageCdn: true,
        listItems: this.state.filterTopic.map((topic) => {
          return {
            text: topic,
            selected: this.state.filterArr.includes(topic),
          };
        }),
      },
      (err, result) => {
        if (err) return console.error(err);
        if (result) {
          this.state.filterArr = [];
          result.forEach((topic) => {
            this.state.filterArr.push(topic.text);
          });

          const dot = document.getElementById(this.pointers.dot);
          if (this.state.filterArr.length == this.state.filterTopic.length) {
            dot.classList.add("hidden");
          } else {
            dot.classList.remove("hidden");
          }
          this.runSortFilterResult();
        }
      }
    );
  };

  static sortDrawer = () => {
    config.renderedCard = 0;
    config.page = 1;
    config.lastIndex = 0;
    buildfire.components.drawer.open(
      {
        content: Strings.SORT_TITLE,
        multiSelection: false,
        allowSelectAll: false,
        enableFilter: true,
        multiSelectionActionButton: { text: Strings.APPLY_SORT },
        isHTML: true,
        triggerCallbackOnUIDismiss: true,
        autoUseImageCdn: true,
        listItems: [
          { text: Strings.SORT_DEFAULT_TEXT, selected: true },
          { text: Strings.SORT_MOST_POPULAR_TEXT, selected: false },
          { text: Strings.SORT_MOST_RECENT_TEXT, selected: false },
        ],
      },
      (err, result) => {
        if (err) return console.error(err);
        if (result) {
          buildfire.components.drawer.closeDrawer();
          this.state.sortType = result.text;

          this.runSortFilterResult();
        }
      }
    );
  };

  static runSortFilterResult = () => {
    this.state.data.data.sections.forEach((element) => {
      const container = document.getElementById(
        `${element.id}-container-main`
      );
      if (element.layout == "horizontal-1") {
        Skeleton.horizontal1_Skeleton(container);
      } else if(element.layout == "horizontal") {
        Skeleton.horizontal_Skeleton(container);
      }else{
        Skeleton.verticalSeeAll_Skeleton(container);
      }
      const myTimeout = setTimeout(() => {
        Explore.filterAndPrintData(this.state.data, element, "main");
      }, 1000);
    });

    this.state.data.data.sections.forEach((element) => {
      // if (element.isExplore) {
      const container = document.getElementById(
        `${element.id}-container-explore`
      );
      if (element.layout == "horizontal-1") {
        Skeleton.horizontal1_Skeleton(container);
      } else if(element.layout == "horizontal") {
        Skeleton.horizontal_Skeleton(container);
      }else{
        Skeleton.verticalSeeAll_Skeleton(container);
      }
      // }
      const myTimeout = setTimeout(() => {
        Explore.filterAndPrintData(this.state.data, element, "explore");
      }, 1000);
    });

    if (Navigation.state.activeLayOut === 'see all') {
      document.getElementById(this.pointers.seeAllContainer).innerHTML = '';
      Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
      setTimeout(() => {
        config.renderedCard = 0;
        SeeAll.seeAllCardsRender();
      }, 300)
    }

    if (Navigation.state.activeLayOut === 'search') {
      this.state.page = 1;
      Skeleton.verticalSeeAll_Skeleton(searchContainer);
      setTimeout(() => {
        document.getElementById(this.pointers.searchContainer).innerHTML = '';
        this.printSearchedCards();
      }, 300)
    }
  }

  static search = (e) => {
    let searchedData = e.target.value;
    this.state.searchText = searchedData;
    this.state.page = 1;

    Navigation.openSearch();
    Skeleton.verticalSeeAll_Skeleton(searchContainer);

    this.state.renderedCards = [];
    let allAssets = this.state.data.data.assets_info;
    for (const asset in allAssets) {
      if (this.hasSearch(allAssets[asset])) {
        this.state.renderedCards.push(allAssets[asset])
      }
    }
    document.getElementById(this.pointers.searchContainer).innerHTML = '';
    this.state.emptySearch=true;
    this.printSearchedCards();
    document.getElementById(this.pointers.searchContainer).addEventListener('scroll', (e) => this.lazyLoad(e))
  };

  static printSearchedCards = () => {
    let firstIndex = (this.state.page - 1) * this.state.pageSize;
    let lastIndex = this.state.page * this.state.pageSize;
    if (lastIndex > this.state.renderedCards.length) {
      lastIndex = this.state.renderedCards.length;
    }

    this.state.page += 1;
    this.state.renderedCards = this.sort(this.state.renderedCards, this.state.sortType);
    
    for (let i = firstIndex; i < lastIndex; i++) {
      if (HandleAPI.handleFilter(this.state.renderedCards[i].meta.topics)) {
        this.state.emptySearch = false;
        const nodesClone = document.getElementById(this.pointers.seeAllTemplate).content.cloneNode(true);

        let image = nodesClone.querySelectorAll(".image");
        let title = nodesClone.querySelectorAll(".title");
        let duration = nodesClone.querySelectorAll(".duration");
        let description = nodesClone.querySelectorAll(".description");
        let card = nodesClone.querySelectorAll(".mdc-card");
        description[0].innerText = this.state.renderedCards[i].meta.description;
        image[0].style.backgroundImage = `url('${Utilities.cropImage(
          this.state.renderedCards[i].meta.image,
          "full_width",
          "4:3"
        )}')`;
        let id = this.state.renderedCards[i].id;
        title[0].innerText = this.state.renderedCards[i].meta.title;
        if (this.state.renderedCards[i].meta.duration > 0) {
          duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
                                  <span class="schedule-text bodyText-AppTheme">
                              ${Utilities.timeConvert(
            this.state.renderedCards[i].meta.duration, "min"
          )}</span>`;
        }
        card[0].addEventListener("click", () => {
          Navigation.openPageDetails(id, this.state.renderedCards[i].meta.title);
        });
        document.getElementById(this.pointers.searchContainer).appendChild(nodesClone);
      }
    }
    if(this.state.emptySearch){
      console.log("Empty will be shown --->");
      Utilities.showEmpty(document.getElementById(this.pointers.searchContainer));
    }
    this.state.fetchNext = true;
  }

  static lazyLoad = (e) => {
    if (((e.target.scrollTop + e.target.offsetHeight) / e.target.scrollHeight > 0.80) && this.state.fetchNext) {
      this.state.fetchNext = false;
      this.printSearchedCards();
    }
  }

  static init = () => {
    let filterIcon = document.getElementById(this.pointers.filterIcon);
    filterIcon.addEventListener("click", this.filterDrawer);

    let sortIcon = document.getElementById(this.pointers.sortIcon);
    sortIcon.addEventListener("click", this.sortDrawer);

    let input = document.getElementById(this.pointers.searchInput);

    input.addEventListener("keyup", (e) =>{
      searchInputHandler(e)
    });
    const searchInputHandler=Utilities._debounce(e=>{
      this.search(e)
    },this.state.searchTime);
    this.trendingRender(this.state.data, "trendingContainer");
  };
}