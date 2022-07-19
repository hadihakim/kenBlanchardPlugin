const{addBookmark,deletesBookmark,getAllBookmarks}= Utilities.bookmark();
class PageDetails {
  static state = {
    id: "",
    data: {},
    chapterData: {},
    isBookmarked:false,
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
        if (result.text===Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK && this.state.data.type === "audio")  {
            addBookmark({
              id: this.state.data.id,
              title:this.state.data.meta.title,
              icon: Utilities.cropImage(this.state.data.meta.image,"s","1:1"),
              type: this.state.data.type
            });
            AudioRender.state.audioDrawerItemsList[0].text=Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
          }
          if (result.text===Strings.AUDIO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK && this.state.data.type === "audio") {
            deletesBookmark(this.state.data.id, this.state.data.type);
            AudioRender.state.audioDrawerItemsList[0].text=Strings.AUDIO_SHORTCUTS_DRAWER_BOOKMARK;
        }
        if (result.text===Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK && this.state.data.type === "video") {
          console.log(result, "HADI");
          addBookmark({
            id: this.state.data.id,
            title:this.state.data.meta.title,
            icon: Utilities.cropImage(this.state.data.meta.image,"s","1:1"),
            type: this.state.data.type
          });

          videoDetails.state.videoDrawerItemsList[0].text=Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
        }
        if (result.text===Strings.VIDEO_SHORTCUTS_DRAWER_REMOVE_BOOKMARK && this.state.data.type === "video") {
          deletesBookmark(this.state.data.id, this.state.data.type);
          videoDetails.state.videoDrawerItemsList[0].text=Strings.VIDEO_SHORTCUTS_DRAWER_BOOKMARK;
      }
      if (result.text===Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK && this.state.data.type === "article") {
        addBookmark({
          id: this.state.data.id,
          title:this.state.data.meta.title,
          icon: Utilities.cropImage(this.state.data.meta.image,"s","1:1"),
          type: "article"
        });
        ArticleRender.state.articleDrawerItemsList[0].text=Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK;
      }
      if (result.text===Strings.ARTICLE_SHORTCUTS_DRAWER_REMOVE_BOOKMARK && this.state.data.type === "article") {
        deletesBookmark(this.state.data.id,"article");
        ArticleRender.state.articleDrawerItemsList[0].text=Strings.ARTICLE_SHORTCUTS_DRAWER_BOOKMARK;
    }
      // for reminder
        if (result.text == Strings.SHORTCUT_SET_REMINDER) {
          this.openReminderDrawer();
        }
        // for notes
            //audio
        if(result.text ==Strings.AUDIO_SHORTCUTS_DRAWER_ADD_NOTE ){
          Utilities.addNote({
            itemId: this.state.id,
            title: this.state.data.title,
            imageUrl: this.state.data.image,
            });
        }
            //video
        if(result.text ==Strings.VIDEO_SHORTCUTS_DRAWER_ADD_NOTE){
          Utilities.addNote({
            itemId: this.state.id,
            title: this.state.data.title,
            imageUrl: this.state.data.image,
            });
        }
            //article
         if(result.text ==Strings.ARTICLE_SHORTCUTS_DRAWER_ADD_NOTE){
          Utilities.addNote({
            itemId: this.state.id,
            title: this.state.data.title,
            imageUrl: this.state.data.image,
            });
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
      ArticleRender.init(this.state.id,this.state.data);
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
    document.getElementById("pageDetails").innerHTML = "";
    await this.setState(id);
    this.detailsRender()
  }
}