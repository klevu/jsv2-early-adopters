/**
 * Color swatch Quick view extension
 */

klevu.coreEvent.attach("colorSwatchesModuleBuild", {
    name: "extendColorSwatchesModuleForQuickView",
    fire: function () {

        /**
         * Function to get image element
         */
        function getProductImageElement() {
            var img;
            var target = klevu.dom.find(".productQuick-imgBlock img");
            if (target && target[0]) {
                img = target[0];
            }
            return img;
        };

        /**
         * Color grid mouse enter event
         * @param {*} ele 
         */
        function colorGridMouseEnterEvent(ele) {
            var imgEle = this.getProductImageElement();
            if (imgEle) {
                imgEle.setAttribute("src", ele.swatchesInfo.variantImage);
            }
        };

        /**
         * Color grid mouse leave event
         * @param {*} product 
         */
        function colorGridMouseLeaveEvent(product) {
            var imgEle = this.getProductImageElement();
            if (imgEle) {
                var variantId = product.id;
                var swatchesInfo = product.swatchesInfo;
                swatchesInfo.forEach(function (swatch) {
                    if (variantId == swatch.variantId) {
                        imgEle.setAttribute("src", swatch.variantImage);
                    }
                });
            }
        };

        /**
         * Function to map data with color grid
         * @param {*} product 
         */
        function mapSwatchObjectToColorGrid(product) {
            var self = this;
            klevu.each(klevu.dom.find('.klevuSwatchColorGrid'), function (key, value) {
                var variantId = value.getAttribute("data-variant");
                if (variantId) {
                    product.swatchesInfo.forEach(function (swatch) {
                        if (swatch.variantId == variantId) {
                            value.swatchesInfo = swatch;
                        }
                    });
                    klevu.event.attach(value, "mouseenter", function (event) {
                        self.colorGridMouseEnterEvent(value);
                    });
                    klevu.event.attach(value, "mouseleave", function (event) {
                        self.colorGridMouseLeaveEvent(product);
                    });
                }
            });
        };

        /**
         * Function to get selected product data
         */
        function getSelectedProductData() {
            var selected_product;
            var target = klevu.dom.find(".productQuickView");
            if (target && target[0]) {
                selected_product = target[0].selected_product;
            }
            return selected_product;
        };

        /**
         * Function to bind events with color grid
         */
        function bindColorGridEvents() {
            var product = this.getSelectedProductData();
            if (product && product.swatchesInfo) {
                this.mapSwatchObjectToColorGrid(product);
            }
        }

        klevu.extend(true, klevu.search.modules.colorSwatches.base, {
            bindColorGridEvents: bindColorGridEvents,
            getSelectedProductData: getSelectedProductData,
            mapSwatchObjectToColorGrid: mapSwatchObjectToColorGrid,
            colorGridMouseLeaveEvent: colorGridMouseLeaveEvent,
            colorGridMouseEnterEvent: colorGridMouseEnterEvent,
            getProductImageElement: getProductImageElement
        });
    }
});

/**
 * Event to attach product quick view color swatch
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewColorSwatch",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickViewProductColorSwatches"), "quickViewProductSwatch", true);

        /**
         * parse product color swatch info
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "parseQuickViewProductColorSwatch",
            fire: function (data, scope) {
                klevu.each(data.response.current.queryResults, function (key, value) {
                    if (value && value.id) {
                        klevu.search.modules.colorSwatches.base.parseProductColorSwatch(scope.kScope, value.id);
                    }
                });
            }
        });

        /**
         * Bind color swatch events
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "bindColorGridEvents",
            fire: function (data, scope) {
                klevu.search.modules.colorSwatches.base.bindColorGridEvents();
            }
        });

    }
});