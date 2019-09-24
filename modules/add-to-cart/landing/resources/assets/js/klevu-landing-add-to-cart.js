/**
 * Extend addToCart base module for landing page
 */

klevu.extend({
    addToCartLanding: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.landing = {

            /**
             * Landing page Add to cart button click event
             * @param {*} ele 
             * @param {*} event 
             * @param {*} productList 
             */
            attachProductAddToCartBtnEvent: function (ele, event, productList) {
                event = event || window.event;
                event.preventDefault();
                var selected_product;
                var target = klevu.dom.helpers.getClosest(ele, ".kuAddtocart");
                var productId = target.getAttribute("data-id");
                klevu.each(productList, function (key, product) {
                    if (product.id == productId) {
                        selected_product = product;
                    }
                });
                if (selected_product) {
                    ele.selected_product = selected_product;
                    if (selected_product) {
                        mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                    }
                }
            },

            /**
             * Function to bind events to landing page product add to cart button
             * @param {*} data 
             * @param {*} scope 
             */
            bindLandingProductAddToCartBtnClickEvent: function (data, listName) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var productList = klevu.getObjectPath(data.template.query, listName);
                klevu.each(klevu.dom.find(".kuLandingAddToCartBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.attachProductAddToCartBtnEvent(this, event, productList.result);
                    });
                });
            }
        };
    }
});

/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCartButtonLandingPage",
    fire: function () {

        /** Include addToCart base module first to use base functionalities */
        klevu.addToCart(klevu.search.landing.getScope().element.kScope);

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Initalize add to cart service */
        klevu.addToCartLanding(klevu.search.landing.getScope().element.kScope);

        /** Bind landing page add to cart button click event */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.landing.getScope().addToCart.landing.bindLandingProductAddToCartBtnClickEvent(data, "productList");
            }
        });
    }
});