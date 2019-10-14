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
                                    termOptions.productId = product.id;
                                    termOptions.productName = product.name;
                                    termOptions.productUrl = product.url;
                                    termOptions.src = product.typeOfRecord + ":landing";
                                    klevu.analyticsEvents.click(termOptions);
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
                    termOptions.src += (termOptions.filters) ? ":landing:filters" : ":landing";
                    klevu.analyticsEvents.term(termOptions);
                    klevu.search.landing.getScope().element.kScope.analyticsReqTimeOut = null;
                }, 500);
            }
        });

        klevu.search.landing.getScope().chains.template.render.addAfter("renderResponse", {
            name: "attachAnalyticsOnProduct",
            fire: function (data, scope) {
                var target = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuMeta", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        data.context.current = value.dataset.section;
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