//build event chain to check when quick is powered up
klevu.coreEvent.build({
    name : "setRemoteConfigQuick",
    fire: function(){
        if (
            !klevu.getSetting(klevu.settings,"settings.localSettings",false) ||
            klevu.isUndefined(klevu.search.extraSearchBox) ||
            (klevu.search.extraSearchBox.length == 0)
        ) {return false;}return true;
    },
    maxCount: 500,
    delay:30

});

// add templates
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-templates" ,
    fire: function(){
        //set templates
        klevu.each(klevu.search.extraSearchBox,function(key,box){
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
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-click-out" ,
    fire: function(){
        klevu.coreEvent.attach("buildSearch",{
            name:"clickOutEvent",
            fire: function(){
                klevu.settings.chains.documentClick.add({
                    name: "hideOverlay",
                    fire: function(data, scope) {
                        if(klevu.search.active) {
                            var fullPage =  klevu.getSetting(klevu.search.active.getScope().settings,"settings.search.fullPageLayoutEnabled",true);
                            if(!fullPage){
                                var target =  klevu.getSetting(klevu.search.active.getScope().settings,"settings.search.searchBoxTarget");
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
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-locale" ,
    fire: function(){
        //add translations
        var translatorQuick = klevu.search.quick.getScope().template.getTranslator();
        translatorQuick.addTranslation("Search","Search");
        translatorQuick.addTranslation("<b>%s</b> productList","<b>%s</b> Products");
        translatorQuick.addTranslation("<b>%s</b> contentList","<b>%s</b> Other results");
        translatorQuick.mergeToGlobal();

        //set currency
        var currencyQuick = klevu.search.quick.getScope().currency;

        currencyQuick.setCurrencys({
            'GBP' : { string : "£", format: "%s%s", atEnd: false, precision: 2, thousands: ",", decimal: ".", grouping: 3 },
            'USD' : { string : "USD", atEnd: true },
            'EUR' : { string : "EUR", format: "%s %s", atEnd: true },
        });
        currencyQuick.mergeToGlobal();
    }
});
// attach all klevu chains
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-chains" ,
    fire: function(){
        klevu.each(klevu.search.extraSearchBox,function(key,box){
            //get the global translations
            box.getScope().template.getTranslator().mergeFromGlobal();
            //get the global currency
            box.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
            //what to do when you focus on a search
            box.getScope().chains.events.focus.add({
                name: "displayOverlay",
                fire: function(data, scope) {
                    var target =  klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                    target.style = "display: block !important;";

                }
            });
            box.getScope().chains.events.focus.add({
                name:"doSearch",
                fire:function(data,scope){
                    var chain = klevu.getObjectPath(scope.kScope , "chains.actions.doSearch");

                    if(!klevu.isUndefined(chain) &&  chain.list().length  !== 0){
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if(data.context.preventDefault === true) return false;
                }
            });

            // what will the request look for
            box.getScope().chains.request.build.add({
                name: "addAutosugestions",
                fire: function(data, scope) {
                  if(data.context.term){
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                    var suggestion = klevu.extend( true , {}, parameterMap.suggestions );

                    suggestion.id= "autosuggestion";
                    suggestion.query = data.context.term;
                    suggestion.typeOfRequest= "AUTO_SUGGESTIONS";
                    suggestion.limit= 3;

                    data.request.current.suggestions.push(suggestion);
                    data.context.doSearch = true;
                  }
                }
            });

            box.getScope().chains.request.build.add({
                name: "addCategoryCompressed",
                fire: function(data, scope) {
                  if(data.context.term){
                  
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var categoryCompressed = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    categoryCompressed.id = "categoryCompressed";
                    categoryCompressed.typeOfRequest = "SEARCH";
                    categoryCompressed.settings.query.term  = data.context.term;
                    categoryCompressed.settings.typeOfRecords = ["KLEVU_CATEGORY"];
                    categoryCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    categoryCompressed.settings.fields = ["id","name","shortDesc","url","typeOfRecord"];
                    categoryCompressed.settings.limit = 3;
                    categoryCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(categoryCompressed);

                    data.context.doSearch = true;
                    }

                }
            });
            box.getScope().chains.request.build.add({
                name: "addCmsCompressed",
                fire: function(data, scope) {
                  if(data.context.term){
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var cmsCompressed = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    cmsCompressed.id = "cmsCompressed";
                    cmsCompressed.typeOfRequest = "SEARCH";
                    cmsCompressed.settings.query.term  = data.context.term;
                    cmsCompressed.settings.typeOfRecords = ["KLEVU_CMS"];
                    cmsCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    cmsCompressed.settings.fields = ["id","name","shortDesc","url","typeOfRecord"];
                    cmsCompressed.settings.limit = 3;
                    cmsCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(cmsCompressed);

                    data.context.doSearch = true;
                  }
                }
            });

            box.getScope().chains.request.build.add({
                name: "addProductList",
                fire: function(data, scope) {
                  if(data.context.term){
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var productList = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    productList.id = "productList";
                    productList.typeOfRequest = "SEARCH";
                    productList.settings.query.term  = data.context.term;
                    productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                    productList.settings.fallbackQueryId = "productListFallback";
                    productList.settings.limit = 3;
                    productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    productList.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(productList);

                    data.context.doSearch = true;
                  }

                }
            });
            box.getScope().chains.request.build.add({
                name: "addProductListFallback",
                fire: function(data, scope) {
                  if(data.context.term){
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    //setquery type
                    var productListFallback = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    productListFallback.id = "productListFallback";
                    productListFallback.typeOfRequest = "SEARCH";
                    productListFallback.isFallbackQuery = "true";
                    productListFallback.settings.query.term  = "*";
                    productListFallback.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                    productListFallback.settings.searchPrefs = ["excludeDescription","searchCompoundsAsAndQuery"];
                    productListFallback.settings.limit = 3;
                    productListFallback.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(productListFallback);


                    data.context.doSearch = true;
                  }

                }
            });
          
            // where to render the responce
            box.getScope().chains.template.render.add({
                name: "renderResponse",
                fire: function(data, scope) {
                    if(data.context.isSuccess){
                        scope.kScope.template.setData(data.template);
                        var targetBox = "klevuTemplateBase";
                        var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                        var target = klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                        target.innerHTML = '';
                        //todo: Need extraPolyfill.js
                        target.classList.add("klevuTarget");
                        scope.kScope.element.kData = data.template;
                        scope.kScope.template.insertTemplate(target, element);
                    }
                }
            });

            // where to position the templace
            box.getScope().chains.template.render.add({
                name: "positionTemplate",
                fire: function(data, scope) {
                    var target =  klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                    var positions = scope.kScope.element.getBoundingClientRect();
                    klevu.dom.find(".klevuWrap",target)[0].style = "top:"+positions.bottom+"px;left: "+((positions.right - 500)>0?(positions.right - 500):0)+"px;right: auto;";
                }
            });

            // overide form action
            box.getScope().element.kElem.form.action = klevu.getSetting(box.getScope().settings,"settings.url.landing", false);
        });
    }
});


/**
 * Add to cart base component
 */

klevu.interactive(function () {

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

});

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
 * Color swatch base extension
 */

klevu.interactive(function () {

    /**
     * Function to prepare keyvalue pair object
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
});


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
 * Extend addToCart base module for quick search
 */

klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForQuickSearch",
    fire: function () {

        /**
         * Quick search Add to cart button click event
         * @param {*} ele 
         * @param {*} event 
         * @param {*} productList 
         */
        function attachQuickProductAddToCartBtnEvent(ele, event, productList) {
            event = event || window.event;
            event.preventDefault();

            var selected_product;
            var target = klevu.dom.helpers.getClosest(ele, ".klevuQuickAddtoCart");
            var productId = target.getAttribute("data-id");
            klevu.each(productList, function (key, product) {
                if (product.id == productId) {
                    selected_product = product;
                }
            });
            if (selected_product) {
                if (selected_product) {
                    klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
            }
        }

        /**
         * Function to bind events to Quick search product add to cart button
         * @param {*} scope 
         */
        function bindQuickSearchProductAddToCartBtnClickEvent(scope) {
            var self = this;
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(".klevuQuickCartBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(this, ".klevuQuickSearchResults");
                    if (parent && parent.dataset && parent.dataset.section) {
                        var productList = klevu.getObjectPath(scope.data.template.query, parent.dataset.section);
                        self.attachQuickProductAddToCartBtnEvent(this, event, productList.result);
                    }
                });
            });
        }

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindQuickSearchProductAddToCartBtnClickEvent: bindQuickSearchProductAddToCartBtnClickEvent,
            attachQuickProductAddToCartBtnEvent: attachQuickProductAddToCartBtnEvent
        });
    }
});

/**
 *  Add to cart button functionality on quick search
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addAddToCartButtonQuickSearch",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            /** Set Template */
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickSearchProductAddToCart"), "quickSearchProductAddToCart", true);

            /** Bind quick page add to cart button click event */
            box.getScope().chains.template.events.add({
                name: "quickSearchProductAddToCartEvent",
                fire: function (data, scope) {
                    klevu.search.modules.addToCart.base.bindQuickSearchProductAddToCartBtnClickEvent(scope.kScope);
                }
            });
        });
    }
});



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
                    klevu_term: mainScope.data.context.term,
                    klevu_pageNumber: 1,
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
                        analyticsTermOptions.klevu_limit = reqQueryObj.settings.limit;
                        analyticsTermOptions.klevu_sort = reqQueryObj.settings.sort;
                        analyticsTermOptions.klevu_src = "[[typeOfRecord:" + reqQueryObj.settings.typeOfRecords[0] + "]]";

                    }
                }
                var resQueries = mainScope.data.response.current.queryResults;
                if (resQueries) {
                    var resQueryObj = resQueries.filter(function (obj) {
                        return obj.id == currentSection;
                    })[0];
                    if (resQueryObj) {

                        analyticsTermOptions.klevu_totalResults = resQueryObj.meta.totalResultsFound;
                        analyticsTermOptions.klevu_typeOfQuery = resQueryObj.meta.typeOfSearch;

                        var productListLimit = resQueryObj.meta.noOfResults;
                        analyticsTermOptions.klevu_pageNumber = Math.ceil(resQueryObj.meta.offset / productListLimit) + 1;

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

/**
 * Quick search extension for Analytics utility
 */
klevu.extend({
    analyticsUtilsQuickSearch: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.quick = {
            /**
             * Function to bind and fire analytics event on Quick Search products
             */
            fireAnalyticsOnProducts: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".trackProductClick", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var productId = value.dataset.id;
                        var searchResultContainer = klevu.dom.find(".klevuQuickSearchResults", target)[0];
                        var dataSection;
                        if (searchResultContainer) {
                            dataSection = searchResultContainer.dataset.section;
                        }
                        if (!dataSection) {
                            return;
                        }
                        mainScope.data.context.section = dataSection;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope);
                            if (product) {
                                var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                                if (termOptions) {
                                    event = event || window.event;
                                    event.preventDefault();
                                    termOptions.klevu_keywords = termOptions.klevu_term;
                                    termOptions.klevu_productId = product.id;
                                    termOptions.klevu_productName = product.name;
                                    termOptions.klevu_productUrl = product.url;
                                    termOptions.klevu_src = "[[typeOfRecord:"+product.typeOfRecord + ";;template:quick-search]]";
                                    delete termOptions.klevu_term;
                                    klevu.analyticsEvents.click(termOptions);
                                    setTimeout(function () {
                                        window.location = product.url;
                                    }, 600);
                                }
                            }
                        }
                    }, true);
                });
            },
            /**
             * Function to bind and fire analytics event on Quick Search Categories
             */
            fireAnalyticsOnCategoriesAndPages: function (containerClass, dataListId) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(containerClass, target), function (key, value) {
                    klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, catEle) {
                        klevu.event.attach(catEle, "mousedown", function (event) {
                            var url = catEle.dataset.url;
                            var catName = catEle.dataset.name;
                            var category = mainScope.analyticsUtils.base.getDetailsFromURLAndName(url, catName, mainScope, dataListId);
                            var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = category.id;
                                termOptions.klevu_productName = category.name;
                                termOptions.klevu_productUrl = category.url;
                                termOptions.klevu_src = "[[typeOfRecord:"+category.typeOfRecord + ";;template:quick-search]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsEvents.click(termOptions);
                            }
                        });
                    });
                });
            },
            /**
             * Function to bind and fire analytics event on Auto suggestion items
             */
            fireAnalyticsOnSuggestions: function (containerClass) {

                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(containerClass, target), function (key, value) {
                    klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, sugEle) {
                        klevu.event.attach(sugEle, "click", function (event) {
                            event = event || window.event;
                            event.preventDefault();
                            var suggestionText = sugEle.dataset.content;
                            var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                            if (termOptions) {
                                termOptions.klevu_originalTerm = termOptions.term;
                                termOptions.klevu_term = suggestionText;
                                termOptions.klevu_src = "[[template:ac-suggestions]]";
                                klevu.analyticsEvents.term(termOptions);
                            }
                            setTimeout(function () {
                                window.location = sugEle.getAttribute("href");
                            }, 600);
                        });
                    });
                });
            }
        };
    }
});

/**
 * Attach core event to add quick search analytics
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachQuickSearchAnalyticsEvents",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            /**
             * Initialize analytics utility
             */
            klevu.analyticsUtilsQuickSearch(box.getScope().element.kScope);
            box.getScope().element.kScope.analyticsReqTimeOut = null;

            /**
             * Send term request for anaytics
             */
            box.getScope().chains.response.ajax.done.add({
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
                        var termOptions = box.getScope().analyticsUtils.base.getTermOptions();
                        if (termOptions) {
                            if(termOptions.klevu_src){
                              termOptions.klevu_src = termOptions.klevu_src.replace("]]",";;template:quick-search]]");
                            }                            
                            klevu.analyticsEvents.term(termOptions);
                        }
                        box.getScope().element.kScope.analyticsReqTimeOut = null;
                    }, 300);
                }
            });

            /**
             * Function to add result product click analytics
             */
            box.getScope().chains.template.render.add({
                name: "doResultProductsAnalytics",
                fire: function (data, scope) {
                    /**
                     * Event to fire on quick search product click
                     */
                    box.getScope().analyticsUtils.quick.fireAnalyticsOnProducts();
                    box.getScope().analyticsUtils.quick.fireAnalyticsOnCategoriesAndPages(".klevuCategorySuggestions", "categoryCompressed");
                    box.getScope().analyticsUtils.quick.fireAnalyticsOnCategoriesAndPages(".klevuCmsSuggestions", "cmsCompressed");
                    box.getScope().analyticsUtils.quick.fireAnalyticsOnSuggestions(".klevuAutosuggestions");
                }
            });
        });
    }
});

/**
 * Event to add trending products template and request
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachTrendingProducts",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTrendingProductBlock"), "klevuQuickTrendingProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuTrendingProducts"), "klevuTrendingProducts", true);

            box.getScope().chains.request.build.add({
                name: "addTrendingProductsList",
                fire: function (data, scope) {
                    if (!data.context.term) {
                        data.context.term = "*";
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var trendingProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        trendingProductList.id = "trendingProductList";
                        trendingProductList.typeOfRequest = "SEARCH";
                        trendingProductList.settings.query.term = data.context.term;
                        trendingProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        trendingProductList.settings.limit = 3;
                        trendingProductList.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(trendingProductList);
                        data.context.doSearch = true;
                    }
                }
            });
        });
    }
});

/**
 * Event to add promotional banner for quick search result
 */


klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventPromotionalBanners",
    fire: function () {

        var quick_promo_banners = [{
                default: true,
                id: "001",
                name: "Default Shirts banner",
                src: "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men/shirts.html"
            },
            {
                id: "002",
                name: "Bags banner",
                term: "bags",
                src: "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/homepage-three-column-promo-03.png",
                click: "https://demo.ksearchmisc.com/klevusearch/accessories/bags-luggage.html"
            }
        ];

        var quickPromoBanners = klevu.dictionary("promo-banners");
        quickPromoBanners.mergeFromGlobal();
        quickPromoBanners.addElement("quick", JSON.stringify(quick_promo_banners));
        quickPromoBanners.mergeToGlobal();

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPromotionBanner"), "klevuQuickPromotionBanner", true);

            box.getScope().chains.template.render.addBefore("renderResponse", {
                name: "appendBanners",
                fire: function (data, scope) {
                    if (data.context.isSuccess) {
                        data.template.banners = [];

                        var defaultBanner;
                        var isDefaultAppear = true;
                        var bannerList = [];
                        var quickPromoBanners = klevu.dictionary("promo-banners");
                        quickPromoBanners.mergeFromGlobal();
                        var quickElement = quickPromoBanners.getElement("quick");
                        if (quickElement && quickElement.length && quickElement != "quick") {
                            quickElement = JSON.parse(quickElement);
                            if (quickElement && quickElement.length) {
                                bannerList = quickElement;
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

        });
    }
});

/**
 * Add recently viewed products in Quick search results
 */

klevu.interactive(function () {

    /**
     * Function to register entry in local storage
     * @param {*} scope 
     * @param {*} productId 
     */
    function registerRecentlyViewedProducts(scope, productId) {
        var self = this;
        var recentlyViewedDirectory = self.storage.dictionary;
        recentlyViewedDirectory.setStorage("local");
        recentlyViewedDirectory.mergeFromGlobal();

        var productIdList = recentlyViewedDirectory.getElement(self.storage.products);
        if (productIdList && productIdList.length && productIdList != self.storage.products) {
            productIdList = JSON.parse(productIdList);

            klevu.each(productIdList, function (key, value) {
                if (value == productId) {
                    productIdList.splice(key, 1);
                }
            });
            productIdList.push(productId);

            if (productIdList.length > self.storage.limit) {
                productIdList.splice(0, 1);
            }
            recentlyViewedDirectory.addElement(self.storage.products, JSON.stringify(productIdList));
        } else {
            recentlyViewedDirectory.addElement(self.storage.products, JSON.stringify([productId]));
        }

        recentlyViewedDirectory.mergeToGlobal();
    };

    /**
     * Function to bind product click event for adding id in local storage.
     * @param {*} scope 
     * @param {*} className 
     */
    function bindProductClickForRecentView(scope, className) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                if (ele.dataset && ele.dataset.id) {
                    self.registerRecentlyViewedProducts(scope, ele.dataset.id);
                }
            });
        });
    };

    /**
     * Function to get stored recent viewed product id list
     */
    function getProductIdList() {
        var self = this;
        var recentlyViewedDirectory = self.storage.dictionary;
        recentlyViewedDirectory.setStorage("local");
        recentlyViewedDirectory.mergeFromGlobal();
        var productIdList = recentlyViewedDirectory.getElement(self.storage.products);
        if (productIdList && productIdList.length && productIdList != self.storage.products) {
            productIdList = JSON.parse(productIdList);
            return productIdList;
        } else {
            return [];
        }
    };

    var recentViewedProducts = {
        storage: {
            limit: 3,
            dictionary: klevu.dictionary("recent-viewed"),
            products: "products"
        },
        bindProductClickForRecentView: bindProductClickForRecentView,
        registerRecentlyViewedProducts: registerRecentlyViewedProducts,
        getProductIdList: getProductIdList
    };

    klevu.extend(true, klevu.search.modules, {
        recentViewedProducts: {
            base: recentViewedProducts
        }
    });

});

/**
 * Event to add recent viewed products
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventRecentViewedProducts",
    fire: function () {

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickRecentViewedProductBlock"), "klevuQuickRecentViewedProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuRecentViewedProducts"), "klevuRecentViewedProducts", true);

            box.getScope().chains.request.build.add({
                name: "addRecentViewedProductsList",
                fire: function (data, scope) {
                    var recentViewedProductIdList = klevu.search.modules.recentViewedProducts.base.getProductIdList();
                    if (recentViewedProductIdList.length && (!data.context.term || data.context.term == "*")) {
                        var limit = recentViewedProductIdList.length;
                        recentViewedProductIdList = recentViewedProductIdList.join(",");
                        data.context.term = recentViewedProductIdList;
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var trendingProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        trendingProductList.id = "recentViewedProductList";
                        trendingProductList.typeOfRequest = "SEARCH";
                        trendingProductList.settings.query.term = data.context.term;
                        trendingProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        trendingProductList.settings.limit = limit;
                        data.request.current.recordQueries.push(trendingProductList);
                        data.context.doSearch = true;
                    }
                }
            });

            box.getScope().chains.template.render.addAfter("renderResponse", {
                name: "bindRecentViewProductClick",
                fire: function (data, scope) {
                    klevu.search.modules.recentViewedProducts.base.bindProductClickForRecentView(
                        scope.kScope,
                        ".kuTrackRecentView"
                    );
                }
            });

        });
    }
});
