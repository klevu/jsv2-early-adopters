/**
 * Extension for multiselect filter functionality
 */

klevu.interactive(function () {

    /**
     * Function to initialize muliselect facet item
     * @param {*} dataOptions 
     */
    function initialize(dataOptions) {
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
    };

    var multiselectFilters = {
        initialize: initialize
    };

    klevu.extend(true, klevu.search.modules, {
        multiselectFilters: {
            base: multiselectFilters,
            build: true
        }
    });
});

/**
 * multiselectFilters module build event
 */
klevu.coreEvent.build({
    name: "multiselectFiltersModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.multiselectFilters ||
            !klevu.search.modules.multiselectFilters.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Multiselect filters
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "multiselectFilters",
    fire: function () {

        /**
         * Attach facet multi select
         */
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "addMultiSelectFilters",
            fire: function (data, scope) {

                /** multiselectFilters options  */
                var multiselectFiltersOptions = {
                    responseData: data,
                    dataIdList: ["productList", "contentCompressed"],
                    multiSelectFilterKeys: ["category"]
                };

                klevu.search.modules.multiselectFilters.base.initialize(multiselectFiltersOptions);
            }
        });
    }
});