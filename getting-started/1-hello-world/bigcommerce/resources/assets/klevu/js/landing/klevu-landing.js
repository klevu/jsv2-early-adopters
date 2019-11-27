//build event chain to check when landing is powered up
klevu.coreEvent.build({
    name: "setRemoteConfigLanding",
    fire: function () {
        if (!klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.search.landing)) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30

});
//attach locale settings
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-locale",
    fire: function () {
        //get the global translations
        klevu.search.landing.getScope().template.getTranslator().mergeFromGlobal();
        //get the global currency
        klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
    }
});
// add templates
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-templates",
    fire: function () {
        //set templates
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateBase"), "klevuTemplateLanding", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateNoResultFound"), "noResultFound", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplatePagination"), "pagination", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResults"), "results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateProductBlock"), "productBlock", true);

    }
});
// add chain extensions
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-chains",
    fire: function () {

        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductList",
            fire: function (data, scope) {
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var productList = klevu.extend(true, {}, parameterMap.recordQuery);
                var quickStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");

                //setquery type
                productList.id = "productList";
                productList.typeOfRequest = "SEARCH";
                productList.settings.query.term = data.context.term;
                productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                productList.settings.limit = 12;
                productList.settings.fallbackQueryId = "productListFallback";
                productList.filters.filtersToReturn.enabled = true;
                productList.filters.filtersToReturn.exclude = ["onprescription", "ondiscount", "availableonline", "availableonletter"];
                data.request.current.recordQueries.push(productList);
                data.context.doSearch = true;

            }
        });
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductListFallback",
            fire: function (data, scope) {
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var productListFallback = klevu.extend(true, {}, parameterMap.recordQuery);

                //setquery type
                productListFallback.id = "productListFallback";
                productListFallback.typeOfRequest = "SEARCH";
                productListFallback.isFallbackQuery = "true";
                productListFallback.settings.query.term = "*";
                productListFallback.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productListFallback.settings.searchPrefs = ["excludeDescription", "searchCompoundsAsAndQuery"];
                productListFallback.settings.limit = 3;
                productListFallback.settings.sort = "RELEVANCE";

                data.request.current.recordQueries.push(productListFallback);

                data.context.doSearch = true;

            }
        });

        /** Event to add pagination */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addPagination",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuPaginate", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();

                        var element = event.target;
                        var target = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                        if (target === null) {
                            return;
                        }

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        var options = klevu.dom.helpers.getClosest(element, ".klevuMeta");
                        var offset = element.dataset.offset;
                        offset = (offset < 0) ? 0 : offset;

                        klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", parseInt(offset));
                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    }, true);
                });
            }
        });



        // where to render the responce
        klevu.search.landing.getScope().chains.template.render.add({
            name: "renderResponse",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    scope.kScope.template.setData(data.template);
                    var targetBox = "klevuTemplateLanding";
                    var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.innerHTML = '';
                    target.classList.add("klevuTarget");
                    scope.kScope.element.kData = data.template;
                    scope.kScope.template.insertTemplate(target, element);
                }
            }
        });
    }
});

// add template helpers
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-template-helpers",
    fire: function () {
        //add extra helpers
        var quickStorage = klevu.getSetting(klevu.settings, "settings.storage");
        klevu.search.landing.getScope().template.setHelper("cropText", function cropText(textValue, length) {
            if (textValue.length <= length) return textValue;
            return textValue.substring(0, length) + "...";
        });
        klevu.search.landing.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });
    }
});


/**
 * Extension for multiselect filter functionality
 */
klevu.extend({
    multiselectFilters: function (mainScope) {
        if (!mainScope.multiselectFilters) {
            mainScope.multiselectFilters = {};
        }

        mainScope.multiselectFilters.base = {
            initialize: function (dataOptions) {
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
            }
        };
    }
});

/**
 * Multiselect filters
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "multiselectFilters",
    fire: function () {

        /** Initialze multiselectFilters module */
        klevu.multiselectFilters(klevu.search.landing.getScope().element.kScope);

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "addMultiSelectFilters",
            fire: function (data, scope) {

                /** multiselectFilters options  */
                var multiselectFiltersOptions = {
                    responseData: data,
                    dataIdList: ["productList", "contentCompressed"],
                    multiSelectFilterKeys: ["category"]
                };

                klevu.search.landing.getScope().multiselectFilters.base.initialize(multiselectFiltersOptions);
            }
        });
    }
});

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

/**
 * Event to fire landing search request
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-init",
    fire: function () {

        if (klevu.dom.find(".klevuLanding").length > 0) {
            klevu.search.landing.setTarget(klevu.dom.find(".klevuLanding")[0]);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.minChars", 0);
            var klevuUrlParams = klevu.getAllUrlParameters();
            if (klevuUrlParams.length > 0) {
                klevu.each(klevuUrlParams, function (key, elem) {
                    if (elem.name == "search_query") {
                        var tempElement = klevu.search.landing.getScope().element;
                        tempElement.value = decodeURIComponent(elem.value).split("+").join(" ");
                        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
                        klevu.event.fireChain(tempElement.kScope, "chains.events.keyUp", tempElement, tempElement.kScope.data, null);
                    }
                });
            }
        }

    }
});



/**
 * Search result landing page extension for Analytics utility
 */
klevu.extend({
    analyticsUtilsLandingPage: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.landing = {
            bindProductClickAnalytics: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                        if (parent && parent != null) {
                            var productId = parent.dataset.id;
                            if (productId) {
                                var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope);
                                if (product) {
                                    var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                                    if(termOptions){
                                        termOptions.klevu_keywords = termOptions.klevu_term;
                                        termOptions.klevu_productId = product.id;
                                        termOptions.klevu_productName = product.name;
                                        termOptions.klevu_productUrl = product.url;
                                        termOptions.klevu_src = "[[typeOfRecord:"+product.typeOfRecord + ";;template:landing]]";
                                        delete termOptions.klevu_term;
                                        klevu.analyticsEvents.click(termOptions);
                                    }
                                }
                            }
                        }
                    });
                });
            }
        };
    }
});

/**
 * Attach core event to add landing page analytics
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageAnalyticsEvents",
    fire: function () {
        /** Initialize analytics object */
        klevu.analyticsUtilsLandingPage(klevu.search.landing.getScope().element.kScope);
        klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut = null;

        /** Send term request for anaytics */
        klevu.search.landing.getScope().chains.response.ajax.done.add({
            name: "doAnalytics",
            fire: function (data, scope) {
                if (klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut) {
                    clearTimeout(klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut);
                }
                klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut = setTimeout(function () {
                    var termOptions = klevu.search.landing.getScope().analyticsUtils.base.getTermOptions();
                    termOptions.klevu_src = termOptions.klevu_src.replace("]]",";;template:landing]]");
                    if(termOptions.filters){
                        termOptions.klevu_src = termOptions.klevu_src.replace("]]",";;source:filters]]");
                    }
                    delete termOptions.filters;
                    klevu.analyticsEvents.term(termOptions);
                    klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut = null;
                }, 300);
            }
        });

        klevu.search.landing.getScope().chains.template.render.addAfter("renderResponse", {
            name: "attachAnalyticsOnProduct",
            fire: function (data, scope) {
                var target = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuMeta", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        data.context.section = value.dataset.section;
                    });
                }, true);
                if (klevu.dom.find(".klevuMeta", target)[0]) {
                    klevu.dom.find(".klevuMeta", target)[0].click();
                }
                klevu.search.landing.getScope().analyticsUtils.landing.bindProductClickAnalytics();
            }
        });

    }
});