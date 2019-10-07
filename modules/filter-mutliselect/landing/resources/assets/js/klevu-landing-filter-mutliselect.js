/**
 * Extension for multiselect filter functionality
 */
klevu.extend({
    multiselectFilters: function (mainScope) {
        if (!mainScope.multiselectFilters) {
            mainScope.multiselectFilters = {};
        }

        mainScope.multiselectFilters.base = {
            initialize: function (dataOptions) {
                var list = dataOptions.dataIdList;
                klevu.each(list, function (key, value) {
                    var items = klevu.getObjectPath(dataOptions.responseData.template.query, value);
                    if (!klevu.isUndefined(items)) {
                        klevu.each(items.filters, function (keyFilter, filter) {
                            filter.multiselect = false;
                            var isKeyFound = dataOptions.multiSelectFilterKeys.find(function (keyName) {
                                return keyName == filter.key;
                            });
                            if (isKeyFound) {
                                filter.multiselect = true;
                            }
                        })
                    }
                });
            }
        };
    }
});

/**
 * Multiselect filters
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "multiselectFilters",
    fire: function () {

        /** Initialze multiselectFilters module */
        klevu.multiselectFilters(klevu.search.landing.getScope().element.kScope);

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "addMultiSelectFilters",
            fire: function (data, scope) {

                /** multiselectFilters options  */
                var multiselectFiltersOptions = {
                    responseData: data,
                    dataIdList: ["productList", "contentCompressed"],
                    multiSelectFilterKeys: ["category"]
                };

                klevu.search.landing.getScope().multiselectFilters.base.initialize(multiselectFiltersOptions);
            }
        });
    }
});