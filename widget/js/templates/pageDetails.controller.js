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

  static detailsRender = () => {
    if (this.state.data.type === "summary") {
      summaryRender.init(this.state.id,this.state.data);
    } else if (this.state.data.type === "course") {
      CourseRender.init(this.state.id,this.state.data)
    }
    else if (this.state.data.type === "audio") {
      // console.log("data >>",this.state.data);
      // console.log("id",this.state.id);
      AudioRender.init(this.state.data);
    }
    else if (this.state.data.type === "article") {
      ArticleRender.init(this.state.data);
    }
    else if (this.state.data.type === "PDF") {
      console.log(" ^^^^^^^^^^^^^^^^^^^^^ ");
    }
    else if (this.state.data.type === "video") {
      videoDetails.initVideoDetails(this.state.data);
      console.log(this.state.data, "videeeeee");
    }


    Utilities.setAppTheme();
  };


  static init = async (id) => {
    pageDetails.innerHTML = "";
    await this.setState(id);
    this.detailsRender()
  }
}