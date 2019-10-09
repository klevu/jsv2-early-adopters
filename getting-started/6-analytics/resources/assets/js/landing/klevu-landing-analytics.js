/**
 * Search result landing page extension for Analytics utility
 */
klevu.extend({
    analyticsUtilsLandingPage: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.landing = {
            bindProductClickAnalytics: function (dataListId) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();

                        var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                        if (parent === null) {
                            return;
                        }

                        var productId = parent.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope, dataListId);
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
 * Attach core event to add landing page analytics
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageAnalyticsEvents",
    fire: function () {
        /** Initialize analytics object */
        klevu.analyticsUtilsLandingPage(klevu.search.landing.getScope().element.kScope);

        /** Send term request for anaytics */
        klevu.search.landing.getScope().chains.response.ajax.done.add({
            name: "doAnalytics",
            fire: function (data, scope) {
                var termOptions = klevu.search.landing.getScope().analyticsUtils.base.getTermOptions("productList");
                klevu.analyticsEvents.term(termOptions);
            }
        });

        klevu.search.landing.getScope().chains.template.render.add({
            name: "attachAnalyticsOnProduct",
            fire: function (data, scope) {
                klevu.search.landing.getScope().analyticsUtils.landing.bindProductClickAnalytics("productList");
            }
        });

    }
});