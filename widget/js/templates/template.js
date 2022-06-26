const { timeConvert, cropImage, sort } = utilities();
const templates = () => {
	const printRecommended = (container, durationState, assets_info, topicTitle) => {
		const recommendedTemplate = document.getElementById("recommendedTemplate");
		const nodesClone = recommendedTemplate.content.cloneNode(true);
		let image = nodesClone.querySelectorAll(".image");
		let category = nodesClone.querySelectorAll(".category");
		let title = nodesClone.querySelectorAll(".title");
		let duration = nodesClone.querySelectorAll(".duration");
		image[0].style.backgroundImage = `url('${cropImage(assets_info.meta.image)}')`;
		category[0].innerText = topicTitle;
		title[0].innerText = assets_info.meta.title;
		if (durationState) {
			duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
					<span class="schedule-text">
						${timeConvert(
				assets_info.meta.duration
			)}</span>`;
		}
		container.appendChild(nodesClone);
	}

	const forYouRender = (container, assets_info) => {
		const template = document.getElementById("forYouTemplate");

		const firstClone = template.content.cloneNode(true);
		let title = firstClone.querySelectorAll(".card-Text-Header");
		let note = firstClone.querySelectorAll(".card-Text-Note");
		let image = firstClone.getElementById("card_body");
		title[0].innerHTML = assets_info.meta.title;
		note[0].innerHTML = assets_info.meta.description;
		image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(assets_info.meta.image)}')`;
		container.appendChild(firstClone);
	};

	const filterAndPrintData = (apiData, container, durationState, section) => {
		container.innerHTML = '';
		let assets = [];
		let topicConfig = false;
		// Filtering section to compare it with sections comming from an api Data
		if (section !== "explore" && section !== "Just for you") {
			section = section.split(" ")[1];
		}
		// Get assets of the section from api Data
		apiData.data.sections.forEach((el) => {
			if (el.title === section) {
				assets = el.assets;
			}
		})

		// Get assets_info and topic from api Data then render section
		assets.forEach((el) => {
			let topicTitle;
			let assets_info = apiData.data.assets_info[el];

			assets_info.meta.topics.forEach(topic => {
				let data = apiData.data.topics.find(({ id }) => id === topic);
				topicTitle = data.title;
				if (config.filterArr.includes(topicTitle) || config.filterArr.length == 0) {
					topicConfig = true;
				} else {
					topicConfig = false;
				}
				if (topicConfig) {
					switch (section) {
						case "Just for you":
							forYouRender(container, assets_info)
							break;
						case "explore":

							break;
						default:
							printRecommended(container, durationState, assets_info, topicTitle)
							break;
					}
				}
			})
		})
	};

	const seeAllCardsRender = (apiData, container, durationState, sortDrawerResults) => {
    document.getElementById("seeAllContainer").innerHTML="";
    let coursesId = "e5bf59f3-507a-4703-af2a-bc4ba56cc4c2";
    let data = apiData.data.sections.filter((t) => t.id === coursesId);
    const recommendedTemplate = document.getElementById("seeAllTemplate");
    let assetsInfo = [];
    data.forEach((section) => {
      if (section.hasOwnProperty("assets")) {
        let assets = section.assets;
        assets.forEach((assetId) => {
          assetsInfo.push(apiData.data.assets_info[assetId]);
        });
      } else {
        return;
      }
      assetsInfo = sort(assetsInfo,sortDrawerResults);
      assetsInfo.forEach((el) => {
        const nodesClone = recommendedTemplate.content.cloneNode(true);
        let image = nodesClone.querySelectorAll(".image");
        let title = nodesClone.querySelectorAll(".title");
        let duration = nodesClone.querySelectorAll(".duration");
        let description = nodesClone.querySelectorAll(".description");
        description[0].innerText = el.meta.description;
        image[0].style.backgroundImage = `url('${cropImage(
          el.meta.image,
          "full_width",
          "4:3"
        )}')`;
        title[0].innerText = el.meta.title;
        if (durationState) {
          duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
              <span class="schedule-text">
                ${timeConvert(el.meta.duration)}</span>`;
        }
        // let topics = apiData.data.topics.filter((topic) =>
        //   assetsInfo.meta.topics.includes(topic.id)
        // );
        // topics.forEach((topic) => {});
        container.appendChild(nodesClone);
      });
    });
	};

	const trendingRender = (apiData, containerId) => {
		let data = apiData.data.topics;
		const container = document.getElementById(containerId);
		container.innerHTML = "";
		const trendingTemplate = document.getElementById("trendingTemplate");

		data.forEach((el) => {
			if (el.isTrending) {
				const nodesClone = trendingTemplate.content.cloneNode(true);
				let title = nodesClone.getElementById("trending-span");
				title.innerHTML = el.title;
				container.appendChild(nodesClone);

				if (config.filterArr.indexOf(el.title)>-1) {
					title.classList.add('selectedTrending');
				}

				title.addEventListener('click', () => {
					if (config.filterArr.indexOf(el.title)>-1) {
						title.classList.remove('selectedTrending');
						title.classList.add('unSelectedTrending');
						config.filterArr.splice(config.filterArr.indexOf(el.title), 1);
					} else {
						title.classList.add('selectedTrending');
						title.classList.remove('unSelectedTrending');
						config.filterArr.push(el.title);
					}
					config.exploreConfig.forEach((element) => {
						const container = document.getElementById(element.containerId);
						filterAndPrintData(fakeData, document.getElementById(`${element.containerId}`), element.duration, element.title)
					})
				})
			}
		});
	};



	return { filterAndPrintData, seeAllCardsRender, trendingRender };
};
