const { addBookmark, deletesBookmark, getAllBookmarks } = Utilities.bookmark();
class PageDetails {
  static state = {
    id: "",
    data: {},
    chapterData: {},
    isBookmarked: false,
    fromNotification: false,
    haveReminders: true,
    isInProfile: false,
  };
  static setState = async (id, fromNotification) => {
    this.state.id = id;
    let newRes = await HandleAPI.getDataByID(id, "assets_info");
    if(this.state.isInProfile){
      this.state.data = {...UserProfile.state.data.assets[id],...newRes.data};
    }else{
      this.state.data =newRes.data;
    }
    this.state.fromNotification = fromNotification;
  };

  static audioDrawerItemsListAction = (resultText) => {
    switch (resultText) {
      case Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK:
        addBookmark({
          id: this.state.data.id,
          title: this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image, "s", "1:1"),
          type: this.state.data.type,
        });
        AudioRender.state.audioDrawerItemsList[0].text =
          Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, this.state.data.type);
        AudioRender.state.audioDrawerItemsList[0].text =
          Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK;
        break;
      case Strings.AUDIO_SHORTCUTS_DRAWER_ADD_NOTE:
        Utilities.addNote({
          itemId: this.state.id,
          title: this.state.data.title,
          imageUrl: this.state.data.image,
        });
        break;
      default:
        break;
    }
  };

  static articleDrawerItemsListAction(resultText) {
    switch (resultText) {
      case Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK:
        addBookmark({
          id: this.state.data.id,
          title: this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image, "s", "1:1"),
          type: "article",
        });
        ArticleRender.state.articleDrawerItemsList[0].text =
          Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, "article");
        ArticleRender.state.articleDrawerItemsList[0].text =
          Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK;
        break;
      case Strings.ARTICLE_SHORTCUTS_DRAWER_ADD_NOTE:
        Utilities.addNote({
          itemId: this.state.id,
          title: this.state.data.title,
          imageUrl: this.state.data.image,
        });
        break;
      default:
        break;
    }
  }

  static videoDrawerItemsListAction(resultText) {
    switch (resultText) {
      case Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK:
        addBookmark({
          id: this.state.data.id,
          title: this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image, "s", "1:1"),
          type: this.state.data.type,
        });
        videoDetails.state.videoDrawerItemsList[0].text =
          Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, this.state.data.type);
        videoDetails.state.videoDrawerItemsList[0].text =
          Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK;
        break;
      case Strings.VIDEO_SHORTCUTS_DRAWER_ADD_NOTE:
        Utilities.addNote({
          itemId: this.state.id,
          title: this.state.data.title,
          imageUrl: this.state.data.image,
        });
        break;
      default:
        break;
    }
  }

  static videoShortcutDrawerItemListAction(resultText, shortcut) {
    switch (resultText) {
      case Strings.SHORTCUT_BOOKMARK_SHORTCUT:
        addBookmark({
          id: shortcut.id,
          title: shortcut.title,
          icon: "",
          type: "shortcut",
        });
        videoDetails.renderVideoShortcuts("shortcuts");
        break;
      case Strings.SHORTCUT_BOOKMARK_REMOVE:
        deletesBookmark(shortcut.id, "shortcut");
        videoDetails.renderVideoShortcuts("shortcuts");
        break;
      default:
        break;
    }
  }

  static audioShortcutDrawerItemListAction(resultText, shortcut) {
    switch (resultText) {
      case Strings.SHORTCUT_BOOKMARK_SHORTCUT:
        addBookmark({
          id: shortcut.id,
          title: shortcut.title,
          icon: "",
          type: "shortcut",
        });
        AudioRender.tabClickHandler("shortcuts");
        break;
      case Strings.SHORTCUT_BOOKMARK_REMOVE:
        deletesBookmark(shortcut.id, "shortcut");
        AudioRender.tabClickHandler("shortcuts");
        break;
      default:
        break;
    }
  }

  static openDrawerAudioOrVideoOrArticle = (options, shortcut) => {
    buildfire.components.drawer.open(
      {
        multiSelection: false,
        allowSelectAll: false,
        multiSelectionActionButton: { text: "Save", type: "success" },
        enableFilter: false,
        isHTML: false,
        triggerCallbackOnUIDismiss: false,
        autoUseImageCdn: true,
        listItems: options,
      },
      (err, result) => {
        if (err) return console.error(err);
        buildfire.components.drawer.closeDrawer();
        if (!shortcut) {
          // to manage bookmarks and notes for each asset type
          switch (this.state.data.type) {
            case "audio":
              this.audioDrawerItemsListAction(result.text);
              break;
            case "video":
              this.videoDrawerItemsListAction(result.text);
              break;
            case "article":
              this.articleDrawerItemsListAction(result.text);
              break;
            default:
              break;
          }
        } else {
          // to mange bookmark for each shortcut in audio or video
          switch (this.state.data.type) {
            case "audio":
              this.audioShortcutDrawerItemListAction(result.text, shortcut);
              break;
            case "video":
              this.videoShortcutDrawerItemListAction(result.text, shortcut);
              break;
            default:
              break;
          }
          // for reminder
          if (result.text == Strings.SHORTCUT_SET_REMINDER) {
            this.openReminderDrawer(shortcut);
          }
        }
      }
    );
  };

  static openReminderDrawer = (shortcut) => {
    buildfire.components.drawer.open(
      {
        multiSelection: false,
        allowSelectAll: false,
        multiSelectionActionButton: { text: "Save", type: "success" },
        enableFilter: false,
        isHTML: false,
        triggerCallbackOnUIDismiss: false,
        autoUseImageCdn: true,
        listItems: [
          { text: Strings.REMINDER_DRAWER_OP1, imageUrl: "", selected: false },
          { text: Strings.REMINDER_DRAWER_OP2, imageUrl: "", selected: false },
          { text: Strings.REMINDER_DRAWER_OP3, imageUrl: "", selected: false },
          { text: Strings.REMINDER_DRAWER_OP4, imageUrl: "", selected: false },
        ],
      },
      //     REMINDER_DRAWER_OP1:"10 Minutes",
      // REMINDER_DRAWER_OP2:"30 Minutes",
      // REMINDER_DRAWER_OP3:"1 Hour",
      // REMINDER_DRAWER_OP4:"1 Day",
      (err, result) => {
        if (err) return console.error(err);
        buildfire.components.drawer.closeDrawer();
        if (result.text === Strings.REMINDER_DRAWER_OP1) {
          Utilities.setReminder(
            10,
            shortcut,
            this.state.id,
            this.state.data.meta.title
          );
          this.state.haveReminders?document
          .getElementById(`${shortcut.id}reminderIcon`)
          .classList.remove("hidden"):null;
        } else if (result.text === Strings.REMINDER_DRAWER_OP2) {
          Utilities.setReminder(
            1800,
            shortcut,
            this.state.data.meta.title
          );
          this.state.haveReminders?document
          .getElementById(`${shortcut.id}reminderIcon`)
          .classList.remove("hidden"):null;
        } else if (result.text === Strings.REMINDER_DRAWER_OP3) {
          Utilities.setReminder(
            3600,
            shortcut,
            this.state.id,
            this.state.data.meta.title
          );
          this.state.haveReminders?document
          .getElementById(`${shortcut.id}reminderIcon`)
          .classList.remove("hidden"):null;
        } else if (result.text === Strings.REMINDER_DRAWER_OP4) {
          Utilities.setReminder(
            86400,
            shortcut,
            this.state.id,
            this.state.data.meta.title
          );
          this.state.haveReminders?document
          .getElementById(`${shortcut.id}reminderIcon`)
          .classList.remove("hidden"):null;
        }
        if (result.text) {
          Utilities.showToast(`Reminder set for ${result.text}`);
        }
      }
    );
  };
  
  static detailsRender = () => {
    if (this.state.data.type === "summary") {
      summaryRender.init(this.state.id, this.state.data);
    } else if (this.state.data.type === "course") {
      CourseRender.init(this.state.id, this.state.data);
    } else if (this.state.data.type === "audio") {
      AudioRender.init(
        this.state.id,
        this.state.data,
        this.state.fromNotification
      );
      this.state.fromNotification
        ? AudioRender.tabClickHandler("shortcuts")
        : null;
    } else if (this.state.data.type === "article") {
      ArticleRender.init(this.state.id, this.state.data);
    } else if (this.state.data.type === "PDF") {
      console.log(" PDF pageDetails ");
      // should call external plugin
    } else if (this.state.data.type === "video") {
      videoDetails.initVideoDetails(this.state.id, this.state.data);
      this.state.fromNotification
        ? videoDetails.renderVideoShortcuts("shortcuts")
        : null;
    }

    // Utilities.setAppTheme();
  };

  static init = async (id, fromNotification) => {
    document.getElementById("pageDetails").innerHTML = "";
    if(UserProfile.state.data.assets.hasOwnProperty(id)){
      this.state.isInProfile=true;
    }
    await this.setState(id, fromNotification);
    this.detailsRender();
  };
}
