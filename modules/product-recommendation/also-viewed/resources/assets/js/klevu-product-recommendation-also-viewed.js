/**
 * Also Viewed products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationAlsoViewedEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.alsoViewedBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "alsoViewedProductsBuild",
    fire: function () {

        var alsoViewedScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("alsoViewed");

        /**
         * Function to get the request query object
         * @param {*} scope 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function getRequestObj(scope, productIds, filters) {

            var kuAlsoViewedRequestProductIds = typeof (kuAlsoViewedRequestProductIds) ? [] : kuAlsoViewedRequestProductIds;
            var products = klevu.search.modules.productsRecommendation.base.getProductIds(productIds, kuAlsoViewedRequestProductIds);
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "alsoViewedProductList";
            productQuery.typeOfRequest = "RECS_ALSO_VIEWED";
            productQuery.settings.typeOfRecords = ["KLEVU_PRODUCT"];

            if (products.length) {
                productQuery.settings.context = {
                    "recentObjects": [{
                        "typeOfRecord": "KLEVU_PRODUCT",
                        "records": products
                    }]
                };
            }

            if (filters && filters.length) {
                productQuery.settings.filters = {
                    "applyFilters": {
                        "filters": filters
                    }
                }
            }

            productQuery.settings.limit = 15;
            return productQuery;
        }

        /**
         * Function to get inputs for also Viewed products
         * @param {*} templateId 
         * @param {*} appendToClass 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function alsoViewed(templateId, appendToClass, productIds, filters) {
            alsoViewedScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(alsoViewedScope, productIds, filters);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(alsoViewedScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(alsoViewedScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(alsoViewedScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            alsoViewed: alsoViewed,
            alsoViewedBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationAlsoViewedEvent", {
    name: "alsoViewedProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.alsoViewed.getScope().chains.template.events.add({
            name: "addSlideShow",
            fire: function (data, scope) {

                if (
                    klevu.analyticsUtil &&
                    klevu.analyticsUtil.base.registerAnalyticsClickEvent
                ) {
                    klevu.analyticsUtil.base.registerAnalyticsClickEvent(
                        scope.kScope,
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click,
                        ".kuRecommendationAlsoViewed",
                        ".klevuRecommendedProduct",
                        "PRC_ALSO_VIEWED_BANNER",
                        "prc-banner-alsoViewed"
                    );
                }


                var target = klevu.dom.find(".kuRecommendationAlsoViewed")[0];
                if (target) {
                    var listEl = klevu.dom.find('.klevuRecsResultsInner', target)[0];
                    var btnLeftEl = klevu.dom.find('#klevuRecsControl-left', target)[0];
                    var btnRightEl = klevu.dom.find('#klevuRecsControl-right', target)[0];
                    var count = 0;

                    function klevuSlideRecs(dir) {
                        var totalChildren = listEl.querySelectorAll(".klevuRecs-item").length;
                        dir === "left" ? ++count : --count;
                        listEl.style.left = count * 286 + 'px';
                        btnLeftEl.style.display = count < 0 ? "block" : "none";
                        // Here, 4 is the number displayed at any given time
                        btnRightEl.style.display = count > 4 - totalChildren ? "block" : "none";
                    }

                    klevu.event.attach(btnLeftEl, "click", function (e) {
                        klevuSlideRecs("left");
                    });

                    klevu.event.attach(btnRightEl, "click", function (e) {
                        klevuSlideRecs("right");
                    });
                }

            }
        });
    }
});