/**
 * Attach Product badge
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addSearchResultProductBadges",
    fire: function () {
        
        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductBadge"), "landingProductBadge", true);
    }
});