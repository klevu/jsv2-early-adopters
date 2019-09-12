/**
 * Attach Product VAT label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductVATLabel",
    fire: function () {
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductVATLabel"), "landingProductVATLabel", true);
    }
});