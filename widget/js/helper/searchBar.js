"use strict";

const scrollTop = () => {
  mainContainer.scrollTo({ top: 0, behavior: "smooth" });
};

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
      listItems: [
        { text: "Coaching", selected: false },
        { text: "Conflict", selected: false },
        { text: "Customer Service", selected: false },
        { text: "Change & Innovation", selected: false },
        { text: "Diversity, Equity & Inclusion ", selected: false },
        { text: "Change & Innovation", selected: false },
        { text: "Leading People", selected: false },
        { text: "Performance Management", selected: false },
        { text: "Personal Effectiveness", selected: false },
        { text: "Team Effectiveness", selected: false },
        { text: "Trust", selected: false },
        { text: "Working with Others", selected: false },
      ],
    },
    (err, result) => {
      if (err) return console.error(err);
      appConfig.topics = result;
      console.log("Selected Contacts", appConfig.topics);

      config.sectionConfig.forEach((el) => {
        el.id != "for-you-section" && el.id != "explore"
          ? recommendedCardRender(
              fakeData,
              document.getElementById(`${el.containerId}`),
              el.duration,
              el.title
            )
          : false;
      });
    }
  );
}

let sortDrawerResults = "Default";
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
      console.log("Selected Contacts", result);
      sortDrawerResults = result.text;
      seeAllCardsRender(
        fakeData,
        document.getElementById("seeAllContainer"),
        true,
        sortDrawerResults
      );
    }
  );
}

let filterIcon = document.getElementById("filterIcon");
filterIcon.addEventListener("click", filterDrawer);

let sortIcon = document.getElementById("sortIcon");
sortIcon.addEventListener("click", sortDrawer);
