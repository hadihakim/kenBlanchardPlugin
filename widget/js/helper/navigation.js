class Navigation {
	static state = {
		searchOpened: true,
		seeAllState: null
	}
	static setData(data) {
		this.state.searchOpened = data;
	}

	static pointers = {
		searchInput: 'search-input'
	}

	static openMain = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;
		config.searchFrom = "from-main";
		buildfire.history.push(" ", {
			showLabelInTitlebar: true,
			from: "Personal home Page",

		});
		mainPage.classList.remove("hidden");
		userContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		courseDetailsContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		emptySearch.classList.add("hidden");
		sortIcon.classList.add("hidden");
		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);

		config.search = '';
		Utilities.setAppTheme();
	}

	static openExplore = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;
		config.searchFrom = "from-explore";

		mainPage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		userContainer.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");

		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		explorePage.classList.remove("hidden");

		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);
		config.search = '';
		Utilities.setAppTheme();
	}

	static openSeeAll = (type, title, state) => {

		mainContainer.addEventListener("scroll", Utilities.scrollNextPage);
		config.searchFrom = "from-see-all";
		if (type == "explore") {
			buildfire.history.push(`All ${title}`, {
				showLabelInTitlebar: true,
				from: "Explore from See All",

			});
		} else if (type == "main") {
			buildfire.history.push(`All ${title}`, {
				showLabelInTitlebar: true,
				from: "Home from See All",

			});
		}

		seeAllContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		mainContainer.classList.remove("hidden");
		// document.getElementById("userActivityPage").classList.add("hidden");
		// userActivityPage.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");
		userProfileContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");

		if (state) {
			this.state.seeAllState = state;
		} else {
			state = this.state.seeAllState;
		}
		config.search = '';

		SeeAll.setData(state);
		SeeAll.init();

		Utilities.setAppTheme();

	}

	static openSearch = () => {

		mainContainer.addEventListener("scroll", Utilities.scrollNextPage);
		Utilities.scrollTop();
		seeAllContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");

		// Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
		// 	static myTimeout = setTimeout(() => {
		// 		searchCardsRender(fakeData, seeAllContainer, () => { })
		// 	}, 1000);
		if (Navigation.state.searchOpened) {
			buildfire.history.push("Search", {
				showLabelInTitlebar: true,
				from: "Home from See All",

			});
			Navigation.setData(false);
		}
		Utilities.setAppTheme();
	}

	static openPageDetails = (id, title) => {

		if (!mainPage.classList.contains("hidden")) {
			// buildfire.history.push("Home from Details");
			buildfire.history.push(title, {
			  showLabelInTitlebar: true,
			  from: "Home from Details",
	  
			});
		  } else if (!seeAllContainer.classList.contains("hidden")) {
			// buildfire.history.push("See All from Details");
			buildfire.history.push(title, {
			  showLabelInTitlebar: true,
			  from: "See All from Details",
	  
			});
		  } else if (!explorePage.classList.contains("hidden")) {
			buildfire.history.push(title, {
			  showLabelInTitlebar: true,
			  from: "Explore from Details",
	  
			});
		  }

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
		courseDetailsContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");
		teamEffectiveness_PageContainer.classList.add("hidden");
		userProfileContainer.classList.add("hidden");

		pageDetails.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		config.search = '';

		PageDetails.init(id);
		Utilities.scrollTop();

		Utilities.setAppTheme();
	}
	static openCourseDetails = (id, title, from) => {

		if (from == "from active-card") {
			buildfire.history.push(title, {
				showLabelInTitlebar: true,
				from: "active list from CourseDetails",
				id: id,
			});
		}
		else {
			buildfire.history.push(title, {
				showLabelInTitlebar: true,
				from: "Details from CourseDetails",
				id: id,
			});
		}
		// buildfire.history.push("Details from CourseDetails",{id:id});
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		pageDetails.innerHTML = "";
		config.isSeeAllScreen = false;
		Utilities.scrollTop();
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		searchBar.classList.add("hidden");
		sortIcon.classList.add("hidden");
		emptySearch.classList.add("hidden");
		pageDetails.classList.add("hidden");
		userProfile.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");
		teamEffectiveness_PageContainer.classList.add("hidden");
		userProfileContainer.classList.add("hidden");

		courseDetailsContainer.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		config.search = '';

		CourseDetails.init(id);

		Utilities.setAppTheme();
	}
	static openEmptySearch = () => {
		emptySearch.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		mainPage.classList.add("hidden");
		seeAllContainer.classList.remove("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");

		Utilities.setAppTheme();
	}

	static openUserProfile = () => {
		ChartContainer.innerHTML = `<canvas id="assesmentProgress" class="assesmentsChart"></canvas>`;
		UserProfile.userProfile();
		mainContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");
		userProfileContainer.classList.remove("hidden");
		userProfile.classList.remove("hidden");
		buildfire.history.push("Growth Profile", {
			showLabelInTitlebar: true,
		});
		config.search = '';

		Utilities.setAppTheme();
	}

	static openUserList = (title) => {
		mainContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		teamEffectiveness_PageContainer.classList.add("hidden");

		buildfire.history.push(`My ${title}`, {
			showLabelInTitlebar: true,
			from: "user profile from list",

		});
		myList_PageContainer.classList.remove("hidden");
		userProfileContainer.classList.remove("hidden");

		config.search = '';

		Utilities.setAppTheme();
	}

	static openTeamEffectivenessList = (title, id) => {
		mainContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");

		buildfire.history.push(title, {
			showLabelInTitlebar: true,
			from: "user List from temEffectiveness list",
			to: title

		});

		teamEffectiveness_PageContainer.classList.remove("hidden");
		userProfileContainer.classList.remove("hidden");

		config.search = '';

		TeamEffectivenessList.init(id);

		Utilities.setAppTheme();
	}
}
