/**
 * Event to add trending products template and request
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachTrendingProducts",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTrendingProductBlock"), "klevuQuickTrendingProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuTrendingProducts"), "klevuTrendingProducts", true);

            box.getScope().chains.request.build.add({
                name: "addTrendingProductsList",
                fire: function (data, scope) {
                    if (!data.context.term) {
                        data.context.term = "*";
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var trendingProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        trendingProductList.id = "trendingProductList";
                        trendingProductList.typeOfRequest = "SEARCH";
                        trendingProductList.settings.query.term = data.context.term;
                        trendingProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        trendingProductList.settings.limit = 3;
                        trendingProductList.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(trendingProductList);
                        data.context.doSearch = true;
                    }
                }
            });
        });
    }
});