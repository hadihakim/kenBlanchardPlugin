"use strict";
let dummyData = [];
apiCall().then((res) => {
  dummyData = res;
  render();
});

const render = () => {
  const section1 = document.getElementById("section1");
  const template1 = document.getElementById("template1");
  const firstClone = template1.content.cloneNode(true);
  section1.appendChild(firstClone);
};
