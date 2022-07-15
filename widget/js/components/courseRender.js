class CourseRender{
    static state={
        id:"",
        data:{},
    }
    static pointers={
        pageDetails: "pageDetails",
        detailsPageTemplate: "detailsPageTemplate",
    }
    static setData =(id,data)=>{
        this.state.data=data;
        this.state.id=id;
    }
    static render=()=>{
        let container = document.getElementById(this.pointers.pageDetails);
        container.innerHTML = "";
        
        const template = document.getElementById(this.pointers.detailsPageTemplate);
        const firstClone = template.content.cloneNode(true);
        let image = firstClone.querySelectorAll(".details-img");
        let title = firstClone.querySelectorAll(".details-title");
        let duration = firstClone.querySelectorAll(".duration-details");
        let startButton = firstClone.querySelectorAll(".mdc-button");
        let startCourse = firstClone.querySelectorAll(".startCourse");
        let descriptionTitle = firstClone.querySelectorAll(".description-title");
        let descriptionText = firstClone.querySelectorAll(".description-text");
        let learnTitle = firstClone.querySelectorAll(".learn-title");
        let lessonTitle = firstClone.querySelectorAll(".lesson-title");
        let learnItem = firstClone.querySelectorAll(".lesson-list");
        let lessonItem = firstClone.querySelectorAll(".learn-list");
        // give the button inner text -->
        startCourse[0].innerHTML = Strings.START_COURSE;
        startButton[0].addEventListener("click", () => Navigation.openCourseDetails(this.state.id, this.state.data.title));
        image[0].style.backgroundImage = `url('${Utilities.cropImage(
          this.state.data.meta.image,
          "full_width",
          "4:3"
        )}')`;
        title[0].innerHTML = this.state.data.meta.title;
        if (this.state.data.meta.duration) {
          duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id= "scheduleIcon2"> schedule </span>
                                <span class="schedule-text bodyText-AppTheme">
                            ${Utilities.timeConvert(this.state.data.meta.duration, "sec")}</span>`;
        }
        descriptionTitle[0].innerHTML = Strings.COURSE_DETAILS_DESCRIPTION;
        descriptionText[0].innerHTML =
          "When one of your team members is at the Disillusioned learner stage on a goal, they have some knowledge and skills but are not yet competent. They can easily get stuck, become discouraged, and even feel ready to quit. Their commitment is low.";
        learnTitle[0].innerHTML = Strings.COURSE_DETAILS_LEARN_LIST;
        lessonTitle[0].innerHTML = Strings.COURSE_DETAILS_Lessons_LIST;
        for (let i = 0; i < 4; i++) {
          ui.createElement(
            "li",
            lessonItem[0],
            "Introduction to the Course Focus",
            ["lesson-list-item"],
            `lesson-list-item${i}`
          );
        }
        for (let i = 0; i < 4; i++) {
          ui.createElement(
            "li",
            learnItem[0],
            "Someone to listen to their concerns",
            ["learn-list-item"],
            `learn-list-item${i}`
          );
        }
        container.appendChild(firstClone);
    }
    static init =(id,data)=>{
        this.setData(id,data);
        this.render();
    }
}