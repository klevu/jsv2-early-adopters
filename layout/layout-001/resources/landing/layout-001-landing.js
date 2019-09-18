//build event chain to check when landing is powered up
klevu.coreEvent.build({
    name : "setRemoteConfigLanding",
    fire: function(){
        if ( !klevu.getSetting(klevu.settings,"settings.localSettings",false) ||
            klevu.isUndefined(klevu.search.landing)) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay:30

});

//attach locale settings
// klevu.coreEvent.attach("setRemoteConfigLanding",{
//     name: "search-landing-locale" ,
//     fire: function(){
//         //get the global translations
//         klevu.search.landing.getScope().template.getTranslator().mergeFromGlobal();
//         //get the global currency
//         klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
//      	console.log(klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().getGlobal());
//     }
// });


//attach locale settings
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-locale" ,
    fire: function(){
        //add translations
        var translatorLanding = klevu.search.landing.getScope().template.getTranslator();
        translatorLanding.addTranslation("Search","Search");
        translatorLanding.addTranslation("<b>%s</b> productList","<b>%s</b> Products");
        translatorLanding.addTranslation("<b>%s</b> contentList","<b>%s</b> Other results");
        translatorLanding.mergeToGlobal();

        //set currency
        //var currencyQuick = klevu.search.landing.getScope().currency;
      	var currencyLanding = klevu.search.landing.getScope().template.getTranslator().getCurrencyObject();

        currencyLanding.setCurrencys({
            'GBP' : { string : "£", format: "%s%s", atEnd: false, precision: 2, thousands: ",", decimal: ".", grouping: 3 },
            'USD' : { string : "USD", atEnd: true },
            'EUR' : { string : "EUR", format: "%s %s", atEnd: true },
        });
        currencyLanding.mergeToGlobal();
    }
});


// add templates
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-templates" ,
    fire: function(){
        //set templates
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateBase"), "klevuTemplateLanding", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateNoResultFound"), "noResultFound", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplatePagination"), "pagination", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResults"), "results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateProductBlock"), "productBlock", true);
      	klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);
    }
});
// add chain extensions
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-chains" ,
    fire: function(){
      
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductList",
            fire: function(data, scope) {;
                var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var productList = klevu.extend( true , {}  , parameterMap.recordQuery );
                var quickStorage = klevu.getSetting(scope.kScope.settings , "settings.storage");

                //setquery type
                productList.id = "productList";
                productList.typeOfRequest = "SEARCH";
                productList.settings.query.term  = data.context.term;
                productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                productList.settings.limit = 12;
                productList.settings.fallbackQueryId = "productListFallback";
                productList.filters.filtersToReturn.enabled = true;
                productList.filters.filtersToReturn.exclude = ["onprescription","ondiscount","availableonline","availableonletter"];
              	
                data.request.current.recordQueries.push(productList);

                data.context.doSearch = true;

            }
        });
           
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductListFallback",
            fire: function(data, scope) {;
                var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

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
        }); 
      
      	
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addContentList",
            fire: function(data, scope) {;
                var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var contentList = klevu.extend( true , {}  , parameterMap.recordQuery );
                var quickStorage = klevu.getSetting(scope.kScope.settings , "settings.storage");

                contentList.id = "contentList";
                contentList.typeOfRequest = "SEARCH";
                contentList.settings.query.term  = data.context.term;
                contentList.settings.typeOfRecords = ["KLEVU_CMS"];
                contentList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                contentList.settings.limit = 12;
                contentList.filters.filtersToReturn.enabled = true;
              
                data.request.current.recordQueries.push(contentList);
				
                data.context.doSearch = true;
            }
        });

        // where to render the responce
        klevu.search.landing.getScope().chains.template.render.add({
            name: "renderResponse",
            fire: function(data, scope) {
                if(data.context.isSuccess){                  
                  
                    scope.kScope.template.setData(data.template);
                    var targetBox = "klevuTemplateLanding";
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

        //add collapsable filters
        klevu.search.landing.getScope().chains.template.events.add({
            name: "colapsableFilters",
            fire: function(data, scope) {
                var target = klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                //add colapsable filters
                klevu.each(klevu.dom.find(".kuFilterHead",target), function(key, value) {
                    // onclick
                    klevu.event.attach(value,"click",function(event){
                        event = event || window.event;
                        event.preventDefault();
                        this.classList.toggle("kuCollapse");
                        this.classList.toggle("kuExpand");

                        var parentElem = klevu.dom.helpers.getClosest(this,".kuFilterBox");
                        klevu.each(klevu.dom.find(".kuFilterNames",parentElem), function(key, value) {
                            value.classList.toggle("kuFilterCollapse");
                            value.classList.remove("kuFilterShowAll");
                        });

                    });
                });
                //add expandable filters
                klevu.each(klevu.dom.find(".kuShowOpt",target), function(key, value) {
                    // onclick
                    klevu.event.attach(value,"click",function(event){
                        event = event || window.event;
                        event.preventDefault();

                        var parentElem = klevu.dom.helpers.getClosest(this,".kuFilterBox");
                        klevu.each(klevu.dom.find(".kuFilterNames",parentElem), function(key, value) {
                            value.classList.toggle("kuFilterShowAll");
                        });

                    });
                });
            }
        });      
      
      	// multi-select filters (except for category)
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processFilters",
            fire: function(data, scope) {
                var list = ["productList","contentCompressed"];
                klevu.each(list,function(key,value){
                    var items = klevu.getObjectPath(data.template.query,value);
                    if (!klevu.isUndefined(items)) {
                        klevu.each(items.filters, function(keyFilter, filter) {
                            filter.multiselect = false;
                            if(filter.key != 'category') {
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
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-template-helpers" ,
    fire: function(){
        //add extra helpers
        var quickStorage = klevu.getSetting(klevu.settings , "settings.storage");
        klevu.search.landing.getScope().template.setHelper("cropText",function cropText(textValue,length){
            if(textValue.length <= length) return textValue;
            return textValue.substring(0, length) + "...";
        });
        klevu.search.landing.getScope().template.setHelper("hasResults",function hasResults(data,name){
            if(data.query[name]) {
                if( data.query[name].result.length > 0 ) return true;
            }
            return false;
        });
    }
});




klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-sort",
    fire: function () {
        var options = {
            storage: {
                sort: klevu.dictionary("sort")
            }
        };
        klevu(options);

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateSortBy"), "sortBy", true);

        klevu.search.landing.getScope().chains.request.build.add({
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

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.sort.setStorage("local");
        storage.sort.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getSortBy", function (name) {
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

        klevu.search.landing.getScope().chains.template.events.add({
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


klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-limit",
    fire: function () {
        var options = {
            storage: {
                limits: klevu.dictionary("limits")
            }
        };
        klevu(options);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateLimit"), "limit", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "setLimits",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var limit = (landingStorage.limits.getElement(query.id) == query.id) ? false : landingStorage.limits.getElement(query.id);
                    if (limit) {
                        query.settings.limit = limit;
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.limits.setStorage("local");
        storage.limits.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getLimit", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var limit = (landingStorage.limits.getElement(name) == name) ? 12 : landingStorage.limits.getElement(name);
            return limit;
        });

        klevu.search.landing.getScope().chains.template.events.add({
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


klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-tabs",
    fire: function () {

        var options = {
            storage: {
                tabs: klevu.dictionary("tabs")
            }
        };
        klevu(options);

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.tabs.setStorage("local");
        storage.tabs.mergeFromGlobal();

        /** set templates */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTabResults"), "tab-results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateContentBlock"), "contentBlock", true);

        /** Tab results list */
        klevu.search.landing.getScope().tabResultsList = ['productList', 'contentList'];

        /** move object attribute */
        klevu.search.landing.getScope().moveObjectElement = function (currentKey, afterKey, obj) {
            var result = {};
            var val = obj[currentKey];
            delete obj[currentKey];
            var next = -1;
            var i = 0;
            if (typeof afterKey == 'undefined' || afterKey == null) afterKey = '';

            Object.keys(obj).forEach(function (key) {
                var k = key;
                var v = obj[key];
                if ((afterKey == '' && i == 0) || next == 1) {
                    result[currentKey] = val;
                    next = 0;
                }
                if (k == afterKey) {
                    next = 1;
                }
                result[k] = v;
                ++i;

            });

            if (next == 1) {
                result[currentKey] = val;
            }
            if (next !== -1) {
                return result;
            } else {
                return obj;
            };
        }


        // add the tab text name to the query data
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processTabs",
            fire: function (data, scope) {
                if (klevu.search.landing.getScope().tabResultsList && klevu.search.landing.getScope().tabResultsList.length) {
                    var tempTabList = [];
                    klevu.each(klevu.search.landing.getScope().tabResultsList, function (key, value) {
                        var items = klevu.getObjectPath(data.template.query, value);
                        if (!klevu.isUndefined(items)) {
                            items.id = value;
                            items.tab = true;
                            items.tabText = "<b>%s</b> " + value;
                            items.sort = key + 1;
                            tempTabList.push(items);
                        }
                    });
                    if (tempTabList.length) {
                        tempTabList.sort(function (a, b) {
                            return b.sort - a.sort;
                        });
                        tempTabList.forEach(function (tabObj) {
                            data.template.query = klevu.search.landing.getScope().moveObjectElement(tabObj.id, '', data.template.query);
                        });
                    }
                }
            }
        });

        klevu.search.landing.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });

        /**
         * Function to initialize tab selection
         */
        klevu.search.landing.getScope().initializeTabSelection = function (data, scope, target) {
            var isTabSelected;
            klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
                var selectedTab = landingStorage.tabs.getElement("active");
                value.classList.remove("kuTabSelected");
                if (selectedTab && this.dataset && this.dataset.section) {
                    if (selectedTab == this.dataset.section) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(this, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        klevuWrap.classList.add(this.dataset.section + "Active");
                        isTabSelected = true;
                    }
                }
            });
            if (!isTabSelected) {
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    value.classList.remove("kuTabSelected");
                    if (key == 0) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(this, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        klevuWrap.classList.add(this.dataset.section + "Active");
                    }
                });
            }
        };

        //tab swap
        klevu.search.landing.getScope().chains.template.events.add({
            name: "tabContent",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.search.landing.getScope().initializeTabSelection(data, scope, target);
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    // onclick
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();

                        //getScope
                        var section = klevu.dom.helpers.getClosest(this, ".klevuWrap");
                        if (section === null) {
                            return;
                        }
                        //removeSelectionFromAllTabs
                        klevu.each(klevu.dom.find(".kuTab.kuTabSelected", section), function (key, value) {
                            value.classList.remove("kuTabSelected");
                            section.classList.remove(value.dataset.section + "Active");
                        });

                        //add Selection to current tab
                        this.classList.add("kuTabSelected");
                        section.classList.add(this.dataset.section + "Active");

                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.tabs.addElement("active", this.dataset.section);
                        storageEngine.tabs.mergeToGlobal();

                        /** Initialize price filter slider on tab change */
                        klevu.search.landing.getScope().filterPriceSlider.base.initSlider(data, scope);
                    });
                });
            }
        });

    }
});

/**
 * Attach Product VAT label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductVATLabel",
    fire: function () {
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductVATLabel"), "landingProductVATLabel", true);
    }
});

/**
 * Attach Product badge
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addSearchResultProductBadges",
    fire: function () {
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductBadge"), "landingProductBadge", true);
    }
});

/**
 * Add to cart base module
 */
klevu.extend({
    addToCart: function (mainScope) {
        mainScope.addToCart = {};
        mainScope.addToCart.base = {

            /**
             * Function to update cart count UI
             * @param {*} updatedCartCount 
             */
            appendUpdatedCartCount: function (updatedCartCount) {
                if (parseInt(updatedCartCount)) {
                    var cartContainer = klevu.dom.find('[data-cart-count-bubble]');
                    if (cartContainer.length) {
                        cartContainer[0].classList.remove('hide');
                    }
                    var cartCount = klevu.dom.find('[data-cart-count]');
                    if (cartCount.length) {
                        cartCount[0].innerHTML = updatedCartCount;
                    }
                }
            },

            /**
             * Function to get total count from the response
             * @param {*} res 
             */
            getTotalCardCountFromResponse: function (res) {
                var updatedCount = 0;;
                var hiddenElement = document.createElement("div");
                hiddenElement.style.display = "none";
                hiddenElement.innerHTML = res;
                var cartCount = klevu.dom.find('[data-cart-count]', hiddenElement);
                if (cartCount.length) {
                    updatedCount = cartCount[0].innerHTML;
                }
                hiddenElement = "";
                delete hiddenElement;
                return updatedCount;
            },

            /**
             * Function to send Add to cart request
             * @param {*} variantId 
             * @param {*} quantity 
             */
            sendAddToCartRequest: function (variantId, quantity) {
                var self = this;
                var requestPayload = {
                    id: variantId,
                    quantity: quantity
                };
                klevu.ajax("/cart/add", {
                    method: "POST",
                    mimeType: "application/json; charset=UTF-8",
                    data: JSON.stringify(requestPayload),
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    crossDomain: true,
                    success: function (klXHR) {},
                    error: function (klXHR) {},
                    done: function (klXHR) {
                        self.appendUpdatedCartCount(self.getTotalCardCountFromResponse(klXHR.responseText));
                    }
                });
            }
        };
    }
});

/**
 * Event to initialize add to cart base module
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "initializeAddToCartBaseModule",
    fire: function () {
        /** Initialize add to cart base module in landing scope */
        klevu.addToCart(klevu.search.landing.getScope().element.kScope);
    }
});

/**
 * Extend addToCart base module for landing page
 */

klevu.extend({
    addToCartLanding: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.landing = {

            /**
             * Landing page Add to cart button click event
             * @param {*} ele 
             * @param {*} event 
             * @param {*} productList 
             */
            attachProductAddToCartBtnEvent: function (ele, event, productList) {
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
                        mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                    }
                }
            },

            /**
             * Function to bind events to landing page product add to cart button
             * @param {*} data 
             * @param {*} scope 
             */
            bindLandingProductAddToCartBtnClickEvent: function (data, listName) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var productList = klevu.getObjectPath(data.template.query, listName);
                klevu.each(klevu.dom.find(".kuLandingAddToCartBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.attachProductAddToCartBtnEvent(this, event, productList.result);
                    });
                });
            }
        };
    }
});

/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCardButtonLandingPage",
    fire: function () {

        /** Include addToCart base module first to use base functionalities */

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Initalize add to cart service */
        klevu.addToCartLanding(klevu.search.landing.getScope().element.kScope);

        /*
         *	Bind landing page add to cart button click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.landing.getScope().addToCart.landing.bindLandingProductAddToCartBtnClickEvent(data, "productList");
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
 * Quick view service file
 */
klevu.extend({
    quickViewService: function (mainScope) {
        mainScope.quickViewService = {
            modal: null,
            closeButton: null,
            selected_product: null,
            /*
             *	Add container for Product Quick view
             */
            appendTemplateIntoBody: function () {
                var quickViewCont = document.createElement("div");
                quickViewCont.className = "quickViewWrap productQuickView";
                window.document.body.appendChild(quickViewCont);
            },
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
                var modalElement = klevu.dom.find("div.kuModal", '.productQuickView');
                if (modalElement.length) {
                    this.modal = modalElement[0];
                    this.modal.classList.toggle("show-modal");
                }
            },
            /*
             *	Function to fire on window click event to hide modal
             */
            windowOnClick: function (event) {
                if (event.target === this.modal) {
                    this.toggleModal();
                }
            },
            /**
             * Function to bind event on close button
             */
            bindCloseBtnClick: function () {
                var self = this;
                var closeElement = klevu.dom.find(".close-button", '.productQuickView');
                if (closeElement.length) {
                    self.closeButton = closeElement[0];
                    klevu.event.attach(self.closeButton, "click", function () {
                        self.toggleModal();
                    });
                }
            },
            /**
             * Landing page onload event
             * @param {*} data 
             * @param {*} scope 
             */
            landingPageTemplateOnLoadEvent: function (data) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var selected_product_id = (this.getAttribute("data-id")) ? this.getAttribute("data-id") : null;
                        var items = klevu.getObjectPath(data.template.query, 'productList');
                        if (items.result) {
                            klevu.each(items.result, function (key, value) {
                                if (value.id == selected_product_id) {
                                    selected_product = value;
                                }
                            })
                        }
                        data.template.selected_product = selected_product;
                        var target = klevu.dom.find(".productQuickView");
                        if (target && target[0]) {
                            target[0].selected_product = selected_product;
                        }
                        klevu.event.fireChain(mainScope, "chains.quickView", mainScope.element, mainScope.data, event);
                        self.toggleModal();
                    });
                });
            }
        };
    }
});

/**
 * Add Product Quick view functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Initialize Quick view service */
        klevu.quickViewService(klevu.search.landing.getScope().element.kScope);

        /** Add Quick view wrapper container in body */
        klevu.search.landing.getScope().quickViewService.appendTemplateIntoBody();

        /** Initalize add to cart service */
        klevu.addToCartQuickView(klevu.search.landing.getScope().element.kScope);

        /*
         *	Add Quick view template and update data into that
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "chainQuickView",
            fire: function (data, scope) {
                event = event || window.event;
                event.preventDefault();
                scope.kScope.template.setData(data.template);
                var target = klevu.dom.find("div.quickViewWrap")[0];
                target.innerHTML = '';
                var element = scope.kScope.template.convertTemplate(scope.kScope.template.render("quick-view"));
                scope.kScope.template.insertTemplate(target, element);

                klevu.search.landing.getScope().quickViewService.bindCloseBtnClick();
                klevu.search.landing.getScope().addToCart.quickView.bindAddToCartEvent();
            }
        });

        /**
         *  Bind body click event
         */
        klevu.event.attach(window, "click", function (event) {
            klevu.search.landing.getScope().quickViewService.windowOnClick(event);
        });

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
                klevu.search.landing.getScope().quickViewService.landingPageTemplateOnLoadEvent(data);
            }
        });
    }
})

/**
 * Color swatch base extension
 */
klevu.extend({
    colorSwatches: function (mainScope) {
        mainScope.colorSwatches = {}
        mainScope.colorSwatches.base = {

            /**
             * Function to prepare keyvalue pair object
             * @param {*} keyValuePair 
             */
            parseKeyValuePairs: function (keyValuePair) {
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
            },

            /**
             * Function to parse swatches info data string
             * @param {*} str 
             */
            getColorSwatchesInfoFromString: function (str) {
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
            },

            /**
             * Function to update data in existing product object
             * @param {*} data 
             */
            parseProductColorSwatch: function (data, listName) {
                var self = this;
                var items = klevu.getObjectPath(data.template.query, listName);
                if (items.result) {
                    klevu.each(items.result, function (key, value) {
                        if (value.swatchesInfo && value.swatchesInfo.length) {
                            value.swatchesInfo = self.getColorSwatchesInfoFromString(value.swatchesInfo);
                        }
                    })
                }
            }
        }
    }
});

/**
 * Event to initialize color swatches base module
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "initializeColorSwatchBaseModule",
    fire: function () {
        /** Initialize color swatch base module in landing scope */
        klevu.colorSwatches(klevu.search.landing.getScope().element.kScope);
    }
});

/**
 * Color swatch landing page extension
 */
klevu.extend({
    colorSwatchesLanding: function (mainScope) {

        if (!mainScope.colorSwatches) {
            console.log("Color swatch base module is missing!");
            return;
        }

        mainScope.colorSwatches.landing = {

            /**
             * Function to get nearest product image element
             * @param {*} ele 
             */
            getNearestProductImageByElement: function (ele) {
                var img;
                var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
                klevu.each(klevu.dom.find(".klevuImgWrap img", parentElem), function (key, value) {
                    if (value) {
                        img = value;
                    }
                });
                return img;
            },

            /**
             * Function to map swatches data to landing page color swatches
             * @param {*} ele 
             * @param {*} productResults 
             */
            landingMapColorSwatchesData: function (ele, productResults) {
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
            },

            /**
             * Landing page grid mouse enter event
             * @param {*} ele 
             */
            landingColorGridMouseEnterEvent: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    productImageElement.setAttribute("src", ele.swatchesInfo.variantImage);
                }
            },

            /**
             * Landing color grid mouse leave event
             * @param {*} ele 
             */
            landingColorGridMouseLeaveEvent: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    productImageElement.setAttribute("src", ele.defaultImage);
                }
            },

            /**
             * Function to set default product image to color swatch element
             * @param {*} ele 
             */
            landingSetDefaultProductImageToSwatches: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    ele.defaultImage = productImageElement.getAttribute("src");
                }
            },

            /**
             * Function to bind events to landing page product color swatches
             * @param {*} data 
             */
            bindColorGridEventsToLandingProducts: function (data) {
                var self = this;
                var productResults;
                var items = klevu.getObjectPath(data.template.query, 'productList');
                if (items && items.result) {
                    productResults = items.result;
                }
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
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
        }
    }
});

/**
 * Event to attach landing page product color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageProductColorSwatch",
    fire: function () {

        /** Include Color swatches base module first to use base functionalities */

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);

        /** Initalize color swatch service */
        klevu.colorSwatchesLanding(klevu.search.landing.getScope().element.kScope);

        /**
         * Initialize color swatches and service before rendering
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "initializeLandingProductSwatches",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    klevu.search.landing.getScope().colorSwatches.base.parseProductColorSwatch(data, 'productList');
                }
            }
        });

        /*
         *	Bind landing page color swatches events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addProductGridColorSwatches",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatches.landing.bindColorGridEventsToLandingProducts(data);
            }
        });

    }
});

/**
 * Color swatch Quick view extension
 */
klevu.extend({
    colorSwatchesQuickView: function (mainScope) {

        if (!mainScope.colorSwatches) {
            console.log("Color swatch base module is missing!");
            return;
        }

        mainScope.colorSwatches.quickView = {

            /**
             * Function to get image element
             */
            getProductImageElement: function () {
                var img;
                var target = klevu.dom.find(".productQuick-imgBlock img");
                if (target && target[0]) {
                    img = target[0];
                }
                return img;
            },

            /**
             * Color grid mouse enter event
             * @param {*} ele 
             */
            colorGridMouseEnterEvent: function (ele) {
                var imgEle = this.getProductImageElement();
                if (imgEle) {
                    imgEle.setAttribute("src", ele.swatchesInfo.variantImage);
                }
            },

            /**
             * Color grid mouse leave event
             * @param {*} product 
             */
            colorGridMouseLeaveEvent: function (product) {
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
            },

            /**
             * Function to map data with color grid
             * @param {*} product 
             */
            mapSwatchObjectToColorGrid: function (product) {
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
            },

            /**
             * Function to get selected product data
             */
            getSelectedProductData: function () {
                var selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    selected_product = target[0].selected_product;
                }
                return selected_product;
            },

            /**
             * Function to bind events with color grid
             */
            bindColorGridEvents: function () {
                var product = this.getSelectedProductData();
                if (product && product.swatchesInfo) {
                    this.mapSwatchObjectToColorGrid(product);
                }
            }

        }
    }
});

/**
 * Event to attach product quick view color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewColorSwatch",
    fire: function () {

        /** Include Color swatches base module first to use base functionalities */

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickViewProductColorSwatches"), "quickViewProductSwatch", true);

        /** Initalize color swatch service */
        klevu.colorSwatchesQuickView(klevu.search.landing.getScope().element.kScope);

        /**
         * parse product color swatch info
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "parseQuickViewProductColorSwatch",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatches.base.parseProductColorSwatch(data, 'productList');
            }
        });

        /**
         * Bind color swatch events
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "bindColorGridEvents",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatches.quickView.bindColorGridEvents();
            }
        });


    }
});

/*! nouislider - 8.2.1 - 2015-12-02 21:43:14 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// http://youmightnotneedjquery.com/#has_class
	function hasClass ( el, className ) {
		if ( el.classList ) {
			el.classList.contains(className);
		} else {
			new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// Shorthand for stopPropagation so we don't have to create a dynamic method
	function stopPropagation ( e ) {
		e.stopPropagation();
	}

	// todo
	function addCssPrefix(cssPrefix) {
		return function(className) {
			return cssPrefix + className;
		};
	}


	var
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	defaultCssPrefix = 'noUi-';


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0,
			hover = entry.indexOf('hover') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		var i;

		if ( entry === false ) {
			return;
		} else if ( entry === true ) {

			parsed.tooltips = [];

			for ( i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}

		} else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider: must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' ) {
			throw new Error( "noUiSlider: 'cssPrefix' must be a string.");
		}

		parsed.cssPrefix = entry;
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		};

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options ){

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {},
		scope_Self;

  var cssClasses = [
    /*  0 */  'target'
    /*  1 */ ,'base'
    /*  2 */ ,'origin'
    /*  3 */ ,'handle'
    /*  4 */ ,'horizontal'
    /*  5 */ ,'vertical'
    /*  6 */ ,'background'
    /*  7 */ ,'connect'
    /*  8 */ ,'ltr'
    /*  9 */ ,'rtl'
    /* 10 */ ,'draggable'
    /* 11 */ ,''
    /* 12 */ ,'state-drag'
    /* 13 */ ,''
    /* 14 */ ,'state-tap'
    /* 15 */ ,'active'
    /* 16 */ ,''
    /* 17 */ ,'stacking'
    /* 18 */ ,'tooltip'
    /* 19 */ ,''
    /* 20 */ ,'pips'
    /* 21 */ ,'marker'
    /* 22 */ ,'value'
  ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		addClass(handle, cssClasses[3]);
		addClass(handle, cssClasses[3] + additions[index]);

		addClass(origin, cssClasses[2]);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, cssClasses[7]);
					addClass(handles[0], cssClasses[6]);
					break;
			case 3: addClass(handles[1], cssClasses[6]);
					/* falls through */
			case 2: addClass(handles[0], cssClasses[7]);
					/* falls through */
			case 0: addClass(target, cssClasses[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, cssClasses[0]);
		addClass(target, cssClasses[8 + direction]);
		addClass(target, cssClasses[4 + orientation]);

		var div = document.createElement('div');
		addClass(div, cssClasses[1]);
		target.appendChild(div);
		return div;
	}


	function addTooltip ( handle, index ) {

		if ( !options.tooltips[index] ) {
			return false;
		}

		var element = document.createElement('div');
		element.className = cssClasses[18];
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		if ( options.dir ) {
			options.tooltips.reverse();
		}

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		if ( options.dir ) {
			tips.reverse();
			options.tooltips.reverse();
		}

		bindEvent('update', function(f, o, r) {
			if ( tips[o] ) {
				tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
			}
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][options.ort],
			element = document.createElement('div');

		addClass(element, cssClasses[20]);
		addClass(element, cssClasses[20] + '-' + style);

		function getSize( type ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1]) +
				'" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			element.innerHTML += '<div ' + getTags(offset, cssClasses[21], values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				element.innerHTML += '<div '+getTags(offset, cssClasses[22], values)+'>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		return scope_Base['offset' + ['Width', 'Height'][options.ort]];
	}

	// External event handling
	function fireEvent ( event, handleNumber, tap ) {

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					// .reverse is in place
					// Return values as array, so arg_1[arg_2] is always valid.
					callback.call(scope_Self, asArray(valueGet()), handleNumber, asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))), tap || false);
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, cssClasses[14]) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + cssClasses[15] ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, cssClasses[15]);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, cssClasses[12]);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		// If this is a standard handle movement, fire the end event.
		if ( data.handleNumber !== undefined ) {
			fireEvent('end', data.handleNumber);
		}
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			end ( event, data );
		}
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			addClass(data.handles[0].children[0], cssClasses[15]);

			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}
		}

		// Fix #551, where a handle gets selected instead of dragged.
		event.preventDefault();

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			handleNumber: data.handleNumber,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		var outEvent = attach("mouseout", d, documentLeave, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		d.noUiListeners = moveEvent.concat(endEvent, outEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, cssClasses[12]);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}

		if ( data.handleNumber !== undefined ) {
			fireEvent('start', data.handleNumber);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber, true);
		fireEvent('set', handleNumber, true);
		fireEvent('change', handleNumber, true);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function hover ( event ) {

		var location = event.calcPoint - offset(scope_Base)[ options.style ],
			to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
			value = scope_Spectrum.fromStepping( to );

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < scope_Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, scope_Handles[i].children[0], start, {
					handles: [ scope_Handles[i] ],
					handleNumber: i
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attach ( actions.move, scope_Base, hover, { hover: true } );
			for ( i = 0; i < scope_Handles.length; i += 1 ) {
				['mousemove MSPointerMove pointermove'].forEach(function( eventName ){
					scope_Handles[i].children[0].addEventListener(eventName, stopPropagation, false);
				});
			}
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			drag = [scope_Base.querySelector( '.' + cssClasses[7] )];
			addClass(drag[0], cssClasses[10]);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move
		if ( to === scope_Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, cssClasses[17]);
			if ( to > 50 ) {
				addClass(handle, cssClasses[17]);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		var count, values = asArray( input ), i;

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('set', i);
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {
		cssClasses.forEach(function(cls){
			if ( !cls ) { return; } // Ignore empty classes
			removeClass(scope_Target, cls);
		});
		scope_Target.innerHTML = '';
		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent.split('.')[0],
			namespace = namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, step, range, animate, snap
	function updateOptions ( optionsToUpdate ) {

		var v = valueGet(), i, newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate,
			snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
		});

		['margin', 'limit', 'step', 'range', 'animate'].forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = optionsToUpdate[name];
			}
		});

		scope_Spectrum = newOptions.spectrum;

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [-1, -1];
		valueSet(v);

		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('update', i);
		}
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions
	};

	// Attach user events.
	events( options.events );

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));

/**
 * Extension for filter price slider
 */
klevu.extend({
    filterPriceSlider: function (mainScope) {
        mainScope.filterPriceSlider = {};
        mainScope.filterPriceSlider.base = {
            initSlider: function (data) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var priceSliderList = klevu.dom.find(".kuPriceSlider [data-querykey]", target);
                if (priceSliderList) {
                    priceSliderList.forEach(function (ele) {
                        var sliderData;
                        var querykey = ele.getAttribute("data-querykey");
                        var contentData = data.template.query[querykey];
                        if (contentData) {
                            contentData.filters.forEach(function (filter) {
                                if (filter.key == mainScope.priceSliderFilterReqQuery.key && filter.type == "SLIDER") {
                                    sliderData = filter;
                                }
                            });
                        }
                        if (sliderData) {
                            if (ele.slider) {
                                ele.slider.destroy();
                            }
                            ele.sliderData = sliderData;
                            ele.slider = noUiSlider.create(ele, {
                                start: [sliderData.start, sliderData.end],
                                connect: true,
                                range: {
                                    'min': [sliderData.min],
                                    'max': [sliderData.max]
                                }
                            });
                            ele.slider.on('update', function (values, handle) {
                                klevu.dom.find(".minValue" + querykey)[0].innerHTML = parseInt(values[0]);
                                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = parseInt(values[1]);
                            });
                            ele.slider.on('change', function (values, handle) {
                                self.sliderOnUpdateEvent(values, querykey, data, ele);
                            });
                        }
                    });
                }
            },

            /**
             * Slider filter on value change event
             * @param {*} values 
             * @param {*} querykey 
             * @param {*} data 
             * @param {*} ele 
             */
            sliderOnUpdateEvent: function (values, querykey, data, ele) {
                var min = parseInt(values[0]);
                var max = parseInt(values[1]);
                klevu.dom.find(".minValue" + querykey)[0].innerHTML = min;
                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = max;

                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");

                /** Get Scope */
                var sliderFilter = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter", target)[0], ".klevuTarget");

                var scope = sliderFilter.kElem;
                scope.kScope.data = scope.kObject.resetData(scope.kElem);

                var options = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter", target)[0], ".klevuMeta");

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
                    applyFilters.forEach(function (filter) {
                        if (filter.key == ele.sliderData.key) {
                            isUpdated = true;
                            filter.values = [min.toString(), max.toString()];
                        }
                    });
                    if (!isUpdated) {
                        applyFilters.push(sliderFilterReqObj);
                    }
                }

                /** reset offset after filter change */
                klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);

            }
        };
    }
});

/**
 * Add Price slider paramter in request object functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachPriceSliderFilter",
    fire: function () {

        /** Price slider filter request query */
        klevu.search.landing.getScope().priceSliderFilterReqQuery = {
            key: "price",
            minMax: true,
            rangeInterval: 500
        };

        /** Function to add range filters in request filter object */
        klevu.search.landing.getScope().chains.request.build.addAfter('addProductList', {
            name: "addPriceSlider",
            fire: function (data, scope) {
                var requestQueries = data.request.current.recordQueries;
                requestQueries.forEach(function (req) {
                    if (req.id == "productList") {
                        req.filters.filtersToReturn.rangeFilterSettings = [klevu.search.landing.getScope().priceSliderFilterReqQuery];
                    }
                });
            }
        });

        /**
         *  Initialize slider
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "initSliderFilter",
            fire: function (data, scope) {

                /** Initialize filterPriceSlider */
                klevu.filterPriceSlider(klevu.search.landing.getScope().element.kScope);

                klevu.search.landing.getScope().filterPriceSlider.base.initSlider(data, scope);
            }
        });

    }
});

/**
 * Attach Product stock availability label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductavailabilityLabel",
    fire: function () {
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductStock"), "landingProductStock", true);
    }
});

/**
 * Extension for mobile sliding filter
 */
klevu.extend({
    mobileFilterSlider: function (mainScope) {
        mainScope.mobileFilterSlider = {};
        mainScope.mobileFilterSlider.base = {
            /**
             * Function to manage slider status in target element
             * @param {*} status 
             */
            manageSliderStatus: function (status) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var scope = target.kElem;
                scope.kScope.isMobileSliderOpen = status;
            },

            /**
             * Function to attach event on filter button
             */
            attachFilterBtnClickEvent: function () {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
                    klevu.event.attach(ele, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        self.toggleBodyScroll();

                        var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                            ele.classList.add("kuFiltersIn");
                            self.manageSliderStatus(true);
                        });

                    });
                });
            },

            /**
             * Function to add event on slider close button
             */
            attachFilterCloseBtnClickEvent: function () {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuMobileFilterCloseBtn", target), function (index, ele) {
                    klevu.event.attach(ele, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        self.toggleBodyScroll();

                        var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                            ele.classList.remove("kuFiltersIn");
                            self.manageSliderStatus(false);
                        });

                    });
                });
            },

            /**
             * Function to persisting filter slider position
             */
            persistFilterPosition: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
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
            },

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

            /**
             * Function to attach events on buttons
             */
            attachButtonEvents: function () {
                this.attachFilterBtnClickEvent();
                this.attachFilterCloseBtnClickEvent();
            }
        };
    }
});

/**
 * Attach Filter slider effect
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addMobileFilterSliderEvents",
    fire: function () {
        /**
         * Function to load on landing page load
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachMobileSliderFilter",
            fire: function (data, scope) {

                /** Initialize mobileFilterSlider */
                klevu.mobileFilterSlider(klevu.search.landing.getScope().element.kScope);

                klevu.search.landing.getScope().mobileFilterSlider.base.attachButtonEvents();
                klevu.search.landing.getScope().mobileFilterSlider.base.persistFilterPosition();
            }
        });

    }
});

/**
 * Extension for reordering filters
 */
klevu.extend({
    reorderFilters: function (mainScope) {
        mainScope.reorderFilters = {};
        mainScope.reorderFilters.base = {
            /**
             * Function to reorder filter list as per the priority list
             * @param {*} data 
             * @param {*} priorityFilters 
             */
            reorder: function (data, priorityFilters) {
                if (data && data.template && data.template.query) {
                    var items = klevu.getObjectPath(data.template.query, 'productList');
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
        };
    }
});

/**
 * Reorder filter list
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilters",
    fire: function () {

        /**
         * Function to set filter priority list and reoder filter list
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "reorderFilterPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {

                    var priorityFilters = [{
                        key: "brand"
                    }, {
                        key: "category"
                    }];

                    /** Initialize reorderFilters */
                    klevu.reorderFilters(klevu.search.landing.getScope().element.kScope);

                    klevu.search.landing.getScope().reorderFilters.base.reorder(data, priorityFilters);
                }
            }
        });
    }
});

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

                    /** Initialize reorderFilterOptions */
                    klevu.reorderFilterOptions(klevu.search.landing.getScope().element.kScope);

                    klevu.search.landing.getScope().reorderFilterOptions.base.reorder(data, priorityFilterOptions);
                }
            }
        });
    }
});

/**
 * Extension for collapse filter functionality
 */
klevu.extend({
    collapseFilters: function (mainScope) {
        mainScope.collapseFilters = {};
        mainScope.collapseFilters.base = {
            /**
             * Function to collapse filter list as per the priority list
             * @param {*} data 
             * @param {*} collapsedFilters 
             */
            collapse: function (data, collapsedFilters) {
                if (data && data.template && data.template.query && collapsedFilters) {
                    var items = klevu.getObjectPath(data.template.query, 'productList');
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

                    /** Initialize collapseFilters module */
                    klevu.collapseFilters(klevu.search.landing.getScope().element.kScope);

                    klevu.search.landing.getScope().collapseFilters.base.collapse(data, collapsedFilters);
                }
            }
        });
    }
});

/**
 * Extend klevu object for custom pagination functionality
 */
klevu.extend({
    customPagination: function (mainScope) {
        mainScope.customPagination = {};
        mainScope.customPagination.base = {

            /**
             * Paginate click event
             * @param {*} scope 
             * @param {*} event 
             */
            paginateClickEvent: function (event) {
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
            },

            /**
             * Function to bind pagination events
             * @param {*} paginateClass paginate link container class
             */
            bindPaginationEvents: function (paginateClass) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(paginateClass, target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.paginateClickEvent(event);
                    }, true);
                });
            }
        };
    }
});


/**
 * Add landing page custom pagination bar
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addLandingPageCustomPaginationBar",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#customLandingPagePaginationBar"), "customLandingPagePagination", true);

        /**
         * Add pagination events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addCustomPagination",
            fire: function (data, scope) {

                /** Initializing custom pagination */
                klevu.customPagination(klevu.search.landing.getScope().element.kScope);

                klevu.search.landing.getScope().customPagination.base.bindPaginationEvents(".kuPaginate");

            }
        });

    }
});

/**
 *  search request fire 
 */

/** add landing init */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-init",
    fire: function () {
        /** read query param */
        if (klevu.dom.find(".klevuLanding").length > 0) {
            klevu.search.landing.setTarget(klevu.dom.find(".klevuLanding")[0]);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.minChars", 0);
            var klevuUrlParams = klevu.getAllUrlParameters();
            if (klevuUrlParams.length > 0) {
                klevu.each(klevuUrlParams, function (key, elem) {
                    if (elem.name == "q") {
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

