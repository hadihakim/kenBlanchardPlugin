class PageDetails {
  static state = {
    id: "",
    data: {},
    chapterData: {}
  }
  static setState = async (id) => {
    this.state.id = id;
    let newRes = await HandleAPI.getDataByID(id, "assets_info")
    this.state.data = newRes.data
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
        console.log("Selected Contacts", result.text);
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
          {text: "10 Minutes",imageUrl: "",selected: false,},
          { text: "30 Minutes", imageUrl: "", selected: false },
          { text: "1 Hour", imageUrl: "", selected: false },
          {text: "1 day", imageUrl: "",selected: false,},
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
      AudioRender.init(this.state.data);
    }
    else if (this.state.data.type === "article") {
      ArticleRender.init(this.state.data);
    }
    else if (this.state.data.type === "PDF") {
      console.log(" PDF pageDetails ");
    }
    else if (this.state.data.type === "video") {
      videoDetails.initVideoDetails(this.state.data);
    }

    Utilities.setAppTheme();
  };

  static init = async (id) => {
    pageDetails.innerHTML = "";
    await this.setState(id);
    this.detailsRender()
  }
}