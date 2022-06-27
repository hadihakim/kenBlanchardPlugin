"use strict";

const scrollTop = () => {
  mainContainer.scrollTo({ top: 0, behavior: "smooth" });
};
// let filterTopics = [
//   "Coaching",
//   "Conflict",
//   "Customer Service",
//   "Change & Innovation",
//   "Diversity, Equity & Inclusion ",
//   "Change & Innovation",
//   "Leading People",
//   "Performance Management",
//   "Personal Effectiveness",
//   "Team Effectiveness",
//   "Working with Others",
//   "Trust",
//   "Inactive Topic",
// ];

let filterTopics=[];
fakeData.data.topics.forEach((el) => {
// console.log( el.title , " el.title;");
filterTopics.push(el.title);
})

function filterDrawer() {
  buildfire.components.drawer.open(
    {
      content: "Topics",
      multiSelection: true,
      allowSelectAll: true,
      multiSelectionActionButton: { text: "Apply" },
      enableFilter: true,
      isHTML: true,
      triggerCallbackOnUIDismiss: false,
      autoUseImageCdn: true,
      listItems: filterTopics.map((topic) => {
        return { text: topic, selected: config.filterArr.includes(topic) };
      }),
    },
    (err, result) => {
      if (err) return console.error(err);
      config.filterArr = [];
      result.forEach((topic) => {
        config.filterArr.push(topic.text);
      });

      config.sectionConfig.forEach((el) => {
        filterAndPrintData(
          fakeData,
          document.getElementById(`${el.containerId}`),
          el.duration,
          el.title,
          el.id
        );
      });

      config.exploreConfig.forEach((element) => {
        filterAndPrintData(
          fakeData,
          document.getElementById(`${element.containerId}`),
          element.duration,
          element.title,
          element.id
        );
      });
      seeAllCardsRender(
        fakeData,
        document.getElementById("seeAllContainer"),
        true,
		()=>{}
      );

      trendingRender(fakeData, "trendingContainer");
    }
  );
}

function sortDrawer() {
  buildfire.components.drawer.open(
    {
      content: "Sorting",
      multiSelection: false,
      allowSelectAll: false,
      enableFilter: true,
      multiSelectionActionButton: { text: "Apply" },
      isHTML: true,
      triggerCallbackOnUIDismiss: true,
      autoUseImageCdn: true,
      listItems: [
        { text: "Default", selected: true },
        { text: "Most Popular", selected: false },
        { text: "Most Recent", selected: false },
      ],
    },
    (err, result) => {
      if (err) return console.error(err);
      buildfire.components.drawer.closeDrawer();
      config.sortType = result.text;

      config.exploreConfig.forEach((element) => {
        filterAndPrintData(
          fakeData,
          document.getElementById(`${element.containerId}`),
          element.duration,
          element.title,
          element.id
        );
      });

      seeAllCardsRender(
        fakeData,
        document.getElementById("seeAllContainer"),
        true,
		()=>{}
      );
    }
  );
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);

let input = document.getElementById("search-input");
input.addEventListener("keyup", () => {
  setTimeout(() => {
    config.search = input.value;
    config.sectionConfig.forEach((el) => {
      filterAndPrintData(
        fakeData,
        document.getElementById(`${el.containerId}`),
        el.duration,
        el.title,
        el.id
      );
    });

    config.exploreConfig.forEach((element) => {
      filterAndPrintData(
        fakeData,
        document.getElementById(`${element.containerId}`),
        element.duration,
        element.title,
        element.id
      );
    });

    seeAllCardsRender(
      fakeData,
      document.getElementById("seeAllContainer"),
      true
    );
  }, 500);
});
