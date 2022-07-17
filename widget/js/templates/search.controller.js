class Search {
  static state = {
    data: fakeData,
    trendingArr: [],
    filterArr: [],
    filterTopic:[],
    sortType: "Default",
  };

  static setData = (data) => {
    this.setFilteredTopic(data);
    this.state.data = data;
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
    dot:"dot"
  };

  static hasSearch = (data) => {
    return (
      config.search == "" ||
      data.meta.title.toLowerCase().search(config.search.toLowerCase()) >= 0 ||
      data.meta.description.toLowerCase().search(config.search.toLowerCase()) >=
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
  static sort = (data, type) => {
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
  static searchCardsRender = (container, callback) => {
    if (config.renderedCard === 0) {
      config.page = 1;
      config.lastIndex = 0;
      document.getElementById(this.pointers.seeAllContainer).innerHTML = "";
    }
    let assetsInfo = [];
    const seeAllTemplate = document.getElementById(
      this.pointers.seeAllTemplate
    );
    this.state.data.data.sections.forEach((element) => {
      element.assets.forEach((assetId) => {
        let assetData = this.state.data.data.assets_info[assetId];
        assetData.id = assetId;
        assetsInfo.push(assetData);
      });
    });
    assetsInfo = this.sort(assetsInfo, this.state.sortType);
    if (config.lastIndex >= assetsInfo.length) {
      return;
    }
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
        console.log("first log", config.lastIndex, " ", config.page);
        if (config.renderedCard == 0) {
          Navigation.openEmptySearch();
        } else {
          Navigation.openSearch();
        }
        return;
      } else {
        let topicIdArray = assetsInfo[lastIndex].meta.topics;
        let printCard = HandleAPI.handleFilter(topicIdArray) && this.hasSearch(assetsInfo[lastIndex])
       
        if (printCard) {
          config.renderedCard++;
          const nodesClone = seeAllTemplate.content.cloneNode(true);
          let image = nodesClone.querySelectorAll(".image");
          let title = nodesClone.querySelectorAll(".title");
          let duration = nodesClone.querySelectorAll(".duration");
          let description = nodesClone.querySelectorAll(".description");
          let card = nodesClone.querySelectorAll(".mdc-card");
          description[0].innerText = assetsInfo[lastIndex].meta.description;
          image[0].style.backgroundImage = `url('${Utilities.cropImage(
            assetsInfo[lastIndex].meta.image,
            "full_width",
            "4:3"
          )}')`;
          let id = assetsInfo[lastIndex].id;
          title[0].innerText = assetsInfo[lastIndex].meta.title;
          if (assetsInfo[lastIndex].meta.duration > 0) {
            duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
							<span class="schedule-text bodyText-AppTheme">
						${Utilities.timeConvert(assetsInfo[lastIndex].meta.duration, "sec", "hh|mm")}</span>`;
          }
          card[0].addEventListener("click", () => {
            Navigation.openPageDetails(id, assetsInfo[lastIndex].meta.title);
          });
          container.appendChild(nodesClone);
        }
      }
    }
    Utilities.setAppTheme();
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
          
          const dot= document.getElementById(this.pointers.dot);
          if(this.state.filterArr.length == this.state.filterTopic.length){
            dot.classList.add("hidden");
          }else{
            dot.classList.remove("hidden");
          }

          this.state.data.data.sections.forEach((element) => {
            const container = document.getElementById(
              `${element.id}-container-main`
            );
            if (element.layout == "horizontal-1") {
              Skeleton.horizontal1_Skeleton(container);
            } else {
              Skeleton.horizontal_Skeleton(container);
            }
            const myTimeout = setTimeout(() => {
              Explore.filterAndPrintData(this.state.data, element, "main");
            }, 1000);
          });

          this.state.data.data.sections.forEach((element) => {
            console.log('check element in filter', element);
            /*Condition was element.isExplore */
            if (element.isActive) {
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

          let seeAllContainer = document.getElementById(
            this.pointers.seeAllContainer
          );
          if (!seeAllContainer.classList.contains("hidden")) {
            if (
              config.searchFrom == "from-explore" ||
              config.searchFrom == "from-main"
            ) {
              Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
              const myTimeout = setTimeout(() => {
                this.searchCardsRender(seeAllContainer, () => {});
              }, 1000);
            } else if (config.searchFrom == "from-see-all") {
              Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
              const myTimeout = setTimeout(() => {
                SeeAll.seeAllCardsRender(this.state.data,this.pointers.seeAllContainer, true, () => {});
              }, 1000);
            }
          }
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
          this.state.data.data.sections.forEach((element) => {
            const container = document.getElementById(
              `${element.id}-container-main`
            );
            if (element.layout == "horizontal-1") {
              Skeleton.horizontal1_Skeleton(container);
            } else {
              Skeleton.horizontal_Skeleton(container);
            }
            const myTimeout = setTimeout(() => {
              Explore.filterAndPrintData(this.state.data, element, "main");
            }, 1000);
          });

          this.state.data.data.sections.forEach((element) => {
            /*condition was element.isExplore */
            if (element.isActive) {
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

          if (!seeAllContainer.classList.contains("hidden")) {
            if (
              config.searchFrom == "from-explore" ||
              config.searchFrom == "from-main"
            ) {
              Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
              const myTimeout = setTimeout(() => {
                this.searchCardsRender(seeAllContainer, () => {});
              }, 1000);
            } else if (config.searchFrom == "from-see-all") {
              Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
              const myTimeout = setTimeout(() => {
                SeeAll.seeAllCardsRender(this.state.data,this.pointers.seeAllContainer, true, () => {});
              }, 1000);
            }
          }
        }
      }
    );
  };

  static search = () => {
    config.page = 1;
    config.lastIndex = 0;
    config.renderedCard = 0;
      setTimeout(() => {
      let input = document.getElementById(this.pointers.searchInput);
      config.search = input.value;

      if (
        config.searchFrom == "from-explore" ||
        config.searchFrom == "from-main"
      ) {
        if(Navigation.state.searchOpened){
           Navigation.openSearch();
           Navigation.setData(false);
        }
        
        Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
        const myTimeout = setTimeout(() => {
          this.searchCardsRender(seeAllContainer, () => {});
        }, 1000);
      } else if (config.searchFrom == "from-see-all") {
        Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
        const myTimeout = setTimeout(() => {
          SeeAll.seeAllCardsRender(this.state.data,this.pointers.seeAllContainer, true, () => {});
        }, 1000);
      }
    }, 300);
    
  };

  static init = () => {
    let filterIcon = document.getElementById(this.pointers.filterIcon);
    filterIcon.addEventListener("click", this.filterDrawer);

    let sortIcon = document.getElementById(this.pointers.sortIcon);
    sortIcon.addEventListener("click", this.sortDrawer);

    let input = document.getElementById(this.pointers.searchInput);
    input.addEventListener("keyup", this.search);
    this.trendingRender(this.state.data, "trendingContainer");
  };
}
