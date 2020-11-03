/**
 * Add to cart base component
 */

(function (klevu) {

    /**
     * Function to send Add to cart request
     * @param {*} scope 
     * @param {*} variantId 
     * @param {*} quantity 
     */
    function sendAddToCartRequest(variantId, quantity) {
        var requestPayload = {
            id: variantId,
            quantity: quantity
        };
        /**
         * Shopify version of add to cart request.
         * Other frameworks may have other type of request for add to cart.
         * Hence, modify request code accordingly.
         */

        klevu.ajax("/cart/add", {
            method: "POST",
            mimeType: "application/json; charset=UTF-8",
            data: JSON.stringify(requestPayload),
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            crossDomain: true,
            success: function (klXHR) {},
            error: function (klXHR) {},
            done: function (klXHR) {}
        });
    }

    var addToCart = {
        sendAddToCartRequest: sendAddToCartRequest
    };

    klevu.extend(true, klevu.search.modules, {
        addToCart: {
            base: addToCart,
            build: true
        }
    });

})(klevu);

/**
 * addToCart module build event
 */
klevu.coreEvent.build({
    name: "addToCartModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.addToCart ||
            !klevu.search.modules.addToCart.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});