class UserProfile {
  static state = {
    userData: config.userConfig,
    data: {},
    userProfileTabs: [Strings.USER_PROFILE_TAP_1, Strings.USER_PROFILE_TAP_2, Strings.USER_PROFILE_TAP_3],
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
	  ],

    assesments: [{
      title: "Self Management",
      assesment:[{
        title: "Confidence",
        subtitle: "Take the Assessment"
      },
      {
        title: "Discipline",
        subtitle: "Take the Assessment"
      },
      {
        title: "Confidence",
        subtitle: "Take the Assessment"
      },
      {
        title: "Discipline",
        subtitle: "Take the Assessment"
      }
    ]
    }, {
      title: "Self Knowledge",
      assesment:[{
        title: "Confidence",
        subtitle: "Take the Assessment"
      },
      {
        title: "Discipline",
        subtitle: "Take the Assessment"
      },
      {
        title: "Confidence",
        subtitle: "Take the Assessment"
      },
      {
        title: "Discipline",
        subtitle: "Take the Assessment"
      }
    ]
    }]
  };

  static pointers = {
    userName: "userName",
    userProfilePicture: "userProfilePicture",
    userAchievementIcon: "userAchievementIcon",
    growthProfile: "growthProfile",
    userProfile: "userProfile",
    userProfileTemplate: "userProfileTemplate",
    userProfileTabsContainer: "userProfileTabsContainer",
	userBadgesTemplate:"userBadgesTemplate",
  userProfileInsights: "userProfileInsights",
  assesmentProgress: "assesmentProgress"
  };

  static setData = (data) => {
    this.state.userData = data;
    this.state.data = fakeData;
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
    contentDivs[1].appendChild(this.insightsUI());
    contentDivs[2].appendChild(this.badgesUi());

    // Explore.setData();
    Explore.cardRender("userActivityPage", "userActivityPage");

  };

  static badgesUi=()=>{
	let userBadgesTemplate=document.getElementById(this.pointers.userBadgesTemplate)
	const nodesClone = userBadgesTemplate.content.cloneNode(true);
	let badgesAchievedContainer = nodesClone.getElementById("badgesAchievedContainer");
  let achievedTitle=nodesClone.querySelectorAll(".achieved-title");
  let toAchievedTitle=nodesClone.querySelectorAll(".to-achieve-title");
  achievedTitle[0].innerText=Strings.USER_PROFILE_BADGES_ACHIEVED_TEXT;
  toAchievedTitle[0].innerText=Strings.USER_PROFILE_BADGES__TO_ACHIEVE_TEXT;

	this.state.userBadgesAchieved.forEach((badge)=>{
		let badgeElement= document.createElement("div");
		badgeElement.classList.add("badge");
		let badgeElementContent=`
			<img src=${badge.image} alt="${badge.label}"/>
			<label class="headerText-AppTheme">${badge.label}</label>
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
			<label class="headerText-AppTheme">${badge.label}</label>
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
				  text: `<span style="color:${Utilities.state.appTheme.colors.icons}">OK</span>`,
				  action: () => {
				  },
				},
			  ],
			})
    });
	});

	return nodesClone;
  }

  static loadCharts = (percent) => {
    // let percent = 71;
    const data = {
        labels: ["Average Progress", ""],
        datasets: [
            {
                label: 'Dataset 1',
                data: [percent / 100, 1 - percent / 100],
                backgroundColor: ["#ffff", Utilities.LightenDarkenColor(Utilities.state.appTheme.colors.infoTheme, 16)],
                borderWidth:0,
                cutout: "78%"
            }
        ]
    };

    new Chart(this.pointers.assesmentProgress, {
        type: 'doughnut',
        data: data,
        options:{
          
            plugins:{
                legend:{
                    display:false
                }
            },
            
        },
    });
    Chart.defaults.font.size = 3;

    // document.getElementById(this.pointers.percentageContainer).innerHTML = `${percent}%`;
    // document.getElementById(this.pointers.averageLable).innerHTML = 'Average Progress';
}


  static insightsUI=()=>{
    let percent = 71;
    let userProfileInsights=document.getElementById(this.pointers.userProfileInsights)
	const nodesClone = userProfileInsights.content.cloneNode(true);
  let assesmentsNumber = nodesClone.querySelectorAll(".assesmentsNumber");
  let assesmentsTitle = nodesClone.querySelectorAll(".assesmentsTitle");
  let assesmentsBar = nodesClone.querySelectorAll(".assesmentsBar");
  let allAssesmentsContainer = nodesClone.querySelectorAll(".allAssesmentsContainer");
  let assesmentPercentage = nodesClone.querySelectorAll(".assesmentPercentage");
  assesmentsNumber[0].innerText = 12;
  assesmentsTitle[0].innerText = Strings.USER_PROFILE_ASSESMENTS_TEXT;
  assesmentPercentage[0].innerText = `${percent}%`;
  this.state.assesments.forEach((el)=>{
    let assesmentSection = document.createElement('div');
    let assesmentHeader = document.createElement('p');
    let assesmentList = document.createElement('ul');
    assesmentHeader.classList.add('assesmentHeader', 'headerText-AppTheme'); 
    assesmentSection.classList.add('assesmentSection');
    assesmentList.classList.add('assesmentList');
    assesmentHeader.innerText= el.title;
    assesmentSection.appendChild(assesmentHeader);
    el.assesment.forEach((arr)=>{
      let assesmentElement = document.createElement('li');
      assesmentElement.classList.add('assesmentElement');
      assesmentElement.innerHTML=`<div class="assesmentDetails">
      <p class="assesmentDetailsTitle headerText-AppTheme">${arr.title}</p>
      <p class="assesmentDetailsSubtitle bodyText-AppTheme">${arr.subtitle}</p>
    </div>
    <div id="assesmentAction" class="assesmentAction">
      <span class="material-icons icon">
        chevron_right
      </span>
    </div>`
    assesmentList.appendChild(assesmentElement);
    assesmentSection.appendChild(assesmentList);
    allAssesmentsContainer[0].appendChild(assesmentSection);
    })
  })
  this.loadCharts(percent);
  let canvas = document.getElementById("assesmentProgress");
  assesmentsBar[0].appendChild(canvas);
  return nodesClone;
  }

  static init = () => {
    this.getUser();
  };
}
