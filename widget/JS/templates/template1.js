const  forYouRender = (dummyData, container, duration) => {
  const template = document.getElementById("template_1");
  // const firstClone = template.content.cloneNode(true);
  for(let i=0; i<dummyData.length; i++) {
    const firstClone = template.content.cloneNode(true);

    let header=firstClone.getElementById("card-Text-Header");
    header.innerHTML = dummyData[i].title;
    let note=firstClone.getElementById("card-Text-Note");
    note.innerHTML=dummyData[i].description;
    let image=firstClone.getElementById("card_body");

   image.style.backgroundImage= `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)), url(${dummyData[i].image})`;
   container.appendChild(firstClone);
  }


  // if (duration) {
  //   span.innerText = "9:h";
  // }

};
