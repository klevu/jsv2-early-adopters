/**
 * Reorder filter option list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilterOptions",
    fire: function () {

        /**
         * Filter option reorder scope
         */
        klevu.search.landing.getScope().reorderFilterOptions = {
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
                                    filter.otherOptionsIndexStart = priorityOptions.length + 1;
                                    priorityOptions.forEach(function (priorityOption, index) {
                                        options.forEach(function (option) {
                                            if (priorityOption.name == option.name) {
                                                option.sort = index + 1;
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        filters.forEach(function (filter) {
                            var optionsIndex = (filter.otherOptionsIndexStart) ? filter.otherOptionsIndexStart : 1;
                            filter.options.forEach(function (option) {
                                if (!option.sort) {
                                    option.sort = optionsIndex;
                                    optionsIndex++;
                                }
                            });
                            filter.options.sort(function (a, b) {
                                return a.sort - b.sort;
                            });
                        });
                    }
                }
            }
        };

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

                    klevu.search.landing.getScope().reorderFilterOptions.reorder(data, priorityFilterOptions);
                }
            }
        });
    }
});