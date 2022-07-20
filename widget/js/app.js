"use strict";
document.getElementById("userProfilePicture").addEventListener("click", () => {
  Navigation.openUserProfile();
});


const loadData = async (data) => {
  let userData = await authManager.currentUser;
  UserProfile.init(userData);
  Explore.init();
  Search.setData({ data });
  Search.init();
  Utilities.initBack();
  Navigation.openMain();
  Utilities.setAppTheme();
};

const init = async() => {
  Skeleton.initMainSkeleton(sectionsContainer);
  Utilities.getAppTheme();
  UserProfile.init();
  Utilities.setAppTheme();

  await HandleAPI.getSettingsData();
  await HandleAPI.getCurrentUser();
  loadData(HandleAPI.state.data)
  // Utilities.achievedBadgeDialog();
  //  Assets.getAssetTypetPerTopicsStats("summary",(err,res)=>{
  //   console.log("res>>>",res);
  // })


}

init();