class summaryRender {
  static state = {
    id: "",
    data: {},
    chapterData: {},
  };

  static pointers = {
    pageDetails: "pageDetails",
    graphicalSummariesFirstPage: "graphicalSummariesFirstPage",
    graphicalSummariesSecondPage: "graphicalSummariesSecondPage",
    graphicalSummariesThirdPage: "graphicalSummariesThirdPage",
    graphicalSummariesFourthPage: "graphicalSummariesFourthPage",
  };
  static setData = (id, data) => {
    this.state.data = data;
    this.state.id = id;
  };

  static graphicalSummariesFirstPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    const template = document.getElementById(
      this.pointers.graphicalSummariesFirstPage
    );
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let subTitle = nodesClone.querySelectorAll(".subtitle");
    let description = nodesClone.querySelectorAll(".description");
    let chaptersList = nodesClone.querySelectorAll(".chapters-list");
    topImage[0].style.backgroundImage = `url('${Utilities.cropImage(
      this.state.data.meta.image
    )}')`;
    title[0].innerText = this.state.data.meta.title;
    subTitle[0].innerText = Strings.GRAPHICAL_DESCRIPTION_TEXT;
    description[0].innerText = this.state.data.meta.description;
    this.state.data.chapters.forEach((chapter) => {
      let li = document.createElement("li");
      li.classList.add("chapter-item");
      let innerHTML = `
                  <h6 class="chapter-title bodyText-AppTheme">${
                    chapter.title
                  }</h6>
                  <div class="sub-chapter-item">
                    <span class="chapter-subtitle headerText-AppTheme">${
                      chapter.subTitle
                    }</span>
                    ${
                      chapter.premium
                        ? '<label for="searchInput" class="material-icons icon">lock</label>'
                        : ""
                    }
      
                  </div>
                  <div class="bar holderPercentage"></div>
                  `;
      li.innerHTML = innerHTML;
      chaptersList[0].appendChild(li);
      li.addEventListener("click", () => {
        buildfire.history.push(chapter.subTitle, {
          showLabelInTitlebar: true,
          from: "page detail from chapter",
          id: this.state.id,
          title: chapter.subTitle,
          data: this.state.data,
        });
        // buildfire.history.push("page detail from chapter",{id:this.state.id});
        this.state.chapterData = chapter;
        chapter.premium
          ? this.graphicalSummariesFourthPage()
          : this.graphicalSummariesSecondPage();
      });
    });

    container.appendChild(nodesClone);
    // Utilities.setAppTheme();
  };

  static graphicalSummariesSecondPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(
      this.pointers.graphicalSummariesSecondPage
    );
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let subtitle = nodesClone.querySelectorAll(".subtitle");
    let startChapter = nodesClone.getElementById("startChapter");
    let startChapterLabel = nodesClone.querySelectorAll(".mdc-button__label");
    startChapterLabel[0].innerText = Strings.START_CHAPTER;
    startChapter.addEventListener("click", () => {
      this.graphicalSummariesThirdPage();
      Stats.incrementViews(this.state.id, (err, res) => {
        if (err) return console.log(err);
      })
    });
    topImage[0].src = Utilities.cropImage(this.state.chapterData.chapterImage);
    title[0].innerText = this.state.chapterData.title;
    subtitle[0].innerText = this.state.chapterData.subTitle;
    container.appendChild(nodesClone);
    // Utilities.setAppTheme();
  };

  static graphicalSummariesThirdPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(
      this.pointers.graphicalSummariesThirdPage
    );
    const nodesClone = template.content.cloneNode(true);
    const splideList = nodesClone.querySelectorAll(".splide__list");
    this.state.chapterData.pages.forEach((page) => {
      let li = document.createElement("li");
      li.classList.add("splide__slide");
      let innerHTML = `
                  <div class="content-item">
                      <img
                        src="${Utilities.cropImage(page.pageImage)}"
                        alt=""
                        class="top-image"
                        loading="lazy"
                      />
                      <div class="text-content">
                        <p class="bodyText-AppTheme">
                          ${page.pageContent}
                        </p>
                      </div>
                    </div>
                  `;
      li.innerHTML = innerHTML;
      splideList[0].appendChild(li);
    });
    container.appendChild(nodesClone);
    Utilities.splideInit({hasProgressBar:true});
    // Utilities.setAppTheme();
  };

  static graphicalSummariesFourthPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(
      this.pointers.graphicalSummariesFourthPage
    );
    const nodesClone = template.content.cloneNode(true);
    let title = nodesClone.querySelector(".title");
    let bodyText = nodesClone.querySelector(".body-text");
    let planTitle = nodesClone.querySelector(".plan-title");
    let plan1Title = nodesClone.querySelector(".plan-1-title");
    let plan1Subtitle = nodesClone.querySelector(".plan-1-subtitle");
    let plan2Title = nodesClone.querySelector(".plan-2-title");
    let plan2DiscountText = nodesClone.querySelector(".plan-2-discount-text");
    let plan2Subtitle = nodesClone.querySelector(".plan-2-subtitle");

    title.innerText = Strings.GRAPHICAL_PREMIUM_TITLE;
    bodyText.innerHTML = Strings.GRAPHICAL_PREMIUM_BODY_TEXT;
    planTitle.innerText = Strings.GRAPHICAL_PREMIUM_PLANS_TITLE;
    plan1Title.innerText = Strings.GRAPHICAL_PREMIUM_PLAN_1_TITLE;
    plan1Subtitle.innerText = Strings.GRAPHICAL_PREMIUM_PLAN_1_SUBTITLE;
    plan2Title.innerText = Strings.GRAPHICAL_PREMIUM_PLAN_2_TITLE;
    plan2Subtitle.innerText = Strings.GRAPHICAL_PREMIUM_PLAN_2_DISCOUNT_TEXT;
    plan2DiscountText.innerText = Strings.GRAPHICAL_PREMIUM_PLAN_2_SUBTITLE;
    container.appendChild(nodesClone);
    // Utilities.setAppTheme();
  };
  static render = () => {
    let pageDetails = document.getElementById(this.pointers.pageDetails);
    pageDetails.innerHTML = "";
    this.graphicalSummariesFirstPage();
  };

  static init = (id, data) => {
    this.setData(id, data);
    this.render();
  };
}
