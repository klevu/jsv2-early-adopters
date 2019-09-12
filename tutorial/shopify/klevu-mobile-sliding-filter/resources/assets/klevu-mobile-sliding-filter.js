/**
 * Attach Filter slider effect
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addMobileFilterSliderEvents",
    fire: function () {
        klevu.search.landing.getScope().mobileFilterSlider = {
            /**
             * Function to manage slider status in target element
             * @param {*} status 
             */
            manageSliderStatus: function (status) {
                var klevuTarget = klevu.dom.find(".klevuTarget")[0];
                klevuTarget.isMobileSliderOpen = status;
            },

            /**
             * Function to attach event on filter button
             */
            attachFilterBtnClickEvent: function (data, scope) {
                var self = this;
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
                    klevu.event.attach(ele, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        self.toggleBodyScroll();
                        var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                            ele.classList.add("kuFiltersIn");
                            self.manageSliderStatus(true);
                        });

                    });
                });
            },

            /**
             * Function to add event on slider close button
             */
            attachFilterCloseBtnClickEvent: function (data, scope) {
                var self = this;
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuMobileFilterCloseBtn", target), function (index, ele) {
                    klevu.event.attach(ele, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        self.toggleBodyScroll();
                        var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                            ele.classList.remove("kuFiltersIn");
                            self.manageSliderStatus(false);
                        });

                    });
                });
            },

            persistFilterPosition: function (data, scope) {
                var isMobileSliderOpen = klevu.dom.find(".klevuTarget")[0].isMobileSliderOpen;
                if (isMobileSliderOpen) {
                    var kuFilter = klevu.dom.find(".kuFilters")[0];
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
                        var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuMeta");
                        var dataSection = parentElem.getAttribute("data-section");
                        if (dataSection) {
                            var klevuWrap = klevu.dom.helpers.getClosest(ele, ".klevuWrap");
                            var isActive = klevuWrap.classList.contains(dataSection + "Active");
                            if (isActive) {
                                var filterEle = klevu.dom.find(".kuFilters", parentElem);
                                if (filterEle && filterEle[0]) {
                                    kuFilter = filterEle[0];
                                }
                            }
                        }
                    });
                    kuFilter.classList.add("kuFiltersIn");
                }
            },

            /*
             *	Function to toggle Body scroll style
             */
            toggleBodyScroll: function () {
                var body = klevu.dom.find("body")[0];
                var isScroll = '';
                if (!body.style.overflow) {
                    isScroll = "hidden";
                }
                body.style.overflow = isScroll;
            },

            /**
             * Function to attach events on buttons
             */
            attachButtonEvents: function (data, scope) {
                this.attachFilterBtnClickEvent(data, scope);
                this.attachFilterCloseBtnClickEvent(data, scope);
            }
        };

        /**
         * Function to load on landing page load
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachMobileSliderFilter",
            fire: function (data, scope) {
                klevu.search.landing.getScope().mobileFilterSlider.attachButtonEvents(data, scope);
                klevu.search.landing.getScope().mobileFilterSlider.persistFilterPosition(data, scope);
            }
        });

    }
});