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
                klevu.each(klevu.dom.find(".klevuProduct", target), function (key, value) {
                    var prodLink = klevu.dom.find(".trackProductClick", value)[0];
                    if (prodLink) {
                        klevu.event.attach(prodLink, "mousedown", function (event) {
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
                                    termOptions.productId = product.id;
                                    termOptions.productName = product.name;
                                    termOptions.productUrl = product.url;
                                    termOptions.src = product.typeOfRecord + ":quick-search";
                                    klevu.analyticsEvents.click(termOptions);
                                }
                            }
                        });
                    }
                });
            },
            /**
             * Function to bind and fire analytics event on Quick Search Categories
             */
            fireAnalyticsOnCategoriesAndPages: function (containerClass, dataListId) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(containerClass, target), function (key, value) {
                    klevu.each(klevu.dom.find("a", value), function (key, catEle) {
                        klevu.event.attach(catEle, "mousedown", function (event) {
                            var url = catEle.getAttribute("href");
                            var catName = catEle.innerHTML;
                            var category = mainScope.analyticsUtils.base.getDetailsFromURLAndName(url, catName, mainScope, dataListId);
                            var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                            termOptions.productName = category.name;
                            termOptions.productUrl = category.url;
                            termOptions.src = category.typeOfRecord + ":quick-search";
                            klevu.analyticsEvents.click(termOptions);
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
                    klevu.each(klevu.dom.find("a", value), function (key, sugEle) {
                        klevu.event.attach(sugEle, "click", function (event) {
                            event = event || window.event;
                            event.preventDefault();
                            var suggestionURL = sugEle.getAttribute("href");
                            var suggestionText = (decodeURI(suggestionURL)).replace("/?q=", "");
                            var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                            termOptions.originalTerm = termOptions.term;
                            termOptions.term = suggestionText;
                            termOptions.src = "ac-suggestions";
                            klevu.analyticsEvents.term(termOptions);
                            setTimeout(function () {
                                window.location = sugEle.getAttribute("href");
                            }, 500);
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
    fire: "attachQuickSearchAnalyticsEvents",
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
                        termOptions.src += ":quick-search";
                        klevu.analyticsEvents.term(termOptions);
                        box.getScope().element.kScope.analyticsReqTimeOut = null;
                    }, 500);
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