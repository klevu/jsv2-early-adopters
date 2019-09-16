/**
 * Extend addToCart base module for Quick view
 */

klevu.extend({
    addToCartQuickView: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.quickView = {

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
                    modalElement[0].classList.toggle("show-modal");
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
                    mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
                this.toggleModal();
            },

            /**
             * Function to bind add to cart button event
             */
            bindAddToCartEvent: function () {
                var self = this;
                var addToCartElement = klevu.dom.find(".kuModalProductCart", ".productQuickView");
                if (addToCartElement.length) {
                    klevu.event.attach(addToCartElement[0], "click", function (event) {
                        self.attachKlevuQuickViewAddToCartBtnEvent(event);
                    });
                }
            }
        };


    }
});