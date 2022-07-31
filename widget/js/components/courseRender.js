class CourseRender{
    static state={
        id:"",
        data:{},
        
    }
    static pointers={
        pageDetails: "pageDetails",
        courseDetailsFirstPageTemplate: "courseDetails-FirstPageTemplate",
    }
    static setData =(id,data)=>{
        this.state.data=data;
        this.state.id=id;
    }
    static render=()=>{
        let container = document.getElementById(this.pointers.pageDetails);
        container.innerHTML = "";
        
        const template = document.getElementById(this.pointers.courseDetailsFirstPageTemplate);
        const firstClone = template.content.cloneNode(true);
        let image = firstClone.querySelectorAll(".courseDetails-FirstPage-img");
        let title = firstClone.querySelectorAll(".courseDetails-FirstPage-title");
        let duration = firstClone.querySelectorAll(".duration-details");
        let startButton = firstClone.querySelectorAll(".mdc-button");
        let startCourse = firstClone.querySelectorAll(".startCourse");
        let descriptionTitle = firstClone.querySelectorAll(".courseDetails-FirstPage-description-title");
        let descriptionText = firstClone.querySelectorAll(".courseDetails-FirstPage-description-text");
        let learnTitle = firstClone.querySelectorAll(".learn-title");
        let lessonTitle = firstClone.querySelectorAll(".lesson-title");
        let learnItem = firstClone.querySelectorAll(".lesson-list");
        let lessonItem = firstClone.querySelectorAll(".learn-list");
        // give the button inner text -->
        startCourse[0].innerHTML = Strings.START_COURSE;
        startButton[0].addEventListener("click", () => {Navigation.openCourseDetails(this.state.data,"from course"); 
        Stats.incrementViews(this.state.id, (err, res) => {
            if (err) return console.log(err);
          })
        });
        image[0].style.backgroundImage = `url('${Utilities.cropImage(
          this.state.data.meta.image,
          "full_width",
          "4:3"
        )}')`;
        title[0].innerHTML = this.state.data.meta.title;
        if (this.state.data.meta.duration) {
          duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id= "scheduleIcon2"> schedule </span>
                                <span class="schedule-text bodyText-AppTheme">
                            ${Utilities.timeConvert(this.state.data.meta.duration,"hh|mm")}</span>`;
        }
        descriptionTitle[0].innerHTML = Strings.COURSE_DETAILS_DESCRIPTION;
        descriptionText[0].innerHTML =this.state.data.meta.description;
        container.appendChild(firstClone);
    }
    static init =(id,data)=>{
        this.setData(id,data);
        this.render();
    }
}