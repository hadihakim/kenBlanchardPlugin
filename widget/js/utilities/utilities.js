class Utilities {
	static state = {
		appTheme:{},
	}

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
			this.state.appTheme = appTheme;
			console.log(appTheme, "APP THEME");
		});
	};

	static LightenDarkenColor=(col, amt)=> {

		// col => color 
		// amt => the amount of chnging the color
		// if you passed positive number the color will be lighter
		// if you passed nigative number the color will be darken

		let usePound = false;
		if (col[0] == "#") {
			col = col.slice(1);
			usePound = true;
		}
	 
		let num = parseInt(col,16);
	 
		let r = (num >> 16) + amt;
		if (r > 255) r = 255;
		else if  (r < 0) r = 0;
	 
		let b = ((num >> 8) & 0x00FF) + amt;
		if (b > 255) b = 255;
		else if  (b < 0) b = 0;
	 
		let g = (num & 0x0000FF) + amt;
		if (g > 255) g = 255;
		else if (g < 0) g = 0;
	 
		return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
	  
	}

	static setThemeHandler = (arr, type, color) => {
		for (let i = 0; i < arr.length; i++) {
			let newColor;
			switch (type) {
				case "color":
					arr[i].setAttribute( 'style', `fill: ${color} !important` );
					arr[i].setAttribute( 'style', `color: ${color} !important` );
					break;
				case "back":
					// arr[i].style.backgroundColor = color;
					arr[i].setAttribute( 'style', `background-color: ${color} !important` );
					break;
				case "borderColor":
					newColor = this.LightenDarkenColor(color, 20)
					arr[i].setAttribute( 'style', `border-color: ${newColor} !important` );
					break;
				case "backPercentage":
					newColor = this.LightenDarkenColor(color, 55)
					arr[i].setAttribute( 'style', `background-color: ${newColor} !important` );
					break;
				default:
					break;
			}
		}
	};

	static setAppTheme = () => {
		let colorCollections = [
			{
				elements: [...document.getElementsByClassName("icon"), ...document.getElementsByClassName("arrow-color")],
				colorType: "color",
				colorDegree: this.state.appTheme.colors.icons,
			},
			{
				elements: document.getElementsByClassName("primaryBtn-AppTheme"),
				colorType: "back",
				colorDegree: this.state.appTheme.colors.defaultTheme,
			},
			{
				elements: document.getElementsByClassName("defaultlink-AppTheme"),
				colorType: "color",
				colorDegree: this.state.appTheme.colors.defaultTheme,
			},
			{
				elements: document.getElementsByClassName("headerText-AppTheme"),
				colorType: "color",
				colorDegree: this.state.appTheme.colors.headerText,
			},
			{
				elements: document.getElementsByClassName("barText-AppTheme"),
				colorType: "color",
				colorDegree: this.state.appTheme.colors.titleBarTextAndIcons,
			},
			{
				elements: document.getElementsByClassName("bodyText-AppTheme"),
				colorType: "color",
				colorDegree: this.state.appTheme.colors.bodyText,
			},
			{
				elements: document.getElementsByClassName("userContainer"),
				colorType: "back",
				colorDegree: this.state.appTheme.colors.titleBar,
			},
			{
				elements: document.getElementsByClassName("user-image-border"),
				colorType: "borderColor",
				colorDegree: this.state.appTheme.colors.titleBar,
			},
			{
				elements: document.getElementsByClassName("info-btn-AppTheme"),
				colorType: "back",
				colorDegree: this.state.appTheme.colors.infoTheme,
			},
			{
				elements: document.getElementsByClassName("info-link-AppTheme"),
				colorType: "color",
				colorDegree: this.state.appTheme.colors.infoTheme,
			},
			{
				elements: document.getElementsByClassName("infoTheme"),
				colorType: "back",
				colorDegree: this.state.appTheme.colors.infoTheme,
			},
			{
				elements: document.getElementsByClassName("holderPercentage"),
				colorType: "backPercentage",
				colorDegree: this.state.appTheme.colors.infoTheme,
			}
		];

		colorCollections.forEach((element) => {
			this.setThemeHandler(element.elements, element.colorType, element.colorDegree);
		});
	};

	static _fetchNextList = () => {
		config.fetchingNextPage = true;
		if (config.searchFrom == "from-explore" || config.searchFrom == "from-main") {
			console.log("test");
			Search.searchCardsRender(seeAllContainer, () => { config.fetchingNextPage = false; })
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
			input.value = "";

			buildfire.history.get(
				{
					pluginBreadcrumbsOnly: true,
				},
				(err, result) => {
					if (err) return console.log(err);
					if (result.length) {
						switch (result[result.length - 1].label) {
								
							case "Explore":
								Navigation.openMain();
								break;
							// case "Home from See All":
							// 	Navigation.openMain();
							// 	break;
							// case "Explore from See All":
							// 	Navigation.openExplore();
							// 	break;
							// case "Explore from Details":
							// 	Navigation.openExplore();
							// 	break;
							// case "See All from Details":
							// 	if (config.searchFrom == "from-main" || config.searchFrom == "from-explore") {
							// 		Navigation.openSearch();
							// 	} else if (config.searchFrom == "from-see-all") {
							// 		Navigation.openSeeAll();
							// 	}
								// break;
							// case "page detail from chapter":
							// 	let id = result[result.length - 1].options.id;
							// 	Navigation.openPageDetails(id);
							// 	PageDetails.setState(id);
							// 	PageDetails.init();
							// 	break;
							// case "Details from CourseDetails":
							// 	let id2 = result[result.length - 1].options.id;
							// 	Navigation.openPageDetails();
							// 	PageDetails.setState(id2);
  							// 	PageDetails.init();
							// 	break;
							case "Search":
								if (config.searchFrom == "from-main") {
									Navigation.openMain();
								} else if (config.searchFrom == "from-explore") {
									Navigation.openExplore();
								}
								Navigation.setData(true);
								break;
							case "Growth Profile":
								Navigation.openMain();
								break;
							// case "user profile from list":
							// 	Navigation.openUserProfile();
							// 	break;

							// case "user List from temEffectiveness list":
							// 	Navigation.openUserList();
							// 	break;
							default:
								let from=result[result.length-1].options.from;
								if(from == "Home from See All" || from == "Home from Details"){
									Navigation.openMain();
								}else if (from == "Explore from See All" || from== "Explore from Details"){
									Navigation.openExplore();
								}else if( from == "See All from Details"){
									if (config.searchFrom == "from-main" || config.searchFrom == "from-explore") {
										Navigation.openSearch();
									} else if (config.searchFrom == "from-see-all") {
										Navigation.openSeeAll();
									}
								}else if(from == "page detail from chapter" || from == "Details from CourseDetails"){
									let id = result[result.length - 1].options.id;
									Navigation.openPageDetails(id);
									
								}else if(from == "user profile from list"){
									Navigation.openUserProfile();
								}else if (from == "user List from temEffectiveness list" || from == "User list from Details"){
									Navigation.openUserList();
								}else if(from =="Personal home Page"){
									Navigation.openMain();
								}else if (from =="active list from CourseDetails"){
									Navigation.openTeamEffectivenessList(result[result.length-1].options.to);
								}
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
		mainContainer.scrollTo({ top: 0 });
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

	static showDialog = (options) => {
		buildfire.dialog.show(
			options,
			(err, actionButton) => {
			  if (err) console.error(err);
		  
			  if (actionButton && actionButton.text == "Cancel") {
				console.log("Cancel clicked");
			  }
			}
		  );
	};

	static setAttributesHandler=(el,attrs)=>{
		for(var key in attrs) {
			el.setAttribute(key, attrs[key]);
		  }
	}
};

