class SeeAll {
  static state = {
    title: "see all",
    data: {},
    userData: config.userConfig,
    renderedCards: [],
    pageType: "seeAll",
    duration: true,
    printedCards: 0,
    page: 1,
    pageSize: 7,
    fetchNext:true,
    scrollTime:300,
  };
  static pointers = {
    searchBar: "searchBar",
    searchSortIcon: "sortIcon",
    searchFilterIcon: "filterIcon",
    seeAllContainer: "seeAllContainer",
    seeAllTemplate: "seeAllTemplate",
  };

  /*
  options include =>
    - data: section object from API
    - duration: to check if cards contain duration and time
    - title: title will be print in the head of the page
    - userData: user profile data 
  */
  static setData = (options) => {
    this.state = {...this.state, ...options};
  };

  static lazyLoadHandler=Utilities._debounce(e=>{
    this.lazyLoad(e)
  },this.state.scrollTime);
  
  static seeAllCardsRender = () => {
    let seeAllContainer = document.getElementById(this.pointers.seeAllContainer);
    let myAssets = this.state.data.assets || [];

    this.state.renderedCards = []; 
    myAssets.forEach(asset => {
      this.state.renderedCards.push(HandleAPI.state.data.assets_info[asset]);
    })
    
    this.state.page = 1;
    seeAllContainer.innerHTML = '';
    seeAllContainer.addEventListener('scroll', (e)=>{
      this.lazyLoadHandler(e);
    });
    
    this.printCards();
  }

  static printCards = () => {

    let firstIndex = (this.state.page - 1) * this.state.pageSize;
    let lastIndex = this.state.page * this.state.pageSize;
    this.state.page += 1;

    if (lastIndex > this.state.renderedCards.length)
      lastIndex = this.state.renderedCards.length;

    let printArr = Search.sort(this.state.renderedCards);

    for(let i =firstIndex;i<lastIndex;i++){
      if(HandleAPI.handleFilter(printArr[i].meta.topics)){
        const nodesClone = seeAllTemplate.content.cloneNode(true);
        let image = nodesClone.querySelectorAll(".image");
        let title = nodesClone.querySelectorAll(".title");
        let duration = nodesClone.querySelectorAll(".duration");
        let description = nodesClone.querySelectorAll(".description");
        let card = nodesClone.querySelectorAll(".mdc-card");
        description[0].innerText = printArr[i].meta.description;
        image[0].style.backgroundImage = `url('${Utilities.cropImage(
          printArr[i].meta.image,
          "full_width",
          "4:3"
        )}')`;
        let id = printArr[i].id;
        title[0].innerText = printArr[i].meta.title;
        if (printArr[i].meta.duration > 0) {
          duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
                                  <span class="schedule-text bodyText-AppTheme">
                              ${Utilities.timeConvert(
            printArr[i].meta.duration, "hh|mm"
          )}</span>`;
        }
        card[0].addEventListener("click", () => {
          Navigation.openPageDetails(id, printArr[i].meta.title,false,false);
        });
        document.getElementById(this.pointers.seeAllContainer).appendChild(nodesClone);
      }
    }
    this.state.fetchNext = true;
  }

  static lazyLoad = (e) => {
    if (((e.target.scrollTop + e.target.offsetHeight) / e.target.scrollHeight > 0.80) && this.state.fetchNext) {
      this.state.fetchNext = false;
      this.printCards();
    }
  }

  static init(options) {
		this.setData(options);

    Skeleton.verticalSeeAll_Skeleton(seeAllContainer);

    const myTimeout = setTimeout(() => {
      this.seeAllCardsRender();
    }, 1000);

  }
}