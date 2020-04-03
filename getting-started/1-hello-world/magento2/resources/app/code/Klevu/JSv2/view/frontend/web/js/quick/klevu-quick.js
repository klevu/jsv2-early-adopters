/**
 * build event chain to check when quick is powered up
 */
klevu.coreEvent.build({
    name: "setRemoteConfigQuick",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.search.extraSearchBox) ||
            (klevu.search.extraSearchBox.length == 0)
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add base quick search templates
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-templates",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTemplateBase"), "klevuTemplateBase", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickAutoSuggestions"), "klevuQuickAutoSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPageSuggestions"), "klevuQuickPageSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickCategorySuggestions"), "klevuQuickCategorySuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProducts"), "klevuQuickProducts", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProductBlock"), "klevuQuickProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultFound"), "klevuQuickNoResultFound", true);
        });
    }
});
//attach click out defocus
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-click-out",
    fire: function () {
        klevu.coreEvent.attach("buildSearch", {
            name: "clickOutEvent",
            fire: function () {
                klevu.settings.chains.documentClick.add({
                    name: "hideOverlay",
                    fire: function (data, scope) {
                        if (klevu.search.active) {
                            var fullPage = klevu.getSetting(klevu.search.active.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
                            if (!fullPage) {
                                var target = klevu.getSetting(klevu.search.active.getScope().settings, "settings.search.searchBoxTarget");
                                target.style = "display: none !important;";
                            }
                        }
                    }
                });
            }
        });
    }
});
//attach locale settings
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-locale",
    fire: function () {
        //add translations
        var translatorQuick = klevu.search.quick.getScope().template.getTranslator();
        translatorQuick.addTranslation("Search", "Search");
        translatorQuick.addTranslation("<b>%s</b> productList", "<b>%s</b> Products");
        translatorQuick.addTranslation("<b>%s</b> contentList", "<b>%s</b> Other results");
        translatorQuick.mergeToGlobal();

        //set currency
        var currencyQuick = klevu.search.quick.getScope().currency;

        currencyQuick.setCurrencys({
            'GBP': {
                string: "£",
                format: "%s%s",
                atEnd: false,
                precision: 2,
                thousands: ",",
                decimal: ".",
                grouping: 3
            },
            'USD': {
                string: "USD",
                atEnd: true
            },
            'EUR': {
                string: "EUR",
                format: "%s %s",
                atEnd: true
            },
        });
        currencyQuick.mergeToGlobal();
    }
});

// attach all klevu chains
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-chains",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            //get the global translations
            box.getScope().template.getTranslator().mergeFromGlobal();
            //get the global currency
            box.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();

            //what to do when you focus on a search
            box.getScope().chains.events.focus.add({
                name: "displayOverlay",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.style = "display: block !important;";

                }
            });
            box.getScope().chains.events.focus.add({
                name: "doSearch",
                fire: function (data, scope) {
                    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doSearch");

                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if (data.context.preventDefault === true) return false;
                }
            });

            // what will the request look for
            box.getScope().chains.request.build.add({
                name: "addAutosugestions",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                    var suggestion = klevu.extend(true, {}, parameterMap.suggestions);

                    suggestion.id = "autosuggestion";
                    suggestion.query = data.context.term;
                    suggestion.typeOfRequest = "AUTO_SUGGESTIONS";
                    suggestion.limit = 3;

                    data.request.current.suggestions.push(suggestion);
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addCategoryCompressed",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var categoryCompressed = klevu.extend(true, {}, parameterMap.recordQuery);

                    //setquery type
                    categoryCompressed.id = "categoryCompressed";
                    categoryCompressed.typeOfRequest = "SEARCH";
                    categoryCompressed.settings.query.term = data.context.term;
                    categoryCompressed.settings.typeOfRecords = ["KLEVU_CATEGORY"];
                    categoryCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    categoryCompressed.settings.fields = ["id", "name", "shortDesc", "url", "typeOfRecord"];
                    categoryCompressed.settings.limit = 3;
                    categoryCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(categoryCompressed);

                    data.context.doSearch = true;

                }
            });
            box.getScope().chains.request.build.add({
                name: "addCmsCompressed",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var cmsCompressed = klevu.extend(true, {}, parameterMap.recordQuery);

                    //setquery type
                    cmsCompressed.id = "cmsCompressed";
                    cmsCompressed.typeOfRequest = "SEARCH";
                    cmsCompressed.settings.query.term = data.context.term;
                    cmsCompressed.settings.typeOfRecords = ["KLEVU_CMS"];
                    cmsCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    cmsCompressed.settings.fields = ["id", "name", "shortDesc", "url", "typeOfRecord"];
                    cmsCompressed.settings.limit = 3;
                    cmsCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(cmsCompressed);

                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addProductList",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var productList = klevu.extend(true, {}, parameterMap.recordQuery);

                    //setquery type
                    productList.id = "productList";
                    productList.typeOfRequest = "SEARCH";
                    productList.settings.query.term = data.context.term;
                    productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                    productList.settings.fallbackQueryId = "productListFallback";
                    productList.settings.limit = 3;
                    productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    productList.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(productList);

                    data.context.doSearch = true;

                }
            });
            box.getScope().chains.request.build.add({
                name: "addProductListFallback",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    //setquery type
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

            // where to render the responce
            box.getScope().chains.template.render.add({
                name: "renderResponse",
                fire: function (data, scope) {
                    if (data.context.isSuccess) {
                        scope.kScope.template.setData(data.template);
                        var targetBox = "klevuTemplateBase";
                        var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                        target.innerHTML = '';
                        target.classList.add("klevuTarget");
                        scope.kScope.element.kData = data.template;
                        scope.kScope.template.insertTemplate(target, element);
                    }
                }
            });

            // where to position the templace
            box.getScope().chains.template.render.add({
                name: "positionTemplate",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    var positions = scope.kScope.element.getBoundingClientRect();
                    klevu.dom.find(".klevuWrap", target)[0].style = "top:" + positions.bottom + "px;left: " + ((positions.right - 500) > 0 ? (positions.right - 500) : 0) + "px;right: auto;";
                }
            });

            // overide form action
            box.getScope().element.kElem.form.action = klevu.getSetting(box.getScope().settings, "settings.url.landing", false);
        });
    }
});

/**
 * Klevu Analytics Utility
 */

(function (klevu) {

    /**
     * Function to get term request option
     * @param {*} scope 
     */
    function getTermOptions(scope, isExtended) {

        var analyticsTermOptions = {
            klevu_term: (scope.data.context.termOriginal) ? scope.data.context.termOriginal : "*",
            klevu_pageNumber: "unknown",
            klevu_src: "unknown",
            klevu_limit: "unknown",
            klevu_sort: "unknown",
            klevu_totalResults: "unknown",
            klevu_typeOfQuery: "unknown",
            filters: false
        };

        var currentSection = scope.data.context.section;
        if (!currentSection) {
            return analyticsTermOptions;
        }

        //TO-DO: Get cached data

        var reqQueries = scope.data.request.current.recordQueries;
        if (reqQueries) {
            var reqQueryObj = reqQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (reqQueryObj) {
                analyticsTermOptions.klevu_limit = reqQueryObj.settings.limit;
                analyticsTermOptions.klevu_sort = reqQueryObj.settings.sort;
                analyticsTermOptions.klevu_src = "[[typeOfRecord:" + reqQueryObj.settings.typeOfRecords[0] + "]]";
            }
        }
        var resQueries = scope.data.response.current.queryResults;
        if (resQueries) {
            var resQueryObj = resQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (resQueryObj) {

                analyticsTermOptions.klevu_totalResults = resQueryObj.meta.totalResultsFound;
                analyticsTermOptions.klevu_typeOfQuery = resQueryObj.meta.typeOfSearch;

                var productListLimit = resQueryObj.meta.noOfResults;
                analyticsTermOptions.klevu_pageNumber = Math.ceil(resQueryObj.meta.offset / productListLimit) + 1;

                if (isExtended) {
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
                        analyticsTermOptions.klevu_term += selectedFiltersStr;
                    }
                }
            }
        }
        return analyticsTermOptions;
    };

    /**
     * Function to get product details  
     * @param {*} productId 
     * @param {*} scope 
     */
    function getProductDetailsFromId(productId, scope) {
        var dataListId = scope.data.context.section;
        var product;
        var results = scope.data.response.current.queryResults;
        if (results) {
            var dataList = results.filter(function (obj) {
                return obj.id == dataListId;
            })[0];
            if (dataList) {
                var records = dataList.records;
                var matchedProduct = records.filter(function (prod) {
                    return prod.id == productId;
                })[0];
                if (matchedProduct) {
                    product = matchedProduct;
                }
            }
        }
        return product;
    };

    /**
     * Function to get object details from URL and Name
     * @param {*} url 
     * @param {*} name 
     * @param {*} scope 
     * @param {*} dataListId 
     */
    function getDetailsFromURLAndName(url, name, scope, dataListId) {
        var category = {};
        var results = scope.data.response.current.queryResults;
        if (results) {
            var categoryList = results.filter(function (obj) {
                return obj.id == dataListId;
            })[0];
            if (categoryList) {
                var records = categoryList.records;
                var matchedCategory = records.filter(function (cat) {
                    return cat.name == name && cat.url == url;
                })[0];
                if (matchedCategory) {
                    category = matchedCategory;
                }
            }
        }
        return category;
    };

    /**
     * Function to store analytics event data
     * @param {*} eventOptions 
     */
    function storeAnalyticsEvent(dictionary, element, eventOptions) {
        var autoSug = klevu.dictionary(dictionary);
        if (autoSug && eventOptions) {
            autoSug.setStorage("local");
            autoSug.mergeFromGlobal();

            var dataList = [];
            var existingDataList = autoSug.getElement(element);
            if (existingDataList && existingDataList.length && existingDataList != element) {
                existingDataList = JSON.parse(existingDataList);
                if (existingDataList.length) {
                    existingDataList.push(eventOptions);
                    dataList = existingDataList;
                }
            } else {
                dataList.push(eventOptions);
            }

            autoSug.addElement(element, JSON.stringify(dataList));
            autoSug.mergeToGlobal();
        }
    }

    /**
     * Function to register auto suggestion product click event
     * @param {*} scope 
     * @param {*} className 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerAutoSuggestProductClickEvent(scope, className, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".trackProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var productId = value.dataset.id;
                var searchResultContainer = klevu.dom.find(className, target)[0];
                var dataSection;
                if (searchResultContainer) {
                    dataSection = searchResultContainer.dataset.section;
                }
                if (!dataSection) {
                    return;
                }
                scope.data.context.section = dataSection;
                if (productId) {
                    var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                    if (product) {
                        var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                        if (termOptions) {
                            termOptions.klevu_keywords = termOptions.klevu_term;
                            termOptions.klevu_productId = product.id;
                            termOptions.klevu_productName = product.name;
                            termOptions.klevu_productUrl = product.url;
                            termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:quick-search]]";
                            delete termOptions.klevu_term;
                            klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                        }
                    }
                }
            }, true);
        });
    };

    /**
     * Function to register search auto suggestion click event
     * @param {*} scope 
     * @param {*} className 
     */
    function registerAutoSuggestTermEvent(scope, className, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (key, value) {
            klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, sugEle) {
                klevu.event.attach(sugEle, "click", function (event) {
                    var searchResultContainer = klevu.dom.find(".klevuQuickSearchResults", target)[0];
                    var dataSection;
                    if (searchResultContainer) {
                        dataSection = searchResultContainer.dataset.section;
                    }
                    if (!dataSection) {
                        return;
                    }
                    scope.data.context.section = dataSection;
                    var suggestionText = sugEle.dataset.content;
                    var termOptions = klevu.analyticsUtil.base.getTermOptions(scope, true);
                    if (termOptions) {
                        termOptions.klevu_originalTerm = termOptions.klevu_term;
                        termOptions.klevu_term = suggestionText;
                        termOptions.klevu_src = "[[template:ac-suggestions]]";
                        klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                    }
                });
            });
        });
    };

    /**
     * Function to register auto-suggestion page click event
     * @param {*} scope 
     * @param {*} className 
     * @param {*} dataListId 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerAutoSuggestPageClickEvent(scope, className, dataListId, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (key, value) {
            klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, catEle) {
                klevu.event.attach(catEle, "click", function (event) {
                    var url = catEle.dataset.url;
                    var catName = catEle.dataset.name;
                    var category = klevu.analyticsUtil.base.getDetailsFromURLAndName(url, catName, scope, dataListId);
                    var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                    if (termOptions) {
                        termOptions.klevu_keywords = termOptions.klevu_term;
                        termOptions.klevu_productId = category.id;
                        termOptions.klevu_productName = category.name;
                        termOptions.klevu_productUrl = category.url;
                        termOptions.klevu_src = "[[typeOfRecord:" + category.typeOfRecord + ";;template:quick-search]]";
                        delete termOptions.klevu_term;
                        klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                    }
                });
            });
        });
    };


    /**
     * Function to add product click event on landing page
     * @param {*} scope 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerLandingProductClickEvent(scope, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                if (parent && parent != null) {
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:landing]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                }
            });
        });
    }


    /**
     * Function to send term analytics request from local storage
     * @param {*} dictionary 
     * @param {*} element 
     */
    function sendAnalyticsEventsFromStorage(dictionary, element) {
        var autoSug = klevu.dictionary(dictionary);
        autoSug.setStorage("local");
        autoSug.mergeFromGlobal();
        var storedEvents = autoSug.getElement(element);
        if (storedEvents && storedEvents != element) {
            storedEvents = JSON.parse(storedEvents);
            klevu.each(storedEvents, function (index, value) {
                delete value.filters;
                if (element == klevu.analyticsUtil.base.storage.click) {
                    klevu.analyticsEvents.click(value);
                } else if (element == klevu.analyticsUtil.base.storage.categoryClick) {

                    //TO-DO: Send category product click event
                    console.log(value);

                } else {
                    klevu.analyticsEvents.term(value);
                }
            });
            autoSug.addElement(element, "");
            autoSug.mergeToGlobal();
        }
    };

    /**
     * Function to get Category view options
     * @param {*} scope 
     */
    function getCategoryViewOptions(scope) {
        var analyticsCategoryOptions = {
            klevu_categoryName: "unknown",
            klevu_src: "unknown",
            klevu_categoryPath: "unknown",
            klevu_productIds: "unknown",
            klevu_pageStartsFrom: "unknown",
            filters: false
        };

        var currentSection = scope.data.context.section;
        if (!currentSection) {
            return analyticsCategoryOptions;
        }

        //TO-DO: Get cached data

        var reqQueries = scope.data.request.current.recordQueries;
        if (reqQueries) {
            var reqQueryObj = reqQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (reqQueryObj) {
                if (reqQueryObj.settings.query && reqQueryObj.settings.query.categoryPath) {
                    analyticsCategoryOptions.klevu_categoryName = reqQueryObj.settings.query.categoryPath;
                }
                analyticsCategoryOptions.klevu_limit = reqQueryObj.settings.limit;
                analyticsCategoryOptions.klevu_sort = reqQueryObj.settings.sort;
                analyticsCategoryOptions.klevu_src = "[[typeOfRecord:" + reqQueryObj.settings.typeOfRecords[0] + "]]";
            }
        }

        var resQueries = scope.data.response.current.queryResults;
        if (resQueries) {
            var resQueryObj = resQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (resQueryObj) {
                analyticsCategoryOptions.klevu_pageStartsFrom = resQueryObj.meta.offset;
                if (resQueryObj.records && resQueryObj.records.length) {
                    analyticsCategoryOptions.klevu_productIds = "";
                    klevu.each(resQueryObj.records, function (key, value) {
                        if (analyticsCategoryOptions.klevu_productIds &&
                            analyticsCategoryOptions.klevu_productIds !== "unknown") {
                            if (value.id) {
                                analyticsCategoryOptions.klevu_productIds += ",";
                            }
                        }
                        if (value.id) {
                            analyticsCategoryOptions.klevu_productIds += value.id;
                        }
                    });
                    if (resQueryObj.records[0].klevu_category) {
                        analyticsCategoryOptions.klevu_categoryPath = resQueryObj.records[0].klevu_category;
                    }
                }

            }
        }

        return analyticsCategoryOptions;
    }

    /**
     * Function to register category product click event analytics
     * @param {*} scope 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerCategoryProductClickEvent(scope, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                if (parent && parent != null) {
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var categoryOptions = klevu.analyticsUtil.base.getCategoryViewOptions(scope);
                            categoryOptions.klevu_productId = product.id;
                            categoryOptions.klevu_productName = product.name;
                            categoryOptions.klevu_productUrl = product.url;
                            categoryOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:category]]";
                            categoryOptions.klevu_productSku = product.sku;
                            categoryOptions.klevu_salePrice = product.salePrice;
                            categoryOptions.klevu_productRatings = product.rating;
                            categoryOptions.klevu_productPosition = categoryOptions.klevu_pageStartsFrom;

                            delete categoryOptions.klevu_term;
                            delete categoryOptions.klevu_pageStartsFrom;

                            klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, categoryOptions);
                        }
                    }
                }
            });
        });
    }

    var storageOptions = {
        dictionary: "analytics-util",
        term: "termList",
        click: "clickList",
        categoryClick: "categoryClickList"
    };

    klevu.extend({
        analyticsUtil: {
            base: {
                storage: storageOptions,
                getTermOptions: getTermOptions,
                getProductDetailsFromId: getProductDetailsFromId,
                getDetailsFromURLAndName: getDetailsFromURLAndName,
                storeAnalyticsEvent: storeAnalyticsEvent,
                registerAutoSuggestProductClickEvent: registerAutoSuggestProductClickEvent,
                registerAutoSuggestTermEvent: registerAutoSuggestTermEvent,
                registerAutoSuggestPageClickEvent: registerAutoSuggestPageClickEvent,
                registerLandingProductClickEvent: registerLandingProductClickEvent,
                sendAnalyticsEventsFromStorage: sendAnalyticsEventsFromStorage,
                getCategoryViewOptions: getCategoryViewOptions,
                registerCategoryProductClickEvent: registerCategoryProductClickEvent
            }
        }
    });

    klevu.analyticsUtil.build = true;

})(klevu);

/**
 * Analytics Event build
 */
klevu.coreEvent.build({
    name: "analyticsPowerUp",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            !klevu.analytics.build ||
            !klevu.analyticsUtil.build
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Event to send request from queue
 */
klevu.coreEvent.attach("analyticsPowerUp", {
    name: "attachSendRequestEvent",
    fire: function () {
        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.term
        );

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.click
        );

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.categoryClick
        );
    }
});

/**
 * Attach core event to add quick search analytics
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachQuickSearchAnalyticsEvents",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().element.kScope.analyticsReqTimeOut = null;

            /**
             * Send term request for analytics
             */
            box.getScope().chains.template.events.add({
                name: "doAnalytics",
                fire: function (data, scope) {
                    if (box.getScope().element.kScope.analyticsReqTimeOut) {
                        clearTimeout(box.getScope().element.kScope.analyticsReqTimeOut);
                    }
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    var searchResultContainer = klevu.dom.find(".klevuQuickSearchResults", target)[0];
                    var dataSection;
                    if (searchResultContainer) {
                        dataSection = searchResultContainer.dataset.section;
                    }
                    if (!dataSection) {
                        return;
                    }
                    scope.kScope.data.context.section = dataSection;
                    box.getScope().element.kScope.analyticsReqTimeOut = setTimeout(function () {
                        var termOptions = klevu.analyticsUtil.base.getTermOptions(box.getScope().element.kScope, true);
                        if (termOptions) {
                            termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;template:quick-search]]");
                            klevu.analyticsEvents.term(termOptions);
                        }
                        box.getScope().element.kScope.analyticsReqTimeOut = null;
                    }, 300);
                }
            });

            /**
             * Function to add result product click analytics
             */
            box.getScope().chains.template.events.add({
                name: "doResultProductsAnalytics",
                fire: function (data, scope) {
                    /**
                     * Event to fire on quick search product click
                     */

                    klevu.analyticsUtil.base.registerAutoSuggestTermEvent(
                        scope.kScope,
                        ".klevuAutosuggestions",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.term
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestPageClickEvent(
                        scope.kScope,
                        ".klevuCmsSuggestions",
                        "cmsCompressed",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestPageClickEvent(
                        scope.kScope,
                        ".klevuCategorySuggestions",
                        "categoryCompressed",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestProductClickEvent(
                        scope.kScope,
                        ".klevuQuickSearchResults",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );
                }
            });

        });
    }
});


/**
 * Module to update product information from search results
 */

(function (klevu) {

    /**
     * Function to update image path in products
     * @param {*} scope 
     */
    function updateImagePath(scope) {
        var data = scope.data;
        var queryResults = klevu.getObjectPath(data, "response.current.queryResults");
        if (queryResults) {
            klevu.each(queryResults, function (key, queryResult) {
                if (queryResult && queryResult.records) {
                    klevu.each(queryResult.records, function (rKey, record) {
                        if (typeof (klevu_pubIsInUse) == "undefined" || klevu_pubIsInUse) {
                            record.image = (record.image) ? record.image.replace('needtochange/', '') : "";
                        } else {
                            record.image = (record.image) ? record.image.replace('needtochange/', 'pub/') : "";
                        }
                    });
                }
            });
        }
    }

    var productDataModification = {
        updateImagePath: updateImagePath
    };

    klevu.extend(true, klevu.search.modules, {
        productDataModification: {
            base: productDataModification,
            build: true
        }
    });

})(klevu);

/**
 *  Product image path update for Magento framework
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {

        /**
         * Event to update product image url for magento store 
         */
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().chains.template.process.success.add({
                name: "updateProductImagePath",
                fire: function (data, scope) {
                    var productDataModification = klevu.search.modules.productDataModification;
                    if (productDataModification) {
                        productDataModification.base.updateImagePath(scope.kScope);
                    }
                }
            });
        });
    }
});