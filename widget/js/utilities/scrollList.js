(function () {

    // control variables
    let currentPage = 1;
    const limit = 10;
    let total = 0;

    const hasData = (currentPage, limit, total) => {
        return true;
    }

    const _fetchNextList = () => {
        // if (config.fetchingNextPage) return;
        config.fetchingNextPage = true;
        seeAllCardsRender(fakeData, document.getElementById("seeAllContainer"), true, () => {
            config.fetchingNextPage = false;
        });
    }

    mainContainer.addEventListener('scroll', () => {
        if(!seeAllContainer.classList.contains("hidden")) {
            if ((((mainContainer.scrollTop + mainContainer.clientHeight) / mainContainer.scrollHeight) > 0.8) && 
                hasData(currentPage, limit, total) && !config.fetchingNextPage) {
                config.page++;
                console.log(document.documentElement);
                _fetchNextList();
                // loadData(currentPage, limit);
            }
        }
    }, {
        passive: true
    });

    // // initialize
    // loadQuotes(currentPage, limit);

})();