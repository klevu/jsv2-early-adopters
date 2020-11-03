/**
 * Initialize facets
 */

(function (klevu) {

    /**
     * Function to attach event on facet items
     * @param {*} scope 
     */
    function attachFacetItemsClickEvent(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuFilterOption", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuFilter");
                if (parentElem !== null && (parentElem.dataset.singleselect === 'true') && !this.classList.contains("klevuFilterOptionActive")) {
                    var listSingleSelect = klevu.dom.find(".klevuFilterOptionActive", parentElem);
                    klevu.each(listSingleSelect, function (key, value) {
                        value.classList.remove("klevuFilterOptionActive");
                    });
                }
                this.classList.toggle("klevuFilterOptionActive");

                //getScope
                var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                if (target === null) {
                    return;
                }

                var elScope = target.kElem;
                elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                elScope.kScope.data.context.keyCode = 0;
                elScope.kScope.data.context.eventObject = event;
                elScope.kScope.data.context.event = "keyUp";
                elScope.kScope.data.context.preventDefault = false;

                //override local variables

                var options = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                if (options === null) {
                    return;
                }
                //calculate new filters
                //getAllActiveFilters
                var listActive = klevu.dom.find(".klevuFilterOptionActive", options);
                if (listActive.length > 0) {
                    var filterList = [];
                    klevu.each(listActive, function (key, value) {
                        var filter = klevu.dom.helpers.getClosest(value, ".klevuFilter");

                        if (filter !== null) {
                            var objectToChange = filterList.filter(function (element) {
                                return element.key == filter.dataset.filter
                            });
                            if (objectToChange.length === 0) {
                                filterList.push({
                                    key: filter.dataset.filter,
                                    settings: {
                                        singleSelect: (klevu.isUndefined(filter.dataset.singleselect) ? false : filter.dataset.singleselect)
                                    },
                                    values: [(klevu.isUndefined(value.dataset.value) ? false : value.dataset.value)]
                                });
                            } else {
                                objectToChange[0].values.push((klevu.isUndefined(value.dataset.value) ? false : value.dataset.value));
                            }
                        }
                    });
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters.filters", filterList);
                } else {
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters", {});
                }
                //reset offset after filter change
                klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
            }, true);
        });
    }

    var facets = {
        attachFacetItemsClickEvent: attachFacetItemsClickEvent
    };

    klevu.extend(true, klevu.search.modules, {
        facets: {
            base: facets,
            build: true
        }
    });

})(klevu);

/**
 * facets module build event
 */
klevu.coreEvent.build({
    name: "facetsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.facets ||
            !klevu.search.modules.facets.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});