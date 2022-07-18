class Navigation {
	static state = {
		searchOpened: true,
		seeAllState: null,
		activeLayOut:'main'
	}
	static setData(data) {
		this.state.searchOpened = data;
	}

	static pointers = {
		searchInput: 'search-input'
	}

	static openMain = () => {
		this.state.activeLayOut = 'main';

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
		exploreButton.classList.remove("hidden");

		courseDetailsContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		emptySearch.classList.add("hidden");
		sortIcon.classList.add("hidden");
		searchContainer.classList.add("hidden");
		
		// document.getElementById("videoPageContainer").classList.add("hidden");
		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);

		config.search = '';
		Utilities.setAppTheme();
	}

	static openExplore = () => {
		this.state.activeLayOut = 'explore';

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
		searchContainer.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");

		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		explorePage.classList.remove("hidden");

		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);
		config.search = '';
		Utilities.setAppTheme();
	}

	static openSeeAll = (type, title, state) => {
		this.state.activeLayOut = 'see all';

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
		searchContainer.classList.add("hidden");
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
		this.state.activeLayOut = 'search';

		mainContainer.addEventListener("scroll", Utilities.scrollNextPage);
		Utilities.scrollTop();
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		searchContainer.classList.remove("hidden");
		
		seeAllContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");

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
		this.state.activeLayOut = 'page details';

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
		}else if(!pageDetails.classList.contains("hidden")) {
			console.log("from chapters");
		}else if(!contentContainer.classLisbt.contains("hidden")){
			
			buildfire.history.push(title, {
				showLabelInTitlebar: true,
				from: "User profile from Details",

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
		searchContainer.classList.add("hidden");

		pageDetails.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		config.search = '';
		PageDetails.init(id);
		Utilities.scrollTop();

		Utilities.setAppTheme();
	}

	static openCourseDetails = (id, title, from) => {
		this.state.activeLayOut = 'course details';

		if (from == "from active-card") {
			console.log("lllllll.................");
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
		searchContainer.classList.add("hidden");

		courseDetailsContainer.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		config.search = '';

		CourseDetails.init(id);

		Utilities.setAppTheme();
	}

	static openEmptySearch = () => {
		this.state.activeLayOut = 'search';

		emptySearch.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		seeAllContainer.classList.remove("hidden");
		
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		courseDetailsContainer.classList.add("hidden");
		searchContainer.classList.add("hidden");

		Utilities.setAppTheme();
	}

	static openUserProfile = () => {
		this.state.activeLayOut = 'user profile';

		// ChartContainer.innerHTML = `<canvas id="assesmentProgress" class="assesmentsChart"></canvas>`;
		UserProfile.userProfile();
		mainContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");
		searchContainer.classList.add("hidden");

		userProfileContainer.classList.remove("hidden");
		userProfile.classList.remove("hidden");
		// userProfile.innerHTML="";
		buildfire.history.push("Growth Profile", {
			showLabelInTitlebar: true,
		});
		config.search = '';

		Utilities.setAppTheme();
	}

	static openUserList = (options) => {
		this.state.activeLayOut = 'user list';

		mainContainer.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		teamEffectiveness_PageContainer.classList.add("hidden");
		searchContainer.classList.add("hidden");

		if (options?.title)
			buildfire.history.push(`My ${options?.title}`, {
				showLabelInTitlebar: true,
				from: "user profile from list",

			});
		myList_PageContainer.classList.remove("hidden");
		userProfileContainer.classList.remove("hidden");

		config.search = '';
		if (options?.data) {
			let _options = {
				data: options.data
			}
			MyList.setData(_options)
		}
		MyList.init();

		Utilities.setAppTheme();
	}

	static openTeamEffectivenessList = (options) => {
		this.state.activeLayOut = 'team effectiveness list';

		mainContainer.classList.add("hidden");
		userProfile.classList.add("hidden");
		mainPage.classList.add("hidden");
		explorePage.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		myList_PageContainer.classList.add("hidden");
		searchContainer.classList.add("hidden");

		if (options?.title)
			buildfire.history.push(options.title, {
				showLabelInTitlebar: true,
				from: "user List from temEffectiveness list",
				to: options.title

			});

		teamEffectiveness_PageContainer.classList.remove("hidden");
		userProfileContainer.classList.remove("hidden");

		config.search = '';

		if (options?.id) {
			// call api
			let _options = {
				id: options.id,
				data: options.activeData,
				archivedData: options.archiveData,
			}
			TeamEffectivenessList.setStates(_options);
		}
		TeamEffectivenessList.init();

		Utilities.setAppTheme();
	}
}
