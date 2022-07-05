const config = {
  userConfig: {
    firstName: "Michel",
    lastName: "Scott",
    email: "michel@gmail.com",
    growthProfile:"Newcomer",
    profilePicture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWHkQVsb4b-CS96W5FbUgyBLTrtpBNE-DSHg&usqp=CAU",
    badges: [
      {
        active:false,
        achievementTitle: "achievement",
        achievementIcon:
          "https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
      },
      {
        active:true,
        achievementTitle: "achievement 2",
        achievementIcon:
          "https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png",
      },
    ],
    recommendedTags: ["Conflict", "Coaching"],
    isLoggedIn: true,
  },
  appTheme: {},
  filterArr: [],
  sortType: "Default",
  activeSeeAll: "",
  cardsLimit: 7,
  isSeeAllScreen: false,
  fetchingNextPage: false,
  page: 1,
  pageSize: 5,
  lastIndex: 0,
  renderedCard: 0,
  search: "",
  //////////////////////
  searchFrom:"from-main",
  /////////////////////
  isTrending:[],
  filterTopics:[]
};
