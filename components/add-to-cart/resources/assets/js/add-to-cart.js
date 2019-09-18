/**
 * Add to cart base component
 */
klevu.extend({
    addToCart: function (mainScope) {
        mainScope.addToCart = {};
        mainScope.addToCart.base = {

            /**
             * Function to send Add to cart request
             * @param {*} variantId 
             * @param {*} quantity 
             */
            sendAddToCartRequest: function (variantId, quantity) {
                var self = this;
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
        };
    }
});