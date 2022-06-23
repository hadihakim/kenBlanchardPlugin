
const utilities = () => {

	const cropImage = (image, size = "full_width", aspect = "16:9") => {
		let cropedImage = buildfire.imageLib.cropImage(
			image,
			{ size: size, aspect: aspect }
		)
		return cropedImage;
	}

	const timeConvert=(n)=> {
		let num = n;
		let hours = (num / 60);
		let rHours = Math.floor(hours);
		let minutes = (hours - rHours) * 60;
		let rMinutes = Math.round(minutes);
		return  rHours + "h " + rMinutes + "min";
	  }

	  return {cropImage, timeConvert}

}
