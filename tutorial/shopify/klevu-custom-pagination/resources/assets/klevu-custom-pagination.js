/**
 * Add landing page custom pagination bar
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addLandingPageCustomPaginationBar",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#customLandingPagePaginationBar"), "customLandingPagePagination", true);

        klevu.search.landing.getScope().customPagination = {

            /**
             * Paginate click event
             * @param {*} data 
             * @param {*} scope 
             * @param {*} event 
             */
            paginateClickEvent: function (data, scope, event) {
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
             * @param {*} data 
             * @param {*} scope 
             */
            bindPaginationEvents: function (data, scope) {
                var self = this;
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");

                klevu.each(klevu.dom.find(".kuPaginate", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        self.paginateClickEvent(data, scope, event);
                    }, true);
                });
            }
        };

        /**
         * Add pagination events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addCustomPagination",
            fire: function (data, scope) {
                klevu.search.landing.getScope().customPagination.bindPaginationEvents(data, scope);
            }
        });

    }
});