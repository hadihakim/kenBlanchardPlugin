class videoDetails {
  static state = {
    id:"",
    data: {},
    tabs: [],
    activeTab: "",
    videoDrawerItemsList: [
      {
        text: Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.VIDEO_SHORTCUTS_DRAWER_ADD_NOTE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.VIDEO_SHORTCUTS_DRAWER_SHARE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
      {
        text: Strings.VIDEO_SHORTCUTS_DRAWER_MARK_COMPLETE,
        secondaryText: "",
        imageUrl: "",
        selected: false,
      },
    ],
    
  };

  static setState = async (id,data) => {
    this.state.id = id;
    this.state.data = data;
    this.state.tabs = [];
    this.state.activeTab = "";
  };

  static pointers = {
    videoPageContainer: "videoPageContainer",
    videoChoosenContainer: "videoChoosenContainer",
    videoTabs: "videoTabs",
    videoShortcutsContainer: "videoShortcutsContainer",
    videoDetailsContainer: "videoDetailsContainer",
    pageDetails: "pageDetails",
  };

  static checkTabsExistance = () => {
    if (this.state.data.showDetails) this.state.tabs.push("details");
    if (this.state.data.showTranscript) this.state.tabs.push("transcript");
    if (this.state.data.showCheckList) this.state.tabs.push("shortcuts");
  };

  static renderTabs = () => {
    if (this.state.tabs.length < 2) {
      document.getElementById("videoTabsContainer").classList.add("hidden");
    } else {
      this.state.tabs.forEach((el, idx) => {
        let container = document.getElementById(this.pointers.videoTabs);
        let button = document.createElement("button");
        button.classList.add("mdc-tab");
        button.setAttribute("role", "tab");
        button.setAttribute("tabindex", `${idx}`);
        button.innerHTML = `<span class="mdc-tab__content">
                <span class="mdc-tab__text-label headerText-AppTheme">${
                  el === "details"
                    ? Strings.VIDEO_DETAILS_TAB
                    : el === "transcript"
                    ? Strings.VIDEO_TRANSCRIPT_TAB
                    : el === "shortcuts"
                    ? Strings.VIDEO_SHORTCUTS_TAB
                    : ""
                }</span>
            </span>
            <span id="indicator-${el}" class="mdc-tab-indicator">
                <span
                    class="mdc-tab-indicator__content mdc-tab-indicator__content--underline primaryTheme-border"></span>
            </span>
            <span class="mdc-tab__ripple"></span>`;

        button.addEventListener("click", () => {
          this.tabClickHandler(el);
        });
        container.appendChild(button);
      });
    }
  };

  static renderVideoMainPage = () => {
    let pageDetails = document.getElementById(this.pointers.pageDetails);
    pageDetails.innerHTML = `<div class="pageVideo" id="videoPageContainer">
        <div class="videoTopContainer" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${Utilities.cropImage(
          this.state.data.meta.image
        )}')" id="videoTopContainer">
          <!-- <img src="" alt="" class="videoImage"> -->
          <span class="material-icons icon videoSpan">
            play_circle_outline
          </span>
        </div>
        <div class="titleContainer">
          <p class="videoTitle headerText-AppTheme" id="videoTitle">${
            this.state.data.meta.title
          }</p>
          <span class="material-icons icon videoMore" id="videoMore">
            more_horiz
          </span>
        </div>
        <div class="mdc-tab-scroller__scroll-content" id="videoTabsContainer">
          <div class="mdc-tab-bar" role="tablist">
            <div class="mdc-tab-scroller">
              <div class="mdc-tab-scroller__scroll-area">
                <div class="mdc-tab-scroller__scroll-content scrollTabs" id="videoTabs">
    
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="choosenContainer" id="videoChoosenContainer">
        </div>
      </div>`;
    document.getElementById("videoMore").addEventListener("click", () => {
      this.openMoreOptions();
    });
  };

  static tabClickHandler = (el) => {
    el === "details"
      ? this.renderVideoDetails(el)
      : el === "transcript"
      ? this.renderVideoTranscript(el)
      : el === "shortcuts"
      ? this.renderVideoShortcuts(el)
      : "";
  };

  static removeActiveTabs = (tabs, el) => {
    const result = tabs.filter((tabs) => tabs != el);
    result.forEach((tab) => {
      document
        .getElementById(`indicator-${tab}`)
        .classList.remove("mdc-tab-indicator--active");
    });
  };

  static renderVideoDetails = (el) => {
    if (
      this.state.tabs.length > 1 &&
      !document
        .getElementById(`indicator-${el}`)
        .classList.contains("mdc-tab-indicator--active")
    ) {
      document
        .getElementById(`indicator-${el}`)
        .classList.add("mdc-tab-indicator--active");
      this.removeActiveTabs(this.state.tabs, el);
    }
    let container = document.getElementById(
      this.pointers.videoChoosenContainer
    );
    container.innerHTML = `${this.state.data.details}`;
    this.state.activeTab = "details";
  };

  static renderVideoTranscript = (el) => {
    if (
      this.state.tabs.length > 1 &&
      !document
        .getElementById(`indicator-${el}`)
        .classList.contains("mdc-tab-indicator--active")
    ) {
      document
        .getElementById(`indicator-${el}`)
        .classList.add("mdc-tab-indicator--active");
      this.removeActiveTabs(this.state.tabs, el);
    }
    let container = document.getElementById(
      this.pointers.videoChoosenContainer
    );
    container.innerHTML = `${this.state.data.transcript}`;
    this.state.activeTab = "transcript";
    Utilities.setAppTheme();
  };

  static openMoreOptions = () => {
    PageDetails.openDrawerAudioOrVideoOrArticle(
      this.state.videoDrawerItemsList
    );
  };

  static renderVideoShortcuts = (el) => {
    if (
      this.state.tabs.length > 1 &&
      !document
        .getElementById(`indicator-${el}`)
        .classList.contains("mdc-tab-indicator--active")
    ) {
      document
        .getElementById(`indicator-${el}`)
        .classList.add("mdc-tab-indicator--active");
      this.removeActiveTabs(this.state.tabs, el);
    }

    let container = document.getElementById(
      this.pointers.videoChoosenContainer
    );
    container.innerHTML = ``;
    //let shortcutContainer = document.getElementById(this.pointers.videoShortcutsContainer);
    let div = document.createElement("div");
    Utilities.setAttributesHandler(div, {
      class: "videoShortcutsContainer",
      id: "videoShortcutsContainer",
    });
    this.state.data.checkList.forEach((el, idx) => {
      el.id=el.title;
     
      let element = document.createElement("div");
      element.classList.add("shortcutVideoElement");
      element.innerHTML = `
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
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">${idx + 1}. ${
                     el.title
                 }</p>
                <p class="shortcutDuration bodyText-AppTheme">${Utilities.timeConvert(
                   el.timeStamp,
                      "hh:mm:ss"
                     )}
                    <span class="material-icons icon videoBookmarkIcon hidden " id='${el.id}icon'>
                        bookmark_border
                     </span>
                </p>
                
            </div>
            
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon videoShortCutDrawer">
                        more_horiz
                    </span>

            </div>`;
      div.appendChild(element);
      container.appendChild(div);
      let shortcutDrawerElements = element.querySelectorAll(
        ".videoShortCutDrawer"
      );
      shortcutDrawerElements.forEach(async(e) => {
        const shortcutDrawerItemsList=[
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
        ];
        const icon= document.getElementById(`${el.id}icon`);
       await this.checkIsBookmarked(shortcutDrawerItemsList,el.id ,icon, "shortcut");
        e.addEventListener("click", () => {
         PageDetails.openDrawerAudioOrVideoOrArticle(
            shortcutDrawerItemsList,el
          );
        
        });
      });
      
    });
    this.state.activeTab = "shortcuts";
    Utilities.setAppTheme();
  };

  static initActiveTab = () => {
    this.state.tabs[0] === "details"
      ? this.renderVideoDetails(this.state.tabs[0])
      : this.state.tabs[0] === "transcript"
      ? this.renderVideoTranscript(this.state.tabs[0])
      : this.state.tabs[0] === "shortcuts"
      ? this.renderVideoShortcuts(this.state.tabs[0])
      : "";
  };

  static checkIsBookmarked = async(drawerList, id ,icon, to) => {
    let allBookmarks=await getAllBookmarks();
    let filteredBookmarks=allBookmarks.filter(bookmark =>bookmark.id===id);
    if(filteredBookmarks.length>0){
     drawerList[0].text= (to == "video"?Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:Strings.SHORTCUT_BOOKMARK_REMOVE)
     icon? icon.classList.remove('hidden'):"";
    }else{
     drawerList[0].text=(to == "video"? Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK:Strings.SHORTCUT_BOOKMARK_SHORTCUT)
     
    }
    
  };

  static initVideoDetails = (id,data) => {
    this.setState(id,data);
    this.checkTabsExistance();
    this.renderVideoMainPage();
    this.renderTabs();
    this.initActiveTab();
    this.checkIsBookmarked(this.state.videoDrawerItemsList,this.state.data.id ,null, "video");
  };
}
