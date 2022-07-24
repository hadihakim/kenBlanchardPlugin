class ArticleRender {
  static state = {
    id: "",
    data: {},
    tabs: [],
    selectedNav: 'articleTab-0',
    articleDrawerItemsList: [
      { text: Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK, secondaryText: '', imageUrl: '', selected: false },
      { text: Strings.ARTICLE_SHORTCUTS_DRAWER_ADD_NOTE, secondaryText: '', imageUrl: '', selected: false },
      { text: Strings.ARTICLE_SHORTCUTS_DRAWER_SHARE, secondaryText: '', imageUrl: '', selected: false },
      { text: Strings.ARTICLE_SHORTCUTS_DRAWER_MARK_COMPLETE, secondaryText: '', imageUrl: '', selected: false }
    ],
    // noteIcon:"",
  

  }
  static pointers = {
    pageDetails: "pageDetails",
    articleTemplate: "articleTemplate",
    articleImage: "articleImage",
    articleTitle: "articleTitle",
    articleTitleContainer: "articleTitleContainer",
    articleTabHandler: "articleTabHandler",
    articleKeyTakeaways: "articleKeyTakeaways",
    articleFullArticle: "articleFullArticle",
    articleIcon: "articleIcon"
  }
  static setState = (id,data) => {
    this.state.id=id;
    this.state.data = data
  }
// to render the page with asset data & article template
  static render = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    const template = document.getElementById(this.pointers.articleTemplate);
    const firstClone = template.content.cloneNode(true);
    let image = firstClone.querySelectorAll(".articleImage");
    let title = firstClone.querySelectorAll(".articleTitle");
    let icon = firstClone.querySelectorAll(".articleIcon");
    let tabHandler = firstClone.querySelectorAll(".articleTabHandler");
    let articleKeyTakeaways = firstClone.querySelectorAll(".articleKeyTakeaways");
    let articleFullArticle = firstClone.querySelectorAll(".articleFullArticle");
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      this.state.data.meta.image,
      "full_width",
      "4:3"
    )}')`;
    title[0].innerHTML = this.state.data.meta.title;
  //  this.state.noteIcon = ui.createElement('span',title[0],"text_snippet",["material-icons","icon" , "hidden"])
  //  this.state.noteIcon.setAttribute('id','articleNoteIcon');
   
   // to check the enable tabs 
    if (this.state.data.showKeyTakeaways) {
      tabHandler[0].innerHTML = "";
      this.state.tabs = [];
      this.state.tabs.push(Strings.ARTICLE_TAP_KEY_TAKEAWAYS);
      // push it because it always enabled
      this.state.tabs.push(Strings.ARTICLE_TAP_FULL_ARTICLE);
      // tab text
      articleFullArticle[0].innerHTML = "Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development."
      articleKeyTakeaways[0].innerHTML = "The four stages of team development—Orientation, Dissatisfaction, Integration, and Productio Facilitate productive conversations  when con ndor and curiosity alive in your organization"
      //tab title 
      this.state.tabs.forEach((tab, index) => {
        let button = document.createElement("button");
        button.classList.add("mdc-tab", "mdc-tab--active");
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", "true");
        button.setAttribute("tabindex", index);
        let tabButtonContent = `
                        <span class="mdc-tab__content">
                          <span class="mdc-tab__text-label  headerText-AppTheme">${tab}</span>
                        </span>
                        <span class="mdc-tab-indicator">
                          <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline primaryTheme-border"></span>
                        </span>
                        <span class="mdc-tab__ripple"></span>
                      `;
        button.innerHTML = tabButtonContent;
        button.setAttribute('id', `articleTab-${index}`)
        // to add active tab style
        if (`articleTab-${index}` == this.state.selectedNav) {
          button.classList.add("articleSelectedNav");
        }
        // change the active tab
        button.addEventListener('click', () => {
          document.getElementById(this.state.selectedNav)?.classList.remove("articleSelectedNav");

          this.state.selectedNav = `articleTab-${index}`;
          button.classList.add("articleSelectedNav");
          //change the active text nested the active tab
          if (tab == 'FULL ARTICLE') {
            articleKeyTakeaways[0].classList.add("hidden");
            articleFullArticle[0].classList.remove("hidden");
          } else if (tab == 'KEY TAKEAWAYS') {
            articleKeyTakeaways[0].classList.remove("hidden");
            articleFullArticle[0].classList.add("hidden");
          }
        })
        tabHandler[0].appendChild(button);
      });

    // if the summery tab disable we need just to render the full article text
    } else {
      articleFullArticle[0].classList.remove("hidden");
      articleKeyTakeaways[0].classList.add("noMargin");
      articleFullArticle[0].innerHTML = "Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and developmentMost companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and developmentMost companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development...."
    }
    // show the drawer list when click the three dots
    icon[0].addEventListener("click", () => {
      PageDetails.openDrawerAudioOrVideoOrArticle(this.state.articleDrawerItemsList)
    });
    container.appendChild(firstClone);
    // this.hasNotes(title[0]);
    
    //for the app theme
    Utilities.setAppTheme();
  }


  // check if this article saved in the bookmarks if yes, change the text in drawer to delete it, if no, the drawer text will be to add the article to the bookmarks list
  static checkIsBookmarked = async() => {
    let allBookmarks=await getAllBookmarks();
    let filteredBookmarks=allBookmarks.filter(bookmark =>bookmark.id===this.state.data.id);
    filteredBookmarks.length>0?
      this.state.articleDrawerItemsList[0].text=Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK
      :
      this.state.articleDrawerItemsList[0].text=Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK
    ;
  };
  // static hasNotes =async(notIcon) => {
  //   let notes= await Utilities.assetsHasNotes(this.state.id);
  //  if(notes){
   
  //  this.state.noteIcon.classList.remove('hidden');
   
  //  }
  // }

  static init = (id,data) => {
    this.setState(id,data);
    this.render();
    this.checkIsBookmarked();
    // this.hasNotes();
  }
}