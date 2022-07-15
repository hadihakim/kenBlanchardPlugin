class Skeleton {

	static state={
		mainSkeletonSections :['section1', 'section2']
	}

    static horizontal1_Skeleton = (container) => {
        Utilities.scrollTop();
        container.innerHTML = '';
        const nodesClone = horizontal1_SkeletonTemplate.content.cloneNode(true);
					let card = nodesClone.querySelectorAll(".horizontal-1--skeleton");
					for (let i = 0; i < 3; i++) {
						let div = document.createElement("div");
						div.classList.add("horizontal-1--card");
						let innerHTML = `<div class="firstCard skeleton"></div>`
						div.innerHTML = innerHTML;
						card[0].appendChild(div);
					}
					container.appendChild(nodesClone);
    }

    static horizontal_Skeleton = (container) => {
        Utilities.scrollTop();
        container.innerHTML = '';
        const nodesClone = horizontalSkeletonTemplate.content.cloneNode(true);
					let card = nodesClone.querySelectorAll(".horizontal--skeleton");
					for (let i = 0; i < 4; i++) {
						let div = document.createElement("div");
						div.classList.add("horizontal--card");
						let innerHTML = `<div class="firstDiv skeleton"></div>
						<div class="secondDiv skeleton"></div>
						<div class="thirdDiv skeleton"></div>
						<div class="fourthDiv skeleton"></div>`
						div.innerHTML = innerHTML;
						card[0].appendChild(div);
					}
					container.appendChild(nodesClone);
    }

    static verticalSeeAll_Skeleton = (container) => {
        Utilities.scrollTop();
        container.innerHTML = '';
        const nodesClone = verticalSeeAll_SkeletonTemplate.content.cloneNode(true);
					let card = nodesClone.querySelectorAll(".verticalSeeAll--skeleton");
					for (let i = 0; i < 6; i++) {
						let div = document.createElement("div");
						div.classList.add("verticalSeeAll--card");
						let innerHTML = `<div class="firstDiv skeleton"></div>
                        <div class="secondPart">
                            <div class="secondDiv skeleton"></div>
                            <div class="thirdDiv skeleton"></div>
                            <div class="fourthDiv skeleton"></div>
                            <div class="fifthDiv skeleton"></div>
                        </div>`
						div.innerHTML = innerHTML;
						card[0].appendChild(div);
					}
					container.appendChild(nodesClone);
    }

	/* Why using this method ?! skeleton been executing twice 1st by calling this method 2nd when rendering the cards by calling the cardRender method.*/
	static initMainSkeleton = (container) => {
		exploreButton.classList.add("hidden");
		this.state.mainSkeletonSections.forEach((section,idx)=>{
			let headContainer = ui.createElement('div',container, `<div class="container-header">${section}</div>`, ['horizontal'], `skeletonSection-${idx}`);
			let skeletonContainer = ui.createElement('div',headContainer, '', [], `skeletonContainer-${idx}`);
			// if(idx==0){
			// 	this.horizontal1_Skeleton(skeletonContainer);
			// }else{
			// 	this.horizontal_Skeleton(skeletonContainer);
			// }
		})
	}
}