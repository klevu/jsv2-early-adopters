/**
 * Event to initialize add to cart base component
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "initializeAddToCartBaseModuleQuick",
    fire: function () {

        /** Initialize add to cart base module in quick search */
        klevu.addToCart(klevu.search.quick.getScope().element.kScope);

    }
});