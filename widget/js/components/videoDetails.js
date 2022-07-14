class videoDetails {

    static state = {
        data: {},
        tabs: ["details", "transcript", "shortcuts"]
    };

    static pointers = {
        videoPageContainer: "videoPageContainer",
        videoChoosenContainer: "videoChoosenContainer",
        videoTabs: "videoTabs",
        videoShortcutsContainer: "videoShortcutsContainer",
        videoDetailsContainer: "videoDetailsContainer"
    };

    static renderTabs = () => {
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
        let DetailsTab = document.getElementById(`indicator-${el}`);
        if (!DetailsTab.classList.contains("mdc-tab-indicator--active")) {
            DetailsTab.classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }

        let container = document.getElementById(this.pointers.videoChoosenContainer);
        // let detailContainer = document.getElementById(this.pointers.videoDetailsContainer);
        container.innerHTML = `<div class="videoDetailsContainer" id="videoDetailsContainer">
        <p>ddd</p>
    </div>`;
        // container.appendChild(detailContainer);
    }

    static renderVideoTranscript = (el) => {
        let transcriptTab = document.getElementById(`indicator-${el}`);
        if (!transcriptTab.classList.contains("mdc-tab-indicator--active")) {
            transcriptTab.classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }

        let container = document.getElementById(this.pointers.videoChoosenContainer);
            // let shortcutContainer = document.getElementById(this.pointers.videoShortcutsContainer);
            container.innerHTML = `renderVideoTranscript`;
            Utilities.setAppTheme();
            // container.appendChild(shortcutContainer);

    }

    static renderVideoShortcuts = (el) => {
        let shortcutTab = document.getElementById(`indicator-${el}`);
        if (!shortcutTab.classList.contains("mdc-tab-indicator--active")) {
            shortcutTab.classList.add("mdc-tab-indicator--active");
            this.removeActiveTabs(this.state.tabs, el);
        }

        let container = document.getElementById(this.pointers.videoChoosenContainer);
        //let shortcutContainer = document.getElementById(this.pointers.videoShortcutsContainer);
        container.innerHTML = `<div class="videoShortcutsContainer" id="videoShortcutsContainer">
        <div class="shortcutVideoElement">
            <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">1. Why Focusing is Important</p>
                <p class="shortcutDuration bodyText-AppTheme">00:00:00</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>
        </div>
        <div class="shortcutVideoElement">
        <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">1. Why Focusing is Important</p>
                <p class="shortcutDuration bodyText-AppTheme">00:00:00</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>
        </div>
        <div class="shortcutVideoElement">
            <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">1. Why Focusing is Important</p>
                <p class="shortcutDuration bodyText-AppTheme">00:00:00</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>
        </div>
        <div class="shortcutVideoElement">
            <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">1. Why Focusing is Important</p>
                <p class="shortcutDuration bodyText-AppTheme">00:00:00</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>
        </div>
        <div class="shortcutVideoElement">
            <input type="checkbox" class="shortcutVideoCheckbox">
            <div class="shorcutElementDetails">
                <p class="shortcutText headerText-AppTheme">1. Why Focusing is Important</p>
                <p class="shortcutDuration bodyText-AppTheme">00:00:00</p>
            </div>
            <div class="shortcutActions">
                <span class="material-icons icon">
                    play_circle_filled
                    </span>

                    <span class="material-icons icon">
                        more_horiz
                    </span>

            </div>
        </div>
    </div>`;
        Utilities.setAppTheme();
        // container.appendChild(shortcutContainer);
    }


    static initVideoDetails = () => {
        this.renderTabs();
        this.renderVideoDetails(`details`);
    }
}


videoDetails.initVideoDetails();
