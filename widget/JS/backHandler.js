

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
						mainPage.classList.remove("hidden");
						subPage.classList.add("hidden");
						userContainer.classList.remove("hidden");
						sortIcon.classList.add("hidden");
						break;
					case "Personal Home Page from See All":
						mainContainer.classList.remove("hidden");
						seeAllContainer.classList.add("hidden");
						break;
					default:

						break;
				}
			}
		);
		scrollTop();
		buildfire.history.pop();

	};
}





initBack();
