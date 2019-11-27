/**
 * Color swatch landing page extension
 */

klevu.coreEvent.attach("colorSwatchesModuleBuild", {
    name: "extendColorSwatchesModuleForLandingPage",
    fire: function () {


        /**
         * Function to get nearest product image element
         * @param {*} ele 
         */
        function getNearestProductImageByElement(ele) {
            var img;
            var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
            klevu.each(klevu.dom.find(".klevuImgWrap img", parentElem), function (key, value) {
                if (value) {
                    img = value;
                }
            });
            return img;
        }

        /**
         * Function to map swatches data to landing page color swatches
         * @param {*} ele 
         * @param {*} productResults 
         */
        function landingMapColorSwatchesData(ele, productResults) {
            var selected_product;
            var productElement = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
            if (productElement) {
                var productId = productElement.getAttribute("data-id");
                if (productId) {
                    klevu.each(productResults, function (key, product) {
                        if (product.id == productId) {
                            selected_product = product;
                        }
                    });
                    if (selected_product && selected_product.swatchesInfo) {
                        var variantId = ele.getAttribute("data-variant");
                        if (variantId) {
                            klevu.each(selected_product.swatchesInfo, function (key, swatch) {
                                if (swatch.variantId == variantId) {
                                    ele.swatchesInfo = swatch;
                                }
                            });
                        }
                    }
                }
            }
        }

        /**
         * Landing page grid mouse enter event
         * @param {*} ele 
         */
        function landingColorGridMouseEnterEvent(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                productImageElement.setAttribute("src", ele.swatchesInfo.variantImage);
            }
        }

        /**
         * Landing color grid mouse leave event
         * @param {*} ele 
         */
        function landingColorGridMouseLeaveEvent(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                productImageElement.setAttribute("src", ele.defaultImage);
            }
        }

        /**
         * Function to set default product image to color swatch element
         * @param {*} ele 
         */
        function landingSetDefaultProductImageToSwatches(ele) {
            var productImageElement = this.getNearestProductImageByElement(ele);
            if (productImageElement) {
                ele.defaultImage = productImageElement.getAttribute("src");
            }
        }

        /**
         * Function to bind events to landing page product color swatches
         * @param {*} scope 
         */
        function bindColorGridEventsToLandingProducts(scope) {
            var self = this;
            klevu.each(scope.data.response.current.queryResults, function (key, value) {
                if (value && value.id) {
                    var productResults;
                    var items = klevu.getObjectPath(scope.data.template.query, value.id);
                    if (items && items.result) {
                        productResults = items.result;
                    }
                    var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find('.klevuLandingSwatchColorGrid', target), function (key, value) {
                        self.landingMapColorSwatchesData(value, productResults);
                        self.landingSetDefaultProductImageToSwatches(value);
                        klevu.event.attach(value, "mouseenter", function (event) {
                            self.landingColorGridMouseEnterEvent(value);
                        });
                        klevu.event.attach(value, "mouseleave", function (event) {
                            self.landingColorGridMouseLeaveEvent(value);
                        });
                    });
                }
            });
        }

        klevu.extend(true, klevu.search.modules.colorSwatches.base, {
            bindColorGridEventsToLandingProducts: bindColorGridEventsToLandingProducts,
            getNearestProductImageByElement: getNearestProductImageByElement,
            landingMapColorSwatchesData: landingMapColorSwatchesData,
            landingColorGridMouseEnterEvent: landingColorGridMouseEnterEvent,
            landingColorGridMouseLeaveEvent: landingColorGridMouseLeaveEvent,
            landingSetDefaultProductImageToSwatches: landingSetDefaultProductImageToSwatches
        });
    }
});

/**
 * Event to attach landing page product color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageProductColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);

        /**
         * Initialize color swatches and service before rendering
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "initializeLandingProductSwatches",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    klevu.each(data.response.current.queryResults, function (key, value) {
                        if (value && value.id) {
                            klevu.search.modules.colorSwatches.base.parseProductColorSwatch(scope.kScope, value.id);
                        }
                    });
                }
            }
        });

        /*
         *	Bind landing page color swatches events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addProductGridColorSwatches",
            fire: function (data, scope) {
                klevu.search.modules.colorSwatches.base.bindColorGridEventsToLandingProducts(scope.kScope);
            }
        });

    }
});