class AudioRender {
  static state = {
    id:"",
    data: {},
    tabs: [],
    fromNotification: false,
    audioDrawerItemsList: [
      {
        text: Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.AUDIO_SHORTCUTS_DRAWER_ADD_NOTE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.AUDIO_SHORTCUTS_DRAWER_SHARE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.AUDIO_SHORTCUTS_DRAWER_MARK_COMPLETE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
    ],

  };

  static pointers = {
    pageDetails: "pageDetails",
    audioTemplate: "audioTemplate",
  };
  static setState = (id,data,fromNotification) => {
    this.state.id=id;
    this.state.data = data;
    this.state.tabs = [];
    if (data.showDetails) {
      this.state.tabs.push("details");
    }
    if (data.showTranscript) {
      this.state.tabs.push("transcript");
    }
    if (data.showCheckList) {
      this.state.tabs.push("shortcuts");
    }
    this.state.fromNotification=fromNotification;
  };

  static render = () => {
    let container = document.getElementById(this.pointers.pageDetails);
    const template = document.getElementById(this.pointers.audioTemplate);
    const nodesClone = template.content.cloneNode(true);

    let audioTitle = nodesClone.querySelectorAll(".audio-title");
    let audioTabContainer = nodesClone.querySelectorAll(".audio-tab-container");
    let tabListContainer = nodesClone.querySelectorAll(".audioTabsList");
    let audioPlayerThumbnail = nodesClone.querySelectorAll(".audio-player");
    let audioDrawer = nodesClone.getElementById("audioDrawer");
    audioDrawer.addEventListener("click", () =>
      this.drawerHandler(this.state.audioDrawerItemsList)
    );
    audioPlayerThumbnail[0].style.background = `
    linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('${Utilities.cropImage(this.state.data.meta.image)}'
    `;
    audioTitle[0].innerText = this.state.data.meta.title;
    if (this.state.tabs.length) {
      this.state.tabs.forEach((tab, idx) => {
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
        <span class="mdc-tab-indicator test">
          <span
            class="mdc-tab-indicator__content mdc-tab-indicator__content--underline primaryTheme-border"
          ></span>
        </span>
        <span class="mdc-tab__ripple"></span>
            `;

        tabButton.innerHTML = buttonInnerHtml;
        tabButton.addEventListener("click", () => {
          this.tabClickHandler(tab);
        });
        audioTabContainer[0].appendChild(tabButton);
      });
      let buttons = nodesClone.querySelectorAll(".mdc-tab");
      let tabIndicators = nodesClone.querySelectorAll(".test");
     ( this.state.fromNotification&& this.state.tabs.indexOf("shortcuts")>-1)? tabIndicators[tabIndicators.length - 1].classList.add("mdc-tab-indicator--active")
      :tabIndicators[0].classList.add("mdc-tab-indicator--active");
      buttons.forEach((button, idx) => {
        button.addEventListener("click", () => {
          tabIndicators.forEach((e, index) => {
            e.classList.remove("mdc-tab-indicator--active");
          });
          tabIndicators[idx].classList.add("mdc-tab-indicator--active");
        });
      });
 
    }

    container.appendChild(nodesClone);
    this.tabsListHandler(tabListContainer);
  };

  static tabsListHandler = (container) => {
    console.log("hi");
    if (this.state.tabs.length <= 1) {
      let element = document.querySelectorAll(
        `[aria-type=${this.state.tabs[0]}]`
      );
      container[0].classList.add("hidden");
     
      if (this.state.tabs[0] === "transcript") {
        this.tabClickHandler(this.state.tabs[0]);
      } else if (this.state.tabs[0] === "shortcuts") {
        this.tabClickHandler(this.state.tabs[0]);
      } else if (this.state.tabs[0] === "details") {
        this.tabClickHandler(this.state.tabs[0]);
      }
    } else {
      if (this.state.tabs[0] === "transcript") {
        this.tabClickHandler(this.state.tabs[0]);
      } else if (this.state.tabs[0] === "shortcuts") {
        this.tabClickHandler(this.state.tabs[0]);
      } else if (this.state.tabs[0] === "details") {
        this.tabClickHandler(this.state.tabs[0]);
      }
    }
  };
  static tabClickHandler = (tab) => {
    let audioTabs = document.querySelectorAll(".audio-tab");
    audioTabs.forEach((e) => {
      e.classList.add("hidden");
    });
    if(this.state.fromNotification&& this.state.tabs.indexOf(tab) <0){
      tab = this.state.tabs[0];
    }

    let element = document.querySelectorAll(`[aria-type=${tab}]`);
    if (element) {
      element[0].classList.remove("hidden");
      if (tab === "transcript") {
        element[0].innerHTML = "";
        element[0].appendChild(this.transcriptUi(this.state.data.transcript));
      } else if (tab === "shortcuts") {
        element[0].innerHTML = "";
        element[0].appendChild(this.shortcutsUi(this.state.data.checkList));
      } else if (tab === "details") {
        element[0].innerHTML = "";
        element[0].appendChild(this.detailsUi(this.state.data.details));
      }
      
      Utilities.setAppTheme();
    }
  };

  static detailsUi = (details) => {
    let div = document.createElement("div");
    div.classList.add("audio-details");
    div.innerHTML = details;
    return div;
  };
  static transcriptUi = (transcriptArray) => {
    let div = document.createElement("div");
    div.classList.add("audio-transcript");
    if (typeof transcriptArray === "string") {
      div.innerHTML = transcriptArray;
    } else {
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
    }

    return div;
  };

  static shortcutsUi = (shortcutsArray) => {
    let div = document.createElement("div");
    div.classList.add("audio-shortcuts");
    shortcutsArray.forEach((shortcut, idx) => {
      shortcut.id=shortcut.title
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
          <div class="mdc-checkbox__background checkbox-border-color">
            <svg class="mdc-checkbox__checkmark checkbox-border-fill-color" viewBox="0 0 24 24">
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
            <span class="shortcut-time audioShortcutTime bodyText-AppTheme">${Utilities.timeConvert(
              shortcut.timeStamp,
              "hh:mm:ss"
            )}
            <span class="material-icons icon videoBookmarkIcon hidden " id='${shortcut.id}icon'>
            bookmark_border
         </span>
            </span>
          </div>
          <label class="material-icons icon">headset</label>
          <label class="material-icons icon shortcutDrawer">more_horiz</label>
        </div>
          `;
      shortcutItem.innerHTML = shortcutItemInnerHTML;
      div.appendChild(shortcutItem);

      let shortcutDrawerElements =
        shortcutItem.querySelectorAll(".shortcutDrawer");

      shortcutDrawerElements.forEach(async(e) => {
        const shortcutDrawerItemsList= [
          {
            text: Strings.SHORTCUT_BOOKMARK_SHORTCUT,
            secondaryText: "",
            imageUrl: "",
            selected: false,
          },
          {
            text: Strings.SHORTCUT_SET_REMINDER,
            secondaryText: "",
            imageUrl: "",
            selected: false,
          },
        ]
        // const icon= document.getElementById(`${shortcut.id}icon`);
        // console.log(icon, "mmmmmmmmmmmmmm");
        await this.checkIsBookmarked(shortcutDrawerItemsList,shortcut.id,"icon","shortcut");

        e.addEventListener("click", () => {
          PageDetails.openDrawerAudioOrVideoOrArticle(
            shortcutDrawerItemsList,shortcut
          );        });
      });
    });

    return div;
  };

  static drawerHandler = (itemsList) => {
    PageDetails.openDrawerAudioOrVideoOrArticle(itemsList);
  };
  static openShortcutDrawer = () => {
    console.log("hi");
  };

  static checkIsBookmarked = async(drawerList, id ,icon, to) => {
    let allBookmarks=await getAllBookmarks();
    let filteredBookmarks=allBookmarks.filter(bookmark =>bookmark.id===id);
    if(filteredBookmarks.length>0){
     drawerList[0].text= (to == "audio"?Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:Strings.SHORTCUT_BOOKMARK_REMOVE)
     icon? document.getElementById(`${id}icon`).classList.remove('hidden'):"";
    }else{
     drawerList[0].text=(to == "audio"? Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK:Strings.SHORTCUT_BOOKMARK_SHORTCUT)
     
    }
    
  };
  static init = (id,data,fromNotification) => {
    this.setState(id,data,fromNotification);
    this.render();
    this.checkIsBookmarked(this.state.audioDrawerItemsList,this.state.id, null,"audio");
    
  };
}
