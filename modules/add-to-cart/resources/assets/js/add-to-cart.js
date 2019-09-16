/**
 * Add to cart base module
 */
klevu.extend({
    addToCart: function (mainScope) {
        mainScope.addToCart = {};
        mainScope.addToCart.base = {

            /**
             * Function to update cart count UI
             * @param {*} updatedCartCount 
             */
            appendUpdatedCartCount: function (updatedCartCount) {
                if (parseInt(updatedCartCount)) {
                    var cartContainer = klevu.dom.find('[data-cart-count-bubble]');
                    if (cartContainer.length) {
                        cartContainer[0].classList.remove('hide');
                    }
                    var cartCount = klevu.dom.find('[data-cart-count]');
                    if (cartCount.length) {
                        cartCount[0].innerHTML = updatedCartCount;
                    }
                }
            },

            /**
             * Function to get total count from the response
             * @param {*} res 
             */
            getTotalCardCountFromResponse: function (res) {
                var updatedCount = 0;;
                var hiddenElement = document.createElement("div");
                hiddenElement.style.display = "none";
                hiddenElement.innerHTML = res;
                var cartCount = klevu.dom.find('[data-cart-count]', hiddenElement);
                if (cartCount.length) {
                    updatedCount = cartCount[0].innerHTML;
                }
                hiddenElement = "";
                delete hiddenElement;
                return updatedCount;
            },

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
                klevu.ajax("/cart/add", {
                    method: "POST",
                    mimeType: "application/json; charset=UTF-8",
                    data: JSON.stringify(requestPayload),
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    crossDomain: true,
                    success: function (klXHR) {},
                    error: function (klXHR) {},
                    done: function (klXHR) {
                        self.appendUpdatedCartCount(self.getTotalCardCountFromResponse(klXHR.responseText));
                    }
                });
            }
        };
    }
});