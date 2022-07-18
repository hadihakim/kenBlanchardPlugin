class ArticleRender{
    static state ={
        id:"",
        data:{},
        tabs: [],
        selectedNav: 'articleTab-0'
    }
    static pointers = {
        pageDetails:"pageDetails",
        articleTemplate:"articleTemplate",
        articleImage:"articleImage",
        articleTitle:"articleTitle",
        articleTitleContainer:"articleTitleContainer",
        articleTabHandler:"articleTabHandler",
        articleKeyTakeaways:"articleKeyTakeaways",
        articleFullArticle:"articleFullArticle",
        articleIcon:"articleIcon"
    }
    static setState =  (data) => {
        this.state.data =data
        console.log("Article data ->", data);
      }

    static render=()=>{
        let container = document.getElementById(this.pointers.pageDetails);
          const template = document.getElementById(this.pointers.articleTemplate);
          const firstClone = template.content.cloneNode(true);
          let image = firstClone.querySelectorAll(".articleImage");
          let title = firstClone.querySelectorAll(".articleTitle");
          let icon= firstClone.querySelectorAll(".articleIcon");
          let tabHandler= firstClone.querySelectorAll(".articleTabHandler");
          let articleKeyTakeaways= firstClone.querySelectorAll(".articleKeyTakeaways");
          let  articleFullArticle = firstClone.querySelectorAll(".articleFullArticle");
          image[0].style.backgroundImage = `url('${Utilities.cropImage(
            this.state.data.meta.image,
            "full_width",
            "4:3"
          )}')`;
          title[0].innerHTML = this.state.data.meta.title;

if(this.state.data.showKeyTakeaways){
  tabHandler[0].innerHTML="";
  this.state.tabs=[];
  this.state.tabs.push(Strings.ARTICLE_TAP_KEY_TAKEAWAYS);
  this.state.tabs.push(Strings.ARTICLE_TAP_FULL_ARTICLE);

    articleFullArticle[0].innerHTML="Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development."
    articleKeyTakeaways[0].innerHTML="The four stages of team development—Orientation, Dissatisfaction, Integration, and Productio Facilitate productive conversations  when con ndor and curiosity alive in your organization"
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
      if (`articleTab-${index}` == this.state.selectedNav) {
          button.classList.add("articleSelectedNav");
      }

      button.addEventListener('click', () => {
          document.getElementById(this.state.selectedNav)?.classList.remove("articleSelectedNav");

          this.state.selectedNav = `articleTab-${index}`;
          button.classList.add("articleSelectedNav");
          //     KEY TAKEAWAYS', 'FULL ARTICLE' articleKeyTakeaways  articleFullArticle
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
}else{
    articleFullArticle[0].classList.remove("hidden");
    articleKeyTakeaways[0].classList.add("noMargin");
    articleFullArticle[0].innerHTML="Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and developmentMost companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development Most companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and developmentMost companies want their employees to continue to grow and develop because they know employee growth benefits not only the individual but also the organization. For example, how would productivity change if an employee became a more effective communicator or learned to manage others using a coach approach? To foster employee growth and development, organizations often enroll people in training or provide them with a coach. What they don’t do enough of, however, is encourage the managers of these employees to support that growth and development...."
}

        icon[0].addEventListener("click", ()=>{
          let listItems = [{text: Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK, secondaryText: '', imageUrl:'', selected: false}, {text: Strings.VIDEO_SHORTCUTS_DRAWER_ADD_NOTE, secondaryText: '', imageUrl:'', selected: false}, {text: Strings.VIDEO_SHORTCUTS_DRAWER_SHARE, secondaryText: '', imageUrl:'', selected: false}, {text: Strings.VIDEO_SHORTCUTS_DRAWER_MARK_COMPLETE, secondaryText: '', imageUrl:'', selected: false}];
          PageDetails.openDrawerAudioOrVideoOrArticle(listItems)
        });

          container.appendChild(firstClone);
          Utilities.setAppTheme();
    }



    static init =  (data) => {
       this.setState(data);
        this.render();
      }
}