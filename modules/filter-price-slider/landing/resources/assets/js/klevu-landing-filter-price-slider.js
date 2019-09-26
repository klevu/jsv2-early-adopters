/**
 * Extension for filter price slider
 */
klevu.extend({
    filterPriceSlider: function (mainScope) {
        mainScope.filterPriceSlider = {};
        mainScope.filterPriceSlider.base = {
            initSlider: function (data) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                var priceSliderList = klevu.dom.find(".kuPriceSlider [data-querykey]", target);
                if (priceSliderList) {
                    priceSliderList.forEach(function (ele) {
                        var sliderData;
                        var querykey = ele.getAttribute("data-querykey");
                        var contentData = data.template.query[querykey];
                        if (contentData) {
                            contentData.filters.forEach(function (filter) {
                                if (filter.key == mainScope.priceSliderFilterReqQuery.key && filter.type == "SLIDER") {
                                    sliderData = filter;
                                }
                            });
                        }
                        if (sliderData) {
                            if (ele.slider) {
                                ele.slider.destroy();
                            }
                            ele.sliderData = sliderData;
                            ele.slider = noUiSlider.create(ele, {
                                start: [parseInt(sliderData.start), parseInt(sliderData.end)],
                                connect: true,
                                range: {
                                    'min': [parseInt(sliderData.min)],
                                    'max': [parseInt(sliderData.max)]
                                }
                            });
                            ele.slider.on('update', function (values, handle) {
                                klevu.dom.find(".minValue" + querykey)[0].innerHTML = parseInt(values[0]);
                                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = parseInt(values[1]);
                            });
                            ele.slider.on('change', function (values, handle) {
                                self.sliderOnUpdateEvent(values, querykey, data, ele);
                            });
                        }
                    });
                }
            },

            /**
             * Slider filter on value change event
             * @param {*} values 
             * @param {*} querykey 
             * @param {*} data 
             * @param {*} ele 
             */
            sliderOnUpdateEvent: function (values, querykey, data, ele) {
                var min = parseInt(values[0]);
                var max = parseInt(values[1]);
                klevu.dom.find(".minValue" + querykey)[0].innerHTML = min;
                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = max;

                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");

                /** Get Scope */
                var sliderFilter = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter", target)[0], ".klevuTarget");

                var scope = sliderFilter.kElem;
                scope.kScope.data = scope.kObject.resetData(scope.kElem);

                var options = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter", target)[0], ".klevuMeta");

                var localQuery = data.localOverrides.query[querykey];
                var localFilters = localQuery.filters;
                var sliderFilterReqObj = {
                    key: ele.sliderData.key,
                    settings: {
                        singleSelect: "false"
                    },
                    values: [
                        min.toString(), max.toString()
                    ]
                };
                if (!localFilters) {
                    localQuery.filters = {};
                    localQuery.filters.applyFilters = {};
                    localQuery.filters.applyFilters.filters = [sliderFilterReqObj];
                } else {
                    var applyFilters = localFilters.applyFilters.filters;
                    var isUpdated = false;
                    applyFilters.forEach(function (filter) {
                        if (filter.key == ele.sliderData.key) {
                            isUpdated = true;
                            filter.values = [min.toString(), max.toString()];
                        }
                    });
                    if (!isUpdated) {
                        applyFilters.push(sliderFilterReqObj);
                    }
                }

                /** reset offset after filter change */
                klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);

            }
        };
    }
});

/**
 * Add Price slider paramter in request object functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachPriceSliderFilter",
    fire: function () {

        /** Initialize filterPriceSlider */
        klevu.filterPriceSlider(klevu.search.landing.getScope().element.kScope);

        /** Price slider filter request query */
        klevu.search.landing.getScope().priceSliderFilterReqQuery = {
            key: "klevu_price",
            minMax: true
        };

        /** Function to add range filters in request filter object */
        klevu.search.landing.getScope().chains.request.build.addAfter('addProductList', {
            name: "addPriceSlider",
            fire: function (data, scope) {
                var requestQueries = data.request.current.recordQueries;
                requestQueries.forEach(function (req) {
                    if (req.id == "productList") {
                        req.filters.filtersToReturn.rangeFilterSettings = [klevu.search.landing.getScope().priceSliderFilterReqQuery];
                    }
                });
            }
        });

        /**
         *  Initialize slider
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "initSliderFilter",
            fire: function (data, scope) {
                klevu.search.landing.getScope().filterPriceSlider.base.initSlider(data, scope);
            }
        });

    }
});