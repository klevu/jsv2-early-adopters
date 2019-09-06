/**
 * Event to attach product Quick view color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachQuickViewProductColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickViewProductColorSwatches"), "quickViewProductSwatch", true);

        /** Initalize color swatch service */
        klevu.colorSwatchesService();

        /**
         * parse product color swatch info
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "parseProductColorSwatch",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatchesService.parseProductColorSwatch(data, scope);
            }
        });

        /**
         * Bind color swatch events
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "bindColorGridEvents",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatchesService.bindColorGridEvents();
            }
        });

    }
});