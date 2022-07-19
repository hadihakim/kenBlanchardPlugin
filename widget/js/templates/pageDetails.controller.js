const { addBookmark, deletesBookmark, getAllBookmarks } = Utilities.bookmark();
class PageDetails {
  static state = {
    id: "",
    data: {},
    chapterData: {},
    isBookmarked: false,
  }
  static setState = async (id) => {
    this.state.id = id;
    let newRes = await HandleAPI.getDataByID(id, "assets_info")
    this.state.data = newRes.data
  }

  static audioDrawerItemsListAction = (resultText) => {
    switch (resultText) {
      case Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK:
        addBookmark({
          id: this.state.data.id,
          title: this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image, "s", "1:1"),
          type: this.state.data.type
        });
        AudioRender.state.audioDrawerItemsList[0].text = Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, this.state.data.type);
        AudioRender.state.audioDrawerItemsList[0].text = Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK;
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


  }

  static articleDrawerItemsListAction(resultText) {
    switch (resultText) {
      case Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK:
        addBookmark({
          id: this.state.data.id,
          title: this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image, "s", "1:1"),
          type: "article"
        });
        ArticleRender.state.articleDrawerItemsList[0].text = Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, "article");
        ArticleRender.state.articleDrawerItemsList[0].text = Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK;
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
          type: this.state.data.type
        });
        videoDetails.state.videoDrawerItemsList[0].text = Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        break;
      case Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK:
        deletesBookmark(this.state.data.id, this.state.data.type);
        videoDetails.state.videoDrawerItemsList[0].text = Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK;
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

  static openDrawerAudioOrVideoOrArticle = (options) => {
    buildfire.components.drawer.open(
      {
        multiSelection: false,
        allowSelectAll: false,
        multiSelectionActionButton: { text: 'Save', type: 'success' },
        enableFilter: false,
        isHTML: false,
        triggerCallbackOnUIDismiss: false,
        autoUseImageCdn: true,
        listItems: options
      },
      (err, result) => {
        if (err) return console.error(err);
        buildfire.components.drawer.closeDrawer();
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
        // for reminder
        if (result.text == Strings.SHORTCUT_SET_REMINDER) {
          this.openReminderDrawer();
        }
      }
    );
  }

  static openReminderDrawer = () => {
    buildfire.components.drawer.open(
      {
        multiSelection: false,
        allowSelectAll: false,
        multiSelectionActionButton: { text: 'Save', type: 'success' },
        enableFilter: false,
        isHTML: false,
        triggerCallbackOnUIDismiss: false,
        autoUseImageCdn: true,
        listItems: [
          { text: "10 Minutes", imageUrl: "", selected: false, },
          { text: "30 Minutes", imageUrl: "", selected: false },
          { text: "1 Hour", imageUrl: "", selected: false },
          { text: "1 day", imageUrl: "", selected: false, },
        ]
      },
      (err, result) => {
        if (err) return console.error(err);
        buildfire.components.drawer.closeDrawer();
        console.log("Selected reminder: ", result.text);

      }
    );
  }
  static detailsRender = () => {
    if (this.state.data.type === "summary") {
      summaryRender.init(this.state.id, this.state.data);
    } else if (this.state.data.type === "course") {
      CourseRender.init(this.state.id, this.state.data)
    }
    else if (this.state.data.type === "audio") {
      AudioRender.init(this.state.id, this.state.data);
    }
    else if (this.state.data.type === "article") {
      ArticleRender.init(this.state.id, this.state.data);
    }
    else if (this.state.data.type === "PDF") {
      console.log(" PDF pageDetails ");
    }
    else if (this.state.data.type === "video") {
      videoDetails.initVideoDetails(this.state.id, this.state.data);
    }

    Utilities.setAppTheme();
  };

  static init = async (id) => {
    document.getElementById("pageDetails").innerHTML = "";
    await this.setState(id);
    this.detailsRender()
  }
}