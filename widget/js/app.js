"use strict";
document.getElementById("userProfilePicture").addEventListener("click", () => {
  Navigation.openUserProfile();
});


const loadData = async (data) => {
  UserProfile.init(authManager.currentUser);
  Explore.setPageData({ data: { data }, userData: authManager.currentUser });
  Explore.init("main");
  Explore.init("explore");
  Search.setData({ data });
  Search.init();
  Utilities.initBack();
  Navigation.openMain();
  Utilities.setAppTheme();
};

const init = async() => {
  Utilities.getAppTheme();
  // UserProfile.init();
  // Skeleton.initMainSkeleton(sectionsContainer);
  Utilities.setAppTheme();

  await HandleAPI.getSettingsData();
  await HandleAPI.getCurrentUser();
  loadData(HandleAPI.state.data)
}

init();