class CourseDetails {
  static state = {
    data: {},
    duration: 0,
  };
  static pointers = {
    courseDetailsContainer: "courseDetailsContainer",
    courseDetailsTemplate: "courseDetailsTemplate",
  };
  static setData(id) {
    this.state.data = coursesData.data.courses[id];
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

    image[0].style.backgroundImage = `url('${Utilities.cropImage(
      this.state.data.image,
      "full_width",
      "4:3"
    )}')`;
    title[0].innerHTML = this.state.data.title;
    this.state.data.lessons.forEach((el) => {
      ui.createElement(
        "p",
        lessons[0],
        el.title,
        ["course-lesson-title", "bodyText-AppTheme"],
        "course-lesson-title"
      );
      let title = ui.createElement(
        "p",
        lessons[0],
        el.subtitle,
        ["course-lesson-subtitle", "headerText-AppTheme", "assetsTitle"],
        "course-lesson-subtitle"
      );
      let durationForLesson = document.createElement("div");
      //value addad after calculated duration for lessons assets
      lessons[0].appendChild(durationForLesson);

      let icons = document.createElement("div");
      icons.classList.add("icon-course");
      let assetsDuration = 0;
      let allAssets = document.createElement("div");
      allAssets.setAttribute("id", " allAssets");
      let lessonIcons = [];
      for (let i = 0; i < el.assets.length; i++) {
        let assets = coursesData.data.assets_info[el.assets[i]];
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

        assetsDetails.appendChild(assetsIcon);

        ui.createElement(
          "p",
          assetsDetails,
          assets.title,
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
                          ${Utilities.timeConvert(assets.duration)}
                      </span>
                     </div>`,
          ["mdc-card-footer"]
        );
        assetsDuration += assets.duration;
        allAssets.appendChild(assetsDetails);
      }

      lessons[0].appendChild(allAssets);
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
                        ${Utilities.timeConvert(assetsDuration)}
                  </span>
            </div>`;
      durationForLesson.appendChild(icons);
      this.state.duration += assetsDuration;

      const progress = document.createElement("div");
      progress.classList.add("progressBar");
      let div = document.createElement("div");
      div.classList.add("courseDetails-card-progressBar", "holderPercentage");
      let percentageDiv = document.createElement("div");
      percentageDiv.style.width = `${el.progress}%`;
      percentageDiv.classList.add(
        "percentageDiv",
        "progress-lesson",
        "infoTheme"
      );
      div.appendChild(percentageDiv);
      progress.appendChild(div);

      durationForLesson.appendChild(progress);
    });

    duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id="scheduleIcon"> schedule </span>
                                     <span class="schedule-text bodyText-AppTheme">
                            ${Utilities.timeConvert(
                              this.state.duration
                            )}</span>`;
    container.appendChild(firstClone);
    Utilities.setAppTheme();
  };

  static init = (id) => {
    document.getElementById(this.pointers.courseDetailsContainer).innerHTML =
      "";
    this.setData(id);
    this.courseRender();
  };
}
