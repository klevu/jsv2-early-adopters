/**
 * Extend klevu object for custom pagination functionality
 */

(function (klevu) {

    /**
     * Paginate click event
     * @param {*} scope 
     * @param {*} event 
     */
    function paginateClickEvent(event) {
        event = event || window.event;
        event.preventDefault();

        var element = event.target;
        var target = klevu.dom.helpers.getClosest(element, ".klevuTarget");
        if (target === null) {
            return;
        }
        var scope = target.kElem;
        scope.kScope.data = scope.kObject.resetData(scope.kElem);
        scope.kScope.data.context.keyCode = 0;
        scope.kScope.data.context.eventObject = event;
        scope.kScope.data.context.event = "keyUp";
        scope.kScope.data.context.preventDefault = false;

        var options = klevu.dom.helpers.getClosest(element, ".klevuMeta");
        var offset = element.dataset.offset;
        offset = (offset < 0) ? 0 : offset;

        klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", parseInt(offset));
        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
    };

    /**
     * Function to bind pagination events
     * @param {*} paginateClass paginate link container class
     */
    function bindPaginationEvents(scope, paginateClass) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(paginateClass, target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                self.paginateClickEvent(event);
            }, true);
        });
    };

    var customPagination = {
        paginateClickEvent: paginateClickEvent,
        bindPaginationEvents: bindPaginationEvents
    };

    klevu.extend(true, klevu.search.modules, {
        customPagination: {
            base: customPagination,
            build: true
        }
    });

})(klevu);

/**
 * customPagination module build event
 */
klevu.coreEvent.build({
    name: "paginationModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.customPagination ||
            !klevu.search.modules.customPagination.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add landing page custom pagination bar
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addLandingPageCustomPaginationBar",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#customLandingPagePaginationBar"), "customLandingPagePagination", true);

        /**
         * Add pagination events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addCustomPagination",
            fire: function (data, scope) {

                /** Binding events for pagination on landing page */
                klevu.search.modules.customPagination.base.bindPaginationEvents(scope.kScope, ".kuPaginate");
            }
        });

    }
});