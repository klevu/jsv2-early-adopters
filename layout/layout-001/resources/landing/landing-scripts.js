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
        //add translations
        var translatorLanding = klevu.search.landing.getScope().template.getTranslator();
        translatorLanding.addTranslation("Search", "Search");
        translatorLanding.addTranslation("<b>%s</b> productList", "<b>%s</b> Products");
        translatorLanding.addTranslation("<b>%s</b> contentList", "<b>%s</b> Other results");
        translatorLanding.mergeToGlobal();

        //set currency
        //var currencyQuick = klevu.search.landing.getScope().currency;
        var currencyLanding = klevu.search.landing.getScope().template.getTranslator().getCurrencyObject();

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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-templates",
    fire: function () {
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
                ;
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


        klevu.search.landing.getScope().chains.request.build.add({
            name: "addContentList",
            fire: function (data, scope) {
                ;
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var contentList = klevu.extend(true, {}, parameterMap.recordQuery);
                var quickStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");

                contentList.id = "contentList";
                contentList.typeOfRequest = "SEARCH";
                contentList.settings.query.term = data.context.term;
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
            fire: function (data, scope) {
                if (data.context.isSuccess) {

                    scope.kScope.template.setData(data.template);
                    var targetBox = "klevuTemplateLanding";
                    var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.innerHTML = '';
                    //todo: Need extraPolyfill.js
                    target.classList.add("klevuTarget");
                    scope.kScope.element.kData = data.template;
                    scope.kScope.template.insertTemplate(target, element);
                }
            }
        });

        // multi-select filters (except for category)
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processFilters",
            fire: function (data, scope) {
                var list = ["productList", "contentCompressed"];
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
                        klevu.search.modules.filterPriceSlider.base.initSlider(data, scope.kScope);
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

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCartButtonLandingPage",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Bind landing page add to cart button click event */
        klevu.search.landing.getScope().chains.template.events.add({
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageProductColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);

        /**
         * Initialize color swatches and service before rendering
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
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
        klevu.search.landing.getScope().chains.template.events.add({
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
                var items = klevu.getObjectPath(scope.data.template.query, 'productList');
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Add Quick view wrapper container in body */
        klevu.search.modules.quickViewService.base.appendTemplateIntoBody();

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
        klevu.search.landing.getScope().chains.template.events.add({
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickViewProductColorSwatches"), "quickViewProductSwatch", true);

        /**
         * parse product color swatch info
         */
        klevu.search.landing.getScope().chains.template.events.add({
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
        klevu.search.landing.getScope().chains.quickView.add({
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "collapseFilters",
    fire: function () {

        /**
         * Function to enable collapsing for filter items
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "enableFilterCollapse",
            fire: function (data, scope) {
                klevu.search.modules.collapseFilters.base.initialize(scope.kScope);
            }
        });

        /**
         * Function to set filter priority list and reorder filter list
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

                    klevu.search.modules.collapseFilters.base.collapse(data, collapsedFilters, 'productList');
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
        var sliderFilter = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter", target)[0], ".klevuTarget");

        var elScope = sliderFilter.kElem;
        elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);

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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachPriceSliderFilter",
    fire: function () {

        /** Price slider filter request query */
        klevu.search.landing.getScope().priceSliderFilterReqQuery = {
            key: "klevu_price",
            minMax: true
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "reorderFilters",
    fire: function () {

        /**
         * Function to set filter priority list and reorder filter list
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
                    klevu.search.modules.reorderFilters.base.reorder(data, priorityFilters, 'productList');
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
                    self.manageSliderStatus(true);
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
                    self.manageSliderStatus(false);
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

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addMobileFilterSliderEvents",
    fire: function () {

        /**
         * Function to load on landing page load
         */
        klevu.search.landing.getScope().chains.template.events.add({
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

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addSearchResultProductBadges",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductBadge"), "landingProductBadge", true);
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

                var scope = target.kElem;
                scope.kScope.data = scope.kObject.resetData(scope.kElem);
                scope.kScope.data.context.keyCode = 0;
                scope.kScope.data.context.eventObject = event;
                scope.kScope.data.context.event = "keyUp";
                scope.kScope.data.context.preventDefault = false;

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
                    klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters.filters", filterList);
                } else {
                    klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters", {});
                }
                //reset offset after filter change
                klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
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
 * Event to add promotion banners to landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
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

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingPromotionBanner"), "klevuLandingPromotionBanner", true);
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
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

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addFacetsOnLandingPage",
    fire: function () {

        /** Load filters template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeFilterLeft",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
        });
    }
});

/**
 * Attach code event to landing page analytics
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachSearchResultLandingPageAnalyticsEvents",
    fire: function () {

        klevu.search.landing.getScope().chains.template.render.add({
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

                var termOptions = klevu.analyticsUtil.base.getTermOptions(scope.kScope);
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
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingProductAddToCartButtonAnalytics",
    fire: function () {

        /**
         * Event to bind analytics on add to cart click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
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

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewAnalytics",
    fire: function () {

        /**
         * Attach events for quick view button
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnProductQuickView",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerLandingProductQuickViewClickEvent(
                    scope.kScope,
                    "source:quick-view;;template:landing"
                );
            }
        });

        klevu.search.landing.getScope().chains.quickView.add({
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