class videoDetails {

    static state = {
        data: {},
        tabs: [],
        activeTab: ""
    };

    static setState = async (data) => {
        this.state.data = data;
        this.state.tabs = [];
        this.state.activeTab = ""
      }

    static pointers = {
        videoPageContainer: "videoPageContainer",
        videoChoosenContainer: "videoChoosenContainer",
        videoTabs: "videoTabs",
        videoShortcutsContainer: "videoShortcutsContainer",
        videoDetailsContainer: "videoDetailsContainer",
        pageDetails: "pageDetails"
    };

    static checkTabsExistance = () => {
        if (this.state.data.showDetails) this.state.tabs.push("details");
        if (this.state.data.showTranscript) this.state.tabs.push("transcript");
        if (this.state.data.showCheckList) this.state.tabs.push("shortcuts");
    }

    static renderTabs = () => {
        if(this.state.tabs.length < 2) {
             document.getElementById("videoTabsContainer").classList.add("hidden");
        } else {
            this.state.tabs.forEach((el, idx) => {
                let container = document.getElementById(this.pointers.videoTabs);
                let button = document.createElement("button");
                button.classList.add("mdc-tab");
                button.setAttribute("role", "tab");
                button.setAttribute("tabindex", `${idx}`);
                button.innerHTML = `<span class="mdc-tab__content">
                <span class="mdc-tab__text-label headerText-AppTheme">${el === "details" ? Strings.VIDEO_DETAILS_TAB : el === "transcript" ? Strings.VIDEO_TRANSCRIPT_TAB : el === "shortcuts" ? Strings.VIDEO_SHORTCUTS_TAB : ""}</span>
            </span>
            <span id="indicator-${el}" class="mdc-tab-indicator">
                <span
                    class="mdc-tab-indicator__content mdc-tab-indicator__content--underline primaryTheme-border"></span>
            </span>
            <span class="mdc-tab__ripple"></span>`
    
                button.addEventListener("click", () => { this.tabClickHandler(el) });
                container.appendChild(button);
            })
        }
        
    }

    static renderVideoMainPage = () => {
        let pageDetails = document.getElementById(this.pointers.pageDetails);
        pageDetails.innerHTML = `<div class="pageVideo" id="videoPageContainer">
        <div class="videoTopContainer" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${this.state.data.meta.image}')" id="videoTopContainer">
          <!-- <img src="" alt="" class="videoImage"> -->
          <span class="material-icons icon videoSpan">
            play_circle_outline
          </span>
        </div>
        <div class="titleContainer">
          <p class="videoTitle headerText-AppTheme" id="videoTitle">${this.state.data.meta.title}</p>
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
      </div>`
        document.getElementById("videoMore").addEventListener("click", ()=>{
            this.openMoreOptions();
        });

    }

    static tabClickHandler = (el) => {
        (el === "details") ? this.renderVideoDetails(el) : el === "transcript" ? this.renderVideoTranscript(el) : el === "shortcuts" ? this.renderVideoShortcuts(el) : "";
    }


    static removeActiveTabs = (tabs, el) => {
        const result = tabs.filter(tabs => tabs != el);
        result.forEach((tab) => {
            document.getElementById(`indicator-${tab}`).classList.remove("mdc-tab-indicator--active");
        })
    }

    static renderVideoDetails = (el) => {
        if ( this.state.tabs.length > 1 && !document.getElementById(`indicator-${el}`).classList.contains("mdc-tab-indicator--active")) {
            document.getElementById(`indicator-${el}`).classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }
        let container = document.getElementById(this.pointers.videoChoosenContainer);
        container.innerHTML = `${this.state.data.details}`;
        this.state.activeTab = "details";
    }

    static renderVideoTranscript = (el) => {
        if ( this.state.tabs.length > 1 && !document.getElementById(`indicator-${el}`).classList.contains("mdc-tab-indicator--active")) {
            document.getElementById(`indicator-${el}`).classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }
        let container = document.getElementById(this.pointers.videoChoosenContainer);
            container.innerHTML = `${this.state.data.transcript}`;
            this.state.activeTab = "transcript";
            Utilities.setAppTheme();

    }

    static openMoreOptions = () => {
        let listItems = [];
        (this.state.activeTab === "details" || this.state.activeTab === "transcript" ? listItems = [{text: 'Mark Complete', secondaryText: '', imageUrl:'', selected: false}] : listItems = [{text: 'Bookmark Lesson', secondaryText: '', imageUrl:'', selected: false}, {text: 'Add Note', secondaryText: '', imageUrl:'', selected: false}, {text: 'Share', secondaryText: '', imageUrl:'', selected: false}, {text: 'Mark Complete', secondaryText: '', imageUrl:'', selected: false}])
          Utilities.openDrawerAudioOrVideo(listItems)
    }

    static renderVideoShortcuts = (el) => {
        if (this.state.tabs.length > 1 && !document.getElementById(`indicator-${el}`).classList.contains("mdc-tab-indicator--active")) {
            document.getElementById(`indicator-${el}`).classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }

        let container = document.getElementById(this.pointers.videoChoosenContainer);
        container.innerHTML = ``;
        //let shortcutContainer = document.getElementById(this.pointers.videoShortcutsContainer);
        let div = document.createElement('div');
        Utilities.setAttributesHandler(div, {
            class: "videoShortcutsContainer",
            id: "videoShortcutsContainer"

        });
        this.state.data.checkList.forEach((el, idx)=>{
            let element = document.createElement('div');
            element.classList.add("shortcutVideoElement");
            element.innerHTML = `
            <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">${idx+1}. ${el.title}</p>
                <p class="shortcutDuration bodyText-AppTheme">${Utilities.timeConvert(el.timeStamp, "sec")}</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>`;
            div.appendChild(element);
        container.appendChild(div);
        })
        this.state.activeTab = "shortcuts";
        Utilities.setAppTheme();
    }

    static initActiveTab = () => {
        (this.state.tabs[0] === "details" ? this.renderVideoDetails(this.state.tabs[0]) : this.state.tabs[0] === "transcript" ? this.renderVideoTranscript(this.state.tabs[0]) : this.state.tabs[0] === "shortcuts" ? this.renderVideoShortcuts(this.state.tabs[0]):"")
    }


    static initVideoDetails = (data) => {
        this.setState(data);
        this.checkTabsExistance();
        this.renderVideoMainPage();
        this.renderTabs();
        this.initActiveTab();
    }
}
