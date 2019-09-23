/**
 * Color swatch Quick view extension
 */
klevu.extend({
    colorSwatchesQuickView: function (mainScope) {

        if (!mainScope.colorSwatches) {
            console.log("Color swatch base module is missing!");
            return;
        }

        mainScope.colorSwatches.quickView = {

            /**
             * Function to get image element
             */
            getProductImageElement: function () {
                var img;
                var target = klevu.dom.find(".productQuick-imgBlock img");
                if (target && target[0]) {
                    img = target[0];
                }
                return img;
            },

            /**
             * Color grid mouse enter event
             * @param {*} ele 
             */
            colorGridMouseEnterEvent: function (ele) {
                var imgEle = this.getProductImageElement();
                if (imgEle) {
                    imgEle.setAttribute("src", ele.swatchesInfo.variantImage);
                }
            },

            /**
             * Color grid mouse leave event
             * @param {*} product 
             */
            colorGridMouseLeaveEvent: function (product) {
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
            },

            /**
             * Function to map data with color grid
             * @param {*} product 
             */
            mapSwatchObjectToColorGrid: function (product) {
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
            },

            /**
             * Function to get selected product data
             */
            getSelectedProductData: function () {
                var selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    selected_product = target[0].selected_product;
                }
                return selected_product;
            },

            /**
             * Function to bind events with color grid
             */
            bindColorGridEvents: function () {
                var product = this.getSelectedProductData();
                if (product && product.swatchesInfo) {
                    this.mapSwatchObjectToColorGrid(product);
                }
            }

        }
    }
});