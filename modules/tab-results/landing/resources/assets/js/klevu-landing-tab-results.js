klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-tabs",
    fire: function () {

        var options = {
            storage: {
                tabs: klevu.dictionary("tabs")
            }
        };
        klevu(options);

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.tabs.setStorage("local");
        storage.tabs.mergeFromGlobal();

        /** set templates */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTabResults"), "tab-results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateContentBlock"), "contentBlock", true);

        /** Tab results list */
        klevu.search.landing.getScope().tabResultsList = ['productList', 'contentList'];

        /** move object attribute */
        klevu.search.landing.getScope().moveObjectElement = function (currentKey, afterKey, obj) {
            var result = {};
            var val = obj[currentKey];
            delete obj[currentKey];
            var next = -1;
            var i = 0;
            if (typeof afterKey == 'undefined' || afterKey == null) afterKey = '';

            Object.keys(obj).forEach(function (key) {
                var k = key;
                var v = obj[key];
                if ((afterKey == '' && i == 0) || next == 1) {
                    result[currentKey] = val;
                    next = 0;
                }
                if (k == afterKey) {
                    next = 1;
                }
                result[k] = v;
                ++i;

            });

            if (next == 1) {
                result[currentKey] = val;
            }
            if (next !== -1) {
                return result;
            } else {
                return obj;
            };
        }


        // add the tab text name to the query data
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processTabs",
            fire: function (data, scope) {
                if (klevu.search.landing.getScope().tabResultsList && klevu.search.landing.getScope().tabResultsList.length) {
                    var tempTabList = [];
                    klevu.each(klevu.search.landing.getScope().tabResultsList, function (key, value) {
                        var items = klevu.getObjectPath(data.template.query, value);
                        if (!klevu.isUndefined(items)) {
                            items.id = value;
                            items.tab = true;
                            items.tabText = "<b>%s</b> " + value;
                            items.sort = key + 1;
                            tempTabList.push(items);
                        }
                    });
                    if (tempTabList.length) {
                        tempTabList.sort(function (a, b) {
                            return b.sort - a.sort;
                        });
                        tempTabList.forEach(function (tabObj) {
                            data.template.query = klevu.search.landing.getScope().moveObjectElement(tabObj.id, '', data.template.query);
                        });
                    }
                }
            }
        });

        klevu.search.landing.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });

        /**
         * Function to initialize tab selection
         */
        klevu.search.landing.getScope().initializeTabSelection = function (data, scope, target) {
            var isTabSelected;
            klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
                var selectedTab = landingStorage.tabs.getElement("active");
                value.classList.remove("kuTabSelected");
                if (selectedTab && value.dataset && value.dataset.section) {
                    if (selectedTab == value.dataset.section) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(value, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        data.context.section = value.dataset.section;
                        klevuWrap.classList.add(value.dataset.section + "Active");
                        isTabSelected = true;
                    }
                }
            });
            if (!isTabSelected) {
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    value.classList.remove("kuTabSelected");
                    if (key == 0) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(value, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        klevuWrap.classList.add(value.dataset.section + "Active");
                    }
                });
            }
        };

        //tab swap
        klevu.search.landing.getScope().chains.template.events.add({
            name: "tabContent",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.search.landing.getScope().initializeTabSelection(data, scope, target);
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    // onclick
                    klevu.event.attach(value, "click", function (event) {

                        event = event || window.event;
                        event.preventDefault();

                        //getScope
                        var section = klevu.dom.helpers.getClosest(this, ".klevuWrap");
                        if (section === null) {
                            return;
                        }
                        //removeSelectionFromAllTabs
                        klevu.each(klevu.dom.find(".kuTab.kuTabSelected", section), function (key, value) {
                            value.classList.remove("kuTabSelected");
                            section.classList.remove(value.dataset.section + "Active");
                        });

                        //add Selection to current tab
                        this.classList.add("kuTabSelected");
                        section.classList.add(this.dataset.section + "Active");

                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.tabs.addElement("active", this.dataset.section);
                        storageEngine.tabs.mergeToGlobal();

                        /** Initialize price filter slider on tab change */
                        if (klevu.search.modules.filterPriceSlider) {
                            klevu.search.modules.filterPriceSlider.base.initSlider(data, scope.kScope);
                        }
                    });
                });
            }
        });

    }
});


/**
 * Core event to attach content list in request
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachContentListRequest",
    fire: function () {
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addContentList",
            fire: function (data, scope) {
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var contentList = klevu.extend(true, {}, parameterMap.recordQuery);
                contentList.id = "contentList";
                contentList.typeOfRequest = "SEARCH";
                contentList.settings.query.term = data.context.term;
                contentList.settings.typeOfRecords = ["KLEVU_CMS"];
                contentList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                contentList.settings.limit = 12;
                contentList.filters.filtersToReturn.enabled = true;
                data.request.current.recordQueries.push(contentList);

                data.context.doSearch = true;
            }
        });
    }
});