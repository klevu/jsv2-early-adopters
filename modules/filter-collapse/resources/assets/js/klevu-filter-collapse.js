/**
 * Extension for collapse filter functionality
 */
klevu.extend({
    collapseFilters: function (mainScope) {
        mainScope.collapseFilters = {};
        mainScope.collapseFilters.base = {
            /**
             * Function to collapse filter list as per the priority list
             * @param {*} data 
             * @param {*} collapsedFilters 
             */
            collapse: function (data, collapsedFilters) {
                if (data && data.template && data.template.query && collapsedFilters) {
                    var items = klevu.getObjectPath(data.template.query, 'productList');
                    if (items && items.filters) {
                        var filters = items.filters;
                        filters.forEach(function (filter) {
                            filter.isCollapsed = false;
                        });
                        collapsedFilters.forEach(function (collapsedFilter) {
                            filters.forEach(function (filter) {
                                if (collapsedFilter.key == filter.key) {
                                    filter.isCollapsed = true;
                                }
                            });
                        });
                    }
                }
            }
        };
    }
});

/**
 * Collapse filter
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "collapseFilters",
    fire: function () {

        /**
         * Function to set filter priority list and reoder filter list
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "collapseFilterPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {

                    var collapsedFilters = [{
                        key: "tags"
                    }, {
                        key: "type"
                    }, {
                        key: "shade_color"
                    }, {
                        key: "product_type"
                    }];

                    /** Initialize collapseFilters module */
                    klevu.collapseFilters(klevu.search.landing.getScope().element.kScope);

                    klevu.search.landing.getScope().collapseFilters.base.collapse(data, collapsedFilters);
                }
            }
        });
    }
});