

function initBack() {
	buildfire.navigation.onBackButtonClick = () => {
		// buildfire.history.get(
		// 	{
		// 	  pluginBreadcrumbsOnly: true,
		// 	},
		// 	(err, result) => {
		// 	  console.info("Current Plugin Breadcrumbs", result);
		// 		switch (result[0].label) {
		// 			case "Personal Home Page":
		// 				window.location.href = "index.html";
		// 				break;
		// 			default:
		// 				break;
		// 		}
		// 	}
		//   );

		// buildfire.history.pop();
		if (mainPage.classList.contains("hidden") == true) {
			mainPage.classList.remove("hidden");
			subPage.classList.add("hidden");
			userContainer.classList.remove("hidden");
			sortIcon.classList.add("hidden");
			
		}
	};
}

initBack();
