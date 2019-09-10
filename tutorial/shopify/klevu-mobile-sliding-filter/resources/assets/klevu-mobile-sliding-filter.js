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
            attachFilterBtnClickEvent: function () {
                var self = this;
                var filterBtn = klevu.dom.find(".kuBtn.kuFacetsSlideIn");
                if (filterBtn && filterBtn[0]) {
                    filterBtn = filterBtn[0];
                    klevu.event.attach(filterBtn, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var kuFiltersContainer = klevu.dom.find(".kuFilters");
                        if (kuFiltersContainer && kuFiltersContainer[0]) {
                            kuFiltersContainer = kuFiltersContainer[0];
                            kuFiltersContainer.classList.add("kuFiltersIn");
                            self.manageSliderStatus(true);
                        }
                    })
                }
            },

            /**
             * Function to add event on slider close button
             */
            attachFilterCloseBtnClickEvent: function () {
                var self = this;
                var filterCloseBtn = klevu.dom.find(".kuMobileFilterCloseBtn");
                if (filterCloseBtn && filterCloseBtn[0]) {
                    filterCloseBtn = filterCloseBtn[0];
                    klevu.event.attach(filterCloseBtn, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var kuFiltersContainer = klevu.dom.find(".kuFilters");
                        if (kuFiltersContainer && kuFiltersContainer[0]) {
                            kuFiltersContainer = kuFiltersContainer[0];
                            kuFiltersContainer.classList.remove("kuFiltersIn");
                            self.manageSliderStatus(false);
                        }
                    })
                }
            },

            /**
             * Function to attach events on buttons
             */
            attachButtonEvents: function () {
                this.attachFilterBtnClickEvent();
                this.attachFilterCloseBtnClickEvent();
            }
        };

        /**
         * Function to load on landing page load
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachMobileSliderFilter",
            fire: function (data, scope) {
                klevu.search.landing.getScope().mobileFilterSlider.attachButtonEvents();
                var isMobileSliderOpen = klevu.dom.find(".klevuTarget")[0].isMobileSliderOpen;
                if (isMobileSliderOpen) {
                    klevu.dom.find(".kuFilters")[0].classList.add("kuFiltersIn");
                }
            }
        });

    }
});