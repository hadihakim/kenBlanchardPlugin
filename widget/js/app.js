"use strict";
document.getElementById("userProfilePicture").addEventListener("click", () => {
  Navigation.openUserProfile();
});


const init = async (data) => {
  await getCurrentUser();
  Utilities.getAppTheme();
  UserProfile.init(authManager.currentUser);
  Explore.setPageData({ data: { data }, userData: authManager.currentUser });
  Explore.init("main");
  Explore.init("explore");
  Search.setData({ data });
  Search.init();
  Utilities.initBack();
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

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    Profiles.get((err, res) => {
      if (err) reject(err)
      console.log('current user -=>', res);
      resolve(res)
    })
  });
}

// promise.then(
//   result => console.log("ererer *->",result)
// );