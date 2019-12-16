/**
 * Facets implementation
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addFacetsOnLandingPage",
    fire: function () {
        
        /** Load filters template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeFilterLeft",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
        });
    }
});