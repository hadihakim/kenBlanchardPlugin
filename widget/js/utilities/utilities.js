class Utilities {
	static cropImage = (image, size = "full_width", aspect = "16:9") => {
		let cropedImage = buildfire.imageLib.cropImage(image, {
			size: size,
			aspect: aspect,
		});
		return cropedImage;
	};

	static timeConvert = (n) => {
		let num = n;
		let hours = num / 60;
		let rHours = Math.floor(hours);
		let minutes = (hours - rHours) * 60;
		let rMinutes = Math.round(minutes);
		return rHours + "h " + rMinutes + "min";
	};

	static getAppTheme = () => {
		buildfire.appearance.getAppTheme((err, appTheme) => {
			if (err) return console.error(err);
			config.appTheme = appTheme;
		});
	};

	static setThemeHandler = (arr, type, color) => {
		for (let i = 0; i < arr.length; i++) {
			switch (type) {
				case "color":
					arr[i].setAttribute( 'style', `fill: ${color} !important` );
					arr[i].style.color = color;
					break;
				case "back":
					arr[i].style.backgroundColor = color;
					break;
				case "borderColor":
					arr[i].style.borderColor = color;
					break;
				default:
					break;
			}
		}
	};

	static setAppTheme = () => {
		let colorCollections = [
			{
				elements: [...document.getElementsByClassName("icon"),...document.getElementsByClassName("arrow-color")],
				colorType: "color",
				colorDegree: config.appTheme.colors.icons,
			},
			{
				elements: document.getElementsByClassName("headerText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.headerText,
			},
			{
				elements: document.getElementsByClassName("barText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.titleBarTextAndIcons,
			},
			{
				elements: document.getElementsByClassName("bodyText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.bodyText,
			},
			{
				elements: document.getElementsByClassName("userContainer"),
				colorType: "back",
				colorDegree: config.appTheme.colors.primaryTheme,
			},
			{
				elements: document.getElementsByClassName("user-image-border"),
				colorType: "borderColor",
				colorDegree: config.appTheme.colors.infoTheme,
			},
			{
				elements: document.getElementsByClassName("info-btn-AppTheme"),
				colorType: "back",
				colorDegree: config.appTheme.colors.infoTheme,
			},
			{
				elements: document.getElementsByClassName("info-link-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.infoTheme,
			},
		];

		colorCollections.forEach((element) => {
			this.setThemeHandler(element.elements, element.colorType, element.colorDegree);
		});
	};

	static _fetchNextList = () => {
	config.fetchingNextPage = true;
	if (config.searchFrom == "from-explore" || config.searchFrom == "from-main") {
		console.log("test");
		Search.searchCardsRender(seeAllContainer, () => {config.fetchingNextPage = false; })
	} else if (config.searchFrom == "from-see-all") {
		SeeAll.seeAllCardsRender(fakeData, "seeAllContainer", true, () => {
			config.fetchingNextPage = false;
		});
	}

	}

	static scrollNextPage = () => {
		if (!seeAllContainer.classList.contains("hidden") && config.page != 1) {
			console.log("before scrollNextPage");
			if ((((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) > 0.8) && !config.fetchingNextPage) {
				this._fetchNextList();
				// loadData(currentPage, limit);
			}
		}
	}

	static initBack = () => {
		let timer;
		buildfire.navigation.onBackButtonClick = () => {
			
			let input = document.getElementById("search-input");
			input.value="";
		
			buildfire.history.get(
				{
					pluginBreadcrumbsOnly: true,
				},
				(err, result) => {
					if(err) return console.log(err);
					if (result.length) {
						switch (result[result.length - 1].label) {
							case "Home from Explore":
								Navigation.openMain();
								break;
							case "Home from See All":
								Navigation.openMain();
								break;
							case "Explore from See All":
								Navigation.openExplore();
								break;
							case "Explore from Details":
								Navigation.openExplore();
								break;
							case "See All from Details":
								if(config.searchFrom == "from-main" ||config.searchFrom == "from-explore" ){
									Navigation.openSearch();
								}else if(config.searchFrom == "from-see-all"){
									Navigation.openSeeAll();
								}
								break;
							case "page detail from chapter":
								let id = result[result.length - 1].options.id;
								Navigation.openPageDetails(id);
								PageDetails.setState(id);
  								PageDetails.init();
								break;
							case "main/explore from search":
								if(config.searchFrom == "from-main"){
									Navigation.openMain();
								}else if(config.searchFrom == "from-explore"){
									Navigation.openExplore();
								}
								Navigation.setData(true);
								break;
						
							case "Home from user profile":
								Navigation.openMain();
								break;
							case "user profile from list":
								Navigation.openUserProfile();
								break;
							default:
								break;
						}
					}
				}
			);
			Utilities.scrollTop();
			clearTimeout(timer);
			// to ask charabel -->
			timer = setTimeout(() => {
				buildfire.history.pop();
			}, 50)
		};
	};

	static scrollTop = () => {
		mainContainer.scrollTo({ top: 0});
	};

	static splideInit = () => {
		var splide = new Splide(".splide");
		var bar = splide.root.querySelector(".my-carousel-progress-bar");
		// Update the bar width:
		splide.on("mounted move", function () {
			var end = splide.Components.Controller.getEnd() + 1;
			bar.style.width = String((100 * (splide.index + 1)) / end) + "%";
			document.getElementById("slideNum").innerText = splide.index + 1 + "/" + end
		});
		splide.mount();
	}
};

