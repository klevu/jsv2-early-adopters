/**
 *  Product image path update for Magento framework
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {
        /**
         * Event to update product image url for magento store 
         */
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "updateProductImagePath",
            fire: function (data, scope) {
                var productDataModification = klevu.search.modules.productDataModification;
                if (productDataModification) {
                    productDataModification.base.updateImagePath(scope.kScope);
                }
            }
        });
    }
});