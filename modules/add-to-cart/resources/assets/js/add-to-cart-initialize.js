/**
 * Event to initialize add to cart base module
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "initializeAddToCartBaseModule",
    fire: function () {
        /** Initialize add to cart base module in landing scope */
        klevu.addToCart(klevu.search.landing.getScope().element.kScope);
    }
});