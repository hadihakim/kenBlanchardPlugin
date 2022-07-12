"use strict";
document.getElementById("userProfilePicture").addEventListener("click", () => {
  Navigation.openUserProfile();
});


const init = (data) => {
  console.log("user -->",authManager.currentUser);
  Utilities.getAppTheme();
  UserProfile.init(authManager.currentUser);
  Explore.setPageData({ data: { data }, userData: authManager.currentUser });
  Explore.init("main");
  Explore.init("explore");
  Search.setData({ data });
  Search.init();
  Utilities.initBack();
  MyList.loadCharts();
  MyList.loadList();
  Utilities.setAppTheme();
};


let promise = new Promise(function (resolve, reject) {
  authManager.enforceLogin();
  if (!authManager.currentUser) {
    Settings.get((err, res) => {
      if (err) reject(err);
      resolve(init(res));
    })
  }
});

// promise.then(
//   result => console.log("ererer *->",result)
// );