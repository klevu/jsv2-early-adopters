/**
 * Extend klevu object for custom pagination functionality
 */
klevu.extend({
    customPagination: function (mainScope) {
        mainScope.customPagination = {};
        mainScope.customPagination.base = {

            /**
             * Paginate click event
             * @param {*} scope 
             * @param {*} event 
             */
            paginateClickEvent: function (event) {
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
            },

            /**
             * Function to bind pagination events
             * @param {*} paginateClass paginate link container class
             */
            bindPaginationEvents: function (paginateClass) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(paginateClass, target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.paginateClickEvent(event);
                    }, true);
                });
            }
        };
    }
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

                /** Initializing custom pagination */
                klevu.customPagination(klevu.search.landing.getScope().element.kScope);

                klevu.search.landing.getScope().customPagination.base.bindPaginationEvents(".kuPaginate");

            }
        });

    }
});