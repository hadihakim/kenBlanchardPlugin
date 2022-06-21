const render1 = (dummyData, container, duration) => {
  const template1 = document.getElementById("template2");
  const firstClone = template1.content.cloneNode(true);
  container.appendChild(firstClone);
};
