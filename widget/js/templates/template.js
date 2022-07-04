const { timeConvert, cropImage, sort } = utilities();
// page handler
const { graphicalSummariesFirstPage } = pageHandler();

const { cardRender } = navigation();
const templates = () => {



  const detailsRender = (container, id) => {
    let data = fakeData.data.assets_info[id];
    data.id = id;
    if (data.type === "summary") {
      data = summaryData;
      data.id = id;
      graphicalSummaries(data);
    } else {
      const template = document.getElementById("detailsPageTemplate");
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
        data.meta.image,
        "full_width",
        "4:3"
      )}')`;
      title[0].innerHTML = data.meta.title;
      if (data.meta.duration) {
        duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" style="font-size: 1rem !important;"> schedule </span>
							<span class="schedule-text bodyText-AppTheme">
						${timeConvert(data.meta.duration)}</span>`;
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

  

 


  const graphicalSummaries = (data) => {
    let pageDetails = document.getElementById("pageDetails");
    pageDetails.innerHTML = "";
    graphicalSummariesFirstPage(data, pageDetails);
  };

  const userProfile = (containerId, data) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const userProfileTemplate = document.getElementById("userProfileTemplate");
    const nodesClone = userProfileTemplate.content.cloneNode(true);
    let userProfileTabs = ["activity", "insights", "badges"];
    let userProfileTabsContainer = nodesClone.getElementById(
      "userProfileTabsContainer"
    );
    userProfileTabs.forEach((tab, index) => {
      let button = document.createElement("button");
      button.classList.add("mdc-tab", "mdc-tab--active");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "true");
      button.setAttribute("tabindex", index);
      let tabButtonContent = `
					<span class="mdc-tab__content">
					  <span class="mdc-tab__text-label">${tab}</span>
					</span>
					<span class="mdc-tab-indicator">
					  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
					</span>
					<span class="mdc-tab__ripple"></span>
				  `;
      button.innerHTML = tabButtonContent;
      userProfileTabsContainer.appendChild(button);
    });
    container.appendChild(nodesClone);

    let buttons = document.querySelectorAll(".mdc-tab");
    let tabIndicators = document.querySelectorAll(".mdc-tab-indicator");
    let contentDivs = document.querySelectorAll(".tabContent");
    tabIndicators[0].classList.add("mdc-tab-indicator--active");
    buttons.forEach((button, idx) => {
      let contentDiv = document.createElement("div");
      contentDiv.classList.add(`tabContent`);
      document.getElementById("contentContainer").appendChild(contentDiv);
      button.addEventListener("click", () => {
        tabIndicators.forEach((e, index) => {
          e.classList.remove("mdc-tab-indicator--active");
        });
        contentDivs.forEach((e) => {
          e.classList.add("hidden");
        });
        contentDivs[idx].classList.remove("hidden");
        tabIndicators[idx].classList.add("mdc-tab-indicator--active");
      });
    });

    let userActivityPage = document.createElement("div");
    userActivityPage.setAttribute("id", "userActivityPage");
    contentDivs[0].appendChild(userActivityPage);
    contentDivs[1].innerHTML = "content 2";
    contentDivs[2].innerHTML = "content 3";

    // cardRender("userActivityPage", fakeData.data.sections, "userActivityPage");
    // just for demo purposes
    setTimeout(() => {
      document
      .getElementById("528e722c-2527-4dfd-cc3f-2c8bbb256904-userActivityPage")
      .classList.add("hidden");
    },1000);
  };
  return {
    detailsRender,
    userProfile,
  };
};
