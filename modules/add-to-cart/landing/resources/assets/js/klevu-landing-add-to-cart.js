/**
 * Extend addToCart base module for landing page
 */


klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForLandingPage",
    fire: function () {

        /**
         * Landing page Add to cart button click event
         * @param {*} ele 
         * @param {*} event 
         * @param {*} productList 
         */
        function attachProductAddToCartBtnEvent(ele, event, productList) {
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
                    klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
            }
        }

        /**
         * Function to bind events to landing page product add to cart button
         * @param {*} scope 
         */
        function bindLandingProductAddToCartBtnClickEvent(scope) {
            var self = this;
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");

            klevu.each(klevu.dom.find(".kuLandingAddToCartBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                    if (parent && parent.dataset && parent.dataset.section) {
                        var productList = klevu.getObjectPath(scope.data.template.query, parent.dataset.section);
                        self.attachProductAddToCartBtnEvent(this, event, productList.result);
                    }
                });
            });
        }

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindLandingProductAddToCartBtnClickEvent: bindLandingProductAddToCartBtnClickEvent,
            attachProductAddToCartBtnEvent: attachProductAddToCartBtnEvent
        });
    }
});

/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCartButtonLandingPage",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Bind landing page add to cart button click event */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.modules.addToCart.base.bindLandingProductAddToCartBtnClickEvent(scope.kScope);
            }
        });
    }
});

/**
 * Klevu analyticsUtil base extension
 */
klevu.coreEvent.attach("analyticsPowerUp", {
    name: "extAddToCartAnalyticsUtil",
    fire: function () {

        /**
         * Function to register analytics on landing page add to cart button
         * @param {*} scope 
         * @param {*} className 
         * @param {*} dictionary 
         * @param {*} element 
         */
        function registerProductAddToCartClickEvent(scope, className, dictionary, element) {
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(className, target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                    if (parent === null) {
                        return;
                    }
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[shortlist:add-to-cart;;template:landing]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            registerProductAddToCartClickEvent: registerProductAddToCartClickEvent
        });

    }
});


/**
 * Function to attach analytics event on add to cart button
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingProductAddToCartButtonAnalytics",
    fire: function () {

        /**
         * Event to bind analytics on add to cart click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnAddToCartButtonEvent",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerProductAddToCartClickEvent(
                    scope.kScope,
                    ".kuAddtocart",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );
            }
        });
    }
});