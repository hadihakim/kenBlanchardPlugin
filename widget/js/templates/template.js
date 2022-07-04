const { timeConvert, cropImage, sort } = utilities();
// page handler
const { graphicalSummariesFirstPage } = pageHandler();
const templates = () => {
	const printRecommended = (
		container,
		durationState,
		assets_info,
		topicTitle,
		id
	) => {
		const recommendedTemplate = document.getElementById("recommendedTemplate");
		const nodesClone = recommendedTemplate.content.cloneNode(true);
		let image = nodesClone.querySelectorAll(".image");
		let category = nodesClone.querySelectorAll(".category");
		let title = nodesClone.querySelectorAll(".title");
		let duration = nodesClone.querySelectorAll(".duration");
		let card = nodesClone.querySelectorAll(".mdc-card");
		image[0].style.backgroundImage = `url('${cropImage(
			assets_info.meta.image
		)}')`;
		category[0].innerText = topicTitle;
		title[0].innerText = assets_info.meta.title;
		if (durationState) {
			duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
					<span class="schedule-text">
						${timeConvert(assets_info.meta.duration)}</span>`;
		}
		card[0].addEventListener("click", () => {
			openDetails(id);
		});
		container.appendChild(nodesClone);
		setAppTheme();
	};

	const forYouRender = (container, assets_info, id) => {
		const template = document.getElementById("forYouTemplate");
		const firstClone = template.content.cloneNode(true);
		let title = firstClone.querySelectorAll(".card-Text-Header");
		let note = firstClone.querySelectorAll(".card-Text-Note");
		let image = firstClone.getElementById("card_body");
		let card = firstClone.querySelectorAll(".mdc-card");
		title[0].innerHTML = assets_info.meta.title;
		note[0].innerHTML = assets_info.meta.description;
		image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(assets_info.meta.image)}')`;

		card[0].addEventListener("click", () => {
			openDetails(id);
		});
		container.appendChild(firstClone);
		setAppTheme();
	};

	const detailsRender = (container, id) => {
		let data = fakeData.data.assets_info[id];
		data.id = id;
		if (data.type === "summary") {
			data = summaryData;
			data.id = id;
			graphicalSummaries(data)
		} else {
			const template = document.getElementById("detailsPageTemplate");
			const firstClone = template.content.cloneNode(true);
			let image = firstClone.querySelectorAll(".details-img");
			let title = firstClone.querySelectorAll(".details-title");
			let duration = firstClone.querySelectorAll(".duration-details");
			let startCourse = firstClone.querySelectorAll(".startCourse");
			let descriptionTitle = firstClone.querySelectorAll(".description-title");
			let descriptionText = firstClone.querySelectorAll(".description-text");
			let learnTitle = firstClone.querySelectorAll(".learn-title");
			let lessonTitle = firstClone.querySelectorAll(".lesson-title");
			let learnItem = firstClone.querySelectorAll(".lesson-list");
			let lessonItem = firstClone.querySelectorAll(".learn-list");
			// give the button inner text -->
			startCourse[0].innerHTML = Strings.START_COURSE;

			image[0].style.backgroundImage = `url('${cropImage(
				data.meta.image,
				"full_width",
				"4:3"
			)}')`;
			title[0].innerHTML = data.meta.title;
			if (data.meta.duration) {
				duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" style="font-size: 1rem !important;"> schedule </span>
							<span class="schedule-text bodyText-AppTheme">
						${timeConvert(data.meta.duration)}</span>`;
			}
			descriptionTitle[0].innerHTML = "Description"
			descriptionText[0].innerHTML = "When one of your team members is at the Disillusioned learner stage on a goal, they have some knowledge and skills but are not yet competent. They can easily get stuck, become discouraged, and even feel ready to quit. Their commitment is low."
			learnTitle[0].innerHTML = "what you'll learn"
			lessonTitle[0].innerHTML = "Lessons"
			for (let i = 0; i < 4; i++) {
				ui.createElement(
					"li",
					lessonItem[0],
					"Introduction to the Course Focus",
					["lesson-list-item"],
					`lesson-list-item${i}`
				);
			}
			for (let i = 0; i < 4; i++) {
				ui.createElement(
					"li",
					learnItem[0],
					"Someone to listen to their concerns",
					["learn-list-item"],
					`learn-list-item${i}`
				);
			}
			container.appendChild(firstClone);
		}

		setAppTheme();
	};

	const filterAndPrintData = (apiData, element, type) => {
		if (
			(type == "explore" && element.isExplore && element.isActive) ||
			(element.isActive && type !== "explore")
		) {
			//   return;
			// id , containerId, duration, title, containerClassName, className, sectionContainer
			// id , id-container, title, type, layout, element.id
			let sectionsContainer = document.getElementById(`${element.id}-${type}`);
			let container = document.getElementById(`${element.id}-container-${type}`);
			container.innerHTML = "";
			let isEmpty = true;
			let assets = element.assets;
			let foundInSearch = 0;
			let renderArray = [];
			let topicConfig = false;
			let cardsNumber = 0;
			// Filtering section to compare it with sections comming from an api Data

			// Get assets_info and topic from api Data then render section
			assets.forEach((el) => {
				if (cardsNumber === config.cardsLimit) {
					return;
				}
				let topicTitle;
				let assets_info = apiData.data.assets_info[el];

				// assets_info.meta.topics.forEach((topic) =>
				for (let i = 0; i < assets_info.meta.topics.length; i++) {
					if (cardsNumber === config.cardsLimit) {
						return;
					}
					let data = apiData.data.topics.find(({ id }) => id === assets_info.meta.topics[i]);
					topicTitle = data.title;
					if (
						config.filterArr.includes(topicTitle) ||
						config.filterArr.length == 0
					) {
						topicConfig = true;
						break;
					} else {
						topicConfig = false;
					}
				};
				if (topicConfig) {
					cardsNumber += 1;
					isEmpty = false;
					if (hasSearch(assets_info)) {
						renderArray.push({
							container,
							durationState: assets_info.meta.duration,
							assets_info,
							topicTitle,
							meta: assets_info.meta,
							layout: element.layout,
							id: el,
						});
						foundInSearch++;
					} else {
						foundInSearch--;
					}
					return;
				}
			});
			if (sectionsContainer) {
				if (isEmpty || foundInSearch < 0) {
					sectionsContainer.classList.add("hidden");
				} else {
					sectionsContainer.classList.remove("hidden");
					renderArray = sort(renderArray, config.sortType);
					renderArray.forEach((element) => {
						if (element.layout !== "horizontal-1") {
							printRecommended(
								element.container,
								element.durationState,
								element.assets_info,
								element.topicTitle,
								element.id
							);
						} else {
							forYouRender(element.container, element.assets_info, element.id);
						}
					});
				}
			}
		}

	};

	const seeAllCardsRender = (apiData, container, durationState, callback) => {
		if (config.renderedCard === 0) {
			config.page = 1;
			config.lastIndex = 0;
			document.getElementById("seeAllContainer").innerHTML = "";
		}
		const seeAllTemplate = document.getElementById("seeAllTemplate");

		let sectionData =
			apiData.data.sections.find(({ id }) => id == config.activeSeeAll) || {};
		let assetsInfo = [];
		let ids = [];
		let assets = sectionData.assets || [];
		assets.forEach((assetId) => {
			let assetData = apiData.data.assets_info[assetId];
			assetData.id = assetId;
			//   assetsInfo.push({data: apiData.data.assets_info[assetId] , id: assetId});
			assetsInfo.push(assetData);

			ids.push(assetId);
		});
		// sort
		assetsInfo = sort(assetsInfo, config.sortType);

		// let lastIndex = config.lastIndex;
		for (
			let lastIndex = config.lastIndex;
			lastIndex < lastIndex + config.pageSize;
			lastIndex++
		) {
			if (
				config.renderedCard == config.pageSize * config.page ||
				lastIndex >= assetsInfo.length
			) {
				config.lastIndex = lastIndex;
				callback();
				config.page++;
				if (config.renderedCard == 0) {
					openEmptySearch();
				} else {
					openSeeAll();
				}
				return;
			} else {
				let topicIdArray = assetsInfo[lastIndex].meta.topics;
				let printCard = false;
				topicIdArray.forEach((topicId) => {
					let data = apiData.data.topics.find(({ id }) => id === topicId);
					if (
						(config.filterArr.includes(data.title) ||
							config.filterArr.length === 0) &&
						hasSearch(assetsInfo[lastIndex])
					) {
						printCard = true;
					}
				});
				if (printCard) {
					config.renderedCard++;
					const nodesClone = seeAllTemplate.content.cloneNode(true);

					let image = nodesClone.querySelectorAll(".image");
					let title = nodesClone.querySelectorAll(".title");
					let duration = nodesClone.querySelectorAll(".duration");
					let description = nodesClone.querySelectorAll(".description");
					let card = nodesClone.querySelectorAll(".mdc-card");
					description[0].innerText = assetsInfo[lastIndex].meta.description;
					image[0].style.backgroundImage = `url('${cropImage(
						assetsInfo[lastIndex].meta.image,
						"full_width",
						"4:3"
					)}')`;
					let id = assetsInfo[lastIndex].id;
					title[0].innerText = assetsInfo[lastIndex].meta.title;
					if (durationState && assetsInfo[lastIndex].meta.duration > 0) {
						duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
								<span class="schedule-text">
							${timeConvert(assetsInfo[lastIndex].meta.duration)}</span>`;
					}
					card[0].addEventListener("click", () => {
						openDetails(id);
					});
					container.appendChild(nodesClone);
				}
			}
		}
		setAppTheme();
	};
///////////////////////////////////////////////////////////////////
	const searchCardsRender = (apiData, container, callback) => {
		if (config.renderedCard === 0) {
			config.page = 1;
			config.lastIndex = 0;
			document.getElementById("seeAllContainer").innerHTML = "";
		}
		let assetsInfo = [];
		const seeAllTemplate = document.getElementById("seeAllTemplate");
		apiData.data.sections.forEach((element) => {
			element. assets.forEach((assetId) => {
					let assetData = apiData.data.assets_info[assetId];
					assetData.id = assetId;
					assetsInfo.push(assetData);
				});
		})
		assetsInfo = sort(assetsInfo, config.sortType);
		console.log("assetsInfo: " , assetsInfo.length, "assetsInfo: " , assetsInfo);
		if(config.lastIndex >= assetsInfo.length){
			return;
		}
		for (
			let lastIndex = config.lastIndex;
			lastIndex < lastIndex + config.pageSize;
			lastIndex++
		) {
			console.log(config.renderedCard, config.pageSize, assetsInfo.length, lastIndex  );
			if (
				config.renderedCard == config.pageSize *config.page ||
				lastIndex >= assetsInfo.length
			) {
				config.lastIndex = lastIndex;
				callback();
				config.page++;
				console.log("first log", config.lastIndex , " ", config.page);
				if (config.renderedCard == 0) {
					openEmptySearch();
				} else {
					openSearch();
				}
			return
			} else {
				console.log("test", config.page,"  ", config.lastIndex);

				let topicIdArray = assetsInfo[lastIndex].meta.topics;
				let printCard = false;
				topicIdArray.forEach((topicId) => {
					let data = apiData.data.topics.find(({ id }) => id === topicId);
					if (
						(config.filterArr.includes(data.title) ||
							config.filterArr.length === 0) &&
						hasSearch(assetsInfo[lastIndex])
					) {
						printCard = true;
					}
				});
				if (printCard) {
					config.renderedCard++;
					const nodesClone = seeAllTemplate.content.cloneNode(true);
					let image = nodesClone.querySelectorAll(".image");
					let title = nodesClone.querySelectorAll(".title");
					let duration = nodesClone.querySelectorAll(".duration");
					let description = nodesClone.querySelectorAll(".description");
					let card = nodesClone.querySelectorAll(".mdc-card");
					description[0].innerText = assetsInfo[lastIndex].meta.description;
					image[0].style.backgroundImage = `url('${cropImage(
						assetsInfo[lastIndex].meta.image,
						"full_width",
						"4:3"
					)}')`;
					let id = assetsInfo[lastIndex].id;
					title[0].innerText = assetsInfo[lastIndex].meta.title;
					if (assetsInfo[lastIndex].meta.duration > 0) {
						duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
								<span class="schedule-text">
							${timeConvert(assetsInfo[lastIndex].meta.duration)}</span>`;
					}
					card[0].addEventListener("click", () => {
						openDetails(id);
					});
					container.appendChild(nodesClone);
				}
			}
		}
		setAppTheme();
	};
//////////////////////////////////////////////////////////////////

	const trendingRender = (containerId) => {
		const container = document.getElementById(containerId);
		if(container){
			container.innerHTML = "";
			const trendingTemplate = document.getElementById("trendingTemplate");

			config.isTrending.forEach((trendingTopic) => {
				const nodesClone = trendingTemplate.content.cloneNode(true);
				let title = nodesClone.getElementById("trending-span");
				title.innerHTML = trendingTopic;
				container.appendChild(nodesClone);

				if (config.filterArr.indexOf(trendingTopic) > -1) {
					title.classList.add("selectedTrending");
				} else {
					title.classList.add("unSelectedTrending");
				}

				title.addEventListener("click", () => {
					if (config.filterArr.indexOf(trendingTopic) > -1) {
						title.classList.remove("selectedTrending");
						title.classList.add("unSelectedTrending");
						config.filterArr.splice(config.filterArr.indexOf(trendingTopic), 1);
					} else {
						title.classList.add("selectedTrending");
						title.classList.remove("unSelectedTrending");
						config.filterArr.push(trendingTopic);
					}

					////////////////////////////////////////////////////
					fakeData.data.sections.forEach((element) => {
						if (element.isExplore) {
							const container = document.getElementById(`${element.id}-container-explore`);
							if (element.layout == "horizontal-1") {
								horizontal1_Skeleton(container);
							}
							else {
								horizontal_Skeleton(container);
							}
						}
						const myTimeout = setTimeout(() => { filterAndPrintData(fakeData, element, 'explore') }, 1000);

					})
//////////////////////////////////////////////////////
				});
			});
			setAppTheme();
		}
	};

	const graphicalSummaries = (data) => {
		let pageDetails = document.getElementById("pageDetails");
		pageDetails.innerHTML = "";
		graphicalSummariesFirstPage(data, pageDetails)
	}
	
	return {
		filterAndPrintData,
		seeAllCardsRender,
		trendingRender,
		detailsRender,
		///////////////////////
		searchCardsRender,
		///////////////////////
	};
};
