const templates = () => {
  const forYouRender = (dummyData, container, duration) => {
    const template = document.getElementById("forYouTemplate");
    for (let i = 0; i < dummyData.length; i++) {
      const firstClone = template.content.cloneNode(true);

      let header = firstClone.getElementById("card-Text-Header");
      header.innerHTML = dummyData[i].title;
      let note = firstClone.getElementById("card-Text-Note");
      note.innerHTML = dummyData[i].description;
      let image = firstClone.getElementById("card_body");

      image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)), url(${dummyData[i].image})`;
      container.appendChild(firstClone);
    }
  };

  const recommendedCardRender = (dummyData, container, durationState) => {
    let assetsId = dummyData.data.sections[1].assets[0];
    let data = dummyData.data.assets_info[assetsId];
    const recommendedTemplate = document.getElementById("recommendedTemplate");

    for (let index = 0; index < 6; index++) {
      const nodesClone = recommendedTemplate.content.cloneNode(true);
      let image = nodesClone.querySelectorAll(".image");
      let category = nodesClone.querySelectorAll(".category");
      let title = nodesClone.querySelectorAll(".title");
      let duration = nodesClone.querySelectorAll(".duration");
      image[0].style.backgroundImage = `url('${data.meta.image}')`;
      category[0].innerText = data.type;
      title[0].innerText = data.meta.title;
      if (durationState) {
        duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span> ${timeConvert(
          data.meta.duration
        )}`;
      }
      container.appendChild(nodesClone);
    }
  };

  const seeAllCardsRender = (dummyData, container, durationState) => {
    let assetsId = dummyData.data.sections[1].assets[0];
    let data = dummyData.data.assets_info[assetsId];

    const recommendedTemplate = document.getElementById("seeAllTemplate");
    for (let index = 0; index < 6; index++) {
      const nodesClone = recommendedTemplate.content.cloneNode(true);
      let image = nodesClone.querySelectorAll(".image");
      let title = nodesClone.querySelectorAll(".title");
      let duration = nodesClone.querySelectorAll(".duration");
      let description = nodesClone.querySelectorAll(".description");
      image[0].style.backgroundImage = `url('${data.meta.image}')`;
      title[0].innerText = data.meta.title;
      description[0].innerText = data.meta.description;
      if (durationState) {
        duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span> ${timeConvert(
          data.meta.duration
        )}`;
      }
      container.appendChild(nodesClone);
    }
  };

  const trendingRender = (data, containerId) => {
    const container = document.getElementById(containerId);
    const trendingTemplate = document.getElementById("trendingTemplate");
    data.forEach((el, idx) => {
      console.log();
      const nodesClone = trendingTemplate.content.cloneNode(true);
      let title = nodesClone.querySelectorAll(".trending-span");
      title[0].innerHTML = "trending";
      container.appendChild(nodesClone);
    });
  };

  return { forYouRender, recommendedCardRender, seeAllCardsRender, trendingRender };
};
