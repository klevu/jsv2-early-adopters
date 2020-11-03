/**
 * Extension for reordering filter option functionality
 */

(function (klevu) {

    /**
     * Function to reorder filter option list as per the priority list
     * @param {*} data 
     * @param {*} priorityFilterOptions 
     * @param {*} dataListName 
     */
    function reorder(data, priorityFilterOptions, dataListName) {
        if (data && data.template && data.template.query) {
            var items = klevu.getObjectPath(data.template.query, dataListName);
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

    var reorderFilterOptions = {
        reorder: reorder
    };

    klevu.extend(true, klevu.search.modules, {
        reorderFilterOptions: {
            base: reorderFilterOptions,
            build: true
        }
    });
})(klevu);

/**
 * reorderFilterOptions module build event
 */
klevu.coreEvent.build({
    name: "reorderFilterOptionsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.reorderFilterOptions ||
            !klevu.search.modules.reorderFilterOptions.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Reorder filter option list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilterOptions",
    fire: function () {

        /**
         * Function to set filter option priority list and reorder filter option list
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
                    klevu.search.modules.reorderFilterOptions.base.reorder(data, priorityFilterOptions, 'productList');
                }
            }
        });
    }
});