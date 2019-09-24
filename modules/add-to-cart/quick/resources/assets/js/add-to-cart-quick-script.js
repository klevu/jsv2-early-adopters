/**
 *  Add to cart button functionality on quick search
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addAddToCartButtonQuickSearch",
    fire: function () {

        /** Include addToCart base module first to use base functionalities */

        /** Set Template */
        klevu.search.quick.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickSearchProductAddToCart"), "quickSearchProductAddToCart", true);

        /** Initalize add to cart service */
        klevu.addToCartQuick(klevu.search.quick.getScope().element.kScope);

        /** Bind quick page add to cart button click event */
        klevu.search.quick.getScope().chains.template.events.add({
            name: "quickSearchProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.quick.getScope().addToCart.quick.bindQuickSearchProductAddToCartBtnClickEvent(data, "productList");
            }
        });
    }
});