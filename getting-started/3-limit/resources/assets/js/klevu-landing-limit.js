klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-limit",
    fire: function () {
        var options = {
            storage: {
                limits: klevu.dictionary("limits")
            }
        };
        klevu(options);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateLimit"), "limit", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "setLimits",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var limit = (landingStorage.limits.getElement(query.id) == query.id) ? false : landingStorage.limits.getElement(query.id);
                    if (limit) {
                        query.settings.limit = limit;
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.limits.setStorage("local");
        storage.limits.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getLimit", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var limit = (landingStorage.limits.getElement(name) == name) ? 12 : landingStorage.limits.getElement(name);
            return limit;
        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "SortByLimit",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuLimit", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.limits.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.limits.mergeToGlobal();

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
