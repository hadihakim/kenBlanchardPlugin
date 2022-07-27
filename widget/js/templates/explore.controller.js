class Explore {
  static state = {
    data: [],
    userData: config.userConfig,
    userprofileData:{}
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

  static setPageData = (options) => {
    this.state = {...this.state, ...options};
   
  };

  static seeAllButton = (id, title, type) => {
    // section will be read from the HandleAPI class
    let data = HandleAPI.getDataByID(id, 'section');
    let seeAllState = {
      title: "see all",
      data: data,
      userData: authManager.currentUser,
      duration: true,
    };

    Navigation.openSeeAll(type, title, seeAllState);
  };

  // new render and print cards ----->
  static horizontal1_Render = (asset, container) => {
    const template = document.getElementById(this.pointers.forYouTemplate);
    const firstClone = template.content.cloneNode(true);
    let title = firstClone.querySelectorAll(".card-Text-Header");
    let note = firstClone.querySelectorAll(".card-Text-Note");
    let image = firstClone.getElementById("card_body");
    let card = firstClone.querySelectorAll(".mdc-card");
    title[0].innerHTML = asset.meta.title;
    note[0].innerHTML = asset.meta.description;
    image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${Utilities.cropImage(asset.meta.image)}')`;

    card[0].addEventListener("click", () => {
      Navigation.openPageDetails(asset.id, asset.meta.title,false);
    });
    container.appendChild(firstClone);
  }

  static horizontal_Render = (asset, container,pageType="") => {
  console.log("🚀 ~ file: explore.controller.js ~ line 59 ~ Explore ~ container", container)
    const nodesClone = recommendedTemplate.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let category = nodesClone.querySelectorAll(".category");
    let title = nodesClone.querySelectorAll(".title");
    let progressBarContainer = nodesClone.querySelectorAll(".progressBarContainer");
    let progress = nodesClone.querySelectorAll(".progressBar");
    let duration = nodesClone.querySelectorAll(".duration");
    let card = nodesClone.querySelectorAll(".mdc-card");
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      asset.meta.image
    )}')`;
    category[0].innerText = HandleAPI.getDataByID(asset.meta.topics[0], 'topic')?.title || '';
    title[0].innerText = asset.meta.title;
    if (asset.meta.duration > 0) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
					<span class="schedule-text bodyText-AppTheme">
						${Utilities.timeConvert(asset.meta.duration, "hh|mm")}</span>`;
    }
    
    if(pageType==="profile"){
      (asset.progress ? progress[0].style.width = `${asset.progress}%` : progress[0].style.width = "0%");
    }else{
      progressBarContainer[0].classList.add("hidden");
    }
    card[0].addEventListener("click", () => {
      Navigation.openPageDetails(asset.id, asset.meta.title,false);
    });
    container.appendChild(nodesClone);
  }

  static vertical_Render = (asset, container) => {
    const nodesClone = seeAllTemplate.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let title = nodesClone.querySelectorAll(".title");
    let duration = nodesClone.querySelectorAll(".duration");
    let description = nodesClone.querySelectorAll(".description");
    let card = nodesClone.querySelectorAll(".mdc-card");
    description[0].innerText = asset.meta.description;
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      asset.meta.image,
      "full_width",
      "4:3"
    )}')`;
    let id = asset.id;
    title[0].innerText = asset.meta.title;
    if (asset.meta.duration > 0) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
                                    <span class="schedule-text bodyText-AppTheme">
                                ${Utilities.timeConvert(asset.meta.duration, "hh|mm")}</span>`;
    }
    card[0].addEventListener("click", () => {
      Navigation.openPageDetails(asset.id, asset.meta.title,false);
    });
    container.appendChild(nodesClone);
  }

  static setCardsReady = (section, page) => {
    let sectionContainerId = page == 'main' ? `${section.id}-main` : `${section.id}-explore`;
    let sectionContainer = document.getElementById(sectionContainerId);
    let emptySection = true;

    // get all assets in the section
    let myAssets = [];
    section.assets.forEach(asset => {
      if(this.state.userprofileData[asset]){
        asset=this.state.userprofileData[asset].id
      }
      let returnedAsset = HandleAPI.state.data.assets_info[asset];
      if(returnedAsset){
        returnedAsset.id = asset;
        myAssets.push(returnedAsset);
      }
    })

    // sort all assets
    myAssets = Search.sort(myAssets);
    // loop through assets in the section to print cards
    myAssets.forEach(asset => {
      // check if the asset is included in the filter 
      // if the section is userSpecific it will not be affected with the filter
      let printCardState = (HandleAPI.handleFilter(asset.meta.topics) || section.userSpecific) 
      && !asset.isActive;
      if (printCardState) {
        emptySection = false;
        switch (section.layout) {
          case 'horizontal-1':
            this.horizontal1_Render(asset, sectionContainer);
            break;
          case 'horizontal':
            this.horizontal_Render(asset, sectionContainer);
            break;
          default:
            this.vertical_Render(asset, sectionContainer);
            break;
        }
      }
    })
    if(emptySection){
      // if the section is empty it will be removed
      let mainSectionRow = document.getElementById(`${section.id}-mainSectionRow-${page}`);
      mainSectionRow.remove();
    }
    // calling function to set the app theme 
    Utilities.setAppTheme();
  }

  static initContainers = (page) => {
    // all API data will be read from the HandleAPI class
    HandleAPI.state.data.sections.forEach(section => {
      // check if the section has assets 
      // if the section is userSpecific it will not appear in the explore page
      if (section.assets.length > 0 && ((page === 'explore' && !section.userSpecific) || page === 'main')) {
        let newSectionDiv = ui.createElement('div', page == 'main' ? sectionsContainer : exploreContainer, '', ['sectionContainer'], `${section.id}-mainSectionRow-${page}`);
        let newSectionHeader = ui.createElement('div', newSectionDiv, '', ['sectionHeader'], '');
        let newSectionTitle = ui.createElement('p', newSectionHeader, `Recommended ${section.title}`, ['sectionTitle', 'headerTextTheme', 'headerText-AppTheme'], '');
        let newSectionSeeAll = ui.createElement('p', newSectionHeader, 'See All', ['sectionTitle', 'defaultTheme', 'seeAllBtn', 'defaultlink-AppTheme'], '');
        let newSectionCardsContainer = ui.createElement('div', newSectionDiv, '', ['sectionCardsContainer', `${section.layout}`], page == 'main' ? `${section.id}-main` : `${section.id}-explore`);

        // if the section is userSpecific the title will appear without adding new words
        // if the section is userSpecific see all button will not appear
        if (section.userSpecific) {
          newSectionSeeAll.innerHTML = '';
          newSectionTitle.innerHTML = section.title;
        } else {
          newSectionSeeAll.addEventListener("click", () => {

            // see all is working on explore and main page
            this.seeAllButton(section.id, section.title, page);
          });
        }

        // calling function to print all cards in the pages
        this.setCardsReady(section, page);
      }
    })
  }

  static init = async() => {
    
    this.state.userprofileData=await HandleAPI.getUserData();
    sectionsContainer.innerHTML = '';
    exploreContainer.innerHTML = '';
    // init main page
    this.initContainers('main');

    // init explore page
    this.initContainers('explore');

    // init explore button
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
  }
}
