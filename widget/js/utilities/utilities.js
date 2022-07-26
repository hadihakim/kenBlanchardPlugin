class Utilities {
  static state = {
    appTheme: {},
  };

  static cropImage = (image, size = "full_width", aspect = "16:9") => {
    let cropedImage = buildfire.imageLib.cropImage(image, {
      size: size,
      aspect: aspect,
    });
    return cropedImage;
  };

  static timeConvert = (n, format) => {
    let hours = Math.floor(n / 3600);
    n %= 3600;
    let minutes = Math.floor(n / 60);
    let seconds = n % 60;
    // strings with leading zeros
    switch (format) {
      case "hh:mm:ss":
        minutes = String(minutes).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
      case "hh|mm":
        minutes = String(minutes).padStart(1, "0");
        hours = String(hours).padStart(1, "0");
        return hours !== "0"
          ? hours + "h " + (minutes !== "0" ? minutes + "min" : "")
          : minutes !== "0"
            ? minutes + "min"
            : "";
      default:
        return "unknown";
    }
  };

  static getAppTheme = () => {
    buildfire.appearance.getAppTheme((err, appTheme) => {
      if (err) return console.error(err);
      this.state.appTheme = appTheme;
    });
  };

  static LightenDarkenColor = (col, amt) => {
    // col => color
    // amt => the amount of chnging the color
    // if you passed positive number the color will be lighter
    // if you passed nigative number the color will be darken

    let usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };

  static setThemeHandler = (arr, type, color) => {
    for (let i = 0; i < arr.length; i++) {
      let newColor;
      switch (type) {
        case "color":
          arr[i].setAttribute("style", `fill: ${color} !important`);
          arr[i].setAttribute("style", `color: ${color} !important`);
          break;
        case "back":
          arr[i].style.backgroundColor = color;
          // arr[i].setAttribute("style", `background-color: ${color} !important`);
          break;
        case "borderColor":
          newColor = this.LightenDarkenColor(color, 20);
          arr[i].setAttribute("style", `border-color: ${newColor} !important`);
          break;
        case "normalBorderColor":
          arr[i].setAttribute("style", `border-color: ${color} !important`);
          break;
        case "backPercentage":
          newColor = this.LightenDarkenColor(color, 55);
          arr[i].setAttribute(
            "style",
            `background-color: ${newColor} !important`
          );
          break;
        default:
          break;
      }
    }
  };

  static setAppTheme = () => {
    let colorCollections = [
      {
        elements: [
          ...document.getElementsByClassName("icon"),
          ...document.getElementsByClassName("arrow-color"),
        ],
        colorType: "color",
        colorDegree: this.state.appTheme.colors.icons,
      },
      {
        elements: document.getElementsByClassName("primaryBtn-AppTheme"),
        colorType: "back",
        colorDegree: this.state.appTheme.colors.defaultTheme,
      },
      {
        elements: document.getElementsByClassName("defaultlink-AppTheme"),
        colorType: "color",
        colorDegree: this.state.appTheme.colors.defaultTheme,
      },
      {
        elements: document.getElementsByClassName("headerText-AppTheme"),
        colorType: "color",
        colorDegree: this.state.appTheme.colors.headerText,
      },
      {
        elements: document.getElementsByClassName("barText-AppTheme"),
        colorType: "color",
        colorDegree: this.state.appTheme.colors.titleBarTextAndIcons,
      },
      {
        elements: document.getElementsByClassName("bodyText-AppTheme"),
        colorType: "color",
        colorDegree: this.state.appTheme.colors.bodyText,
      },
      {
        elements: document.getElementsByClassName("userContainer"),
        colorType: "back",
        colorDegree: this.state.appTheme.colors.titleBar,
      },
      {
        elements: document.getElementsByClassName("user-image-border"),
        colorType: "borderColor",
        colorDegree: this.state.appTheme.colors.titleBar,
      },
      {
        elements: document.getElementsByClassName("primaryTheme-border"),
        colorType: "normalBorderColor",
        colorDegree: this.state.appTheme.colors.primaryTheme,
      },
      {
        elements: document.getElementsByClassName("checkbox-border-color"),
        colorType: "borderColor",
        colorDegree: this.state.appTheme.colors.icons,
      },
      {
        elements: document.getElementsByClassName("checkbox-border-fill-color"),
        colorType: "back",
        colorDegree: this.state.appTheme.colors.icons,
      },
      {
        elements: document.getElementsByClassName("info-btn-AppTheme"),
        colorType: "back",
        colorDegree: this.state.appTheme.colors.infoTheme,
      },
      {
        elements: document.getElementsByClassName("info-link-AppTheme"),
        colorType: "color",
        colorDegree: this.state.appTheme.colors.infoTheme,
      },
      {
        elements: document.getElementsByClassName("infoTheme"),
        colorType: "back",
        colorDegree: this.state.appTheme.colors.infoTheme,
      },
      {
        elements: document.getElementsByClassName("holderPercentage"),
        colorType: "backPercentage",
        colorDegree: this.state.appTheme.colors.infoTheme,
      },
    ];

    colorCollections.forEach((element) => {
      this.setThemeHandler(
        element.elements,
        element.colorType,
        element.colorDegree
      );
    });
  };

  static scrollNextPage = () => {
    if (!seeAllContainer.classList.contains("hidden") && config.page != 1) {
      if (
        (mainContainer.scrollTop + mainContainer.clientHeight) /
        mainContainer.scrollHeight >
        0.8 &&
        !config.fetchingNextPage
      ) {
        this._fetchNextList();
        // loadData(currentPage, limit);
      }
    }
  };

  static initBack = () => {
    let timer;
    buildfire.navigation.onBackButtonClick = () => {
      let input = document.getElementById("search-input");
      input.value = "";

      buildfire.history.get(
        {
          pluginBreadcrumbsOnly: true,
        },
        (err, result) => {
          if (err) return console.log(err);
          if (result.length) {
            switch (result[result.length - 1].label) {
              case "Explore":
                Navigation.openMain();
                break;
              case "Search":
                if (config.searchFrom == "from-main") {
                  Navigation.openMain();
                } else if (config.searchFrom == "from-explore") {
                  Navigation.openExplore();
                }
                Navigation.setData(true);
                break;
              case "Growth Profile":
                Navigation.openMain();
                break;
              default:
                let from = result[result.length - 1].options.from;
                if (
                  from == "Home from See All" ||
                  from == "Home from Details"
                ) {
                  Navigation.openMain();
                } else if (
                  from == "Explore from See All" ||
                  from == "Explore from Details"
                ) {
                  Navigation.openExplore();
                } else if (from == "See All from Details") {
                  if (
                    config.searchFrom == "from-main" ||
                    config.searchFrom == "from-explore"
                  ) {
                    Navigation.openSearch();
                  } else if (config.searchFrom == "from-see-all") {
                    Navigation.openSeeAll();
                  }
                } else if (from == "Details from CourseDetails") {
                  let id = result[result.length - 1].options.id;
                  Navigation.openPageDetails(
                    id,
                    result[result.length - 1].options.title, false
                  );
                } else if (
                  from == "user profile from list" ||
                  from == "User profile from Details"
                ) {
                  Navigation.openUserProfile();
                } else if (from == "user List from temEffectiveness list") {
                  PageDetails.innerHtml = "";
                  Navigation.openUserList();
                } else if (from == "Personal home Page") {
                  Navigation.openMain();
                } else if (from == "active list from CourseDetails") {
                  Navigation.openTeamEffectivenessList(
                    result[result.length - 1].options.to
                  );
                } else if (from == "page detail from chapter") {
                  summaryRender.init(
                    result[result.length - 1].options.id,
                    result[result.length - 1].options.data
                  );
                } else if (from == "search from details") {
                  Navigation.openSearch();
                }
                break;
            }
          }
        }
      );
      Utilities.scrollTop();
      buildfire.history.pop();
    };
  };

  static scrollTop = () => {
    mainContainer.scrollTo({ top: 0 });
  };

  static splideInit = () => {
    var splide = new Splide(".splide");
    var bar = splide.root.querySelector(".my-carousel-progress-bar");
    // Update the bar width:
    splide.on("mounted move", function () {
      var end = splide.Components.Controller.getEnd() + 1;
      bar.style.width = String((100 * (splide.index + 1)) / end) + "%";
      document.getElementById("slideNum").innerText =
        splide.index + 1 + "/" + end;
    });
    splide.mount();
  };

  static showDialog = (options) => {
    buildfire.dialog.show(options, (err, actionButton) => {
      if (err) console.error(err);

      if (actionButton && actionButton.text == "Cancel") {
        console.log("Cancel clicked");
      }
    });
  };

  static setAttributesHandler = (el, attrs) => {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };

  static showEmpty = (container) => {
    container.innerHTML = `
		<div class="emptySearch_Container">
			<img src="./media/empty_page.svg" alt="Empty Search" loading="lazy"/>
			<p id="emptyTitle">Nothing Found</p>
			<p id="emptyDescription">Refine your search...</p>
      	</div>
		`;
  };

  static _debounce = (cb, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  static addNote(options) {
    buildfire.notes.openDialog(options, (err, data) => {
      if (err) return console.error(err);

      const { hasNotes, noteCount, itemId } = data;

      if (hasNotes) {
        this.showToast("Notes added successfully!");
      } else {
        console.log(`No notes yet!`);
      }
    });
  }
  static assetsHasNotes(id) {
    return new Promise((resolve, reject) => {
      buildfire.notes.getByItemId(
        {
          itemId: id,
        },
        (err, data) => {
          if (err) reject(err);
          const { hasNotes, noteCount, itemId } = data;
          if (hasNotes) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  static showToast = (message) => {
    buildfire.dialog.toast({
      message: message,
      duration: 3000,
      hideDismissButton: true,
      type: "info",
    });
  };

  static bookmark = () => {
    const addBookmark = (options, type) => {
      buildfire.bookmarks.add(options, (err, bookmark) => {
        if (err) return console.error(err);
        this.showToast(
          options.type === "video"
            ? Strings.VIDEO_ADDED_BOOKMARK
            : options.type === "audio"
              ? Strings.AUDIO_ADDED_BOOKMARK
              : Strings.ARTICLE_ADDED_BOOKMARK
        );
      });
    };

    const deletesBookmark = (id, type) => {
      buildfire.bookmarks.delete(id, () => {
        this.showToast(
          type === "video"
            ? Strings.VIDEO_REMOVED_BOOKMARK
            : type === "audio"
              ? Strings.AUDIO_REMOVED_BOOKMARK
              : Strings.ARTICLE_REMOVED_BOOKMARK
        );
      });
    };

    const getAllBookmarks = () => {
      return new Promise((resolve, reject) => {
        buildfire.bookmarks.getAll((err, bookmarks) => {
          if (err) reject(err);
          resolve(bookmarks);
        });
      });
    };
    return { addBookmark, deletesBookmark, getAllBookmarks };
  };

  static bookmark = () => {
    const addBookmark = (options, type) => {
      buildfire.bookmarks.add(options, (err, bookmark) => {
        if (err) return console.error(err);
        this.showToast(
          options.type === "video"
            ? Strings.VIDEO_ADDED_BOOKMARK
            : options.type === "audio"
              ? Strings.AUDIO_ADDED_BOOKMARK
              : options.type === "article"
                ? Strings.ARTICLE_ADDED_BOOKMARK
                : Strings.SHORTCUT_ADDED_BOOKMARK
        );
      });
    };

    const deletesBookmark = (id, type) => {
      buildfire.bookmarks.delete(id, () => {
        this.showToast(
          type === "video"
            ? Strings.VIDEO_REMOVED_BOOKMARK
            : type === "audio"
              ? Strings.AUDIO_REMOVED_BOOKMARK
              : type === "article"
                ? Strings.ARTICLE_REMOVED_BOOKMARK
                : Strings.SHORTCUT_REMOVED_BOOKMARK
        );
      });
    };

    const getAllBookmarks = () => {
      return new Promise((resolve, reject) => {
        buildfire.bookmarks.getAll((err, bookmarks) => {
          if (err) reject(err);
          resolve(bookmarks);
        });
      });
    };
    return { addBookmark, deletesBookmark, getAllBookmarks };
  };

  static achievedBadgeDialog = () => {
    buildfire.dialog.alert({
      isMessageHTML: true,
      title: " ",
      okButtonText: " ",
      message: `
			  <div
				style="
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-image: url('https://i.gifer.com/origin/1a/1af8d3b487b77085d5288814f151e1de.gif');
				"
			  >
			<img src="https://seeklogo.com/images/B/business-people-circle-logo-83C8022853-seeklogo.com.png"
			  style="
			  width: 6.5rem;
			  height: 6.5rem;
			  margin-bottom: 1.5rem;
			  "
			  loading="lazy"
			/>
			<div style="text-align: center;">
			  <h2
				style="
				font-style: normal;
				font-weight: 700;
				font-size: 1.25rem;
				line-height: 1.5rem;
				margin-bottom: 1rem;
				"
			  >${Strings.ACHIEVED_BADGE_DIALOG_TITLE}</h2>
			  <p
				style="
				font-style: normal;
				font-weight: 500;
				font-size: 0.75rem;
				line-height: 1rem;
				margin-bottom: 2rem;
				color:#5F5F5F;
				"
			  >${Strings.ACHIEVED_BADGE_DIALOG_SUBTITLE}</p>
			  <h2
				style="
				font-style: normal;
				font-weight: 900;
				font-size: 1.25rem;
				line-height: 1.5rem;
				margin-bottom: 2rem;
				color:#0297A0;
				"
			  >LEARNER</h2>
			</div>
			<a 
			  style="
			  width: 6.625rem;
			  height: 2.5rem;
			  background-color:#0297A0;
			  text-align: center;
			  border-radius:4px;
			  "
			>
			  <span
			  style="
			  font-style: normal;
			  font-weight: 600 !important;
			  font-size: 1rem !important;
			  line-height: 1.5rem !important;
			  letter-spacing: 0.0625rem !important;
			  text-transform: uppercase !important;
			  color: #fff !important;
			  margin: 0.5rem;
			  "
			  >${Strings.ACHIEVED_BADGE_DIALOG_BUTTON}</span>
			</a>
		  </div>
			  `,
    });
  };

  static setReminder = (time, shortcut, assetId, title) => {
    let sendTime = new Date();
    sendTime.setSeconds(sendTime.getSeconds() + time);
    buildfire.notifications.localNotification.schedule(
      {
        title: "Task Reminder",
        text: `Time to complete this task: ${shortcut.title || ""}`,
        at: sendTime,
        data: { id: assetId },
        returnToPluginInstanceId: "true",
      },
      (err, result) => {
        if (err) return console.error(err);
        console.log("Notification scheduled", result);
      }
    );
    buildfire.notifications.localNotification.onClick = (data) => {
      Navigation.openPageDetails(data.id, title, true);
      document
        .getElementById(`${shortcut.id}reminderIcon`)
        .classList.add("hidden");
    };
  };
}
