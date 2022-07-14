class PageDetails {
  static state = {
    id: "",
    data: {},
    chapterData: {}
  }
  static pointers = {
    pageDetails: "pageDetails",
    detailsPageTemplate: "detailsPageTemplate",
    graphicalSummariesFirstPage: "graphicalSummariesFirstPage",
    graphicalSummariesSecondPage: "graphicalSummariesSecondPage",
    graphicalSummariesThirdPage: "graphicalSummariesThirdPage",
    graphicalSummariesFourthPage: "graphicalSummariesFourthPage"
  }
  static setState = async (id) => {
    this.state.id = id;
    let newRes = await HandleAPI.getDataByID(id, "assets_info")
    this.state.data = newRes.data
  }

  static graphicalSummariesFirstPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    const template = document.getElementById(this.pointers.graphicalSummariesFirstPage);
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let subTitle = nodesClone.querySelectorAll(".subtitle");
    let description = nodesClone.querySelectorAll(".description");
    let chaptersList = nodesClone.querySelectorAll(".chapters-list");
    topImage[0].style.backgroundImage = `url('${Utilities.cropImage(this.state.data.meta.image)}')`;
    title[0].innerText = this.state.data.meta.title;
    subTitle[0].innerText = Strings.GRAPHICAL_DESCRIPTION_TEXT;
    description[0].innerText = this.state.data.meta.description;
    this.state.data.chapters.forEach((chapter) => {
      let li = document.createElement("li");
      li.classList.add("chapter-item");
      let innerHTML = `
              <h6 class="chapter-title bodyText-AppTheme">${chapter.title}</h6>
              <div class="sub-chapter-item">
                <span class="chapter-subtitle headerText-AppTheme">${chapter.subTitle}</span>
                ${chapter.premium
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
        });
        // buildfire.history.push("page detail from chapter",{id:this.state.id});
        this.state.chapterData = chapter;
        this.graphicalSummariesSecondPage();
      });
    });

    container.appendChild(nodesClone);
    Utilities.setAppTheme();
  };

  static graphicalSummariesSecondPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(this.pointers.graphicalSummariesSecondPage);
    const nodesClone = template.content.cloneNode(true);
    let topImage = nodesClone.querySelectorAll(".top-image");
    let title = nodesClone.querySelectorAll(".title");
    let subtitle = nodesClone.querySelectorAll(".subtitle");
    let startChapter = nodesClone.getElementById("startChapter");
    let startChapterLabel = nodesClone.querySelectorAll(".mdc-button__label");
    startChapterLabel[0].innerText = Strings.START_CHAPTER;
    startChapter.addEventListener("click", () => {
      this.graphicalSummariesThirdPage();
    });
    topImage[0].src = Utilities.cropImage(this.state.chapterData.chapterImage);
    title[0].innerText = this.state.chapterData.title;
    subtitle[0].innerText = this.state.chapterData.subTitle;
    container.appendChild(nodesClone);
    Utilities.setAppTheme();
  };

  static graphicalSummariesThirdPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(this.pointers.graphicalSummariesThirdPage);
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
    Utilities.splideInit();
    Utilities.setAppTheme();
  };

  static graphicalSummariesFourthPage = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    container.innerHTML = "";
    const template = document.getElementById(this.pointers.graphicalSummariesFourthPage);
    const nodesClone = template.content.cloneNode(true);
    container.appendChild(nodesClone);
    Utilities.setAppTheme();
  };
  static detailsRender = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    if (this.state.data.type === "summary") {
      this.graphicalSummaries();
    } else if (this.state.data.type === "course") {
      const template = document.getElementById(this.pointers.detailsPageTemplate);
      const firstClone = template.content.cloneNode(true);
      let image = firstClone.querySelectorAll(".details-img");
      let title = firstClone.querySelectorAll(".details-title");
      let duration = firstClone.querySelectorAll(".duration-details");
      let startButton = firstClone.querySelectorAll(".mdc-button");
      let startCourse = firstClone.querySelectorAll(".startCourse");
      let descriptionTitle = firstClone.querySelectorAll(".description-title");
      let descriptionText = firstClone.querySelectorAll(".description-text");
      let learnTitle = firstClone.querySelectorAll(".learn-title");
      let lessonTitle = firstClone.querySelectorAll(".lesson-title");
      let learnItem = firstClone.querySelectorAll(".lesson-list");
      let lessonItem = firstClone.querySelectorAll(".learn-list");
      // give the button inner text -->
      startCourse[0].innerHTML = Strings.START_COURSE;
      startButton[0].addEventListener("click", () => Navigation.openCourseDetails(this.state.id, this.state.data.title));
      image[0].style.backgroundImage = `url('${Utilities.cropImage(
        this.state.data.meta.image,
        "full_width",
        "4:3"
      )}')`;
      title[0].innerHTML = this.state.data.meta.title;
      if (this.state.data.meta.duration) {
        duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id= "scheduleIcon2"> schedule </span>
                              <span class="schedule-text bodyText-AppTheme">
                          ${Utilities.timeConvert(this.state.data.meta.duration, "min")}</span>`;
      }
      descriptionTitle[0].innerHTML = Strings.COURSE_DETAILS_DESCRIPTION;
      descriptionText[0].innerHTML =
        "When one of your team members is at the Disillusioned learner stage on a goal, they have some knowledge and skills but are not yet competent. They can easily get stuck, become discouraged, and even feel ready to quit. Their commitment is low.";
      learnTitle[0].innerHTML = Strings.COURSE_DETAILS_LEARN_LIST;
      lessonTitle[0].innerHTML = Strings.COURSE_DETAILS_Lessons_LIST;
      for (let i = 0; i < 4; i++) {
        ui.createElement(
          "li",
          lessonItem[0],
          "Introduction to the Course Focus",
          ["lesson-list-item"],
          `lesson-list-item${i}`
        );
      }
      for (let i = 0; i < 4; i++) {
        ui.createElement(
          "li",
          learnItem[0],
          "Someone to listen to their concerns",
          ["learn-list-item"],
          `learn-list-item${i}`
        );
      }
      container.appendChild(firstClone);
    }
    else if (this.state.data.type === "audio") {
      // console.log("data >>",this.state.data);
      // console.log("id",this.state.id);
      AudioRender.init(this.state.data);
    }
    else if (this.state.data.type === "article") {
      ArticleRender.init(this.state.id);
    }
    else if (this.state.data.type === "PDF") {
      console.log(" ^^^^^^^^^^^^^^^^^^^^^ ");
    }
    else if (this.state.data.type === "video") {
      videoDetails.initVideoDetails(this.state.data);
      console.log(this.state.data, "videeeeee");
    }


    Utilities.setAppTheme();
  };

  static graphicalSummaries = () => {
    let pageDetails = document.getElementById(this.pointers.pageDetails);
    pageDetails.innerHTML = "";
    this.graphicalSummariesFirstPage();
  };
  static init = async (id) => {
    pageDetails.innerHTML = "";
    await this.setState(id);
    this.detailsRender()
  }
}