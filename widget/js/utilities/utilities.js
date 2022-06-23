
const utilities = () => {

	const cropImage = (image, size = "full_width", aspect = "16:9") => {
		let cropedImage = buildfire.imageLib.cropImage(
			image,
			{ size: size, aspect: aspect }
		)
		return cropedImage;
	}

	const timeConvert = (n) => {
		let num = n;
		let hours = (num / 60);
		let rHours = Math.floor(hours);
		let minutes = (hours - rHours) * 60;
		let rMinutes = Math.round(minutes);
		return rHours + "h " + rMinutes + "min";
	}

	const getAppTheme = () => {
		buildfire.appearance.getAppTheme((err, appTheme) => {
			if (err) return console.error(err);
			config.appTheme = appTheme;
		});
	}

	const setThemeHandler = (arr, type, color) => {
		for (let i = 0; i < arr.length; i++) {
			switch (type) {
				case "color":
					arr[i].style.color = color;
					break;
				case "back":
					arr[i].style.backgroundColor = color;
					break;
				default:
					break;
			}
		}
	}

	const setAppTheme = () => {
		let colorCollections = [
			{
				elements: document.getElementsByClassName("icon"),
				colorType: "color",
				colorDegree: config.appTheme.colors.icons
			}, {
				elements: document.getElementsByClassName("headerText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.headerText
			}, {
				elements: document.getElementsByClassName("barText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.titleBarTextAndIcons
			}, {
				elements: document.getElementsByClassName("bodyText-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.bodyText
			}, {
				elements: document.getElementsByClassName("userContainer"),
				colorType: "back",
				colorDegree: config.appTheme.colors.primaryTheme
			}, {
				elements: document.getElementsByClassName("info-btn-AppTheme"),
				colorType: "back",
				colorDegree: config.appTheme.colors.infoTheme
			}, {
				elements: document.getElementsByClassName("info-link-AppTheme"),
				colorType: "color",
				colorDegree: config.appTheme.colors.infoTheme
			}
		];

		colorCollections.forEach(element => {
			setThemeHandler(element.elements, element.colorType, element.colorDegree);
		})
	}
	return { cropImage, timeConvert, getAppTheme, setAppTheme }
}
