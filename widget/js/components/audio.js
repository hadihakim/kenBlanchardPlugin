let transcript = [
  {
    timestamp: "00:20",
    title:
      "Talking to someone while they scan the room, study a computer screen, or gaze out the window is like trying to hit a moving target.",
  },
  {
    timestamp: "00:20",
    title:
      "Talking to someone while they scan the room, study a computer screen, or gaze out the window is like trying to hit a moving target.",
  },
  {
    timestamp: "00:20",
    title:
      "Talking to someone out the window is like trying to hit a moving target.",
  },
];
let shortcuts = [
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important", timestamp: "00:00:00" },
  { title: "Why Focusing is Important kfkjfkdjfkdjfkjdkjfkdfjkdjfkjdkfjkdjfk sdddddd ddd d dd", timestamp: "00:00:00" },
];
const audioPageUi = () => {
  let tabs = ["transcript", "shortcuts"];

  let container = document.getElementById("audioContainer");
  const template = document.getElementById("audioTemplate");
  const nodesClone = template.content.cloneNode(true);

  let audioTitle = nodesClone.querySelectorAll(".audio-title");
  let audioTabContainer = nodesClone.querySelectorAll(".audio-tab-container");

  audioTitle[0].innerText = "Acknowledge Emotion";
  tabs.forEach((tab, idx) => {
    let tabButton = document.createElement("button");
    Utilities.setAttributesHandler(tabButton, {
      class: "mdc-tab",
      role: "tab",
      "aria-selected": "true",
      tabindex: `${idx}`,
    });
    let buttonInnerHtml = `
        <span class="mdc-tab__content">
			<span class="mdc-tab__text-label">${
        tab.toLocaleLowerCase() === "transcript"
          ? Strings.AUDIO_TAP_2
          : tab.toLocaleLowerCase() === "shortcuts"
          ? Strings.AUDIO_TAP_3
          : Strings.AUDIO_TAP_1
      }</span>
		</span>
		<span class="mdc-tab-indicator">
			<span
				class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"
			></span>
		</span>
		<span class="mdc-tab__ripple"></span>
        `;

    tabButton.innerHTML = buttonInnerHtml;
    tabButton.addEventListener("click", () => {
      tabClickHandler(tab);
    });
    audioTabContainer[0].appendChild(tabButton);
  });

  let buttons = nodesClone.querySelectorAll(".mdc-tab");
  let tabIndicators = nodesClone.querySelectorAll(".mdc-tab-indicator");
  tabIndicators[0].classList.add("mdc-tab-indicator--active");
  buttons.forEach((button, idx) => {
    button.addEventListener("click", () => {
      tabIndicators.forEach((e, index) => {
        e.classList.remove("mdc-tab-indicator--active");
      });
      tabIndicators[idx].classList.add("mdc-tab-indicator--active");
    });
  });

  container.appendChild(nodesClone);
  let element = document.querySelectorAll(`[aria-type=transcript]`);
  element[0].appendChild(transcriptUi(transcript));
};

const tabClickHandler = (tab) => {
  let audioTabs = document.querySelectorAll(".audio-tab");
  audioTabs.forEach((e) => {
    e.classList.add("hidden");
  });
  let element = document.querySelectorAll(`[aria-type=${tab}]`);
  if (element) {
    element[0].classList.remove("hidden");
    if (tab === "transcript") {
      element[0].innerHTML = "";
      element[0].appendChild(transcriptUi(transcript));
    } else if (tab === "shortcuts") {
      element[0].innerHTML = "";
      element[0].appendChild(shortcutsUi(shortcuts));
    }
    Utilities.setAppTheme();
  }
};

const transcriptUi = (transcriptArray) => {
  let div = document.createElement("div");
  div.classList.add("audio-transcript");
  transcriptArray.forEach((transcript) => {
    let transcriptItem = document.createElement("div");
    transcriptItem.classList.add("transcript-item");
    let transcriptItemInnerHTML = `
        <span class="time bodyText-AppTheme">${transcript.timestamp}</span>
        <p class="title bodyText-AppTheme">
        ${transcript.title}
        </p>
        `;
    transcriptItem.innerHTML = transcriptItemInnerHTML;
    div.appendChild(transcriptItem);
  });
  return div;
};

const shortcutsUi = (shortcutsArray) => {
  let div = document.createElement("div");
  div.classList.add("audio-shortcuts");
  shortcutsArray.forEach((shortcut, idx) => {
    let shortcutItem = document.createElement("div");
    shortcutItem.classList.add("shortcut-item");
    let shortcutItemInnerHTML = `
        <div class="mdc-checkbox mdc-checkbox--touch">
        <input
          type="checkbox"
          class="mdc-checkbox__native-control"
          id="checkbox-1"
          name="check1"
        />
        <div class="mdc-checkbox__background user-image-border">
          <svg class="mdc-checkbox__checkmark userContainer" viewBox="0 0 24 24">
            <path
              class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"
            />
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
      </div>
      <div class="right">
        <div class="shortcut-text">
          <label for="check1" class="shortcut-label headerText-AppTheme"
            >${idx + 1 + ". " + shortcut.title}</label
          >
          <span class="shortcut-time bodyText-AppTheme">${
            shortcut.timestamp
          }</span>
        </div>
        <label class="material-icons icon">headset</label>
        <label class="material-icons icon">more_horiz</label>
      </div>
        `;

    shortcutItem.innerHTML = shortcutItemInnerHTML;
    div.appendChild(shortcutItem);
  });
  return div;
};
