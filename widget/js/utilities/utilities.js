const utilities = () => {
  const cropImage = (image, size = "full_width", aspect = "16:9") => {
    let cropedImage = buildfire.imageLib.cropImage(image, {
      size: size,
      aspect: aspect,
    });
    return cropedImage;
  };

  const timeConvert = (n) => {
    let num = n;
    let hours = num / 60;
    let rHours = Math.floor(hours);
    let minutes = (hours - rHours) * 60;
    let rMinutes = Math.round(minutes);
    return rHours + "h " + rMinutes + "min";
  };

  const getAppTheme = () => {
    buildfire.appearance.getAppTheme((err, appTheme) => {
      if (err) return console.error(err);
      config.appTheme = appTheme;
    });
  };

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
  };

  const setAppTheme = () => {
    let colorCollections = [
      {
        elements: document.getElementsByClassName("icon"),
        colorType: "color",
        colorDegree: config.appTheme.colors.icons,
      },
      {
        elements: document.getElementsByClassName("headerText-AppTheme"),
        colorType: "color",
        colorDegree: config.appTheme.colors.headerText,
      },
      {
        elements: document.getElementsByClassName("barText-AppTheme"),
        colorType: "color",
        colorDegree: config.appTheme.colors.titleBarTextAndIcons,
      },
      {
        elements: document.getElementsByClassName("bodyText-AppTheme"),
        colorType: "color",
        colorDegree: config.appTheme.colors.bodyText,
      },
      {
        elements: document.getElementsByClassName("userContainer"),
        colorType: "back",
        colorDegree: config.appTheme.colors.primaryTheme,
      },
      {
        elements: document.getElementsByClassName("info-btn-AppTheme"),
        colorType: "back",
        colorDegree: config.appTheme.colors.infoTheme,
      },
      {
        elements: document.getElementsByClassName("info-link-AppTheme"),
        colorType: "color",
        colorDegree: config.appTheme.colors.infoTheme,
      },
    ];

    colorCollections.forEach((element) => {
      setThemeHandler(element.elements, element.colorType, element.colorDegree);
    });
  };

  const _fetchNextList = () => {
    // if (config.fetchingNextPage) return;
    config.fetchingNextPage = true;
    seeAllCardsRender(fakeData, document.getElementById("seeAllContainer"), true, () => {
        config.fetchingNextPage = false;
    });
    config.fetchingNextPage = false;
  }

  const scrollFcn = () => {
    if(!seeAllContainer.classList.contains("hidden") && config.page !=1) {
        if ((((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) > 0.8) && !config.fetchingNextPage) {
            console.log(document.documentElement);
            _fetchNextList();
            // loadData(currentPage, limit);
        }
    }
}

  const initBack = () => {
    buildfire.navigation.onBackButtonClick = () => {
      buildfire.history.get(
        {
          pluginBreadcrumbsOnly: true,
        },
        (err, result) => {
          console.info("Current Plugin Breadcrumbs", result);
          switch (result[result.length - 1].label) {
            case "Personal Home Page":
              mainPage.classList.remove("hidden");
              subPage.classList.add("hidden");
              userContainer.classList.remove("hidden");
              sortIcon.classList.add("hidden");
              break;
            case "Personal Home Page from See All":
              mainPage.classList.remove("hidden");
              seeAllContainer.classList.add("hidden");
              config.renderedCard = 0;
              config.page = 1;
              config.lastIndex = 0;
              config.isSeeAllScreen = false;
              userContainer.classList.remove("hidden");
              sortIcon.classList.add("hidden");
              mainContainer.removeEventListener('scroll', scrollFcn);
              break;
            case "Explore page":
              subPage.classList.remove("hidden");
              seeAllContainer.classList.add("hidden");
              config.renderedCard = 0;
              config.page = 1;
              config.lastIndex = 0;
              config.isSeeAllScreen = false;
              mainContainer.removeEventListener('scroll', scrollFcn);
              break;
            default:
              break;
          }
        }
      );
      scrollTop();
      buildfire.history.pop();
    };
  };

  const sort = (data, type) => {
    if (type === "Most Recent") {
      data.sort((a, b) => {
        if (a.meta.createdOn < b.meta.createdOn) {
          return -1;
        }
        if (a.meta.createdOn > b.meta.createdOn) {
          return 1;
        }
      });
    }
    return data;
  };

  return { cropImage, timeConvert, getAppTheme, setAppTheme, initBack, sort, scrollFcn };
};


const hasSearch = (data) => {
return   config.search == "" ||
data.meta.title
  .toLowerCase()
  .search(config.search.toLowerCase()) >= 0 ||
data.meta.description
  .toLowerCase()
  .search(config.search.toLowerCase()) >= 0
}