const render3 = (dummyData, container, durationState) => {
  let assetsId = dummyData.data.sections[1].assets[0];
  let data = dummyData.data.assets_info[assetsId];

  const template2 = document.getElementById("template3");
  for (let index = 0; index < 6; index++) {
    const nodesClone = template2.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let title = nodesClone.querySelectorAll(".title");
    let duration = nodesClone.querySelectorAll(".duration");
    let description = nodesClone.querySelectorAll(".description");
    image[0].style.backgroundImage = `url('${data.meta.image}')`;
    title[0].innerText = data.meta.title;
    description[0].innerText = data.meta.description;
    if (durationState) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span> ${timeConvert(data.meta.duration)}`;
    }
    container.appendChild(nodesClone);
  }
};

