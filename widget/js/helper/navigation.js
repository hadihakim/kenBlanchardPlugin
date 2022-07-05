class Navigation {

	static openMain = () => {
		mainContainer.classList.remove("hidden");
		document.getElementById("userProfile").classList.add("hidden");
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
		mainContainer.removeEventListener('scroll', Utilities.scrollNextPage);
//////////////////////////////
config.searchFrom="from-main";
////////////////////////////
		Utilities.setAppTheme();
	}

	static openExplore = () => {
		config.renderedCard = 0;
		config.page = 1;
		config.lastIndex = 0;
		config.isSeeAllScreen = false;
//////////////////////////////
config.searchFrom="from-explore";
////////////////////////////
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

	static openSeeAll = () => {
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
		
		buildfire.history.push("main/explore from search");
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
