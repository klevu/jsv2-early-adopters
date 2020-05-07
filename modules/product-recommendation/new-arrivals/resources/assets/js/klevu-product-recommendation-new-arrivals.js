/**
 * New Arrivals products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationNewArrivalsEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.newArrivalsBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "newArrivalsProductsBuild",
    fire: function () {

        var newArrivalsScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("newArrivals");

        /**
         * Function to get the request query object
         * @param {*} scope 
         */
        function getRequestObj(scope) {

            var kuNewArrivalsRequestProductIds = typeof (kuNewArrivalsRequestProductIds) ? [] : kuNewArrivalsRequestProductIds;
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "newArrivalsProductList";
            productQuery.typeOfRequest = "RECS_NEW_ARRIVALS";
            productQuery.settings.typeOfRecords = ["KLEVU_PRODUCT"];
            productQuery.settings.query = {
                "term": "*"
            };

            productQuery.settings.limit = 15;
            return productQuery;
        }

        /**
         * Function to get inputs for new arrivals products
         * @param {*} templateId 
         * @param {*} appendToClass 
         */
        function newArrivals(templateId, appendToClass) {
            newArrivalsScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(newArrivalsScope);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(newArrivalsScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(newArrivalsScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(newArrivalsScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            newArrivals: newArrivals,
            newArrivalsBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationNewArrivalsEvent", {
    name: "newArrivalsProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.newArrivals.getScope().chains.template.events.add({
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
                        ".kuRecommendationNewArrivals",
                        ".klevuRecommendedProduct",
                        "PRC_NEW_ARRIVALS_BANNER",
                        "prc-banner-NewArrivals"
                    );
                }

                var target = klevu.dom.find(".kuRecommendationNewArrivals")[0];
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