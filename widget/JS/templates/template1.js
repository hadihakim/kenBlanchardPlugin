const  forYouRender = (dummyData, container, duration) => {
  const template = document.getElementById("for-you-template");
  // const firstClone = template.content.cloneNode(true);
  for(let i=0; i<dummyData.length; i++) {
    const firstClone = template.content.cloneNode(true);
 
    let header=firstClone.getElementById("for-you-header");
    header.innerHTML = dummyData[i].title;
    let note=firstClone.getElementById("for-you-note");
    note.innerHTML=dummyData[i].description;
    let image=firstClone.getElementById("for-you-img");
   image.src=dummyData[i].image;
   container.appendChild(firstClone);
  }
  

  // if (duration) {
  //   span.innerText = "9:h";
  // }

};
