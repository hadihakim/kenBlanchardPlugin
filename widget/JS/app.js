"use strict";
let dummyData = [];
apiCall().then((res) => {
  dummyData = res;
  render(dummyData);
  console.log("dddd", dummyData);
});

const render = (dummyData) => {
    // const container1 = document.getElementById("container1");
    // const container2 = document.getElementById("container2");
    // render1(dummyData,container1,true);
    // render1(dummyData,container2,false);

    const forYouContainer = document.getElementById("for-you-container");
    forYouRender(dummyData,forYouContainer);

};
