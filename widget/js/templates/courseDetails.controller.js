class CourseDetails {

    static state = {
        data: {},
        courseArr: [
            {
                "title": "introduction",
                "subTitle": "Introduction to the course",
                "duration": 300,
                "type": ["video"],
                "progress":50,
                "data": {}
            },
            {
                "title": "Lesson 1",
                "subTitle": "Focus and Listen",
                "duration": 360,
                "type": ["video"],
                "progress":0,
                "data": {}
            },
            {
                "title": "Lesson 2",
                "subTitle": "Acknowledge Emotion",
                "duration": 400,
                "type": ["article","podcast"],
                "progress":30,
                "data": {}
            },
            {
                "title": "Lesson 3",
                "subTitle": "Ask Them What They Need",
                "duration": 100,
                "type": ["article"],
                "progress":60,
                "data": {}
            },
            {
                "title": "Lesson 4",
                "subTitle": "Reteach and Redirect",
                "duration": 1400,
                "type": ["video"],
                "progress":100,
                "data": {}
            },
            {
                "title": "Quiz",
                "subTitle": "Review",
                "duration": 1000,
                "type": ["article"],
                "progress":0,
                "data": {}
            },
        ],
        
    }
    static pointers = {
        courseDetailsContainer: "courseDetailsContainer",
        courseDetailsTemplate: "courseDetailsTemplate"

    }
    static setData(data) {
        this.state.data = data;
        this.state.data.details = this.state.courseArr;
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
            this.state.data.meta.image,
            "full_width",
            "4:3"
        )}')`;
        title[0].innerHTML = this.state.data.meta.title;
        if (this.state.data.meta.duration) {
            duration[0].innerHTML = `<span class="material-icons icon details-icon schedule-icon" id="scheduleIcon"> schedule </span>
                                    <span class="schedule-text bodyText-AppTheme">
                                ${Utilities.timeConvert(this.state.data.meta.duration)}</span>`;
        }
      
        this.state.data.details.forEach((el) => {
            ui.createElement( "p",lessons[0], el.title, ["course-lesson-title", "bodyText-AppTheme"], 'course-lesson-title' );
            ui.createElement( "p",lessons[0], el.subTitle, ["course-lesson-subtitle", "headerText-AppTheme"], 'course-lesson-subtitle' );
            const durationState=document.createElement("div");
            // durationState.classList.add("mdc-card-footer ");
            durationState.innerHTML=`<div class="duration duration-details">
            <span class="material-icons icon details-icon schedule-icon"  id="scheduleIcon"> schedule </span>
                 <span class="schedule-text bodyText-AppTheme">
                      ${Utilities.timeConvert(this.state.data.meta.duration)}
                  </span>
            </div>`
             lessons[0].appendChild(durationState)
            let icons=document.createElement("div");
            icons.classList.add("icon-course");
             for(let i=0; i< el.type.length; i++){
                let icon=document.createElement("div");
                icon.classList.add("icons")
                if(el.type[i] =="video"){
                    icon.innerHTML=`<label class="material-icons icon" id="movieIcon">videocam</label> `; 
                }else if(el.type[i] =="podcast"){
                    icon.innerHTML=`<label class="material-icons icon" id="podcastIcon">headphones</label> `;
                }else if(el.type[i]=="article"){
                    icon.innerHTML=`<label class="material-icons icon" id="articleIcon">article</label> `;
                }
                icons.appendChild(icon)
            }
            lessons[0].appendChild(icons)

            //<div class="progressBar"></div>
            const progress = document.createElement("div");
            progress.classList.add("progressBar");
            let div=document.createElement("div");
            div.classList.add("card-progressBar");
            let percentageDiv=document.createElement("div");
            percentageDiv.style.width=`${el.progress}%`;
            percentageDiv.classList.add("percentageDiv","progress-lesson")
            div.appendChild(percentageDiv);
            progress.appendChild(div);

            lessons[0].appendChild(progress)
        })


        container.appendChild(firstClone);
        Utilities.setAppTheme();
    }

    static init = (data) => {
        document.getElementById(this.pointers.courseDetailsContainer).innerHTML = ""
        this.setData(data);
        this.courseRender();
    }
}
