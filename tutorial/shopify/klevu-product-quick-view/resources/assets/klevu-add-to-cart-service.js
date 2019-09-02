/**
 * Service to provide add to cart functionality
 */
klevu.extend({
    addToCartService: function () {
        klevu.search.landing.getScope().addToCartService = {

            /*
             *	Function to toggle Body scroll style
             */
            toggleBodyScroll: function () {
                var body = klevu.dom.find("body")[0];
                var isScroll = '';
                if (!body.style.overflow) {
                    isScroll = "hidden";
                }
                body.style.overflow = isScroll;
            },

            /*
             *	Function to toggle modal UI
             */
            toggleModal: function () {
                this.toggleBodyScroll();
                var modalElement = klevu.dom.find("div.kuModal");
                if (modalElement.length) {
                    this.modal = modalElement[0];
                    this.modal.classList.toggle("show-modal");
                }
            },

            /**
             * Function to bind add to cart button event
             */
            bindAddToCartEvent: function () {
                var self = this;
                var addToCartElement = klevu.dom.find(".kuModalProductCart");

                if (addToCartElement.length) {
                    klevu.event.attach(addToCartElement[0], "click", function (event) {
                        self.attachKlevuQuickViewAddToCartBtnEvent(event);
                    });
                }
            },

            /**
             * Function to attach add to cart button event
             * @param {*} event 
             */
            attachKlevuQuickViewAddToCartBtnEvent: function (event) {
                event = event || window.event;
                event.preventDefault();
                var selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    selected_product = target[0].selected_product;
                }
                if (selected_product) {
                    this.sendAddToCartRequest(selected_product.id, 1);
                }
                this.toggleModal();
            },

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