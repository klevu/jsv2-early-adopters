/**
 * Klevu extension for Analytics Utility functions
 */
klevu.extend({
    analyticsUtils: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            mainScope.analyticsUtils = {};
        }
        mainScope.analyticsUtils.base = {
            /**
             * Function to get term options
             */
            getTermOptions: function () {

                var analyticsTermOptions = {
                    term: mainScope.data.context.term,
                    pageNumber: 1,
                    currentURL: window.location.href,
                    filters: false
                };

                var currentSection = mainScope.data.context.section;
                if (!currentSection) {
                    return analyticsTermOptions;
                }

                var reqQueries = mainScope.data.request.current.recordQueries;
                if (reqQueries) {
                    var reqQueryObj = reqQueries.filter(function (obj) {
                        return obj.id == currentSection;
                    })[0];
                    if (reqQueryObj) {
                        analyticsTermOptions.limit = (reqQueryObj.settings.limit) ? reqQueryObj.settings.limit : "";
                        analyticsTermOptions.sort = (reqQueryObj.settings.sort) ? reqQueryObj.settings.sort : "";
                        analyticsTermOptions.src = reqQueryObj.settings.typeOfRecords[0];

                    }
                }
                var resQueries = mainScope.data.response.current.queryResults;
                if (resQueries) {
                    var resQueryObj = resQueries.filter(function (obj) {
                        return obj.id == currentSection;
                    })[0];
                    if (resQueryObj) {

                        analyticsTermOptions.totalResults = resQueryObj.meta.totalResultsFound;
                        analyticsTermOptions.typeOfQuery = resQueryObj.meta.typeOfSearch;

                        var productListLimit = resQueryObj.meta.noOfResults;
                        analyticsTermOptions.pageNumber = Math.ceil(resQueryObj.meta.offset / productListLimit) + 1;

                        var selectedFiltersStr = " [[";
                        var isAnyFilterSelected = false;
                        klevu.each(resQueryObj.filters, function (key, filter) {
                            if (filter.type == "SLIDER") {
                                if (filter.start != filter.min || filter.end != filter.max) {
                                    if (isAnyFilterSelected) {
                                        selectedFiltersStr += ";;";
                                    }
                                    isAnyFilterSelected = true;
                                    selectedFiltersStr += filter.key + ":" + filter.start + " - " + filter.end;
                                }
                            } else {
                                klevu.each(filter.options, function (key, option) {
                                    if (option.selected) {
                                        if (isAnyFilterSelected) {
                                            selectedFiltersStr += ";;";
                                        }
                                        isAnyFilterSelected = true;
                                        selectedFiltersStr += filter.key + ":" + option.name;
                                    }
                                });
                            }
                        });
                        selectedFiltersStr += "]]";
                        if (isAnyFilterSelected) {
                            analyticsTermOptions.filters = true;
                            analyticsTermOptions.term += selectedFiltersStr;
                        }
                    }
                }
                return analyticsTermOptions;
            },
            getProductDetailsFromId: function (productId, scope) {
                var dataListId = scope.data.context.section;
                var product;
                var results = scope.data.response.current.queryResults;
                if (results) {
                    var productList = results.filter(function (obj) {
                        return obj.id == dataListId;
                    })[0];
                    if (productList) {
                        var records = productList.records;
                        var matchedProduct = records.filter(function (prod) {
                            return prod.id == productId;
                        })[0];
                        if (matchedProduct) {
                            product = matchedProduct;
                        }
                    }
                }
                return product;
            },
            getDetailsFromURLAndName: function (catURL, catName, scope, dataListId) {
                var category = {};
                var results = scope.data.response.current.queryResults;
                if (results) {
                    var categoryList = results.filter(function (obj) {
                        return obj.id == dataListId;
                    })[0];
                    if (categoryList) {
                        var records = categoryList.records;
                        var matchedCategory = records.filter(function (cat) {
                            return cat.name == catName && cat.url == catURL;
                        })[0];
                        if (matchedCategory) {
                            category = matchedCategory;
                        }
                    }
                }
                return category;
            }
        };
    }
});