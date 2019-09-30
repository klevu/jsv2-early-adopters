/**
 * Extend addToCart base module for quick search
 */

klevu.extend({
    addToCartQuick: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.quick = {

            /**
             * Quick search Add to cart button click event
             * @param {*} ele 
             * @param {*} event 
             * @param {*} productList 
             */
            attachQuickProductAddToCartBtnEvent: function (ele, event, productList) {
                event = event || window.event;
                event.preventDefault();

                var selected_product;
                var target = klevu.dom.helpers.getClosest(ele, ".klevuQuickAddtoCart");
                var productId = target.getAttribute("data-id");
                klevu.each(productList, function (key, product) {
                    if (product.id == productId) {
                        selected_product = product;
                    }
                });
                if (selected_product) {
                    if (selected_product) {
                        mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                    }
                }
            },

            /**
             * Function to bind events to Quick search product add to cart button
             * @param {*} data 
             * @param {*} scope 
             */
            bindQuickSearchProductAddToCartBtnClickEvent: function (data, listName) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var productList = klevu.getObjectPath(data.template.query, listName);

                klevu.each(klevu.dom.find(".klevuQuickCartBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.attachQuickProductAddToCartBtnEvent(this, event, productList.result);
                    });
                });
            }
        };

    }
});

/**
 *  Add to cart button functionality on quick search
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addAddToCartButtonQuickSearch",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            /** Initialize add to cart base module in quick search */
            klevu.addToCart(box.getScope().element.kScope);

            /** Initalize add to cart service */
            klevu.addToCartQuick(box.getScope().element.kScope);

            /** Set Template */
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickSearchProductAddToCart"), "quickSearchProductAddToCart", true);

            /** Bind quick page add to cart button click event */
            box.getScope().chains.template.events.add({
                name: "quickSearchProductAddToCartEvent",
                fire: function (data, scope) {
                    scope.kScope.addToCart.quick.bindQuickSearchProductAddToCartBtnClickEvent(data, "productList");
                }
            });
        });
    }
});