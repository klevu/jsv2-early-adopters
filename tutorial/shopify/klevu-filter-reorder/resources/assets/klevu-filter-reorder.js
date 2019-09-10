/**
 * Reorder filter list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilters",
    fire: function () {

        /**
         * Filter reorder scope
         */
        klevu.search.landing.getScope().reorderFilters = {
            /**
             * Function to reorder filter list as per the priority list
             * @param {*} data 
             * @param {*} priorityFilters 
             */
            reorder: function (data, priorityFilters) {
                if (data && data.template && data.template.query) {
                    var items = klevu.getObjectPath(data.template.query, 'productList');
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
        };

        /**
         * Function to set filter priority list and reoder filter list
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

                    klevu.search.landing.getScope().reorderFilters.reorder(data, priorityFilters);
                }
            }
        });
    }
});