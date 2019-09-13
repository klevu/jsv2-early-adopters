/**
 *  Service file for Color swatches
 */
klevu.extend({
    colorSwatchesService: function () {
        klevu.search.landing.getScope().colorSwatchesService = {

            /**
             * Function to prepare keyvalue pair object
             * @param {*} keyValuePair 
             */
            parseKeyValuePairs: function (keyValuePair) {
                var dataList = [];
                keyValuePair.forEach(function (obj, index) {
                    var dataIndex = index + 1;
                    var matchedData = {};
                    keyValuePair.forEach(function (swatch, i) {
                        var objName = swatch.name;
                        if (objName.indexOf(dataIndex) > -1) {
                            objName = objName.replace(dataIndex, "");
                            matchedData[objName] = swatch.value;
                            matchedData.isMatched = true;
                        }
                    });
                    if (matchedData.isMatched) {
                        delete matchedData.isMatched;
                        dataList.push(matchedData);
                    }
                });
                return dataList;
            },

            /**
             * Function to parse swatches info data string
             * @param {*} str 
             */
            getColorSwatchesInfoFromString: function (str) {
                if (str && str[0] && str[0].variantId) {
                    return str;
                }
                var dataArray = str.split(";;;;");
                var keyValuePair = [];
                dataArray.forEach(function (str) {
                    if (str.length) {
                        var obj = {};
                        var trimmedStr = str.trim();
                        var splitedStr = trimmedStr.split(":");
                        if (splitedStr.length === 2) {
                            obj = {
                                name: splitedStr[0],
                                value: splitedStr[1]
                            };
                        } else if (splitedStr.length > 2) {
                            var shiftedArray = splitedStr.shift();
                            obj = {
                                name: shiftedArray,
                                value: splitedStr.join(":")
                            };
                        }
                        keyValuePair.push(obj);
                    }
                });
                return this.parseKeyValuePairs(keyValuePair);
            },

            /**
             * Function to update data in existing product object
             * @param {*} data 
             * @param {*} scope 
             */
            parseProductColorSwatch: function (data, scope) {
                var self = this;
                var items = klevu.getObjectPath(data.template.query, 'productList');
                if (items.result) {
                    klevu.each(items.result, function (key, value) {
                        if (value.swatchesInfo && value.swatchesInfo.length) {
                            value.swatchesInfo = self.getColorSwatchesInfoFromString(value.swatchesInfo);
                        }
                    })
                }
            },

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
             * Function to bind events to landing page product color swatches
             * @param {*} data 
             * @param {*} scope 
             */
            bindColorGridEventsToLandingProducts: function (data, scope) {
                var self = this;
                var productResults;
                var items = klevu.getObjectPath(data.template.query, 'productList');
                if (items && items.result) {
                    productResults = items.result;
                }
                klevu.each(klevu.dom.find('.klevuLandingSwatchColorGrid'), function (key, value) {
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