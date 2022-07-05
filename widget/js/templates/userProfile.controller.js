class UserProfile {
  static state = {
    userData: config.userConfig,
    data: {},
    userProfileTabs: ["activity", "insights", "badges"],
  };

  static setData = (data) => {
    this.state.userData = data;
    this.state.data = fakeData;
  };

  static pointers = {
    userName: "userName",
    userProfilePicture: "userProfilePicture",
    userAchievementIcon: "userAchievementIcon",
    growthProfile: "growthProfile",
    userProfile: "userProfile",
    userProfileTemplate: "userProfileTemplate",
    userProfileTabsContainer: "userProfileTabsContainer",
  };

  static getUser = () => {
    let userName = document.getElementById(this.pointers.userName);
    let userProfilePicture = document.getElementById(
      this.pointers.userProfilePicture
    );
    let userAchievementIcon = document.getElementById(
      this.pointers.userAchievementIcon
    );
    let growthProfile = document.getElementById(this.pointers.growthProfile);
    if (this.state.userData.isLoggedIn) {
      let userAchievements = this.state.userData.badges.filter(
        (el) => el.active === true
      );
      userName.innerText =
        this.state.userData.firstName + " " + this.state.userData.lastName;
      growthProfile.innerText = this.state.userData.growthProfile;
      userProfilePicture.src = this.state.userData.profilePicture;
      userProfilePicture.alt = this.state.userData.firstName;
      userAchievementIcon.src = userAchievements[0].achievementIcon;
      userAchievementIcon.alt = userAchievements[0].achievementTitle;
      Search.state.filterArr = this.state.userData.recommendedTags;
    } else {
      userProfilePicture.src =
        "../../../../styles/media/avatar-placeholder.png";
      userName.innerText = "Anonymous";
      growthProfile.innerText = "Profile Growth";
      userAchievementIcon.src = "../../../../styles/media/holder-1x1.png";
    }
  };


  static userProfile = () => {
    const container = document.getElementById(this.pointers.userProfile);
    container.innerHTML = "";
    const userProfileTemplate = document.getElementById(
      this.pointers.userProfileTemplate
    );
    const nodesClone = userProfileTemplate.content.cloneNode(true);

    let userProfileTabsContainer = nodesClone.getElementById(
      this.pointers.userProfileTabsContainer
    );
    this.state.userProfileTabs.forEach((tab, index) => {
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
    // Explore.setData();
    Explore.cardRender("userActivityPage", "userActivityPage");

    // just for demo purposes
    // setTimeout(() => {
    //   document
    //     .getElementById("528e722c-2527-4dfd-cc3f-2c8bbb256904-userActivityPage")
    //     .classList.add("hidden");
    // }, 1000);
  };

  static init = () => {
    this.getUser();
  };
}
