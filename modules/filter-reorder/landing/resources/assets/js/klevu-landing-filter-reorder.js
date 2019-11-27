/**
 * Extension for reordering filters
 */

klevu.interactive(function () {

    /**
     * Function to reorder filter list as per the priority list
     * @param {*} data 
     * @param {*} priorityFilters 
     * @param {*} dataListName 
     */
    function reorder(data, priorityFilters, dataListName) {
        if (data && data.template && data.template.query) {
            var items = klevu.getObjectPath(data.template.query, dataListName);
            if (items && items.filters) {
                var filters = items.filters;
                var otherIndexStart = priorityFilters.length + 1;
                priorityFilters.forEach(function (priorityFilter, index) {
                    filters.forEach(function (filter) {
                        if (filter.key == priorityFilter.key) {
                            filter.sort = index + 1;
                        }
                    });
                });
                filters.forEach(function (filter) {
                    if (!filter.sort) {
                        filter.sort = otherIndexStart;
                        otherIndexStart++;
                    }
                });
                filters.sort(function (a, b) {
                    return a.sort - b.sort;
                });
            }
        }
    }

    var reorderFilters = {
        reorder: reorder
    };

    klevu.extend(true, klevu.search.modules, {
        reorderFilters: {
            base: reorderFilters,
            build: true
        }
    });
});

/**
 * reorderFilters module build event
 */
klevu.coreEvent.build({
    name: "reorderFiltersModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.reorderFilters ||
            !klevu.search.modules.reorderFilters.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Reorder filter list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilters",
    fire: function () {

        /**
         * Function to set filter priority list and reorder filter list
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "reorderFilterPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    var priorityFilters = [{
                        key: "brand"
                    }, {
                        key: "category"
                    }];
                    klevu.search.modules.reorderFilters.base.reorder(data, priorityFilters, 'productList');
                }
            }
        });
    }
});