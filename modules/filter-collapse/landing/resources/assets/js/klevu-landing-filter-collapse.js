/**
 * Extension for collapse filter functionality
 */

(function (klevu) {

    /**
     * Initialize collapsing for filter items
     */
    function initialize(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        //add collapsable filters
        klevu.each(klevu.dom.find(".kuFilterHead", target), function (key, value) {
            // onclick
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                this.classList.toggle("kuCollapse");
                this.classList.toggle("kuExpand");

                var parentElem = klevu.dom.helpers.getClosest(this, ".kuFilterBox");
                klevu.each(klevu.dom.find(".kuFilterNames", parentElem), function (key, value) {
                    value.classList.toggle("kuFilterCollapse");
                    value.classList.remove("kuFilterShowAll");
                });

            });
        });
        //add expandable filters
        klevu.each(klevu.dom.find(".kuShowOpt", target), function (key, value) {
            // onclick
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                var parentElem = klevu.dom.helpers.getClosest(this, ".kuFilterBox");
                klevu.each(klevu.dom.find(".kuFilterNames", parentElem), function (key, value) {
                    value.classList.toggle("kuFilterShowAll");
                });

            });
        });
    };

    /**
     * Function to collapse filter list as per the priority list
     * @param {*} data 
     * @param {*} collapsedFilters 
     */
    function collapse(data, collapsedFilters, itemListId) {
        if (data && data.template && data.template.query && collapsedFilters && collapsedFilters.length) {
            var items = klevu.getObjectPath(data.template.query, itemListId);
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
    };

    var collapseFilters = {
        collapse: collapse,
        initialize: initialize
    };

    klevu.extend(true, klevu.search.modules, {
        collapseFilters: {
            base: collapseFilters,
            build: true
        }
    });
})(klevu);

/**
 * collapseFilters module build event
 */
klevu.coreEvent.build({
    name: "collapseFiltersModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.collapseFilters ||
            !klevu.search.modules.collapseFilters.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Collapse filter
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "collapseFilters",
    fire: function () {

        /**
         * Function to enable collapsing for filter items
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "enableFilterCollapse",
            fire: function (data, scope) {
                klevu.search.modules.collapseFilters.base.initialize(scope.kScope);
            }
        });

        /**
         * Function to set filter priority list and reorder filter list
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

                    klevu.search.modules.collapseFilters.base.collapse(data, collapsedFilters, 'productList');
                }
            }
        });
    }
});