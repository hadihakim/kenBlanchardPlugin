const render2 = (dummyData, container, durationState) => {
  const template2 = document.getElementById("template2");
  dummyData.forEach((el, idx) => {
    const nodesClone = template2.content.cloneNode(true);
    let image = nodesClone.querySelectorAll(".image");
    let category = nodesClone.querySelectorAll(".category");
    let title = nodesClone.querySelectorAll(".title");
    let duration = nodesClone.querySelectorAll(".duration");
    console.log(el.image);
    image[0].style.backgroundImage = `url(${el.image})`;
    category[0].innerText = el.category;
    title[0].innerText = el.title;
    if (durationState) {
      duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span> 2h 20min`;
    }
    container.appendChild(nodesClone);
  });
};
