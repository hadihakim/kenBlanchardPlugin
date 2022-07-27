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
    emptySearch: true,
    searchText: "",
    mostPopularState: false
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
    if (type === Strings.SORT_MOST_RECENT_TEXT) {
      data.sort((a, b) => {
        if (new Date(a.meta.createdOn) < new Date(b.meta.createdOn)) {
          return -1;
        }
        if (new Date(a.meta.createdOn) > new Date(b.meta.createdOn)) {
          return 1;
        }
      });
    }else if (type === Strings.SORT_MOST_POPULAR_TEXT) {
      data.sort((a, b) => {
        if (a.meta.views > b.meta.views) {
          return -1;
        }
        if (a.meta.views < b.meta.views) {
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
          this.runSortFilterResult();
        });
      });
      // Utilities.setAppTheme();
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
          this.trendingRender();
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
     async (err, result) => {
        if (err) return console.error(err);
        if (result) {
          if (result.text===Strings.SORT_MOST_POPULAR_TEXT && !this.state.mostPopularState) {
            // mostPopular.views
            let mostPopularAssets=await HandleAPI.getStats();
            for (const key in mostPopularAssets.views) {
              if (Object.hasOwnProperty.call( mostPopularAssets.views, key)) {
                const element =  mostPopularAssets.views[key];
                HandleAPI.state.data.assets_info[key].meta.views=element;
              }
            }
            this.state.mostPopularState=true;
          }
          buildfire.components.drawer.closeDrawer();
          this.state.sortType = result.text;
          this.runSortFilterResult();
        }
      }
    );
  };

  static runSortFilterResult = () => {

    // run the skeleton before showing the data
    this.state.data.data.sections.forEach((element) => {
      const container = document.getElementById(
        `${element.id}-main`
      );
      if (element.layout == "horizontal-1" && container) {
        Skeleton.horizontal1_Skeleton(container);
      } else if (element.layout == "horizontal" && container) {
        Skeleton.horizontal_Skeleton(container);
      } else if (container) {
        Skeleton.verticalSeeAll_Skeleton(container);
      }
    });
    this.state.data.data.sections.forEach((element) => {
      const container = document.getElementById(
        `${element.id}-explore`
      );
      if (element.layout == "horizontal-1" && container) {
        Skeleton.horizontal1_Skeleton(container);
      } else if (element.layout == "horizontal" && container) {
        Skeleton.horizontal_Skeleton(container);
      } else if (container) {
        Skeleton.verticalSeeAll_Skeleton(container);
      }
    });
    // render the data in the ui
    setTimeout(() => {
      Explore.init();
    }, 300);


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
    let searchedData = e.target.value.trim("");
    this.state.searchText = searchedData;
    this.state.page = 1;

    Navigation.openSearch();

    this.state.renderedCards = [];
    let allAssets = this.state.data.data.assets_info;
    for (const asset in allAssets) {
      if (this.hasSearch(allAssets[asset])) {
        let returnedObj = allAssets[asset];
        returnedObj.id = asset

        this.state.renderedCards.push(returnedObj);
      }
    }
    document.getElementById(this.pointers.searchContainer).innerHTML = '';
    this.state.emptySearch = true;
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
    let printedAssetAtt = this.sort(this.state.renderedCards);

    for (let i = firstIndex; i < lastIndex; i++) {
      if (HandleAPI.handleFilter(printedAssetAtt[i].meta.topics)) {
        this.state.emptySearch = false;
        const nodesClone = document.getElementById(this.pointers.seeAllTemplate).content.cloneNode(true);

        let image = nodesClone.querySelectorAll(".image");
        let title = nodesClone.querySelectorAll(".title");
        let duration = nodesClone.querySelectorAll(".duration");
        let description = nodesClone.querySelectorAll(".description");
        let card = nodesClone.querySelectorAll(".mdc-card");
        description[0].innerText = printedAssetAtt[i].meta.description;
        image[0].style.backgroundImage = `url('${Utilities.cropImage(
          printedAssetAtt[i].meta.image,
          "full_width",
          "4:3"
        )}')`;
        let id = printedAssetAtt[i].id;
        title[0].innerText = printedAssetAtt[i].meta.title;
        if (printedAssetAtt[i].meta.duration > 0) {
          duration[0].innerHTML = `<span class="iconsTheme material-icons icon schedule-icon"> schedule </span>
                                  <span class="schedule-text bodyText-AppTheme">
                              ${Utilities.timeConvert(
            printedAssetAtt[i].meta.duration, "hh|mm"
          )}</span>`;
        }
        card[0].addEventListener("click", () => {
          Navigation.openPageDetails(id, printedAssetAtt[i].meta.title,false);
        });
        document.getElementById(this.pointers.searchContainer).appendChild(nodesClone);
      }
    }
    if (this.state.emptySearch) {
      Utilities.showEmpty(document.getElementById(this.pointers.searchContainer));
    }
    this.state.fetchNext = true;
    // Utilities.setAppTheme();
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
      Skeleton.verticalSeeAll_Skeleton(searchContainer);
      searchInputHandler(e)
    });
    const searchInputHandler = Utilities._debounce(e => {
      this.search(e)
    }, this.state.searchTime);
    this.trendingRender(this.state.data, "trendingContainer");
  };
}