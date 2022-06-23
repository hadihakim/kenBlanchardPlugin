
const {timeConvert, cropImage} = utilities();
const templates = () => {
	const forYouRender = (apiData, container, duration) => {
		let assetsId = apiData.data.sections[1].assets[0];
		let data = apiData.data.assets_info[assetsId];

		const template = document.getElementById("forYouTemplate");

		for (let i = 0; i < 6; i++) {
			const firstClone = template.content.cloneNode(true);
			let title = firstClone.querySelectorAll(".card-Text-Header");
			let note = firstClone.querySelectorAll(".card-Text-Note");
			let image = firstClone.getElementById("card_body");
			title[0].innerHTML = data.meta.title;
			note[0].innerHTML = data.meta.description;
			image.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
			url('${cropImage(data.meta.image)}')`;
			container.appendChild(firstClone);
		}
	};

	const recommendedCardRender = (apiData, container, durationState) => {
		let assetsId = apiData.data.sections[1].assets[0];
		let data = apiData.data.assets_info[assetsId];
		const recommendedTemplate = document.getElementById("recommendedTemplate");

		for (let index = 0; index < 6; index++) {
			const nodesClone = recommendedTemplate.content.cloneNode(true);
			let image = nodesClone.querySelectorAll(".image");
			let category = nodesClone.querySelectorAll(".category");
			let title = nodesClone.querySelectorAll(".title");
			let duration = nodesClone.querySelectorAll(".duration");
			image[0].style.backgroundImage = `url('${cropImage(data.meta.image)}')`;
			category[0].innerText = data.type;
			title[0].innerText = data.meta.title;
			if (durationState) {
				duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
				<span class="schedule-text">
					${timeConvert(
					data.meta.duration
				)}</span>`;
			}
			container.appendChild(nodesClone);
		}
	};

	const seeAllCardsRender = (apiData, container, durationState) => {
		let assetsId = apiData.data.sections[1].assets[0];
		let data = apiData.data.assets_info[assetsId];

		const recommendedTemplate = document.getElementById("seeAllTemplate");
		for (let index = 0; index < 6; index++) {
			const nodesClone = recommendedTemplate.content.cloneNode(true);
			let image = nodesClone.querySelectorAll(".image");
			let title = nodesClone.querySelectorAll(".title");
			let duration = nodesClone.querySelectorAll(".duration");
			let description = nodesClone.querySelectorAll(".description");
			image[0].style.backgroundImage = `url('${cropImage(data.meta.image,"full_width", "4:3")}')`;
			title[0].innerText = data.meta.title;
			description[0].innerText = data.meta.description;
			if (durationState) {
				duration[0].innerHTML = `<span class="material-icons icon schedule-icon"> schedule </span>
				<span class="schedule-text">
					${timeConvert(
					data.meta.duration
				)}</span>`;
			}
			container.appendChild(nodesClone);
		}
	};

	const trendingRender = (data, containerId) => {
		const container = document.getElementById(containerId);
		const trendingTemplate = document.getElementById("trendingTemplate");
		for (let i = 0; i < 6; i++) {
			const nodesClone = trendingTemplate.content.cloneNode(true);
			let title = nodesClone.querySelectorAll(".trending-span");
			title[0].innerHTML = "trending";
			container.appendChild(nodesClone);
		};
	};

	return { forYouRender, recommendedCardRender, seeAllCardsRender, trendingRender };
};
