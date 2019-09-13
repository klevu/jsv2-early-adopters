/**
 * Extension for mobile sliding filter
 */
klevu.extend({
    mobileFilterSlider: function (mainScope) {
        mainScope.mobileFilterSlider = {};
        mainScope.mobileFilterSlider.base = {
            /**
             * Function to manage slider status in target element
             * @param {*} status 
             */
            manageSliderStatus: function (status) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var scope = target.kElem;
                scope.kScope.isMobileSliderOpen = status;
            },

            /**
             * Function to attach event on filter button
             */
            attachFilterBtnClickEvent: function () {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
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
            attachFilterCloseBtnClickEvent: function () {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
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

            /**
             * Function to persisting filter slider position
             */
            persistFilterPosition: function () {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var scope = target.kElem;
                var isMobileSliderOpen = scope.kScope.isMobileSliderOpen;
                if (isMobileSliderOpen) {
                    var kuFilter = klevu.dom.find(".kuFilters", target)[0];
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
            attachButtonEvents: function () {
                this.attachFilterBtnClickEvent();
                this.attachFilterCloseBtnClickEvent();
            }
        };
    }
});

/**
 * Attach Filter slider effect
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addMobileFilterSliderEvents",
    fire: function () {
        /**
         * Function to load on landing page load
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachMobileSliderFilter",
            fire: function (data, scope) {

                /** Initialize mobileFilterSlider */
                klevu.mobileFilterSlider(klevu.search.landing.getScope().element.kScope);

                klevu.search.landing.getScope().mobileFilterSlider.base.attachButtonEvents();
                klevu.search.landing.getScope().mobileFilterSlider.base.persistFilterPosition();
            }
        });

    }
});