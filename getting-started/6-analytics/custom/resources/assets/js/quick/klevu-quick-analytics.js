/**
 * Quick search extension for Analytics utility
 */
klevu.extend({
    analyticsUtilsQuickSearch: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.quick = {
            fireAnalyticsOnProducts: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuProduct", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var productId = value.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope, "productList");
                            var productOptions = {
                                term: mainScope.data.context.term,
                                productId: product.id,
                                productName: product.name,
                                productUrl: product.url
                            };
                            klevu.analyticsEvents.click(productOptions);
                        }
                        window.location = product.url;
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

            /**
             * Send term request for anaytics
             */
            box.getScope().chains.response.ajax.done.add({
                name: "doAnalytics",
                fire: function (data, scope) {
                    var termOptions = box.getScope().analyticsUtils.base.getTermOptions("productList");
                    klevu.analyticsEvents.term(termOptions);
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
                }
            });
        });
    }
});