/**
 * Extend addToCart base module for quick search
 */

klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForQuickSearch",
    fire: function () {

        /**
         * Quick search Add to cart button click event
         * @param {*} ele 
         * @param {*} event 
         * @param {*} productList 
         */
        function attachQuickProductAddToCartBtnEvent(ele, event, productList) {
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
                    klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
            }
        }

        /**
         * Function to bind events to Quick search product add to cart button
         * @param {*} scope 
         */
        function bindQuickSearchProductAddToCartBtnClickEvent(scope) {
            var self = this;
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(".klevuQuickCartBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(this, ".klevuQuickSearchResults");
                    if (parent && parent.dataset && parent.dataset.section) {
                        var productList = klevu.getObjectPath(scope.data.template.query, parent.dataset.section);
                        if (productList) {
                            self.attachQuickProductAddToCartBtnEvent(this, event, productList.result);
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindQuickSearchProductAddToCartBtnClickEvent: bindQuickSearchProductAddToCartBtnClickEvent,
            attachQuickProductAddToCartBtnEvent: attachQuickProductAddToCartBtnEvent
        });
    }
});

/**
 *  Add to cart button functionality on quick search
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addAddToCartButtonQuickSearch",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            /** Set Template */
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickSearchProductAddToCart"), "quickSearchProductAddToCart", true);

            /** Bind quick page add to cart button click event */
            box.getScope().chains.template.events.add({
                name: "quickSearchProductAddToCartEvent",
                fire: function (data, scope) {
                    klevu.search.modules.addToCart.base.bindQuickSearchProductAddToCartBtnClickEvent(scope.kScope);
                }
            });
        });
    }
});