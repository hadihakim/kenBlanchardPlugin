function navigation() {

	const getUser = (data) => {
		let userName = document.getElementById("userName");
		let userProfilePicture = document.getElementById("userProfilePicture");
		let userAchievementIcon = document.getElementById("userAchievementIcon");
		let growthProfile = document.getElementById("growthProfile");
		if (data.isLoggedIn) {
			let userAchievements = data.badges.filter((el) => el.active === true);
			userName.innerText = data.firstName + " " + data.lastName;
			growthProfile.innerText = data.growthProfile;
			userProfilePicture.src = data.profilePicture;
			userProfilePicture.alt = data.firstName;
			userAchievementIcon.src = userAchievements[0].achievementIcon;
			userAchievementIcon.alt = userAchievements[0].achievementTitle;
			config.filterArr = data.recommendedTags;
		} else {
			userProfilePicture.src = "../../../../styles/media/avatar-placeholder.png";
			userName.innerText = "Anonymous";
			growthProfile.innerText = "Profile Growth";
			userAchievementIcon.src = "../../../../styles/media/holder-1x1.png";
		}
	};
	const seeAllBtnAction = (id) => {
		mainContainer.addEventListener("scroll", scrollNextPage);

		scrollTop();
		document.getElementById("seeAllContainer").innerHTML = "";
		config.activeSeeAll = id;
		if (!mainPage.classList.contains("hidden")) {
			buildfire.history.push("Home from See All");
		} else if (!explorePage.classList.contains("hidden")) {
			buildfire.history.push("Explore from See All");
		}
		seeAllCardsRender(
			fakeData,
			document.getElementById("seeAllContainer"),
			true,
			() => { }
		);
		openSeeAll();
		config.isSeeAllScreen = true;
	};
	const cardRender = (sectionId, data, type) => {
		const sectionsContainer = document.getElementById(sectionId);

		data.forEach((element) => {
			if (
				(type == "explore" && element.isExplore && element.isActive) ||
				(element.isActive && type !== "explore")
			) {
				let sectionInnerHTML;
				if (element.layout != "horizontal-1") {
					sectionInnerHTML = `
					<div class="container-header">
						<p class="title headerText-AppTheme">${type == "explore" ? "All" : "Recommended"
						} ${element.title}</p>
						<span class="seeAll-btn info-link-AppTheme" onclick="seeAllBtnAction('${element.id
						}')">${Strings.SEE_ALL_TEXT}</span>
					</div>
						<div id="${`${element.id}-container-${type}`}" class="main">
					</div>
					  `;
				} else {
					sectionInnerHTML = `
					<p class="sectionTitle headerText-AppTheme">${element.title}</p>
						<div id="${`${element.id}-container-${type}`}" class="main"></div>
					`;
				}
				ui.createElement(
					"section",
					sectionsContainer,
					sectionInnerHTML,
					[element.layout],
					`${element.id}-${type}`
				);
				filterAndPrintData(fakeData, element, type);
			}
		});

	};

	const initMain = () => {
		getUser(config.userConfig);
		setFilteredTopic(fakeData);
		cardRender("exploreContainer", fakeData.data.sections, "explore");
		cardRender("sectionsContainer", fakeData.data.sections, "main");
		trendingRender("trendingContainer");

		const exploreBtn = document.getElementById("exploreButton");
		exploreBtn.innerHTML = Strings.EXPLORE_BTN;
		exploreBtn.addEventListener("click", () => {
			buildfire.history.push("Home from Explore");
			scrollTop();
			openExplore();
		});
	}

	const openMain = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;

		mainPage.classList.remove("hidden");
		userContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");

		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		emptySearch.classList.add("hidden");

		sortIcon.classList.add("hidden");
		mainContainer.removeEventListener('scroll', scrollNextPage);

		setAppTheme();
	}

	const openExplore = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;

		mainPage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		userContainer.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");

		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		explorePage.classList.remove("hidden");

		mainContainer.removeEventListener('scroll', scrollNextPage);
		setAppTheme();
	}

	const openSeeAll = () => {
		seeAllContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");

		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
		setAppTheme();
	}

	const openPageDetails = (id) => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;

		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		searchBar.classList.add("hidden");
		sortIcon.classList.add("hidden");
		emptySearch.classList.add("hidden");

		pageDetails.classList.remove("hidden");

		detailsRender(pageDetails, id);
		setAppTheme();
	}

	const openEmptySearch = () => {
		emptySearch.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		seeAllContainer.classList.remove("hidden");

		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		setAppTheme();
	}

	return { openMain, openExplore, openPageDetails, openSeeAll, initMain, openEmptySearch, seeAllBtnAction }

}
