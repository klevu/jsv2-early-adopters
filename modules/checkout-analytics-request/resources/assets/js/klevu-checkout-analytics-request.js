/**
 * Extend analytics util component to add 
 * standalone Klevu checkout analytics request.
 */

klevu.coreEvent.attach("analyticsPowerUp", {
    name: "addCheckoutAnalyticsFunction",
    fire: function () {

        /**
         * Function to send checkout analytics call independently
         * @param {*} productId 
         * @param {*} unit 
         * @param {*} salePrice 
         * @param {*} currency 
         * @param {*} shopperIp 
         */
        function sendCheckoutAnalyticsRequest(productId, unit, salePrice, currency, shopperIp) {
            var reqQueryObj = {
                klevu_productId: productId,
                klevu_unit: unit,
                klevu_salePrice: salePrice,
                klevu_currency: currency,
                klevu_shopperIP: shopperIp
            };
            klevu.analyticsEvents.buy(reqQueryObj);
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            sendCheckoutAnalyticsRequest: sendCheckoutAnalyticsRequest
        });

    }
});