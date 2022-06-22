

function initBack() {

	buildfire.navigation.onBackButtonClick = () => {
		buildfire.history.get(
			{
			  pluginBreadcrumbsOnly: true,
			},
			(err, result) => {
			  console.info("Current Plugin Breadcrumbs", result);
				switch (result[0].label) {
					case "Personal Home Page":
						window.location.href = "index.html";
						break;
					default:
						break;
				}
			}
		  );

		buildfire.history.pop();
	};
}

initBack();
