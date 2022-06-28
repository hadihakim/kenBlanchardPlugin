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
      console.log(appTheme);
      config.appTheme = appTheme;
    });
  };

  const setThemeHandler = (arr, type, color) => {
    for (let i = 0; i < arr.length; i++) {
      switch (type) {
        case "color":
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
        elements: document.getElementsByClassName("icon"),
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
		buildfire.navigation.onBackButtonClick = () => {
			buildfire.history.get(
				{
					pluginBreadcrumbsOnly: true,
				},
				(err, result) => {
					switch (result[result.length - 1].label) {
						case "Personal Home Page":
							mainPage.classList.remove("hidden");
							subPage.classList.add("hidden");
							userContainer.classList.remove("hidden");
							sortIcon.classList.add("hidden");
							break;
						case "Personal Home Page from See All":
							mainPage.classList.remove("hidden");
							seeAllContainer.classList.add("hidden");
							config.renderedCard = 0;
							config.page = 1;
							config.lastIndex = 0;
							config.isSeeAllScreen = false;
							userContainer.classList.remove("hidden");
							sortIcon.classList.add("hidden");
							mainContainer.removeEventListener('scroll', scrollNextPage);
							break;
						case "Explore page":
							subPage.classList.remove("hidden");
							seeAllContainer.classList.add("hidden");
							config.renderedCard = 0;
							config.page = 1;
							config.lastIndex = 0;
							config.isSeeAllScreen = false;
							mainContainer.removeEventListener('scroll', scrollNextPage);
							break;
							case "Details Page":
								mainPage.classList.add("hidden");
								userContainer.classList.add("hidden");
								sortIcon.classList.remove("hidden");
								subPage.classList.add("hidden");
								seeAllContainer.classList.remove("hidden");
								pageDetails.classList.add("hidden");

								break;

						default:
							break;
					}
				}
			);
			scrollTop();
			buildfire.history.pop();
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
		mainContainer.scrollTo({ top: 0, behavior: "smooth" });
	};
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
		scrollTop
	};
};

