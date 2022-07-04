const utilities = () => {
	const cropImage = (image, size = "full_width", aspect = "16:9") => {
		let cropedImage = buildfire.imageLib.cropImage(image, {
			size: size,
			aspect: aspect,
		});
		return cropedImage;
	};

	const timeConvert = (n) => {
		let num = n;
		let hours = num / 60;
		let rHours = Math.floor(hours);
		let minutes = (hours - rHours) * 60;
		let rMinutes = Math.round(minutes);
		return rHours + "h " + rMinutes + "min";
	};

	const getAppTheme = () => {
		buildfire.appearance.getAppTheme((err, appTheme) => {
			if (err) return console.error(err);
			config.appTheme = appTheme;
		});
	};

	const setThemeHandler = (arr, type, color) => {
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

	const setAppTheme = () => {
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
			setThemeHandler(element.elements, element.colorType, element.colorDegree);
		});
	};

	const _fetchNextList = () => {
		// if (config.fetchingNextPage) return;
		config.fetchingNextPage = true;
		seeAllCardsRender(fakeData, document.getElementById("seeAllContainer"), true, () => {
			config.fetchingNextPage = false;
		});
	}

	const scrollNextPage = () => {
		if (!seeAllContainer.classList.contains("hidden") && config.page != 1) {
			if ((((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) > 0.8) && !config.fetchingNextPage) {
				_fetchNextList();
				// loadData(currentPage, limit);
			}
		}
	}

	const initBack = () => {
		let timer;
		buildfire.navigation.onBackButtonClick = () => {
			buildfire.history.get(
				{
					pluginBreadcrumbsOnly: true,
				},
				(err, result) => {
					if(err) return console.log(err);
					if (result.length) {
						switch (result[result.length - 1].label) {
							case "Home from Explore":
								openMain();
								break;
							case "Home from See All":
								openMain();
								break;
							case "Explore from See All":
								openExplore();
								break;
							case "Explore from Details":
								openExplore();
								break;
							case "See All from Details":
								openSeeAll();
								break;
							case "page detail from chapter":
								let id = result[result.length - 1].options.id;
								openPageDetails(id);
								break;
							case "Home from user profile":
								console.log("yes");
								openMain();
								break;
							default:
								break;
						}
					}
				}
			);
			scrollTop();
			clearTimeout(timer);
			// to ask charabel -->
			timer = setTimeout(() => {
				buildfire.history.pop();
			}, 50)
		};
	};

	const sort = (data, type) => {
		if (type === "Most Recent") {
			data.sort((a, b) => {
				if (a.meta.createdOn < b.meta.createdOn) {
					return -1;
				}
				if (a.meta.createdOn > b.meta.createdOn) {
					return 1;
				}
			});
		}
		return data;
	};

	const hasSearch = (data) => {
		return config.search == "" ||
			data.meta.title
				.toLowerCase()
				.search(config.search.toLowerCase()) >= 0 ||
			data.meta.description
				.toLowerCase()
				.search(config.search.toLowerCase()) >= 0
	}

	const setFilteredTopic = (apiData) => {
		apiData.data.topics.forEach((topic) => {
			if (topic.isActive) {
				config.filterTopics.push(topic.title);
			}
			if (topic.isTrending) {
				config.isTrending.push(topic.title);
			}
		})
	}

	const scrollTop = () => {
		mainContainer.scrollTo({ top: 0});
	};

	const splideInit = () => {
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

	return {
		cropImage,
		timeConvert,
		getAppTheme,
		setAppTheme,
		initBack,
		sort,
		scrollNextPage,
		hasSearch,
		setFilteredTopic,
		scrollTop,
		splideInit
	};
};

