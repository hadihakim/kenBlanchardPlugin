class PageDetails {
    static state =  {
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

    static setState = (id) => {
        this.state.id = id;
        this.state.data = fakeData.data.assets_info[id];
    }

    static graphicalSummariesFirstPage = () => {
        let container = document.getElementById(this.pointers.pageDetails);
        const template = document.getElementById(this.pointers.graphicalSummariesFirstPage);
        const nodesClone = template.content.cloneNode(true);
        let topImage = nodesClone.querySelectorAll(".top-image");
        let title = nodesClone.querySelectorAll(".title");
        let description = nodesClone.querySelectorAll(".description");
        let chaptersList = nodesClone.querySelectorAll(".chapters-list");
        topImage[0].style.backgroundImage = `url('${cropImage(this.state.data.image)}')`;
        title[0].innerText = this.state.data.title;
        description[0].innerText = this.state.data.description;
        this.state.data.chapters.forEach((chapter) => {
          let li = document.createElement("li");
          li.classList.add("chapter-item");
          let innerHTML = `
                <h6 class="chapter-title">${chapter.title}</h6>
                <div class="sub-chapter-item">
                  <span class="chapter-subtitle">${chapter.subTitle}</span>
                  ${
                    chapter.premium
                      ? '<label for="searchInput" class="material-icons icon">lock</label>'
                      : ""
                  }
    
                </div>
                <div class="bar"></div>
                `;
          li.innerHTML = innerHTML;
          chaptersList[0].appendChild(li);
          li.addEventListener("click", () => {
            buildfire.history.push("page detail from chapter",{id:this.state.id});
            this.state.chapterData = chapter;
            this.graphicalSummariesSecondPage();
          });
        });
    
        container.appendChild(nodesClone);
            setAppTheme();
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
        startChapter.addEventListener("click", () => {
          this.graphicalSummariesThirdPage();
        });
        topImage[0].src = cropImage(this.state.chapterData.image);
        title[0].innerText = this.state.chapterData.title;
        subtitle[0].innerText = this.state.chapterData.subTitle;
        container.appendChild(nodesClone);
        setAppTheme();
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
                      src="${cropImage(page.pageImage)}"
                      alt=""
                      class="top-image"
                    />
                    <div class="text-content">
                      <p>
                        ${page.pageContent}
                      </p>
                    </div>
                  </div>
                `;
          li.innerHTML = innerHTML;
          splideList[0].appendChild(li);
        });
        container.appendChild(nodesClone);
        splideInit();
            setAppTheme();
        };
    
      static graphicalSummariesFourthPage = () => {
        let container = document.getElementById(this.pointers.pageDetails);
        container.innerHTML = "";
        const template = document.getElementById(this.pointers.graphicalSummariesFourthPage);
        const nodesClone = template.content.cloneNode(true);
        container.appendChild(nodesClone);
            setAppTheme();
        };

    static detailsRender = () => {
        let container = document.getElementById(this.pointers.pageDetails);
        if (this.state.data.type === "summary") {
          this.state.data = summaryData;
          this.graphicalSummaries();
        } else {
          const template = document.getElementById(this.pointers.detailsPageTemplate);
          const firstClone = template.content.cloneNode(true);
          let image = firstClone.querySelectorAll(".details-img");
          let title = firstClone.querySelectorAll(".details-title");
          let duration = firstClone.querySelectorAll(".duration-details");
          let startCourse = firstClone.querySelectorAll(".startCourse");
          let descriptionTitle = firstClone.querySelectorAll(".description-title");
          let descriptionText = firstClone.querySelectorAll(".description-text");
          let learnTitle = firstClone.querySelectorAll(".learn-title");
          let lessonTitle = firstClone.querySelectorAll(".lesson-title");
          let learnItem = firstClone.querySelectorAll(".lesson-list");
          let lessonItem = firstClone.querySelectorAll(".learn-list");
          // give the button inner text -->
          startCourse[0].innerHTML = Strings.START_COURSE;
    
          image[0].style.backgroundImage = `url('${cropImage(
            this.state.data.meta.image,
            "full_width",
            "4:3"
          )}')`;
          title[0].innerHTML = this.state.data.meta.title;
          if (this.state.data.meta.duration) {
            duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" style="font-size: 1rem !important;"> schedule </span>
                                <span class="schedule-text bodyText-AppTheme">
                            ${timeConvert(this.state.data.meta.duration)}</span>`;
          }
          descriptionTitle[0].innerHTML = "Description";
          descriptionText[0].innerHTML =
            "When one of your team members is at the Disillusioned learner stage on a goal, they have some knowledge and skills but are not yet competent. They can easily get stuck, become discouraged, and even feel ready to quit. Their commitment is low.";
          learnTitle[0].innerHTML = "what you'll learn";
          lessonTitle[0].innerHTML = "Lessons";
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
    
        setAppTheme();
      };
    
      static graphicalSummaries = () => {
        let pageDetails = document.getElementById(this.pointers.pageDetails);
        pageDetails.innerHTML = "";
        this.graphicalSummariesFirstPage();
      };



      static init() {
        this.detailsRender()
      }
}