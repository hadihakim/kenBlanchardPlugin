
const { timeConvert, cropImage } = utilities();
const templates = () => {
  const forYouRender = (apiData, container, duration) => {
    let assetsId = apiData.data.sections[1].assets[0];
    let data = apiData.data.assets_info[assetsId];

    const template = document.getElementById("forYouTemplate");

    for (let i = 0; i < 6; i++) {
      const firstClone = template.content.cloneNode(true);
      let title = firstClone.querySelectorAll(".card-Text-Header");
      let note = firstClone.querySelectorAll(".card-Text-Note");
      let image = firstClone.getElementById("card_body");
      title[0].innerHTML = data.meta.title;
      note[0].innerHTML = data.meta.description;
      image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(data.meta.image)}')`;
      container.appendChild(firstClone);
    }
  };

  const recommendedCardRender = (apiData, container, durationState, section) => {
    container.innerHTML = '';
    let assets = [];
    let topicConfig = false;
    const recommendedTemplate = document.getElementById("recommendedTemplate");
    // Filtering section to compare it with sections comming from an api Data
    const mapObj = {
      All: "All", // Not usable for now.
      Recommended: ""
    };
    section = section.replace(/\b(?:All|Recommended)\b/gi, matched => mapObj[matched]).toLowerCase().trim();

    // Get assets of the section from api Data
    apiData.data.sections.forEach((el) => {
      let title = el.title.trim().toLowerCase()
      if (title === section) {
        assets = el.assets;
      }
    })

    // Get assets_info and topic from api Data then render section
    assets.forEach((el) => {
      let topicTitle;
      let assets_info = apiData.data.assets_info[el];
      apiData.data.topics.forEach((topic) => {
        if (topic.id === assets_info.meta.topics[0]) {
          topicTitle = topic.title;
        }
      })
      if (!appConfig.topics.length == 0) {
        appConfig.topics.forEach((el) => {
          if (el.text.toLowerCase() === topicTitle.toLowerCase()) {
            topicConfig = true;
          }
        })
      }else {
        topicConfig = true;
      }
      if (topicConfig) {
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
    })

    // Old WORK
    // let assetsId = apiData.data.sections[1].assets[0];
    // let data = apiData.data.assets_info[assetsId];
    // const recommendedTemplate = document.getElementById("recommendedTemplate");

    // for (let index = 0; index < 6; index++) {
    //   const nodesClone = recommendedTemplate.content.cloneNode(true);
    //   let image = nodesClone.querySelectorAll(".image");
    //   let category = nodesClone.querySelectorAll(".category");
    //   let title = nodesClone.querySelectorAll(".title");
    //   let duration = nodesClone.querySelectorAll(".duration");
    //   image[0].style.backgroundImage = `url('${cropImage(data.meta.image)}')`;
    //   category[0].innerText = data.type;
    //   title[0].innerText = data.meta.title;
    //   if (durationState) {
    //     duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
    // 		<span class="schedule-text">
    // 			${timeConvert(
    //       data.meta.duration
    //     )}</span>`;
    //   }
    //   container.appendChild(nodesClone);
    // }
  };

  const seeAllCardsRender = (apiData, container, durationState, callback) => {
    let assetsId = apiData.data.sections[1].assets[0];
    let data = apiData.data.assets_info[assetsId];

    const recommendedTemplate = document.getElementById("seeAllTemplate");
    for (let index = 0; index < 5; index++) {
      const nodesClone = recommendedTemplate.content.cloneNode(true);
      let image = nodesClone.querySelectorAll(".image");
      let title = nodesClone.querySelectorAll(".title");
      let duration = nodesClone.querySelectorAll(".duration");
      let description = nodesClone.querySelectorAll(".description");
      image[0].style.backgroundImage = `url('${cropImage(data.meta.image, "full_width", "4:3")}')`;
      title[0].innerText = data.meta.title;
      description[0].innerText = data.meta.description;
      if (durationState) {
        duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
				<span class="schedule-text">
					${timeConvert(
          data.meta.duration
        )}</span>`;
      }
      container.appendChild(nodesClone);
    }
    callback();
  };

  const trendingRender = (apiData, containerId) => {
    let data = apiData.data.topics;
    const container = document.getElementById(containerId);
    const trendingTemplate = document.getElementById("trendingTemplate");

    for (let i = 0; i < 3; i++) { // Loop only for testing mode
      data.forEach((el) => {
        if (el.isTrending) {
          const nodesClone = trendingTemplate.content.cloneNode(true);
          let title = nodesClone.querySelectorAll(".trending-span");
          title[0].innerHTML = el.title;
          container.appendChild(nodesClone);
        }
      });
    }
  };

  return { forYouRender, recommendedCardRender, seeAllCardsRender, trendingRender };
};
