/**
 * Extension for collapse filter functionality
 */
klevu.extend({
    collapseFilters: function (mainScope) {

        if (!mainScope.collapseFilters) {
            mainScope.collapseFilters = {};
        }

        mainScope.collapseFilters.base = {

            /**
             * Initialize collapsing for filter items
             */
            initialize: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                //add colapsable filters
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
            },

            /**
             * Function to collapse filter list as per the priority list
             * @param {*} data 
             * @param {*} collapsedFilters 
             */
            collapse: function (data, collapsedFilters, itemListId) {
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

        /** Initialize collapseFilters module */
        klevu.collapseFilters(klevu.search.landing.getScope().element.kScope);

        /**
         * Function to enable collapsing for filter items
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "enableFilterCollapse",
            fire: function (data, scope) {
                klevu.search.landing.getScope().collapseFilters.base.initialize();
            }
        });

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

                    klevu.search.landing.getScope().collapseFilters.base.collapse(data, collapsedFilters, 'productList');
                }
            }
        });
    }
});