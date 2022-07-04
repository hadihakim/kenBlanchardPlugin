class UserProfile{
    static state={
        userData: config.userConfig,
    }

    static setData=(data)=>{
        this.state.userData = data;
    }
    static pointers={
        userName:"userName",
        userProfilePicture:"userProfilePicture",
        userAchievementIcon:"userAchievementIcon",
        growthProfile:"growthProfile"
    }
    
    static getUser = () => {
		let userName = document.getElementById(this.pointers.userName);
		let userProfilePicture = document.getElementById(this.pointers.userProfilePicture);
		let userAchievementIcon = document.getElementById(this.pointers.userAchievementIcon);
		let growthProfile = document.getElementById(this.pointers.growthProfile);
		if (this.state.userData.isLoggedIn) {
			let userAchievements = this.state.userData.badges.filter((el) => el.active === true);
			userName.innerText = this.state.userData.firstName + " " + this.state.userData.lastName;
			growthProfile.innerText = this.state.userData.growthProfile;
			userProfilePicture.src = this.state.userData.profilePicture;
			userProfilePicture.alt = this.state.userData.firstName;
			userAchievementIcon.src = userAchievements[0].achievementIcon;
			userAchievementIcon.alt = userAchievements[0].achievementTitle;
			Search.state.filterArr= this.state.userData.recommendedTags;
		} else {
			userProfilePicture.src = "../../../../styles/media/avatar-placeholder.png";
			userName.innerText = "Anonymous";
			growthProfile.innerText = "Profile Growth";
			userAchievementIcon.src = "../../../../styles/media/holder-1x1.png";
		}
	};


    static init=()=>{
        this.getUser();
    }
}