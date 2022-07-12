const Views = () => {

    const templates = {};
    const sideNavContainer = document.getElementById('sidenav-container');
    const sideNavContent = document.getElementById('sidenav-content');
    const sideNav = document.getElementById('sidenav');
    const sideNavTabs = document.querySelectorAll('#sidenav li a')
    const contentMain = document.getElementById('main');
    const breadcrumbsSelector = document.querySelector("#breadcrumbs");
    const init = () => {
        _loadSettings((err, results) => {
            state.settings = results;
            _initSidenav();
        })
    }
    const _initSidenav = () => {
        // loop through all tabs and attach event listeners
        for (const tab of sideNavTabs) {
            const tabName = tab.getAttribute("tab-name");
            tab.addEventListener('click', () => { navigate(tabName) });
        }
        navigate("assets");
    }

    const navigate = (tab) => {
        _setActiveTab(tab);
        _load(tab, () => {
            switch (tab) {
                case "topics":
                    TopicsList.init();
                    break;
                case "assets":
                    AssetsList.init();
                    break;
                case "sections":
                    SectionsList.init();
                    break;
                default:

                    break;
            }
        });
    }

    const loadSubPage = (templateID, breadCrumbs) => {
        const template = document.importNode(document.getElementById(templateID).content, true);
        // hide main content
        sideNavContainer.classList.add("hidden");
        _buildBreadCrumbs(breadCrumbs);
        const subPage = document.getElementById(`subPage-${breadCrumbs.length - 1}`)
        subPage.innerHTML = ""; // clear previous content when not switching using breadcrumbs
        _switchSubPage(subPage);
        subPage.appendChild(template);
    }

    const closeAllSubPages = () => {
        // hide all Subpages levels
        document.querySelectorAll(".sub-page").forEach(page => {
            page.innerHTML = "";
            page.classList.add("hidden")
        });
        // reset and hide breadCrumbs
        breadcrumbsSelector.innerHTML = "";
        breadcrumbsSelector.classList.add("hidden");
        // show main page
        sideNavContainer.classList.remove("hidden");
    }

    const closeCurrentPage = (level) => {
        document.querySelectorAll("#breadcrumbs li")[level].click()
    }

    const _switchSubPage = (subPage) => {
        // hide all Subpages levels
        document.querySelectorAll(".sub-page").forEach(page => page.classList.add("hidden"));
        // show current Sub page
        subPage.classList.remove("hidden");
        breadcrumbsSelector.classList.remove("hidden");
    }

    const _buildBreadCrumbs = (pages) => {
        breadcrumbsSelector.innerHTML = "";
        pages.forEach((breadCrumb, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = (index < pages.length - 1) ? `<a>${breadCrumb}</a>` : `<span>${breadCrumb}</span>`;
            listItem.onclick = () => {
                const subPage = document.getElementById(`subPage-${index}`)
                if (!index) closeAllSubPages();
                else if (index < pages.length - 1) {
                    _switchSubPage(subPage);
                    // remove all other subpages from the array
                    pages.splice(index + 1, pages.length - index - 1);
                    _buildBreadCrumbs(pages);
                }
            };
            breadcrumbsSelector.appendChild(listItem);
        });
    }

    const _loadSettings = (callback) => Settings.get(callback);

    const _load = (template, callback) => {

        if (templates[template]) {
            _inject(template, callback);
        } else {
            _showLoadingBox();
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                // append new template for future fetch
                templates[template] = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                // inject tab UI
                _inject(template, callback);
            };
            xhr.onerror = (err) => {
                console.error(`Could not fetch template: ${template}.`);
            };
            xhr.open('GET', `./templates/${template}.html`);
            xhr.send(null);
        }

    }

    const _inject = (template, callback) => {
        // append new template for future fetch
        html = document.importNode(templates[template].querySelector('template').content, true);
        contentMain.innerHTML = '';
        contentMain.appendChild(html);
        callback();
    }

    const _setActiveTab = (tab) => {
        for (const tab of sideNavTabs) {
            tab.classList.remove('active');
        };

        document.querySelector(`#sidenav li a[tab-name="${tab}"]`).classList.add('active');
    };

    const _showLoadingBox = () => {
        // clear data
        document.querySelector(`#main`).innerHTML = '';
        // create Loading div
        const div = document.createElement("div");
        div.className = 'empty-state';
        div.innerHTML = `<h4>Loading...</h4>`;
        document.querySelector(`#main`).appendChild(div);
    };

    return { init, navigate, loadSubPage, closeAllSubPages, closeCurrentPage }

}