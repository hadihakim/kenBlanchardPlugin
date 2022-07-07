class CourseDetails {

    static state = {
        data: {},

    }
    static pointers = {
        courseDetailsContainer: "courseDetailsContainer",
        courseDetailsTemplate: "courseDetailsTemplate"

    }
    static setData(id) {
        this.state.data= coursesData.data.courses[id];
    }

    static courseRender() {
        let container = document.getElementById(this.pointers.courseDetailsContainer);
        const template = document.getElementById(this.pointers.courseDetailsTemplate);
        const firstClone = template.content.cloneNode(true);

        let image = firstClone.querySelectorAll(".course-img");
        let title = firstClone.querySelectorAll(".course-title");
        let duration = firstClone.querySelectorAll(".duration-details");
        let lessons = firstClone.querySelectorAll(".course-lessons-list");

        image[0].style.backgroundImage = `url('${Utilities.cropImage(
            this.state.data.image,
            "full_width",
            "4:3"
        )}')`;
        title[0].innerHTML = this.state.data.title;
        // if (this.state.data.meta.duration) {
        //     duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id="scheduleIcon"> schedule </span>
        //                             <span class="schedule-text bodyText-AppTheme">
        //                         ${Utilities.timeConvert(this.state.data.meta.duration)}</span>`;
        // }
      
        this.state.data.lessons.forEach((el) => {
            ui.createElement( "p",lessons[0], el.title, ["course-lesson-title", "bodyText-AppTheme"], 'course-lesson-title' );
            ui.createElement( "p",lessons[0], el.subtitle, ["course-lesson-subtitle", "headerText-AppTheme"], 'course-lesson-subtitle' );
            // const durationState=document.createElement("div");
            // // durationState.classList.add("mdc-card-footer ");
            // durationState.innerHTML=`<div class="duration duration-details">
            // <span class="material-icons icon details-icon schedule-icon"  id="scheduleIcon"> schedule </span>
            //      <span class="schedule-text bodyText-AppTheme">
            //           ${Utilities.timeConvert(this.state.data.meta.duration)}
            //       </span>
            // </div>`
            //  lessons[0].appendChild(durationState)
            // let icons=document.createElement("div");
            // icons.classList.add("icon-course");
            //  for(let i=0; i< el.type.length; i++){
            //     let icon=document.createElement("div");
            //     icon.classList.add("icons")
            //     if(el.type[i] =="video"){
            //         icon.innerHTML=`<label class="material-icons icon" id="movieIcon">videocam</label> `; 
            //     }else if(el.type[i] =="podcast"){
            //         icon.innerHTML=`<label class="material-icons icon" id="podcastIcon">headphones</label> `;
            //     }else if(el.type[i]=="article"){
            //         icon.innerHTML=`<label class="material-icons icon" id="articleIcon">article</label> `;
            //     }
            //     icons.appendChild(icon)
            // }
            // lessons[0].appendChild(icons)

            //<div class="progressBar"></div>
            const progress = document.createElement("div");
            progress.classList.add("progressBar");
            let div=document.createElement("div");
            div.classList.add("courseDetails-card-progressBar", "holderPercentage");
            let percentageDiv=document.createElement("div");
            percentageDiv.style.width=`${el.progress}%`;
            percentageDiv.classList.add("percentageDiv","progress-lesson", "infoTheme")
            div.appendChild(percentageDiv);
            progress.appendChild(div);

            lessons[0].appendChild(progress)
        })


        container.appendChild(firstClone);
        Utilities.setAppTheme();
    }

    static init = (id) => {
        document.getElementById(this.pointers.courseDetailsContainer).innerHTML = ""
        this.setData(id);
        this.courseRender();
    }
}
