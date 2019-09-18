/**
 * Event to initialize color swatches base module
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "initializeColorSwatchBaseModule",
    fire: function () {
        /** Initialize color swatch base module in landing scope */
        klevu.colorSwatches(klevu.search.landing.getScope().element.kScope);
    }
});