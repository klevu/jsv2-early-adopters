klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-sort",
    fire: function () {
        var options = {
            storage: {
                sort: klevu.dictionary("sort")
            }
        };
        klevu(options);

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateSortBy"), "sortBy", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "setSortBy",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var sort = (landingStorage.sort.getElement(query.id) == query.id) ? false : landingStorage.sort.getElement(query.id);
                    if (sort) {
                        query.settings.sort = sort;
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.sort.setStorage("local");
        storage.sort.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getSortBy", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var sorting = (landingStorage.sort.getElement(name) == name) ? "RELEVANCE" : landingStorage.sort.getElement(name);
            switch (sorting) {
                case "RELEVANCE":
                    return 'Relevance';
                    break;
                case "PRICE_ASC":
                    return 'Price: Low to high';
                    break;
                case "PRICE_DESC":
                    return 'Price: High to low';
                    break;
                default:
                    return 'Relevance';
                    break;
            }
        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "SortBySort",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuSort", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");

                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");

                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.sort.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.sort.mergeToGlobal();

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    });
                });
            }
        });
    }
});
