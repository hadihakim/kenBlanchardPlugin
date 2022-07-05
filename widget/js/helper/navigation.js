function navigation() {
	const { horizontal1_Skeleton, horizontal_Skeleton, verticalSeeAll_Skeleton } = skeleton();

	const seeAllBtnAction = (id, type) => {
		console.log("----->", type);
		let seeAllContainer = document.getElementById("seeAllContainer");
		mainContainer.addEventListener("scroll", scrollNextPage);
///////////////////////////
config.searchFrom="from-see-all";
////////////////////////////
		scrollTop();
		seeAllContainer.innerHTML = "";
		config.activeSeeAll = id;
		if (!mainPage.classList.contains("hidden")) {
			buildfire.history.push("Home from See All");
		} else if (!explorePage.classList.contains("hidden")) {
			buildfire.history.push("Explore from See All");
		} else if (!userProfile.classList.contains("hidden")) {
			buildfire.history.push("Profile from See All");
			MyList.init();
		}

		verticalSeeAll_Skeleton(seeAllContainer);

		const myTimeout = setTimeout(() => {
			seeAllCardsRender(
				fakeData,
				seeAllContainer,
				true,
				() => { }
			);
		}, 1000);
		// seeAllCardsRender(
		// 	fakeData,
		// 	seeAllContainer,
		// 	true,
		// 	() => { }
		// );
		openSeeAll();
		config.isSeeAllScreen = true;
	};



	const openMain = () => {
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
		mainContainer.removeEventListener('scroll', scrollNextPage);
//////////////////////////////
config.searchFrom="from-main";
////////////////////////////
		setAppTheme();
	}

	const openExplore = () => {
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

const openSearch = () => {
	mainContainer.addEventListener("scroll", scrollNextPage);
	scrollTop();
	    seeAllContainer.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		mainPage.classList.add("hidden");
		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		emptySearch.classList.add("hidden");
		// verticalSeeAll_Skeleton(seeAllContainer);
		// 	const myTimeout = setTimeout(() => {
		// 		searchCardsRender(fakeData, seeAllContainer, () => { })
		// 	}, 1000);
		
		buildfire.history.push("main/explore from search");
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
		setAppTheme();
	}

	const openEmptySearch = () => {
		emptySearch.classList.remove("hidden");
		searchBar.classList.remove("hidden");
		sortIcon.classList.remove("hidden");
		seeAllContainer.classList.remove("hidden");


		userContainer.classList.add("hidden");
		explorePage.classList.add("hidden");
		pageDetails.classList.add("hidden");
		setAppTheme();
	}

	const openUserProfile = () => {
		UserProfile.userProfile();
		mainContainer.classList.add("hidden");
		document.getElementById("userProfile").classList.remove("hidden");
		buildfire.history.push("Home from user profile");
		setAppTheme();
	}
	return { openMain, openExplore, openPageDetails, openSeeAll, openEmptySearch, seeAllBtnAction,openSearch, openUserProfile }

}
