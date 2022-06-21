"use strict";
let dummyData = [];
apiCall().then((res) => {
  dummyData = res;
  render();
});

const render = () => {
    const container1 = document.getElementById("container1");
    const container2 = document.getElementById("container2");
    render1(dummyData,container1,true);
    render1(dummyData,container2,false);
};
