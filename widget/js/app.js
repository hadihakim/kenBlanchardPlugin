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

const init = async () => {
  Skeleton.initMainSkeleton(sectionsContainer);
  Utilities.getAppTheme();
  UserProfile.init();
  Utilities.setAppTheme();

  await HandleAPI.getSettingsData();
  await HandleAPI.getCurrentUser();
<<<<<<< HEAD
  loadData(HandleAPI.state.data)
  // Utilities.achievedBadgeDialog();
  //  Assets.getAssetTypetPerTopicsStats("summary",(err,res)=>{
  //   console.log("res>>>",res);
  // })


=======
  loadData(HandleAPI.state.data);
>>>>>>> 5b3bc51534fd29f0411f1bbb8f545df64247774e
}

init();