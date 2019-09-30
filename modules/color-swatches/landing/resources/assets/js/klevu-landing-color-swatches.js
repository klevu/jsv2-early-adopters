/**
 * Color swatch landing page extension
 */
klevu.extend({
    colorSwatchesLanding: function (mainScope) {

        if (!mainScope.colorSwatches) {
            console.log("Color swatch base module is missing!");
            return;
        }

        mainScope.colorSwatches.landing = {

            /**
             * Function to get nearest product image element
             * @param {*} ele 
             */
            getNearestProductImageByElement: function (ele) {
                var img;
                var parentElem = klevu.dom.helpers.getClosest(ele, ".klevuProduct");
                klevu.each(klevu.dom.find(".klevuImgWrap img", parentElem), function (key, value) {
                    if (value) {
                        img = value;
                    }
                });
                return img;
            },

            /**
             * Function to map swatches data to landing page color swatches
             * @param {*} ele 
             * @param {*} productResults 
             */
            landingMapColorSwatchesData: function (ele, productResults) {
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
            },

            /**
             * Landing page grid mouse enter event
             * @param {*} ele 
             */
            landingColorGridMouseEnterEvent: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    productImageElement.setAttribute("src", ele.swatchesInfo.variantImage);
                }
            },

            /**
             * Landing color grid mouse leave event
             * @param {*} ele 
             */
            landingColorGridMouseLeaveEvent: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    productImageElement.setAttribute("src", ele.defaultImage);
                }
            },

            /**
             * Function to set default product image to color swatch element
             * @param {*} ele 
             */
            landingSetDefaultProductImageToSwatches: function (ele) {
                var productImageElement = this.getNearestProductImageByElement(ele);
                if (productImageElement) {
                    ele.defaultImage = productImageElement.getAttribute("src");
                }
            },

            /**
             * Function to bind events to landing page product color swatches
             * @param {*} data 
             */
            bindColorGridEventsToLandingProducts: function (data) {
                var self = this;
                var productResults;
                var items = klevu.getObjectPath(data.template.query, 'productList');
                if (items && items.result) {
                    productResults = items.result;
                }
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
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
        }
    }
});

/**
 * Event to attach landing page product color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingPageProductColorSwatch",
    fire: function () {

        /** Include Color swatches base module first to use base functionalities */
        klevu.colorSwatches(klevu.search.landing.getScope().element.kScope);

        /** Initalize color swatch service */
        klevu.colorSwatchesLanding(klevu.search.landing.getScope().element.kScope);

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductColorSwatches"), "landingProductSwatch", true);

        /**
         * Initialize color swatches and service before rendering
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "initializeLandingProductSwatches",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    klevu.search.landing.getScope().colorSwatches.base.parseProductColorSwatch(data, 'productList');
                }
            }
        });

        /*
         *	Bind landing page color swatches events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addProductGridColorSwatches",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatches.landing.bindColorGridEventsToLandingProducts(data);
            }
        });

    }
});