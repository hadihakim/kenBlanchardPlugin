const trendingRender = (data, container) => {
    const traningTemplate = document.getElementById("trendingTemplate");
   data.forEach((el, idx) => {
    console.log();
      const nodesClone =traningTemplate.content.cloneNode(true);
      let title = nodesClone.querySelectorAll(".trending-span");
    // title[0].innerHTML = el.title;
    title[0].innerHTML = "trending";
    container.appendChild(nodesClone);
    });
  };
  