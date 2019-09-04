/**
 * Add Price slider paramter in request object functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "price-slider-filter",
    fire: function () {
        
        /** Price slider filter request query */
        klevu.search.landing.getScope().priceSliderFilterReqQuery = {
            key: "price",
            minMax: true,
            rangeInterval: 500
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

        /** Slider filter object */
        klevu.search.landing.getScope().sliderFilter = {
            initSlider: function (data, scope) {
                var self = this;
                var priceSliderList = klevu.dom.find("[data-querykey]");
                if (priceSliderList) {
                    priceSliderList.innerHTML = "";
                    priceSliderList.forEach(function (ele) {
                        var sliderData;
                        var querykey = ele.getAttribute("data-querykey");
                        var contentData = data.template.query[querykey];
                        if (contentData) {
                            contentData.filters.forEach(function (filter) {
                                if (filter.key == klevu.search.landing.getScope().priceSliderFilterReqQuery.key && filter.type == "SLIDER") {
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
                                start: [sliderData.start, sliderData.end],
                                connect: true,
                                range: {
                                    'min': [sliderData.min],
                                    'max': [sliderData.max]
                                }
                            });
                            ele.slider.on('update', function (values, handle) {
                                klevu.dom.find(".minValue" + querykey)[0].innerHTML = parseInt(values[0]);
                                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = parseInt(values[1]);
                            });
                            ele.slider.on('change', function (values, handle) {
                                self.sliderOnUpdateEvent(values, handle, querykey, data, scope, ele);
                            });
                        }
                    });
                }
            },

            /**
             * Slider filter on value change event
             * @param {*} values 
             * @param {*} handle 
             * @param {*} querykey 
             * @param {*} data 
             * @param {*} scope 
             * @param {*} ele 
             */
            sliderOnUpdateEvent: function (values, handle, querykey, data, scope, ele) {
                var min = parseInt(values[0]);
                var max = parseInt(values[1]);
                klevu.dom.find(".minValue" + querykey)[0].innerHTML = min;
                klevu.dom.find(".maxValue" + querykey)[0].innerHTML = max;

                /** Get Scope */
                var target = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter")[0], ".klevuTarget");
                if (target === null) {
                    /* DEBUG CODE START */
                    if (klevu.settings.console.type.event) {
                        klevu.logDebug("Event - Filter - No Render Target Defined - Check class declarations");
                    }
                    /* DEBUG CODE END */
                    return;
                }

                var scope = target.kElem;
                scope.kScope.data = scope.kObject.resetData(scope.kElem);

                var options = klevu.dom.helpers.getClosest(klevu.dom.find(".klevuSliderFilter")[0], ".klevuMeta");
                if (options === null) {
                    /* DEBUG CODE START */
                    if (klevu.settings.console.type.event) {
                        klevu.logDebug("Event - Filter - No Meta Defined");
                    }
                    /* DEBUG CODE END */
                    return;
                }
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

        /**
         *  Initialize slider
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "initSliderFilter",
            fire: function (data, scope) {
                klevu.search.landing.getScope().sliderFilter.initSlider(data, scope);
            }
        });

    }
});