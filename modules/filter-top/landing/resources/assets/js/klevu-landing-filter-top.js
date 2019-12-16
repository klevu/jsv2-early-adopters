/**
 * Facets implementation
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addTopFacetsOnLandingPage",
    fire: function () {

        /** Load filters template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTopFilters"), "filtersTop", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeFilterTop",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
        });
    }
});