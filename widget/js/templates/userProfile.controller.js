class UserProfile {
  static state = {
    userData: config.userConfig,
    data: {},
    userProfileTabs: ["activity", "insights", "badges"],
	// it should come from user api 
	userBadgesAchieved:[
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Learner"
		},
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Committed"
		},
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Newbie"
		},
	],

	// it should come from public app api 
	badgesToAchieved:[
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Newbie",
      message:"Complete 3 courses or 25 content pieces and collect this badge!"
		},
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Ambassador",
      message:"Complete 3 courses or 25 content pieces and collect this badge!"
		},
		{
			image:"https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
			label:"Ambassador",
      message:"Complete 3 courses or 25 content pieces and collect this badge!"
		}
	  ]
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
	userBadgesTemplate:"userBadgesTemplate"
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
    contentDivs[2].appendChild(this.badgesUi());

    // Explore.setData();
    Explore.cardRender("userActivityPage", "userActivityPage");

  };

  static badgesUi=()=>{
	let userBadgesTemplate=document.getElementById(this.pointers.userBadgesTemplate)
	const nodesClone = userBadgesTemplate.content.cloneNode(true);
	let badgesAchievedContainer = nodesClone.getElementById("badgesAchievedContainer");


	this.state.userBadgesAchieved.forEach((badge)=>{
		let badgeElement= document.createElement("div");
		badgeElement.classList.add("badge");
		let badgeElementContent=`
			<img src=${badge.image} alt="${badge.label}"/>
			<label>${badge.label}</label>
		`
		badgeElement.innerHTML=badgeElementContent;
		badgesAchievedContainer.appendChild(badgeElement);
	});
	
	// badges not achieved yet
	let badgesToAchievedContainer = nodesClone.getElementById("badgesToAchievedContainer");
	this.state.badgesToAchieved.forEach((badge)=>{
		let badgeElement= document.createElement("div");
		badgeElement.classList.add("badge");
		let badgeElementContent=`
			<img src=${badge.image} alt="${badge.label}"/>
			<label>${badge.label}</label>
		`
		badgeElement.innerHTML=badgeElementContent;
		badgesToAchievedContainer.appendChild(badgeElement);
    badgeElement.addEventListener("click", ()=>{
      Utilities.showDialog({
			  title: badge.label,
			  message:badge.message,
			  isMessageHTML: true,
			  showCancelButton: false,
			  actionButtons: [
				{
				  text: `<span style="color:${config.appTheme.colors.icons}">OK</span>`,
				  action: () => {
				  },
				},
			  ],
			})
    });
	});

	return nodesClone;
  }

  static init = () => {
    this.getUser();
  };
}
