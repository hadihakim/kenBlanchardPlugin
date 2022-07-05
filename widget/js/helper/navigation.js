class Navigation {
	static state = {
		searchOpened: true,
	}
	static setData(data) {
		this.state.searchOpened = data;
	}
	
	static openMain = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;
		config.searchFrom = "from-main";

		mainPage.classList.remove("hidden");
		userContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		mainContainer.classList.remove("hidden");

		userProfile.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		seeAllContainer.classList.add("hidden");
		emptySearch.classList.add("hidden");
		sortIcon.classList.add("hidden");
		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);
		
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

		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		explorePage.classList.remove("hidden");

		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);
		Utilities.setAppTheme();
	}

	static openSeeAll = (type) => {

		mainContainer.addEventListener("scroll", Utilities.scrollNextPage);
		config.searchFrom = "from-see-all";
		if (type == "explore") {
			buildfire.history.push("Explore from See All");
		} else if (type == "main") {
			buildfire.history.push("Home from See All");
		}

		seeAllContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");

		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
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
		// Skeleton.verticalSeeAll_Skeleton(seeAllContainer);
		// 	static myTimeout = setTimeout(() => {
		// 		searchCardsRender(fakeData, seeAllContainer, () => { })
		// 	}, 1000);
		if (Navigation.state.searchOpened) {
			buildfire.history.push("main/explore from search");
			Navigation.setData(false);
		}
		Utilities.setAppTheme();
	}

	static openPageDetails = (id) => {
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
		Utilities.setAppTheme();
	}

	static openEmptySearch = () => {
		emptySearch.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		seeAllContainer.classList.remove("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		Utilities.setAppTheme();
	}

	static openUserProfile = () => {
		UserProfile.userProfile();
		mainContainer.classList.add("hidden");
		document.getElementById("userProfile").classList.remove("hidden");
		buildfire.history.push("Home from user profile");
		Utilities.setAppTheme();
	}
}
