/**
 * hand picked products module for Products Recommendation
 */
klevu.coreEvent.build({
    name: "productsRecommendationHandPickedEvent",
    fire: function () {
        if (!klevu.search.modules.productsRecommendation.base.handPickedBuild) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("productsRecommendationModule", {
    name: "handPickedProductsBuild",
    fire: function () {

        var handPickedScope = klevu.search.modules.productsRecommendation.base.createAndGetScope("handPicked");

        /**
         * Function to get the request query object
         * @param {*} scope 
         * @param {*} productIds 
         */
        function getRequestObj(scope, productIds) {

            var kuHandPickedRequestProductIds = typeof (kuHandPickedRequestProductIds) ? [] : kuHandPickedRequestProductIds;
            var products = klevu.search.modules.productsRecommendation.base.getProductIds(productIds, kuHandPickedRequestProductIds);
            var parameterMap = klevu.getSetting(scope.getScope().settings, "settings.search.map", false);

            var productQuery = klevu.extend(true, {}, parameterMap.recordQuery);
            productQuery.id = "handPickedProductList";
            productQuery.typeOfRequest = "SEARCH";
            productQuery.settings.typeOfRecords = ["KLEVU_PRODUCT"];

            productQuery.settings.term = "*";
            productQuery.settings.typeOfSearch = "WILDCARD_AND";
            productQuery.settings.includeIds = [];
            productQuery.settings.topIds = [];

            if (products.length) {
                klevu.each(products, function (key, productId) {
                    var productObject = {
                        "key": "id",
                        "value": productId.id
                    }
                    productQuery.settings.includeIds.push(productObject);
                    productQuery.settings.topIds.push(productObject);
                });
            }

            productQuery.settings.limit = products.length;

            return productQuery;
        }

        /**
         * Function to get inputs for hand picked products
         * @param {*} templateId 
         * @param {*} appendToClass 
         * @param {*} productIds 
         */
        function handPicked(templateId, appendToClass, productIds) {
            handPickedScope.getScope().template.setTemplate(klevu.dom.helpers.getHTML(templateId), templateId, true);
            var requestQuery = getRequestObj(handPickedScope, productIds);
            klevu.search.modules.productsRecommendation.base.addRecordQueryObject(handPickedScope.getScope(), requestQuery);
            klevu.search.modules.productsRecommendation.base.renderResponse(handPickedScope, appendToClass, templateId);
            klevu.search.modules.productsRecommendation.base.fireChain(handPickedScope.getScope());
        }

        klevu.extend(true, klevu.search.modules.productsRecommendation.base, {
            handPicked: handPicked,
            handPickedBuild: true
        });
    }
});


klevu.coreEvent.attach("productsRecommendationHandPickedEvent", {
    name: "handPickedProductsRender",
    fire: function () {

        /** Event to add slideshow clicks */
        klevu.search.handPicked.getScope().chains.template.events.add({
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
                        ".kuRecommendationHandPicked",
                        ".klevuRecommendedProduct",
                        "PRC_HAND_PICKED_BANNER",
                        "prc-banner-HandPicked"
                    );
                }

                var target = klevu.dom.find(".kuRecommendationHandPicked")[0];
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