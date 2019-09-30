/**
 * Attach Product stock availability label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductavailabilityLabel",
    fire: function () {
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductStock"), "landingProductStock", true);
    }
});