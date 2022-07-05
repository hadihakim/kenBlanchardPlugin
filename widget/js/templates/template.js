const { timeConvert, cropImage, sort } = utilities();

const { cardRender } = navigation();
const templates = () => {
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
    userProfile
  };
};
