"use strict";
document.getElementById("userProfilePicture").addEventListener("click", () => {
  Navigation.openUserProfile();
});
const init = () => {
  Settings.get((err, res)=>{
    console.log(res);
  })
  Utilities.getAppTheme();
  UserProfile.init();
  Explore.setPageData({data:fakeData,userData:config.userConfig});
  Explore.init("main");
  Explore.init("explore");
  Search.setData(fakeData);
  Search.init();
  Utilities.initBack();
  MyList.loadCharts();
  MyList.loadList();
  Utilities.setAppTheme();
};

init();
