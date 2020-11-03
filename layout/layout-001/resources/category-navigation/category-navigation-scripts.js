/**
 * Add to cart base component
 */

(function (klevu) {

    /**
     * Function to send Add to cart request
     * @param {*} scope 
     * @param {*} variantId 
     * @param {*} quantity 
     */
    function sendAddToCartRequest(variantId, quantity) {
        var requestPayload = {
            id: variantId,
            quantity: quantity
        };
        /**
         * Shopify version of add to cart request.
         * Other frameworks may have other type of request for add to cart.
         * Hence, modify request code accordingly.
         */

        klevu.ajax("/cart/add", {
            method: "POST",
            mimeType: "application/json; charset=UTF-8",
            data: JSON.stringify(requestPayload),
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            crossDomain: true,
            success: function (klXHR) {},
            error: function (klXHR) {},
            done: function (klXHR) {}
        });
    }

    var addToCart = {
        sendAddToCartRequest: sendAddToCartRequest
    };

    klevu.extend(true, klevu.search.modules, {
        addToCart: {
            base: addToCart,
            build: true
        }
    });

})(klevu);

/**
 * addToCart module build event
 */
klevu.coreEvent.build({
    name: "addToCartModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.addToCart ||
            !klevu.search.modules.addToCart.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
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
                } else if (element == klevu.analyticsUtil.base.storage.buy) {
                    klevu.analyticsEvents.buy(value);
                } else if (element == klevu.analyticsUtil.base.storage.categoryClick) {

                    //TO-DO: Send category product click event
                    //console.log(value);

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
        categoryClick: "categoryClickList",
        buy: "buyList"
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

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.buy
        );
    }
});

/**
 * Color swatch base extension
 */

(function (klevu) {

    /**
     * Function to prepare keyValue pair object
     * @param {*} keyValuePair 
     */
    function parseKeyValuePairs(keyValuePair) {
        var dataList = [];
        keyValuePair.forEach(function (obj, index) {
            var dataIndex = index + 1;
            var matchedData = {};
            keyValuePair.forEach(function (swatch, i) {
                var objName = swatch.name;
                if (objName.indexOf(dataIndex) > -1) {
                    objName = objName.replace(dataIndex, "");
                    matchedData[objName] = swatch.value;
                    matchedData.isMatched = true;
                }
            });
            if (matchedData.isMatched) {
                delete matchedData.isMatched;
                dataList.push(matchedData);
            }
        });
        return dataList;
    }

    /**
     * Function to parse swatches info data string
     * @param {*} str 
     */
    function getColorSwatchesInfoFromString(str) {
        if (str && str[0] && str[0].variantId) {
            return str;
        }
        var dataArray = str.split(";;;;");
        var keyValuePair = [];
        dataArray.forEach(function (str) {
            if (str.length) {
                var obj = {};
                var trimmedStr = str.trim();
                var splitedStr = trimmedStr.split(":");
                if (splitedStr.length === 2) {
                    obj = {
                        name: splitedStr[0],
                        value: splitedStr[1]
                    };
                } else if (splitedStr.length > 2) {
                    var shiftedArray = splitedStr.shift();
                    obj = {
                        name: shiftedArray,
                        value: splitedStr.join(":")
                    };
                }
                keyValuePair.push(obj);
            }
        });
        return this.parseKeyValuePairs(keyValuePair);
    }

    /**
     * Function to update data in existing product object
     * @param {*} scope 
     * @param {*} listName 
     */
    function parseProductColorSwatch(scope, listName) {
        var self = this;
        var items = klevu.getObjectPath(scope.data.template.query, listName);
        if (items && items.result) {
            klevu.each(items.result, function (key, value) {
                if (value.swatchesInfo && value.swatchesInfo.length) {
                    value.swatchesInfo = self.getColorSwatchesInfoFromString(value.swatchesInfo);
                }
            })
        }
    }

    var colorSwatches = {
        parseProductColorSwatch: parseProductColorSwatch,
        getColorSwatchesInfoFromString: getColorSwatchesInfoFromString,
        parseKeyValuePairs: parseKeyValuePairs
    };

    klevu.extend(true, klevu.search.modules, {
        colorSwatches: {
            base: colorSwatches,
            build: true
        }
    });

})(klevu);


/**
 * colorSwatches module build event
 */
klevu.coreEvent.build({
    name: "colorSwatchesModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.colorSwatches ||
            !klevu.search.modules.colorSwatches.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Initialize facets
 */

(function (klevu) {

    /**
     * Function to attach event on facet items
     * @param {*} scope 
     */
    function attachFacetItemsClickEvent(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuFilterOption", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuFilter");
                if (parentElem !== null && (parentElem.dataset.singleselect === 'true') && !this.classList.contains("klevuFilterOptionActive")) {
                    var listSingleSelect = klevu.dom.find(".klevuFilterOptionActive", parentElem);
                    klevu.each(listSingleSelect, function (key, value) {
                        value.classList.remove("klevuFilterOptionActive");
                    });
                }
                this.classList.toggle("klevuFilterOptionActive");

                //getScope
                var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                if (target === null) {
                    return;
                }

                var elScope = target.kElem;
                elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                elScope.kScope.data.context.keyCode = 0;
                elScope.kScope.data.context.eventObject = event;
                elScope.kScope.data.context.event = "keyUp";
                elScope.kScope.data.context.preventDefault = false;

                //override local variables

                var options = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                if (options === null) {
                    return;
                }
                //calculate new filters
                //getAllActiveFilters
                var listActive = klevu.dom.find(".klevuFilterOptionActive", options);
                if (listActive.length > 0) {
                    var filterList = [];
                    klevu.each(listActive, function (key, value) {
                        var filter = klevu.dom.helpers.getClosest(value, ".klevuFilter");

                        if (filter !== null) {
                            var objectToChange = filterList.filter(function (element) {
                                return element.key == filter.dataset.filter
                            });
                            if (objectToChange.length === 0) {
                                filterList.push({
                                    key: filter.dataset.filter,
                                    settings: {
                                        singleSelect: (klevu.isUndefined(filter.dataset.singleselect) ? false : filter.dataset.singleselect)
                                    },
                                    values: [(klevu.isUndefined(value.dataset.value) ? false : value.dataset.value)]
                                });
                            } else {
                                objectToChange[0].values.push((klevu.isUndefined(value.dataset.value) ? false : value.dataset.value));
                            }
                        }
                    });
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters.filters", filterList);
                } else {
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters", {});
                }
                //reset offset after filter change
                klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
            }, true);
        });
    }

    var facets = {
        attachFacetItemsClickEvent: attachFacetItemsClickEvent
    };

    klevu.extend(true, klevu.search.modules, {
        facets: {
            base: facets,
            build: true
        }
    });

})(klevu);

/**
 * facets module build event
 */
klevu.coreEvent.build({
    name: "facetsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.facets ||
            !klevu.search.modules.facets.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});





/**
 * Create categoryLanding search object
 */
klevu.interactive(function () {
    klevu.extend(true, klevu.search, {
        categoryLanding: klevu.searchObjectClone(klevu.search.base)
    });
});

/**
 * Build core event for category page
 */
klevu.coreEvent.build({
    name: "setRemoteConfigCategoryLanding",
    fire: function () {
        if (!klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.search.categoryLanding)) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});



//attach locale settings
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-locale",
    fire: function () {
        //add translations
        var translatorLanding = klevu.search.categoryLanding.getScope().template.getTranslator();
        translatorLanding.addTranslation("Search", "Search");
        translatorLanding.addTranslation("<b>%s</b> productList", "<b>%s</b> Products");
        translatorLanding.addTranslation("<b>%s</b> contentList", "<b>%s</b> Other results");
        translatorLanding.mergeToGlobal();

        //set currency
        //var currencyQuick = klevu.search.categoryLanding.getScope().currency;
        var currencyLanding = klevu.search.categoryLanding.getScope().template.getTranslator().getCurrencyObject();

        currencyLanding.setCurrencys({
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
        currencyLanding.mergeToGlobal();
    }
});


// add templates
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-templates",
    fire: function () {
        //set templates
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateBase"), "klevuTemplateLanding", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateNoResultFound"), "noResultFound", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplatePagination"), "pagination", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResults"), "results", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateProductBlock"), "productBlock", true);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);
    }
});
// add chain extensions
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-chains",
    fire: function () {

        klevu.search.categoryLanding.getScope().chains.request.build.add({
            name: "addProductList",
            fire: function (data, scope) {

                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                var categoryProductList = klevu.extend(true, {}, parameterMap.recordQuery);

                var quickStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                var categoryPath = klevu.getSetting(scope.kScope.settings, "settings.search.categoryPath");
                var filterResults = klevu.getSetting(scope.kScope.settings, "settings.search.categoryFilters");


                if (filterResults && filterResults.length) {
                    var filters = filterResults.split(":");
                    var f_key = filters[0];
                    var f_values = [filters[1]];

                    categoryProductList.filters.applyFilters.filters = [{
                        key: f_key,
                        values: f_values
                    }];

                }


                categoryProductList.id = "categoryProductList";

                categoryProductList.typeOfRequest = "CATNAV";
                categoryProductList.settings.query.term = "*";
                categoryProductList.settings.query.categoryPath = categoryPath;

                categoryProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                categoryProductList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                categoryProductList.settings.limit = 12;
                categoryProductList.filters.filtersToReturn.enabled = true;
                data.request.current.recordQueries.push(categoryProductList);
                data.context.doSearch = true;

            }
        });

        // where to render the responce
        klevu.search.categoryLanding.getScope().chains.template.render.add({
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

        // multi-select filters (except for category)
        klevu.search.categoryLanding.getScope().chains.template.process.success.add({
            name: "processFilters",
            fire: function (data, scope) {
                var list = ["categoryProductList", "contentCompressed"];
                klevu.each(list, function (key, value) {
                    var items = klevu.getObjectPath(data.template.query, value);
                    if (!klevu.isUndefined(items)) {
                        klevu.each(items.filters, function (keyFilter, filter) {
                            filter.multiselect = false;
                            if (filter.key != 'category') {
                                filter.multiselect = true;
                            }
                        })
                    }
                });

            }
        });

    }
});

// add template helpers
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-template-helpers",
    fire: function () {
        //add extra helpers
        var quickStorage = klevu.getSetting(klevu.settings, "settings.storage");
        klevu.search.categoryLanding.getScope().template.setHelper("cropText", function cropText(textValue, length) {
            if (textValue.length <= length) return textValue;
            return textValue.substring(0, length) + "...";
        });
        klevu.search.categoryLanding.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });
    }
});




klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-sort",
    fire: function () {
        var options = {
            storage: {
                sort: klevu.dictionary("sort")
            }
        };
        klevu(options);

        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateSortBy"), "sortBy", true);

        klevu.search.categoryLanding.getScope().chains.request.build.add({
            name: "setSortBy",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var sort = (landingStorage.sort.getElement(query.id) == query.id) ? false : landingStorage.sort.getElement(query.id);
                    if (sort) {
                        query.settings.sort = sort;
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.categoryLanding.getScope().settings, "settings.storage");
        storage.sort.setStorage("local");
        storage.sort.mergeFromGlobal();

        klevu.search.categoryLanding.getScope().template.setHelper("getSortBy", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var sorting = (landingStorage.sort.getElement(name) == name) ? "RELEVANCE" : landingStorage.sort.getElement(name);
            switch (sorting) {
                case "RELEVANCE":
                    return 'Relevance';
                    break;
                case "PRICE_ASC":
                    return 'Price: Low to high';
                    break;
                case "PRICE_DESC":
                    return 'Price: High to low';
                    break;
                default:
                    return 'Relevance';
                    break;
            }
        });

        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "SortBySort",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuSort", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");

                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");

                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.sort.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.sort.mergeToGlobal();

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    });
                });
            }
        });
    }
});


klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-limit",
    fire: function () {
        var options = {
            storage: {
                limits: klevu.dictionary("limits")
            }
        };
        klevu(options);
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateLimit"), "limit", true);

        klevu.search.categoryLanding.getScope().chains.request.build.add({
            name: "setLimits",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var limit = (landingStorage.limits.getElement(query.id) == query.id) ? false : landingStorage.limits.getElement(query.id);
                    if (limit) {
                        query.settings.limit = limit;
                    } else {
                        query.settings.limit = 12;
                        landingStorage.limits.addElement(query.id, 12);
                        landingStorage.limits.mergeToGlobal();
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.categoryLanding.getScope().settings, "settings.storage");
        storage.limits.setStorage("local");
        storage.limits.mergeFromGlobal();

        klevu.search.categoryLanding.getScope().template.setHelper("getLimit", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var limit = (landingStorage.limits.getElement(name) == name) ? 12 : landingStorage.limits.getElement(name);
            return limit;
        });

        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "SortByLimit",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuLimit", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.limits.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.limits.mergeToGlobal();

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    });
                });
            }
        });
    }
});



/**
 * Extend addToCart base module for landing page
 */


klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForLandingPage",
    fire: function () {

        /**
         * Landing page Add to cart button click event
         * @param {*} ele 
         * @param {*} event 
         * @param {*} productList 
         */
        function attachProductAddToCartBtnEvent(ele, event, productList) {
            event = event || window.event;
            event.preventDefault();

            var selected_product;
            var target = klevu.dom.helpers.getClosest(ele, ".kuAddtocart");
            var productId = target.getAttribute("data-id");
            klevu.each(productList, function (key, product) {
                if (product.id == productId) {
                    selected_product = product;
                }
            });
            if (selected_product) {
                ele.selected_product = selected_product;
                if (selected_product) {
                    klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
            }
        }

        /**
         * Function to bind events to landing page product add to cart button
         * @param {*} scope 
         */
        function bindLandingProductAddToCartBtnClickEvent(scope) {
            var self = this;
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");

            klevu.each(klevu.dom.find(".kuLandingAddToCartBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                    if (parent && parent.dataset && parent.dataset.section) {
                        var productList = klevu.getObjectPath(scope.data.template.query, parent.dataset.section);
                        self.attachProductAddToCartBtnEvent(this, event, productList.result);
                    }
                });
            });
        }

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindLandingProductAddToCartBtnClickEvent: bindLandingProductAddToCartBtnClickEvent,
            attachProductAddToCartBtnEvent: attachProductAddToCartBtnEvent
        });
    }
});

/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addAddToCartButtonLandingPage",
    fire: function () {

        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Bind landing page add to cart button click event */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.modules.addToCart.base.bindLandingProductAddToCartBtnClickEvent(scope.kScope);
            }
        });
    }
});

/**
 * Color swatch landing page extension
 */

klevu.coreEvent.attach("colorSwatchesModuleBuild", {
    name: "extendColorSwatchesModuleForLandingPage",
    fire: function () {


        /**
         * Function to get nearest product image element
         * @param {*} ele 
         */
        function getNearestProductImageByElement(ele) {
            var img;
            var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
            klevu.each(klevu.dom.find(".klevuImgWrap img", parentElem), function (key, value) {
                if (value) {
                    img = value;
                }
            });
            return img;
        }

        /**
         * Function to map swatches data to landing page color swatches
         * @param {*} ele 
         * @param {*} productResults 
         */
        function landingMapColorSwatchesData(ele, productResults) {
            var selected_product;
            var productElement = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
            if (productElement) {
                var productId = productElement.getAttribute("data-id");
                if (productId) {
                    klevu.each(productResults, function (key, product) {
                        if (product.id == productId) {
                            selected_product = product;
                        }
                    });
                    if (selected_product && selected_product.swatchesInfo) {
                        var variantId = ele.getAttribute("data-variant");
                        if (variantId) {
                            klevu.each(selected_product.swatchesInfo, function (key, swatch) {
                                if (swatch.variantId == variantId) {
                                    ele.swatchesInfo = swatch;
                                }
                            });
                        }
                    }
                }
            }
        }

        /**
         * Landing page grid mouse enter event
         * @param {*} ele 
         */
        function landingColorGridMouseEnterEvent(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                productImageElement.setAttribute("src", ele.swatchesInfo.variantImage);
            }
        }

        /**
         * Landing color grid mouse leave event
         * @param {*} ele 
         */
        function landingColorGridMouseLeaveEvent(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                productImageElement.setAttribute("src", ele.defaultImage);
            }
        }

        /**
         * Function to set default product image to color swatch element
         * @param {*} ele 
         */
        function landingSetDefaultProductImageToSwatches(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                ele.defaultImage = productImageElement.getAttribute("src");
            }
        }

        /**
         * Function to bind events to landing page product color swatches
         * @param {*} scope 
         */
        function bindColorGridEventsToLandingProducts(scope) {
            var self = this;
            klevu.each(scope.data.response.current.queryResults, function (key, value) {
                if (value && value.id) {
                    var productResults;
                    var items = klevu.getObjectPath(scope.data.template.query, value.id);
                    if (items && items.result) {
                        productResults = items.result;
                    }
                    var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find('.klevuLandingSwatchColorGrid', target), function (key, value) {
                        self.landingMapColorSwatchesData(value, productResults);
                        self.landingSetDefaultProductImageToSwatches(value);
                        klevu.event.attach(value, "mouseenter", function (event) {
                            self.landingColorGridMouseEnterEvent(value);
                        });
                        klevu.event.attach(value, "mouseleave", function (event) {
                            self.landingColorGridMouseLeaveEvent(value);
                        });
                    });
                }
            });
        }

        klevu.extend(true, klevu.search.modules.colorSwatches.base, {
            bindColorGridEventsToLandingProducts: bindColorGridEventsToLandingProducts,
            getNearestProductImageByElement: getNearestProductImageByElement,
            landingMapColorSwatchesData: landingMapColorSwatchesData,
            landingColorGridMouseEnterEvent: landingColorGridMouseEnterEvent,
            landingColorGridMouseLeaveEvent: landingColorGridMouseLeaveEvent,
            landingSetDefaultProductImageToSwatches: landingSetDefaultProductImageToSwatches
        });
    }
});

/**
 * Event to attach landing page product color swatch
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachLandingPageProductColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);

        /**
         * Initialize color swatches and service before rendering
         */
        klevu.search.categoryLanding.getScope().chains.template.render.addBefore("renderResponse", {
            name: "initializeLandingProductSwatches",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    klevu.each(data.response.current.queryResults, function (key, value) {
                        if (value && value.id) {
                            klevu.search.modules.colorSwatches.base.parseProductColorSwatch(scope.kScope, value.id);
                        }
                    });
                }
            }
        });

        /*
         *	Bind landing page color swatches events
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "addProductGridColorSwatches",
            fire: function (data, scope) {
                klevu.search.modules.colorSwatches.base.bindColorGridEventsToLandingProducts(scope.kScope);
            }
        });

    }
});

/**
 * Extend addToCart base module for Quick view
 */

klevu.extend({
    addToCartQuickView: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.quickView = {

            /*
             *	Function to toggle Body scroll style
             */
            toggleBodyScroll: function () {
                var body = klevu.dom.find("body")[0];
                var isScroll = '';
                if (!body.style.overflow) {
                    isScroll = "hidden";
                }
                body.style.overflow = isScroll;
            },

            /*
             *	Function to toggle modal UI
             */
            toggleModal: function () {
                this.toggleBodyScroll();
                var modalElement = klevu.dom.find("div.kuModal");
                if (modalElement.length) {
                    modalElement[0].classList.toggle("show-modal");
                }
            },

            /**
             * Function to attach add to cart button event
             * @param {*} event 
             */
            attachKlevuQuickViewAddToCartBtnEvent: function (event) {
                event = event || window.event;
                event.preventDefault();
                var selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    selected_product = target[0].selected_product;
                }
                if (selected_product) {
                    mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
                this.toggleModal();
            },

            /**
             * Function to bind add to cart button event
             */
            bindAddToCartEvent: function () {
                var self = this;
                var addToCartElement = klevu.dom.find(".kuModalProductCart", ".productQuickView");
                if (addToCartElement.length) {
                    klevu.event.attach(addToCartElement[0], "click", function (event) {
                        self.attachKlevuQuickViewAddToCartBtnEvent(event);
                    });
                }
            }
        };
    }
});

/**
 * Extend addToCart base module for Quick view
 */

klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForQuickView",
    fire: function () {

        /*
         *	Function to toggle Body scroll style
         */
        function toggleBodyScroll() {
            var body = klevu.dom.find("body")[0];
            var isScroll = '';
            if (!body.style.overflow) {
                isScroll = "hidden";
            }
            body.style.overflow = isScroll;
        };

        /*
         *	Function to toggle modal UI
         */
        function toggleModal() {
            this.toggleBodyScroll();
            var modalElement = klevu.dom.find("div.kuModal");
            if (modalElement.length) {
                modalElement[0].classList.toggle("show-modal");
            }
        };

        /**
         * Function to attach add to cart button event
         * @param {*} event 
         */
        function attachKlevuQuickViewAddToCartBtnEvent(event) {
            event = event || window.event;
            event.preventDefault();

            var selected_product;
            var target = klevu.dom.find(".productQuickView");
            if (target && target[0]) {
                selected_product = target[0].selected_product;
            }
            if (selected_product) {
                klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
            }
            this.toggleModal();
        };

        /**
         * Function to bind add to cart button event
         */
        function bindAddToCartEvent() {
            var self = this;
            var addToCartElement = klevu.dom.find(".kuModalProductCart", ".productQuickView");
            if (addToCartElement.length) {
                klevu.event.attach(addToCartElement[0], "click", function (event) {
                    self.attachKlevuQuickViewAddToCartBtnEvent(event);
                });
            }
        };

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindAddToCartEvent: bindAddToCartEvent,
            attachKlevuQuickViewAddToCartBtnEvent: attachKlevuQuickViewAddToCartBtnEvent,
            toggleModal: toggleModal,
            toggleBodyScroll: toggleBodyScroll
        });
    }
});

(function (klevu) {

    /*
     *	Add container for Product Quick view
     */
    function appendTemplateIntoBody() {
        var quickViewCont = document.createElement("div");
        quickViewCont.className = "quickViewWrap productQuickView";
        window.document.body.appendChild(quickViewCont);
    };
    /*
     *	Function to toggle Body scroll style
     */
    function toggleBodyScroll() {
        var body = klevu.dom.find("body")[0];
        var isScroll = '';
        if (!body.style.overflow) {
            isScroll = "hidden";
        }
        body.style.overflow = isScroll;
    };
    /*
     *	Function to toggle modal UI
     */
    function toggleModal() {
        this.toggleBodyScroll();
        var modalElement = klevu.dom.find("div.kuModal", '.productQuickView');
        if (modalElement.length) {
            this.modal = modalElement[0];
            this.modal.classList.toggle("show-modal");
        }
    };

    /*
     *	Function to fire on window click event to hide modal
     */
    function windowOnClick(event) {
        if (event.target === this.modal) {
            this.toggleModal();
        }
    };
    /**
     * Function to bind event on close button
     */
    function bindCloseBtnClick() {
        var self = this;
        var closeElement = klevu.dom.find(".close-button", '.productQuickView');
        if (closeElement.length) {
            self.closeButton = closeElement[0];
            klevu.event.attach(self.closeButton, "click", function () {
                self.toggleModal();
            });
        }
    };
    /**
     * Landing page onload event
     * @param {*} scope 
     */
    function landingPageTemplateOnLoadEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                var selected_product_id = (this.getAttribute("data-id")) ? this.getAttribute("data-id") : null;
                var items = klevu.getObjectPath(scope.data.template.query, 'categoryProductList');
                if (items.result) {
                    klevu.each(items.result, function (key, value) {
                        if (value.id == selected_product_id) {
                            selected_product = value;
                        }
                    })
                }
                scope.data.template.selected_product = selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    target[0].selected_product = selected_product;
                }
                klevu.event.fireChain(scope, "chains.quickView", scope.element, scope.data, event);
                self.toggleModal();
            });
        });
    }

    var quickViewService = {
        modal: null,
        closeButton: null,
        selected_product: null,
        landingPageTemplateOnLoadEvent: landingPageTemplateOnLoadEvent,
        bindCloseBtnClick: bindCloseBtnClick,
        windowOnClick: windowOnClick,
        toggleModal: toggleModal,
        toggleBodyScroll: toggleBodyScroll,
        appendTemplateIntoBody: appendTemplateIntoBody
    };

    klevu.extend(true, klevu.search.modules, {
        quickViewService: {
            base: quickViewService,
            build: true
        }
    });



})(klevu);


/**
 * quickViewService module build event
 */
klevu.coreEvent.build({
    name: "quickViewServiceModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.quickViewService ||
            !klevu.search.modules.quickViewService.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add Product Quick view functionality
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Set template in landing UI */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.categoryLanding.getScope().chains.quickView = klevu.chain();

        /** Add Quick view wrapper container in body */
        klevu.search.modules.quickViewService.base.appendTemplateIntoBody();

        /*
         *	Add Quick view template and update data into that
         */
        klevu.search.categoryLanding.getScope().chains.quickView.add({
            name: "chainQuickView",
            fire: function (data, scope) {
                event = event || window.event;
                event.preventDefault();
                scope.kScope.template.setData(data.template);
                var target = klevu.dom.find("div.quickViewWrap")[0];
                target.innerHTML = '';
                var element = scope.kScope.template.convertTemplate(scope.kScope.template.render("quick-view"));
                scope.kScope.template.insertTemplate(target, element);

                klevu.search.modules.quickViewService.base.bindCloseBtnClick();
                klevu.search.modules.addToCart.base.bindAddToCartEvent();
            }
        });

        /**
         *  Bind body click event
         */
        klevu.event.attach(window, "click", function (event) {
            klevu.search.modules.quickViewService.base.windowOnClick(event);
        });

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
                klevu.search.modules.quickViewService.base.landingPageTemplateOnLoadEvent(scope.kScope);
            }
        });
    }
});

/**
 * Color swatch Quick view extension
 */

klevu.coreEvent.attach("colorSwatchesModuleBuild", {
    name: "extendColorSwatchesModuleForQuickView",
    fire: function () {

        /**
         * Function to get image element
         */
        function getProductImageElement() {
            var img;
            var target = klevu.dom.find(".productQuick-imgBlock img");
            if (target && target[0]) {
                img = target[0];
            }
            return img;
        };

        /**
         * Color grid mouse enter event
         * @param {*} ele 
         */
        function colorGridMouseEnterEvent(ele) {
            var imgEle = this.getProductImageElement();
            if (imgEle) {
                imgEle.setAttribute("src", ele.swatchesInfo.variantImage);
            }
        };

        /**
         * Color grid mouse leave event
         * @param {*} product 
         */
        function colorGridMouseLeaveEvent(product) {
            var imgEle = this.getProductImageElement();
            if (imgEle) {
                var variantId = product.id;
                var swatchesInfo = product.swatchesInfo;
                swatchesInfo.forEach(function (swatch) {
                    if (variantId == swatch.variantId) {
                        imgEle.setAttribute("src", swatch.variantImage);
                    }
                });
            }
        };

        /**
         * Function to map data with color grid
         * @param {*} product 
         */
        function mapSwatchObjectToColorGrid(product) {
            var self = this;
            klevu.each(klevu.dom.find('.klevuSwatchColorGrid'), function (key, value) {
                var variantId = value.getAttribute("data-variant");
                if (variantId) {
                    product.swatchesInfo.forEach(function (swatch) {
                        if (swatch.variantId == variantId) {
                            value.swatchesInfo = swatch;
                        }
                    });
                    klevu.event.attach(value, "mouseenter", function (event) {
                        self.colorGridMouseEnterEvent(value);
                    });
                    klevu.event.attach(value, "mouseleave", function (event) {
                        self.colorGridMouseLeaveEvent(product);
                    });
                }
            });
        };

        /**
         * Function to get selected product data
         */
        function getSelectedProductData() {
            var selected_product;
            var target = klevu.dom.find(".productQuickView");
            if (target && target[0]) {
                selected_product = target[0].selected_product;
            }
            return selected_product;
        };

        /**
         * Function to bind events with color grid
         */
        function bindColorGridEvents() {
            var product = this.getSelectedProductData();
            if (product && product.swatchesInfo) {
                this.mapSwatchObjectToColorGrid(product);
            }
        }

        klevu.extend(true, klevu.search.modules.colorSwatches.base, {
            bindColorGridEvents: bindColorGridEvents,
            getSelectedProductData: getSelectedProductData,
            mapSwatchObjectToColorGrid: mapSwatchObjectToColorGrid,
            colorGridMouseLeaveEvent: colorGridMouseLeaveEvent,
            colorGridMouseEnterEvent: colorGridMouseEnterEvent,
            getProductImageElement: getProductImageElement
        });
    }
});

/**
 * Event to attach product quick view color swatch
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachProductQuickViewColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickViewProductColorSwatches"), "quickViewProductSwatch", true);

        /**
         * parse product color swatch info
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "parseQuickViewProductColorSwatch",
            fire: function (data, scope) {
                klevu.each(data.response.current.queryResults, function (key, value) {
                    if (value && value.id) {
                        klevu.search.modules.colorSwatches.base.parseProductColorSwatch(scope.kScope, value.id);
                    }
                });
            }
        });

        /**
         * Bind color swatch events
         */
        klevu.search.categoryLanding.getScope().chains.quickView.add({
            name: "bindColorGridEvents",
            fire: function (data, scope) {
                klevu.search.modules.colorSwatches.base.bindColorGridEvents();
            }
        });

    }
});

/**
 * Extend klevu object for custom pagination functionality
 */

(function (klevu) {


    /**
     * Paginate click event
     * @param {*} scope 
     * @param {*} event 
     */
    function paginateClickEvent(event) {
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
    };

    /**
     * Function to bind pagination events
     * @param {*} paginateClass paginate link container class
     */
    function bindPaginationEvents(scope, paginateClass) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(paginateClass, target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                self.paginateClickEvent(event);
            }, true);
        });
    };

    var customPagination = {
        paginateClickEvent: paginateClickEvent,
        bindPaginationEvents: bindPaginationEvents
    };

    klevu.extend(true, klevu.search.modules, {
        customPagination: {
            base: customPagination,
            build: true
        }
    });

})(klevu);


/**
 * customPagination module build event
 */
klevu.coreEvent.build({
    name: "paginationModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.customPagination ||
            !klevu.search.modules.customPagination.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add landing page custom pagination bar
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addLandingPageCustomPaginationBar",
    fire: function () {

        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#customLandingPagePaginationBar"), "customLandingPagePagination", true);

        /**
         * Add pagination events
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "addCustomPagination",
            fire: function (data, scope) {

                /** Binding events for pagination on landing page */
                klevu.search.modules.customPagination.base.bindPaginationEvents(scope.kScope, ".kuPaginate");
            }
        });

    }
});

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
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "collapseFilters",
    fire: function () {

        /**
         * Function to enable collapsing for filter items
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "enableFilterCollapse",
            fire: function (data, scope) {
                klevu.search.modules.collapseFilters.base.initialize(scope.kScope);
            }
        });

        /**
         * Function to set filter priority list and reorder filter list
         */
        klevu.search.categoryLanding.getScope().chains.template.render.addBefore("renderResponse", {
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

                    klevu.search.modules.collapseFilters.base.collapse(data, collapsedFilters, 'categoryProductList');
                }
            }
        });
    }
});

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
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "reorderFilterOptions",
    fire: function () {

        /**
         * Function to set filter option priority list and reorder filter option list
         */
        klevu.search.categoryLanding.getScope().chains.template.render.addBefore("renderResponse", {
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
                    klevu.search.modules.reorderFilterOptions.base.reorder(data, priorityFilterOptions, 'categoryProductList');
                }
            }
        });
    }
});

/**
 * Extension for filter price slider
 */

(function (klevu) {

    /**
     * Function to initialize slider
     * @param {*} data 
     * @param {*} scope 
     */
    function initSlider(data, scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        var priceSliderList = klevu.dom.find(".kuPriceSlider [data-querykey]", target);
        if (priceSliderList) {
            priceSliderList.forEach(function (ele) {
                var sliderData;
                var querykey = ele.getAttribute("data-querykey");
                var contentData = data.template.query[querykey];
                if (contentData) {
                    contentData.filters.forEach(function (filter) {
                        if (filter.key == scope.priceSliderFilterReqQuery.key && filter.type == "SLIDER") {
                            sliderData = filter;
                        }
                    });
                }
                if (sliderData) {
                    if (ele.slider) {
                        ele.slider.destroy();
                    }
                    ele.sliderData = sliderData;
                    if(sliderData.start === undefined || sliderData.start == null){
                        sliderData.start = sliderData.min;
                    }
                    if(sliderData.end === undefined || sliderData.end == null){
                        sliderData.end = sliderData.max;
                    }
                    ele.slider = noUiSlider.create(ele, {
                        start: [parseInt(sliderData.start), parseInt(sliderData.end)],
                        connect: true,
                        range: {
                            'min': [parseInt(sliderData.min)],
                            'max': [parseInt(sliderData.max)]
                        }
                    });
                    ele.slider.on('update', function (values, handle) {
                        klevu.dom.find(".minValue" + querykey)[0].innerHTML = parseInt(values[0]);
                        klevu.dom.find(".maxValue" + querykey)[0].innerHTML = parseInt(values[1]);
                    });
                    ele.slider.on('change', function (values, handle) {
                        self.sliderOnUpdateEvent(values, querykey, data, ele, scope);
                    });
                }
            });
        }
    };

    /**
     * Slider filter on value change event
     * @param {*} values 
     * @param {*} querykey 
     * @param {*} data 
     * @param {*} ele 
     */
    function sliderOnUpdateEvent(values, querykey, data, ele, scope) {
        var min = parseInt(values[0]);
        var max = parseInt(values[1]);
        klevu.dom.find(".minValue" + querykey)[0].innerHTML = min;
        klevu.dom.find(".maxValue" + querykey)[0].innerHTML = max;

        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");

        /** Get Scope */
        var sliderFilter = klevu.dom.helpers.getClosest(ele, ".klevuTarget");

        var elScope = sliderFilter.kElem;
        elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);

        var options = klevu.dom.helpers.getClosest(ele, ".klevuMeta");

        var localQuery = data.localOverrides.query[querykey];
        var localFilters = localQuery.filters;
        var sliderFilterReqObj = {
            key: ele.sliderData.key,
            settings: {
                singleSelect: "false"
            },
            values: [
                min.toString(), max.toString()
            ]
        };
        if (!localFilters) {
            localQuery.filters = {};
            localQuery.filters.applyFilters = {};
            localQuery.filters.applyFilters.filters = [sliderFilterReqObj];
        } else {
            var applyFilters = localFilters.applyFilters.filters;
            var isUpdated = false;
            if (applyFilters) {
                applyFilters.forEach(function (filter) {
                    if (filter.key == ele.sliderData.key) {
                        isUpdated = true;
                        filter.values = [min.toString(), max.toString()];
                    }
                });
                if (!isUpdated) {
                    applyFilters.push(sliderFilterReqObj);
                }
            } else {
                localQuery.filters.applyFilters.filters = [sliderFilterReqObj];
            }
        }

        /** reset offset after filter change */
        klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
        klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);

    };

    var filterPriceSlider = {
        initSlider: initSlider,
        sliderOnUpdateEvent: sliderOnUpdateEvent
    };

    klevu.extend(true, klevu.search.modules, {
        filterPriceSlider: {
            base: filterPriceSlider,
            build: true
        }
    });


})(klevu);

/**
 * filterPriceSlider module build event
 */
klevu.coreEvent.build({
    name: "filterPriceSliderModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.filterPriceSlider ||
            !klevu.search.modules.filterPriceSlider.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});


/**
 * Add Price slider paramter in request object functionality
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachPriceSliderFilter",
    fire: function () {

        /** Price slider filter request query */
        klevu.search.categoryLanding.getScope().priceSliderFilterReqQuery = {
            key: "klevu_price",
            minMax: true
        };

        /** Function to add range filters in request filter object */
        klevu.search.categoryLanding.getScope().chains.request.build.addAfter('addProductList', {
            name: "addPriceSlider",
            fire: function (data, scope) {
                var requestQueries = data.request.current.recordQueries;
                requestQueries.forEach(function (req) {
                    if (req.id == "categoryProductList") {
                        req.filters.filtersToReturn.rangeFilterSettings = [klevu.search.categoryLanding.getScope().priceSliderFilterReqQuery];
                    }
                });
            }
        });

        /**
         *  Initialize slider
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "initSliderFilter",
            fire: function (data, scope) {

                klevu.search.modules.filterPriceSlider.base.initSlider(data, scope.kScope);
            }
        });

    }
});

/**
 * Extension for reordering filters
 */

(function (klevu) {

    /**
     * Function to reorder filter list as per the priority list
     * @param {*} data 
     * @param {*} priorityFilters 
     * @param {*} dataListName 
     */
    function reorder(data, priorityFilters, dataListName) {
        if (data && data.template && data.template.query) {
            var items = klevu.getObjectPath(data.template.query, dataListName);
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

    var reorderFilters = {
        reorder: reorder
    };

    klevu.extend(true, klevu.search.modules, {
        reorderFilters: {
            base: reorderFilters,
            build: true
        }
    });

})(klevu);


/**
 * reorderFilters module build event
 */
klevu.coreEvent.build({
    name: "reorderFiltersModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.reorderFilters ||
            !klevu.search.modules.reorderFilters.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Reorder filter list
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "reorderFilters",
    fire: function () {

        /**
         * Function to set filter priority list and reorder filter list
         */
        klevu.search.categoryLanding.getScope().chains.template.render.addBefore("renderResponse", {
            name: "reorderFilterPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    var priorityFilters = [{
                        key: "brand"
                    }, {
                        key: "category"
                    }];
                    klevu.search.modules.reorderFilters.base.reorder(data, priorityFilters, 'categoryProductList');
                }
            }
        });
    }
});

/**
 * Extension for mobile sliding filter
 */

(function (klevu) {

    /**
     * Function to manage slider status in target element
     * @param {*} status 
     */
    function manageSliderStatus(status, scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        var elScope = target.kElem;
        elScope.kScope.isMobileSliderOpen = status;
    };

    /**
     * Function to attach event on filter button
     */
    function attachFilterBtnClickEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                self.toggleBodyScroll();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                    ele.classList.add("kuFiltersIn");
                    self.manageSliderStatus(true,scope);
                });

            });
        });
    };

    /**
     * Function to add event on slider close button
     */
    function attachFilterCloseBtnClickEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuMobileFilterCloseBtn", target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                self.toggleBodyScroll();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                    ele.classList.remove("kuFiltersIn");
                    self.manageSliderStatus(false,scope);
                });

            });
        });
    };

    /**
     * Function to persisting filter slider position
     */
    function persistFilterPosition(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        var scope = target.kElem;
        var isMobileSliderOpen = scope.kScope.isMobileSliderOpen;
        if (isMobileSliderOpen) {
            var kuFilter = klevu.dom.find(".kuFilters", target)[0];
            klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
                var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuMeta");
                var dataSection = parentElem.getAttribute("data-section");
                if (dataSection) {
                    var klevuWrap = klevu.dom.helpers.getClosest(ele, ".klevuWrap");
                    var isActive = klevuWrap.classList.contains(dataSection + "Active");
                    if (isActive) {
                        var filterEle = klevu.dom.find(".kuFilters", parentElem);
                        if (filterEle && filterEle[0]) {
                            kuFilter = filterEle[0];
                        }
                    }
                }
            });
            kuFilter.classList.add("kuFiltersIn");
        }
    };

    /*
     *	Function to toggle Body scroll style
     */
    function toggleBodyScroll() {
        var body = klevu.dom.find("body")[0];
        var isScroll = '';
        if (!body.style.overflow) {
            isScroll = "hidden";
        }
        body.style.overflow = isScroll;
    };

    /**
     * Function to attach events on buttons
     */
    function attachButtonEvents(scope) {
        this.attachFilterBtnClickEvent(scope);
        this.attachFilterCloseBtnClickEvent(scope);
    }

    var mobileFilterSlider = {
        attachButtonEvents: attachButtonEvents,
        attachFilterBtnClickEvent: attachFilterBtnClickEvent,
        attachFilterCloseBtnClickEvent: attachFilterCloseBtnClickEvent,
        toggleBodyScroll: toggleBodyScroll,
        persistFilterPosition: persistFilterPosition,
        manageSliderStatus: manageSliderStatus
    };

    klevu.extend(true, klevu.search.modules, {
        mobileFilterSlider: {
            base: mobileFilterSlider,
            build: true
        }
    });

})(klevu);


/**
 * mobileFilterSlider module build event
 */
klevu.coreEvent.build({
    name: "mobileFilterSliderModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.mobileFilterSlider ||
            !klevu.search.modules.mobileFilterSlider.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Attach Filter slider effect
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addMobileFilterSliderEvents",
    fire: function () {

        /**
         * Function to load on landing page load
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "attachMobileSliderFilter",
            fire: function (data, scope) {
                klevu.search.modules.mobileFilterSlider.base.attachButtonEvents(scope.kScope);
                klevu.search.modules.mobileFilterSlider.base.persistFilterPosition(scope.kScope);
            }
        });

    }
});

/**
 * Attach Product badge
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addSearchResultProductBadges",
    fire: function () {

        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductBadge"), "landingProductBadge", true);
    }
});

/**
 * Attach Product stock availability label
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addProductavailabilityLabel",
    fire: function () {
        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductStock"), "landingProductStock", true);
    }
});

/**
 * Attach Product VAT label
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addProductVATLabel",
    fire: function () {
        /** Set Template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductVATLabel"), "landingProductVATLabel", true);
    }
});


/**
 *  search request fire 
 */

/** add landing init */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "search-landing-init",
    fire: function () {
        /** read query param */
        if (klevu.dom.find(".klevuCategoryPage").length) {

            var klevu_pageCategory = sessionStorage.getItem("klevu_pageCategory");
            var klevu_userLandingFilterResults = sessionStorage.getItem("klevu_userLandingFilterResults");

            sessionStorage.removeItem("klevu_pageCategory");
            sessionStorage.removeItem("klevu_userLandingFilterResults");

            if (klevu_pageCategory || klevu_userLandingFilterResults) {
                klevu.search.categoryLanding.setTarget(klevu.dom.find(".klevuCategoryPage")[0]);
                klevu.setSetting(klevu.search.categoryLanding.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
                klevu.setSetting(klevu.search.categoryLanding.getScope().settings, "settings.search.minChars", 0);

                klevu.setSetting(klevu.search.categoryLanding.getScope().settings, "settings.search.categoryPath", klevu_pageCategory);
                klevu.setSetting(klevu.search.categoryLanding.getScope().settings, "settings.search.categoryFilters", klevu_userLandingFilterResults);

                var tempElement = klevu.search.categoryLanding.getScope().element;
                tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
                klevu.event.fireChain(tempElement.kScope, "chains.events.keyUp", tempElement, tempElement.kScope.data, null);
            }

        }
    }
});


/**
 * facets module build event
 */
klevu.coreEvent.build({
    name: "facetsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.facets ||
            !klevu.search.modules.facets.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Event to add promotion banners to landing page
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "eventAddPromotionBannerLandingPage",
    fire: function () {

        var landing_promo_banners = [{
                default: true,
                id: "001",
                name: "Default Shirts banner",
                src: "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men/shirts.html"
            },
            {
                id: "002",
                name: "shirts banner",
                term: "shirts",
                src: "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/slide-3.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men.html"
            }
        ];

        var landingPromoBanners = klevu.dictionary("promo-banners");
        landingPromoBanners.mergeFromGlobal();
        landingPromoBanners.addElement("landing", JSON.stringify(landing_promo_banners));
        landingPromoBanners.mergeToGlobal();

        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingPromotionBanner"), "klevuLandingPromotionBanner", true);
        klevu.search.categoryLanding.getScope().chains.template.render.addBefore("renderResponse", {
            name: "appendBanners",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    data.template.banners = [];

                    var defaultBanner;
                    var isDefaultAppear = true;
                    var bannerList = [];
                    var landingPromoBanners = klevu.dictionary("promo-banners");
                    landingPromoBanners.mergeFromGlobal();
                    var landingElement = landingPromoBanners.getElement("landing");
                    if (landingElement && landingElement.length && landingElement != "landing") {
                        landingElement = JSON.parse(landingElement);
                        if (landingElement && landingElement.length) {
                            bannerList = landingElement;
                        }
                    }
                    if (bannerList.length) {
                        klevu.each(bannerList, function (index, value) {
                            if (value.default) {
                                defaultBanner = value;
                            }
                            if (data.context.term == value.term) {
                                data.template.banners.push(value);
                                isDefaultAppear = false;
                            }
                        });
                        if (isDefaultAppear && defaultBanner) {
                            data.template.banners.push(defaultBanner);
                        }
                    }
                }
            }
        });
    }
});

/**
 * Facets implementation
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "addFacetsOnLandingPage",
    fire: function () {

        /** Load filters template */
        klevu.search.categoryLanding.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);

        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "initializeFilterLeft",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
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

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {
        /**
         * Event to update product image url for magento store 
         */
        klevu.search.categoryLanding.getScope().chains.template.process.success.add({
            name: "updateProductImagePath",
            fire: function (data, scope) {
                var productDataModification = klevu.search.modules.productDataModification;
                if (productDataModification) {
                    productDataModification.base.updateImagePath(scope.kScope);
                }
            }
        });
    }
});

/**
 * Attach code event to landing page analytics
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachSearchResultLandingPageAnalyticsEvents",
    fire: function () {

        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "attachAnalyticsActionEvent",
            fire: function (data, scope) {

                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuMeta", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        data.context.section = value.dataset.section;
                        scope.kScope.data.context.section = value.dataset.section;
                    });
                }, true);

                var tabStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                if (tabStorage && tabStorage.tabs) {
                    tabStorage.tabs.setStorage("local");
                    tabStorage.tabs.mergeFromGlobal();
                    var currentSection = tabStorage.tabs.getElement("active");
                    if (currentSection && currentSection.length) {
                        data.context.section = currentSection;
                        scope.kScope.data.context.section = currentSection;
                    }
                } else {
                    if (klevu.dom.find(".klevuMeta", target)[0]) {
                        klevu.dom.find(".klevuMeta", target)[0].click();
                    }
                }


                //TO-DO: Add Category analytics

                var termOptions = klevu.analyticsUtil.base.getTermOptions(scope.kScope, true);
                if (termOptions.klevu_src) {
                    termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;template:landing]]");
                    if (termOptions.filters) {
                        termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;source:filters]]");
                    }
                }

                delete termOptions.filters;
                klevu.analyticsEvents.term(termOptions);

                klevu.analyticsUtil.base.registerLandingProductClickEvent(
                    scope.kScope,
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );



            }
        });
    }
});

/**
 * Klevu analyticsUtil base extension
 */
klevu.coreEvent.attach("analyticsPowerUp", {
    name: "extAddToCartAnalyticsUtil",
    fire: function () {

        /**
         * Function to register analytics on landing page add to cart button
         * @param {*} scope 
         * @param {*} className 
         * @param {*} dictionary 
         * @param {*} element 
         */
        function registerProductAddToCartClickEvent(scope, className, dictionary, element) {
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(className, target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                    if (parent === null) {
                        return;
                    }
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
                                termOptions.klevu_src = "[[shortlist:add-to-cart;;template:landing]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            registerProductAddToCartClickEvent: registerProductAddToCartClickEvent
        });

    }
});


/**
 * Function to attach analytics event on add to cart button
 */
klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachLandingProductAddToCartButtonAnalytics",
    fire: function () {

        /**
         * Event to bind analytics on add to cart click event
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "bindAnalyticsOnAddToCartButtonEvent",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerProductAddToCartClickEvent(
                    scope.kScope,
                    ".kuAddtocart",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );
            }
        });
    }
});

/**
 * Klevu AnalyticsUtil base extension for Product Quick view
 */

klevu.coreEvent.attach("analyticsPowerUp", {
    name: "extProductQuickViewAnalyticsUtil",
    fire: function () {
        /**
         * Function to register event on product click quick view button click event
         * @param {*} scope 
         * @param {*} srcTerm 
         */
        function registerLandingProductQuickViewClickEvent(scope, srcTerm) {
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                    if (parent === null) {
                        return;
                    }
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
                                termOptions.klevu_src = "[[" + srcTerm + "]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsEvents.click(termOptions);
                            }
                        }
                    }
                });
            });
        }

        /**
         * Function to register click event in quick view
         * @param {*} scope 
         * @param {*} srcTerm 
         * @param {*} className 
         * @param {*} dictionary 
         * @param {*} element 
         */
        function registerQuickViewButtonClickEvent(scope, srcTerm, className, dictionary, element) {
            var target = klevu.dom.find(".kuModal")[0];
            klevu.each(klevu.dom.find(className, target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var productId = target.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;" + srcTerm + "]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            registerLandingProductQuickViewClickEvent: registerLandingProductQuickViewClickEvent,
            registerQuickViewButtonClickEvent: registerQuickViewButtonClickEvent
        });
    }
});


/**
 *  Product Quick view attach analytics 
 */

klevu.coreEvent.attach("setRemoteConfigCategoryLanding", {
    name: "attachProductQuickViewAnalytics",
    fire: function () {

        /**
         * Attach events for quick view button
         */
        klevu.search.categoryLanding.getScope().chains.template.events.add({
            name: "bindAnalyticsOnProductQuickView",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerLandingProductQuickViewClickEvent(
                    scope.kScope,
                    "source:quick-view;;template:landing"
                );
            }
        });

        klevu.search.categoryLanding.getScope().chains.quickView.add({
            name: "bindAnalyticsOnProductQuickViewEvents",
            fire: function (data, scope) {

                klevu.analyticsUtil.base.registerQuickViewButtonClickEvent(
                    scope.kScope,
                    "source:quick-view",
                    ".kuModalProductURL",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );

                klevu.analyticsUtil.base.registerQuickViewButtonClickEvent(
                    scope.kScope,
                    "source:quick-view;;shortlist:add-to-cart",
                    ".kuModalProductCart",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );
            }
        });

    }
});