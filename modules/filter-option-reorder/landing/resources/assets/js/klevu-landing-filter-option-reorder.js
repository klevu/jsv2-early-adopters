/**
 * Extension for reordering filter option functionality
 */
klevu.extend({
    reorderFilterOptions: function (mainScope) {
        mainScope.reorderFilterOptions = {};
        mainScope.reorderFilterOptions.base = {
            /**
             * Function to reorder filter option list as per the priority list
             * @param {*} data 
             * @param {*} priorityFilterOptions 
             */
            reorder: function (data, priorityFilterOptions) {
                if (data && data.template && data.template.query) {
                    var items = klevu.getObjectPath(data.template.query, 'productList');
                    if (items && items.filters) {
                        var filters = items.filters;
                        priorityFilterOptions.forEach(function (priorityFilter, index) {
                            var priorityOptions = priorityFilter.options;
                            filters.forEach(function (filter) {
                                if (filter.key == priorityFilter.key) {
                                    var options = filter.options;
                                    if (options) {
                                        filter.otherOptionsIndexStart = priorityOptions.length + 1;
                                        priorityOptions.forEach(function (priorityOption, index) {
                                            options.forEach(function (option) {
                                                if (priorityOption.name == option.name) {
                                                    option.sort = index + 1;
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        });
                        filters.forEach(function (filter) {
                            var optionsIndex = (filter.otherOptionsIndexStart) ? filter.otherOptionsIndexStart : 1;
                            var options = filter.options;
                            if (options) {
                                options.forEach(function (option) {
                                    if (!option.sort) {
                                        option.sort = optionsIndex;
                                        optionsIndex++;
                                    }
                                });
                                options.sort(function (a, b) {
                                    return a.sort - b.sort;
                                });
                            }
                        });
                    }
                }
            }
        };
    }
});

/**
 * Reorder filter option list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilterOptions",
    fire: function () {

        /** Initialize reorderFilterOptions */
        klevu.reorderFilterOptions(klevu.search.landing.getScope().element.kScope);

        /**
         * Function to set filter option priority list and reoder filter option list
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "reorderFilterOptionPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    var priorityFilterOptions = [{
                        key: "size",
                        options: [{
                            name: "xl"
                        }, {
                            name: "small"
                        }]
                    }, {
                        key: "category",
                        options: [{
                            name: "father's day sale"
                        }]
                    }];
                    klevu.search.landing.getScope().reorderFilterOptions.base.reorder(data, priorityFilterOptions);
                }
            }
        });
    }
});