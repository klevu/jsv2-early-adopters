/**
 * Also Bought products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationAlsoBoughtEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.alsoBoughtBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "alsoBoughtProductsBuild",
    fire: function () {

        var alsoBoughtScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("alsoBought");

        /**
         * Function to get the request query object
         * @param {*} scope 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function getRequestObj(scope, productIds, filters) {

            var kuAlsoBoughtRequestProductIds = typeof (kuAlsoBoughtRequestProductIds) ? [] : kuAlsoBoughtRequestProductIds;
            var products = klevu.search.modules.productsRecommendation.base.getProductIds(productIds, kuAlsoBoughtRequestProductIds);
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "alsoBoughtProductList";
            productQuery.typeOfRequest = "RECS_ALSO_BOUGHT";
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
         * Function to get inputs for also bought products
         * @param {*} templateId 
         * @param {*} appendToClass 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function alsoBought(templateId, appendToClass, productIds, filters) {
            alsoBoughtScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(alsoBoughtScope, productIds, filters);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(alsoBoughtScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(alsoBoughtScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(alsoBoughtScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            alsoBought: alsoBought,
            alsoBoughtBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationAlsoBoughtEvent", {
    name: "alsoBoughtProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.alsoBought.getScope().chains.template.events.add({
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
                        ".kuRecommendationAlsoBought",
                        ".klevuRecommendedProduct",
                        "PRC_ALSO_BOUGHT_BANNER",
                        "prc-banner-alsoBought"
                    );
                }

                var target = klevu.dom.find(".kuRecommendationAlsoBought")[0];
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