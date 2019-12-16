/**
 * Add recently viewed products in Quick search results
 */

(function (klevu) {

    /**
     * Function to register entry in local storage
     * @param {*} scope 
     * @param {*} productId 
     */
    function registerRecentlyViewedProducts(scope, productId) {
        var self = this;
        var recentlyViewedDirectory = self.storage.dictionary;
        recentlyViewedDirectory.setStorage("local");
        recentlyViewedDirectory.mergeFromGlobal();

        var productIdList = recentlyViewedDirectory.getElement(self.storage.products);
        if (productIdList && productIdList.length && productIdList != self.storage.products) {
            productIdList = JSON.parse(productIdList);

            klevu.each(productIdList, function (key, value) {
                if (value == productId) {
                    productIdList.splice(key, 1);
                }
            });
            productIdList.push(productId);

            if (productIdList.length > self.storage.limit) {
                productIdList.splice(0, 1);
            }
            recentlyViewedDirectory.addElement(self.storage.products, JSON.stringify(productIdList));
        } else {
            recentlyViewedDirectory.addElement(self.storage.products, JSON.stringify([productId]));
        }

        recentlyViewedDirectory.mergeToGlobal();
    };

    /**
     * Function to bind product click event for adding id in local storage.
     * @param {*} scope 
     * @param {*} className 
     */
    function bindProductClickForRecentView(scope, className) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                if (ele.dataset && ele.dataset.id) {
                    self.registerRecentlyViewedProducts(scope, ele.dataset.id);
                }
            });
        });
    };

    /**
     * Function to get stored recent viewed product id list
     */
    function getProductIdList() {
        var self = this;
        var recentlyViewedDirectory = self.storage.dictionary;
        recentlyViewedDirectory.setStorage("local");
        recentlyViewedDirectory.mergeFromGlobal();
        var productIdList = recentlyViewedDirectory.getElement(self.storage.products);
        if (productIdList && productIdList.length && productIdList != self.storage.products) {
            productIdList = JSON.parse(productIdList);
            return productIdList;
        } else {
            return [];
        }
    };

    var recentViewedProducts = {
        storage: {
            limit: 3,
            dictionary: klevu.dictionary("recent-viewed"),
            products: "products"
        },
        bindProductClickForRecentView: bindProductClickForRecentView,
        registerRecentlyViewedProducts: registerRecentlyViewedProducts,
        getProductIdList: getProductIdList
    };

    klevu.extend(true, klevu.search.modules, {
        recentViewedProducts: {
            base: recentViewedProducts
        }
    });

})(klevu);

/**
 * Event to add recent viewed products
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventRecentViewedProducts",
    fire: function () {

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickRecentViewedProductBlock"), "klevuQuickRecentViewedProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuRecentViewedProducts"), "klevuRecentViewedProducts", true);

            box.getScope().chains.request.build.add({
                name: "addRecentViewedProductsList",
                fire: function (data, scope) {
                    var recentViewedProductIdList = klevu.search.modules.recentViewedProducts.base.getProductIdList();
                    if (recentViewedProductIdList.length && (!data.context.term || data.context.term == "*")) {
                        var limit = recentViewedProductIdList.length;
                        recentViewedProductIdList = recentViewedProductIdList.join(",");
                        data.context.term = recentViewedProductIdList;

                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var trendingProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        trendingProductList.id = "recentViewedProductList";
                        trendingProductList.typeOfRequest = "SEARCH";
                        trendingProductList.settings.query.term = data.context.term;
                        trendingProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        trendingProductList.settings.limit = limit;
                        data.request.current.recordQueries.push(trendingProductList);
                        data.context.doSearch = true;
                    }
                }
            });

            box.getScope().chains.template.render.addAfter("renderResponse", {
                name: "bindRecentViewProductClick",
                fire: function (data, scope) {
                    klevu.search.modules.recentViewedProducts.base.bindProductClickForRecentView(
                        scope.kScope,
                        ".kuTrackRecentView"
                    );
                }
            });

        });
    }
});