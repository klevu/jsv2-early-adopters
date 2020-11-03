/**
 * Extension for mobile sliding filter
 */

(function (klevu) {

    /**
     * Function to manage slider status in target element
     * @param {*} status 
     */
    function manageSliderStatus(status, scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        var elScope = target.kElem;
        elScope.kScope.isMobileSliderOpen = status;
    };

    /**
     * Function to attach event on filter button
     */
    function attachFilterBtnClickEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuMobileFilterBtn", target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                self.toggleBodyScroll();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                    ele.classList.add("kuFiltersIn");
                    self.manageSliderStatus(true,scope);
                });

            });
        });
    };

    /**
     * Function to add event on slider close button
     */
    function attachFilterCloseBtnClickEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuMobileFilterCloseBtn", target), function (index, ele) {
            klevu.event.attach(ele, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                self.toggleBodyScroll();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                klevu.each(klevu.dom.find(".kuFilters", parentElem), function (index, ele) {
                    ele.classList.remove("kuFiltersIn");
                    self.manageSliderStatus(false,scope);
                });

            });
        });
    };

    /**
     * Function to persisting filter slider position
     */
    function persistFilterPosition(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
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
    };

    /*
     *	Function to toggle Body scroll style
     */
    function toggleBodyScroll() {
        var body = klevu.dom.find("body")[0];
        var isScroll = '';
        if (!body.style.overflow) {
            isScroll = "hidden";
        }
        body.style.overflow = isScroll;
    };

    /**
     * Function to attach events on buttons
     */
    function attachButtonEvents(scope) {
        this.attachFilterBtnClickEvent(scope);
        this.attachFilterCloseBtnClickEvent(scope);
    }

    var mobileFilterSlider = {
        attachButtonEvents: attachButtonEvents,
        attachFilterBtnClickEvent: attachFilterBtnClickEvent,
        attachFilterCloseBtnClickEvent: attachFilterCloseBtnClickEvent,
        toggleBodyScroll: toggleBodyScroll,
        persistFilterPosition: persistFilterPosition,
        manageSliderStatus: manageSliderStatus
    };

    klevu.extend(true, klevu.search.modules, {
        mobileFilterSlider: {
            base: mobileFilterSlider,
            build: true
        }
    });
})(klevu);

/**
 * mobileFilterSlider module build event
 */
klevu.coreEvent.build({
    name: "mobileFilterSliderModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.mobileFilterSlider ||
            !klevu.search.modules.mobileFilterSlider.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
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
                klevu.search.modules.mobileFilterSlider.base.attachButtonEvents(scope.kScope);
                klevu.search.modules.mobileFilterSlider.base.persistFilterPosition(scope.kScope);
            }
        });

    }
});