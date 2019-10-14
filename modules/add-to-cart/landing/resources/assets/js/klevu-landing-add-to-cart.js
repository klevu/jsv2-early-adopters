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

        /** Initalize add to cart service */
        klevu.addToCartLanding(klevu.search.landing.getScope().element.kScope);

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);
        

        /** Bind landing page add to cart button click event */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.landing.getScope().addToCart.landing.bindLandingProductAddToCartBtnClickEvent(data, "productList");
            }
        });
    }
});


/**
 * Klevu analytics implementation for Landing page add to cart button
 */

klevu.extend({
    analyticsUtilsLandingAddToCart: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.landingAddToCart = {
            /**
             * Function to fire analytics click call on add to cart button
             */
            bindAddToCartClickAnalytics: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuAddtocart", target), function (key, value) {
                    klevu.event.attach(value, "mousedown", function (event) {
                        var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                        if (parent === null) {
                            return;
                        }
                        var productId = parent.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope);
                            if (product) {
                                var termOptions = mainScope.analyticsUtils.base.getTermOptions();
                                termOptions.productId = product.id;
                                termOptions.productName = product.name;
                                termOptions.productUrl = product.url;
                                termOptions.src = "shortlist:add-to-cart:landing";
                                klevu.analyticsEvents.click(termOptions);
                            }
                        }
                    });
                });
            }
        };
    }
});


klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingProductAddToCartButtonAnalytics",
    fire: function () {
        /** initialize add to cart analytics functionality */
        klevu.analyticsUtilsLandingAddToCart(klevu.search.landing.getScope().element.kScope);

        /**
         * Event to bind analytics on add to cart click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnAddToCartButtonEvent",
            fire: function (data, scope) {
                klevu.search.landing.getScope().analyticsUtils.landingAddToCart.bindAddToCartClickAnalytics();
            }
        });
    }
});