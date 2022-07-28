class CourseDetails {
  static state = {
    data: {},
    duration: 0,
  };
  static pointers = {
    courseDetailsContainer: "courseDetailsContainer",
    courseDetailsTemplate: "courseDetailsTemplate",
  };
  static setData = (data) => {
    // HandleAPI.getDataByID
    
    this.state = {...this.state,data};
  }

  static showAssetDetails = (span, allAssets) => {
    if (span.innerHTML == "expand_less") {
      span.innerHTML = "expand_more";
      allAssets.classList.add("hidden");
    } else {
      span.innerHTML = "expand_less";
      allAssets.classList.remove("hidden");
    }
  };

  static courseRender = () => {
    let container = document.getElementById(
      this.pointers.courseDetailsContainer
    );
    const template = document.getElementById(
      this.pointers.courseDetailsTemplate
    );
    const firstClone = template.content.cloneNode(true);

    let image = firstClone.querySelectorAll(".course-img");
    let title = firstClone.querySelectorAll(".course-title");
    let duration = firstClone.querySelectorAll(".duration-details");
    let lessons = firstClone.querySelectorAll(".course-lessons-list");
      console.log("this.state = " , this.state);
    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      this.state.data.meta.image,
      "full_width",
      "4:3"
    )}')`;
    title[0].innerHTML = this.state.data.meta.title;
    this.state.data.lessons.forEach((el) => {
      let lessonContainer= ui.createElement("div", lessons[0],"",["lesson-container"]);
      if(el.assets.length === 1) {
        lessonContainer.style.cursor = "pointer";
        lessonContainer.addEventListener('click', () => {
          Navigation.openPageDetails({id:el.assets[0], title:this.state.data.meta.title,fromLocalNotifications: false,pushToHistory:true, openFrom:"course"});
        })

      }
      ui.createElement(
        "p",
        lessonContainer,
        el.title,
        ["course-lesson-title", "bodyText-AppTheme"],
        "course-lesson-title"
      );
      let title = ui.createElement(
        "p",
        lessonContainer,
        el.subTitle,
        ["course-lesson-subtitle", "headerText-AppTheme", "assetsTitle"],
        "course-lesson-subtitle"
      );
      let durationForLesson = document.createElement("div");
      //value addad after calculated duration for lessons assets
      lessonContainer.appendChild(durationForLesson);

      let icons = document.createElement("div");
      icons.classList.add("icon-course");
      let assetsDuration = 0;
      let allAssets = document.createElement("div");
      allAssets.setAttribute("id", " allAssets");
      let lessonIcons = [];
      for (let i = 0; i < el.assets.length; i++) {
        let assets= HandleAPI.state.assets_info[el.assets[i]]
        // let assets = coursesData.data.assets_info[el.assets[i]];
        let lessonIcon = document.createElement("div");
        let assetsIcon = document.createElement("div");
        lessonIcon.classList.add("icons");
        assetsIcon.classList.add("icons", "assetsIcon-course");
        if (!lessonIcons.includes(assets.type)) {
          lessonIcons.push(assets.type);
          lessonIcon.innerHTML = `<label class="material-icons icon movieIcon">
                    ${
                      assets.type === "video"
                        ? "videocam"
                        : assets.type === "audio"
                        ? "headphones"
                        : assets.type === "article"
                        ? "article"
                        : ""
                    }
                    </label> `;
        }

        assetsIcon.innerHTML = `<label class="material-icons icon movieIcon" >
                ${
                  assets.type === "video"
                    ? "videocam"
                    : assets.type === "audio"
                    ? "headphones"
                    : assets.type === "article"
                    ? "article"
                    : ""
                }
                </label> `;
        icons.appendChild(lessonIcon);

        let assetsDetails = document.createElement("div");
        // assetsDetails.classList.add("assets-container" , "hidden");
        assetsDetails.classList.add("assets-container");
        assetsDetails.style.cursor = "pointer";
        assetsDetails.addEventListener("click", ()=> {
          Navigation.openPageDetails({ id:el.assets[i],  title:this.state.data.meta.title,fromLocalNotifications:false,pushToHistory:true,openFrom:"course"});
        })

        assetsDetails.appendChild(assetsIcon);

        ui.createElement(
          "p",
          assetsDetails,
          assets.meta.title,
          [
            "course-lesson-subtitle",
            "headerText-AppTheme",
            "assetsTitle-course",
          ],
          "course-lesson-subtitleDetails"
        );
        ui.createElement(
          "div",
          assetsDetails,
          `<div class="duration duration-lesson-details">
                      <span class="schedule-text bodyText-AppTheme">
                          ${Utilities.timeConvert(assets.meta.duration, "hh|mm")}
                      </span>
                     </div>`,
          ["mdc-card-footer"]
        );
        assetsDuration += assets.meta.duration;
        allAssets.appendChild(assetsDetails);
      }

      lessonContainer.appendChild(allAssets);
      if (el.assets.length < 2) {
        allAssets.classList.add("hidden");
      } else {
        let span = ui.createElement("span", title, "expand_less", [
          "material-icons",
          "icon",
          "arrow-up-icon",
        ]);
        span.addEventListener("click", () => {
          this.showAssetDetails(span, allAssets);
        });
      }
      durationForLesson.innerHTML = `<div class="duration duration-details">
             <span class="material-icons icon details-icon schedule-icon"  id="scheduleIcon"> schedule </span>
                 <span class="schedule-text bodyText-AppTheme lesson-duration">
                        ${Utilities.timeConvert(assetsDuration, "hh|mm")}
                  </span>
            </div>`;
      durationForLesson.appendChild(icons);
      this.state.duration += assetsDuration;


      let progress = ui.createElement("div",durationForLesson,"",["holderPercentage","course-holderPercentage"]);
      let progressBarContainer = ui.createElement("div",progress,"",["progressBarContainer"]);
      let percentageDiv = ui.createElement("div",progress,"",["progressBar"]);
      percentageDiv.style.width = `${el.progress || 50}%`;
      progress.append(progressBarContainer,percentageDiv);

      durationForLesson.appendChild(progress);
    });

    duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id="scheduleIcon"> schedule </span>
                                     <span class="schedule-text bodyText-AppTheme">
                            ${Utilities.timeConvert(
                              this.state.duration, "hh|mm"
                            )}</span>`;
    container.appendChild(firstClone);
    // Utilities.setAppTheme();
  };

  static init = async(data) => {
    document.getElementById(this.pointers.courseDetailsContainer).innerHTML =
      "";
    await this.setData(data);
    this.courseRender();
    HandleAPI.updateAssetProgress(data.id,50);
  };
}
