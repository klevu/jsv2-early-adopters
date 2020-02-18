/**
 *  Product image path update for Magento framework
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {

        /**
         * Event to update product image url for magento store 
         */
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().chains.template.process.success.add({
                name: "updateProductImagePath",
                fire: function (data, scope) {
                    var productDataModification = klevu.search.modules.productDataModification;
                    if (productDataModification) {
                        productDataModification.base.updateImagePath(scope.kScope);
                    }
                }
            });
        });
    }
});