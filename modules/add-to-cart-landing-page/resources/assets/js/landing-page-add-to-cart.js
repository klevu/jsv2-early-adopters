/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCardButtonLandingPage",
    fire: function () {

        /** Include addToCart base module first to use base functionalities */

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

        /** Initalize color swatch service */
        klevu.addToCartLanding(klevu.search.landing.getScope().element.kScope);

        /*
         *	Bind landing page add to cart button click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.search.landing.getScope().addToCart.landing.bindLandingProductAddToCartBtnClickEvent(data, "productList");
            }
        });
    }
});