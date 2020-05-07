/**
 * Also Viewed products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationRelatedEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.relatedBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "relatedProductsBuild",
    fire: function () {


        var relatedScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("related");

        /**
         * Function to get the request query object
         * @param {*} scope 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function getRequestObj(scope, productIds, filters) {

            var kuRelatedRequestProductIds = typeof (kuRelatedRequestProductIds) ? [] : kuRelatedRequestProductIds;
            var products = klevu.search.modules.productsRecommendation.base.getProductIds(productIds, kuRelatedRequestProductIds);
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "relatedProductList";
            productQuery.typeOfRequest = "RECS_SIMILAR";
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
         * Function to get inputs for related products
         * @param {*} templateId 
         * @param {*} appendToClass 
         * @param {*} productIds 
         * @param {*} filters 
         */
        function related(templateId, appendToClass, productIds, filters) {
            relatedScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(relatedScope, productIds, filters);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(relatedScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(relatedScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(relatedScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            related: related,
            relatedBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationRelatedEvent", {
    name: "relatedProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.related.getScope().chains.template.events.add({
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
                        ".kuRecommendationRelated",
                        ".klevuRecommendedProduct",
                        "PRC_RELATED_PRODUCTS_BANNER",
                        "prc-banner-relatedProducts"
                    );
                }

                var target = klevu.dom.find(".kuRecommendationRelated")[0];
                if (target) {
                    var listEl = klevu.dom.find('.klevuRecsResultsInner', target)[0];
                    var btnLeftEl = klevu.dom.find('#klevuRecsControl-left', target)[0];
                    var btnRightEl = klevu.dom.find('#klevuRecsControl-right', target)[0];
                    var count = 0;

                    function klevuSlideRecs(dir) {
                        var totalChildren = klevu.dom.find(".klevuRecs-item", listEl).length;
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