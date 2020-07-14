/**
 * New Arrivals products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationInTrendsEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.inTrendsBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "inTrendsProductsBuild",
    fire: function () {

        var inTrendsScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("inTrends");

        /**
         * Function to get the request query object
         * @param {*} scope 
         */
        function getRequestObj(scope) {

            var kuInTrendsRequestProductIds = typeof (kuInTrendsRequestProductIds) ? [] : kuInTrendsRequestProductIds;
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "inTrendsProductList";
            productQuery.typeOfRequest = "RECS_TRENDING";
            productQuery.settings.typeOfRecords = ["KLEVU_PRODUCT"];
            productQuery.settings.query = {
                "term": "*"
            };

            productQuery.settings.limit = 15;
            return productQuery;
        }

        /**
         * Function to append trending products
         * @param {*} templateId 
         * @param {*} appendToClass 
         */
        function inTrends(templateId, appendToClass) {
            inTrendsScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(inTrendsScope);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(inTrendsScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(inTrendsScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(inTrendsScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            inTrends: inTrends,
            inTrendsBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationInTrendsEvent", {
    name: "inTrendsProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.inTrends.getScope().chains.template.events.add({
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
                        ".kuRecommendationInTrends",
                        ".klevuRecommendedProduct",
                        "PRC_IN_TRENDS_BANNER",
                        "prc-banner-inTrends"
                    );
                }


                var target = klevu.dom.find(".kuRecommendationInTrends")[0];
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