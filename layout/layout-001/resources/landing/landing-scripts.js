try {
    Object.defineProperty(Element.prototype, 'dataset', {
        get: function () {
            var element = this;
            var attributes = this.attributes;
            var map = {};

            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];

                if (attribute && attribute.name && (/^data-\w[\w-]*$/).test(attribute.name)) {
                    var name = attribute.name;
                    var value = attribute.value;

                    var propName = name.substr(5).replace(/-./g, function (prop) {
                        return prop.charAt(1).toUpperCase();
                    });

                    Object.defineProperty(map, propName, {
                        enumerable: true,
                        get: function () {
                            return this.value;
                        }.bind({
                            value: value || ''
                        }),
                        set: function (name, value) {
                            if (typeof value !== 'undefined') {
                                this.setAttribute(name, value);
                            } else {
                                this.removeAttribute(name);
                            }
                        }.bind(element, name)
                    });
                }
            }

            return map;
        }
    });
} catch (error) {

}
/**
 * Component for initializing base template structure
 */
(function (klevu) {
    klevu.extend({
        baseStructure: {
            base: {
                initialize: function (scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    var containers = klevu.dom.find("[ku-container]", target);
                    klevu.each(containers, function (key, container) {
                        var emptyBlocksCount = 0;
                        var containerChildren = container.children;
                        if (containerChildren && containerChildren.length) {
                            klevu.each(containerChildren, function (key, childElement) {
                                var kuBlockElement = childElement.getAttribute("ku-block");
                                if (kuBlockElement == "" || kuBlockElement) {
                                    if (!childElement.children.length) {
                                        childElement.setAttribute("ku-empty", "");
                                        emptyBlocksCount++;
                                    }
                                }
                            });
                        }
                        if (container.children.length === emptyBlocksCount) {
                            container.setAttribute("ku-empty", "");
                        }
                    });
                }
            },
            build: true
        }
    });

    /**
     * Function to set default thumbnail image 
     * @param {*} element 
     */
    klevu.dom.helpers.cleanUpProductImage = function (element) {
        var elementSrc = element.getAttribute("src");
        if (elementSrc && elementSrc.length) {
            var kuThumbnailImage = "";
            if (typeof klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl === "function") {
                kuThumbnailImage = klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl();
            } else {
                kuThumbnailImage = "https://js.klevu.com/klevu-js-v1/img-1-1/place-holder.jpg";
            }

            var isKlevuPlaceholderImage = (element.src.indexOf(kuThumbnailImage) > -1);
            if (isKlevuPlaceholderImage) {
                element.src = "";
                element.onerror = "";
                return;
            }
            var isPubAdded = (element.src.indexOf("/pub") > -1);
            if (isPubAdded) {
                element.src = element.src.replace("/pub", "");
                element.onerror = function () {
                    element.src = kuThumbnailImage;
                    element.onerror = "";
                };
            } else {
                var isOnlyMediaAdded = (element.src.indexOf("/media") > -1);
                var isNeedToChangeAppended = (element.src.indexOf("needtochange/") > -1);
                var originValue = element.getAttribute("origin");
                if (isNeedToChangeAppended) {
                    element.src = element.src.replace("needtochange/", "");
                } else if (isOnlyMediaAdded) {
                    element.src = element.src.replace("/media", "/pub/media");
                } else if (originValue) {
                    element.src = originValue.replace("needtochange/", "pub/");
                    element.onerror = function () {
                        element.src = kuThumbnailImage;
                        element.onerror = "";
                    };
                }
            }
        } else {
            var kuThumbnailImage = "";
            if (typeof klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl === "function") {
                kuThumbnailImage = klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl();
            } else {
                kuThumbnailImage = "https://js.klevu.com/klevu-js-v1/img-1-1/place-holder.jpg";
            }
            element.src = kuThumbnailImage;
            element.onerror = "";
        }
    }

    /**
     * Function to escape HTML from the string
     * @param {*} string 
     * @returns 
     */
    klevu.dom.helpers.escapeHTML = function (string) {
        if (string && string.length) {
            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            return String(string).replace(/[&<>"'`=\/]/g, function (s) {
                return entityMap[s];
            });
        } else {
            return string;
        }
    }

    /**
     * Function to read stored cookie
     * @param {*} cookieName 
     * @returns 
     */
    klevu.dom.helpers.readCookie = function (cookieName) {
        var theCookie = " " + document.cookie,
            start = theCookie.indexOf(" " + cookieName + "="),
            end = theCookie.indexOf(";", start + 1);
        if (start === -1) {
            start = theCookie.indexOf(";" + cookieName + "=");
        }
        if (start === -1 || cookieName === "") {
            return "";
        }
        end = theCookie.indexOf(";", start + 1);
        if (end === -1) {
            end = theCookie.length;
        }
        return decodeURIComponent(theCookie.substring(start + cookieName.length + 2, end));
    }

    /**
     * Function to add product id to the recent viewed product cookie
     * @param {*} productId 
     */
    klevu.dom.helpers.addClickedProductToCookie = function (productId) {
        var encodedProductId = window.btoa(productId),
            cookieValue = klevu.dom.helpers.readCookie(klevu.settings.constants.COOKIE_KLEVU_RCP),
            existingProductIds, updatedCookieValue = encodedProductId,
            cookieExpiry = new Date(),
            httpOnlyTag = "undefined" !== typeof klevu_setHttpOnlyToCookies && klevu_setHttpOnlyToCookies ? "; HttpOnly" : "";
        if (cookieValue && cookieValue.trim() !== '') {
            existingProductIds = cookieValue.split("#-#");
            if (existingProductIds.indexOf(encodedProductId) !== -1) {
                existingProductIds.splice(existingProductIds.indexOf(encodedProductId), 1);
            } else {
                if (existingProductIds.length >= 20) {
                    existingProductIds.splice(-1, 1);
                }
            }
            existingProductIds.splice(0, 0, encodedProductId);
            updatedCookieValue = existingProductIds.join("#-#");
        }
        cookieExpiry.setTime(cookieExpiry.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = klevu.settings.constants.COOKIE_KLEVU_RCP + "=" + updatedCookieValue +
            ";expires=" + cookieExpiry.toUTCString() + ";path=/" +
            ";SameSite=None; Secure" + httpOnlyTag;
    }

    /**
     * Function to set cleaned SKU value
     * @param {*} sku 
     */
    klevu.dom.helpers.cleanUpSku = function (sku) {
        if (typeof sku === "undefined" || sku == "") {
            return false;
        };
        var SKU = sku.toUpperCase();
        if (SKU.indexOf(';;;;') !== -1) {
            var SKUParent = SKU.split(";;;;")[0];
            SKU = SKUParent;
        };
        if (SKU.slice(0, 1) === "(" && SKU.slice(-1) === ")") {
            return " " + SKU;
        } else {
            return " " + "(" + SKU + ")";
        }
    }

    /**
     * Function to clean up price for template conditions
     * @param {*} priceValue 
     * @param {*} currency 
     * @returns 
     */
    klevu.dom.helpers.cleanUpPriceValue = function (priceValue, currency) {
        if (typeof priceValue == "undefined" || priceValue == "" || !priceValue) {
            return Number("N/A");
        }
        var updatedValue = String(priceValue);
        var hasPriceUpdated = false;
        if (currency && typeof klevu.search.modules.kmcInputs.base.getPriceFormatterObject == "function") {
            var currencyFormatter = klevu.search.modules.kmcInputs.base.getPriceFormatterObject(currency);
            if (currencyFormatter && currencyFormatter.decimal && currencyFormatter.decimal != "") {
                updatedValue = updatedValue.replace(currencyFormatter.decimal, ".");
                hasPriceUpdated = true;
            }
        }
        if (!hasPriceUpdated) {
            updatedValue = updatedValue.replace(",", ".");
        }
        return Number(updatedValue);
    }

    /**
     * Function to get promotional banner image alt tag and title text
     * @param {*} bannerObj 
     * @returns 
     */
    klevu.dom.helpers.getBannerAltTagText = function (bannerObj) {
        var bannerText = "";
        if (bannerObj) {
            if (bannerObj.bannerAltTag && bannerObj.bannerAltTag != "") {
                bannerText = bannerObj.bannerAltTag;
            } else if (bannerObj.bannerName && bannerObj.bannerName != "") {
                bannerText = bannerObj.bannerName;
            } else if (bannerObj.bannerImg && bannerObj.bannerImg != "") {
                bannerText = bannerObj.bannerImg.match(/.*\/(.*)$/)[1];
                bannerText = bannerText.replace(/\.[^/.]+$/, "");
            } else if (bannerObj.bannerImageUrl && bannerObj.bannerImageUrl != "") {
                bannerText = bannerObj.bannerImageUrl.match(/.*\/(.*)$/)[1];
                bannerText = bannerText.replace(/\.[^/.]+$/, "");
            }
        }
        return bannerText;
    }

})(klevu);
/**
 * Global Currency symbol map
 */
var klevu_currencySymbols = {
    'IRR': "ریال",
    'PLN': "z&#322;&nbsp;",
    'AUD': "AU$",
    'HRK': "kn",
    'BRL': "R$",
    'NGN': "₦",
    'HUF': "FT",
    'NOK': "kr",
    'CAD': "$",
    'NZD': "NZ$",
    'ZAR': "R",
    'VND': "&#8363;",
    'SEK': "kr",
    'COP': "$",
    'RUB': "руб.",
    'MXN': "$",
    'SGD': "S$",
    'EGP': "LE",
    'USD': "$",
    'HKD': "HK$",
    'IDR': "RP ",
    'KRW': "원",
    'BDT': "&#2547;",
    'EUR': "&euro;",
    'GBP': "&pound;",
    'INR': "&#8377;",
    'JPY': "&#165;",
    'CNY': "&#165;",
    'CRC': "&#8353;",
    'ILS': "&#8362;"
};

/**
 * Global Price formatters
 */
var klevu_priceFormatters = {
    "USD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "$",
        appendCurrencyAtLast: false
    },
    "EUR": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ",",
        currencySymbol: "&euro;",
        appendCurrencyAtLast: true
    },
    "GBP": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&pound;",
        appendCurrencyAtLast: false
    },
    "IRR": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "ریال",
        appendCurrencyAtLast: false
    },
    "PLN": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "z&#322;&nbsp;",
        appendCurrencyAtLast: false
    },
    "AUD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "AU$",
        appendCurrencyAtLast: false
    },
    "HRK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "kn",
        appendCurrencyAtLast: true
    },
    "BRL": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "R$",
        appendCurrencyAtLast: false
    },
    "NGN": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "₦",
        appendCurrencyAtLast: false
    },
    "HUF": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "FT",
        appendCurrencyAtLast: true
    },
    "NOK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ",",
        currencySymbol: "kr",
        appendCurrencyAtLast: true
    },
    "CAD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "$",
        appendCurrencyAtLast: false
    },
    "NZD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "NZ$",
        appendCurrencyAtLast: false
    },
    "ZAR": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "R",
        appendCurrencyAtLast: false
    },
    "VND": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#8363;",
        appendCurrencyAtLast: true
    },
    "SEK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ",",
        currencySymbol: "kr",
        appendCurrencyAtLast: true
    },
    "COP": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "$",
        appendCurrencyAtLast: false
    },
    "RUB": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "руб.",
        appendCurrencyAtLast: true
    },
    "MXN": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "$",
        appendCurrencyAtLast: false
    },
    "SGD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "S$",
        appendCurrencyAtLast: false
    },
    "EGP": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "LE",
        appendCurrencyAtLast: false
    },
    "HKD": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "HK$",
        appendCurrencyAtLast: false
    },
    "IDR": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "RP ",
        appendCurrencyAtLast: false
    },
    "KRW": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "원",
        appendCurrencyAtLast: true
    },
    "BDT": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#2547;",
        appendCurrencyAtLast: false
    },
    "INR": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#8377;",
        appendCurrencyAtLast: false
    },
    "JPY": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#165;",
        appendCurrencyAtLast: false
    },
    "CNY": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#165;",
        appendCurrencyAtLast: false
    },
    "CRC": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#8353;",
        appendCurrencyAtLast: false
    },
    "ILS": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "&#8362;",
        appendCurrencyAtLast: false
    },
    "BGN": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "лв",
        appendCurrencyAtLast: false
    },
    "CZK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "Kč",
        appendCurrencyAtLast: false
    },
    "DKK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "kr.",
        appendCurrencyAtLast: false
    },
    "ISK": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "kr.",
        appendCurrencyAtLast: false
    },
    "RON": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "Lei",
        appendCurrencyAtLast: false
    },
    "CHF": {
        decimalPlaces: 2,
        thousandSeparator: "",
        decimalSeparator: ".",
        currencySymbol: "CHF",
        appendCurrencyAtLast: false
    }
};
/**
 * Klevu fetch v1 data utility
 */

var klevu_urlProtocol = "";
var klevu_javascriptDomain = "";

(function (klevu) {
    var kmcInputs = {
        /**
         * Function to get the KMC input JS files base on the api key.
         * @param {*} apiKey
         */
        appendScriptsToHeader: function (apiKey) {

            var kmcDataURL = klevu.getSetting(klevu.settings, "settings.url.kmcData");
            if (!kmcDataURL || !kmcDataURL.length) {
                kmcDataURL = "https://js.klevu.com/klevu-js-v1/klevu-js-api/";
            }

            var loadCounter = 0;
            var importScripts = [{
                    id: apiKey,
                    src: kmcDataURL + apiKey + ".js",
                },
                {
                    id: apiKey + "-banner",
                    src: kmcDataURL + apiKey + "-banner.js",
                },
                {
                    id: apiKey + "-maps",
                    src: kmcDataURL + apiKey + "-maps.js",
                },
            ];

            var srcLoadCallBack = function () {
                if (loadCounter == importScripts.length) {
                    klevu.search.modules.kmcInputs.hasAllResourcesLoaded = true;
                }
            };

            importScripts.forEach(function (scriptObj) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.async = false;
                script.src = scriptObj.src;
                script.id = scriptObj.id;
                script.onload = function () {
                    loadCounter++;
                    srcLoadCallBack();
                };
                script.onerror = function () {
                    loadCounter++;
                    srcLoadCallBack();
                };
                document.head.appendChild(script);
            });
        },

        /**
         * Function to get auto suggestion max count
         * @returns 
         */
        getMaxNumberOfAutoSuggestions: function () {
            return (typeof klevu_maxSuggestionsToShow !== "undefined" && klevu_maxSuggestionsToShow) ? klevu_maxSuggestionsToShow : 5;
        },

        /**
         * Function to get Quick search maximum number of category
         * @returns 
         */
        getMaxNumberOfQuickSearchCategories: function () {
            return (typeof klevu_maxCategoriesToShow !== "undefined" && klevu_maxCategoriesToShow) ? klevu_maxCategoriesToShow : 3;
        },

        /**
         * Function to get the maximum numbers of product suggestions
         */
        getMaxNumberOfProductSuggestions: function () {
            return typeof klevu_productsToShowInSlimLayout !== "undefined" ? klevu_productsToShowInSlimLayout : 3;
        },

        /**
         * Function to get the color swatches enable or disabled value
         */
        getColorSwatchesEnableValue: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.showProductSwatches !== "undefined") ?
                klevu_uc_userOptions.showProductSwatches :
                false;
        },

        /**
         * Function to get the filter enable or disabled value
         */
        getFiltersEnableValue: function () {
            return typeof klevu_filtersEnabled !== "undefined" ?
                klevu_filtersEnabled :
                false;
        },

        /**
         * Function to get the landing page filter position
         */
        getLandingFilterPosition: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.landingFilterPosition !== "undefined") ?
                klevu_uc_userOptions.landingFilterPosition :
                "left";
        },

        /**
         * Function to get the filter selection type value
         */
        getFilterMultiSelectValue: function () {
            return typeof klevu_multiSelectFilters !== "undefined" ?
                klevu_multiSelectFilters :
                false;
        },

        /**
         * Function to get the if show out of stock is enabled or disabled
         */
        getShowOutOfStockValue: function () {
            return typeof klevu_showOutOfStock !== "undefined" ?
                klevu_showOutOfStock :
                false;
        },

        /**
         * Function to get the out of stock caption
         */
        getOutOfStockCaptionValue: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.outOfStockCaption !== "undefined") &&
                klevu_uc_userOptions.outOfStockCaption.length ?
                klevu_uc_userOptions.outOfStockCaption :
                "";
        },

        /**
         * Function to get the showPopularSearches is enabled or disabled
         */
        getShowPopularSearchesValue: function () {
            return typeof klevu_showPopularSearches !== "undefined" ?
                klevu_showPopularSearches :
                false;
        },

        /**
         * Function to get the klevu_showRecentSerches is enabled or not
         */
        getShowRecentSearchesValue: function () {
            return typeof klevu_showRecentSerches !== "undefined" ?
                klevu_showRecentSerches :
                false;
        },

        /**
         * Function to get the klevu_webstorePopularTerms array
         */
        getWebstorePopularTermsValue: function () {
            return typeof klevu_webstorePopularTerms !== "undefined" &&
                klevu_webstorePopularTerms.length ?
                klevu_webstorePopularTerms : [];
        },

        /**
         * Function to get the CMS Enabled value
         */
        getCmsEnabledValue: function () {
            return typeof klevu_cmsEnabled !== "undefined" ? klevu_cmsEnabled : false;
        },

        /**
         * Function to get the if add to cart enabled or not
         */
        getAddToCartEnableValue: function () {
            return typeof klevu_addToCartEnabled !== "undefined" ?
                klevu_addToCartEnabled :
                false;
        },

        /**
         * Function to get the add to cart button caption
         */
        getAddToCartButtonCaption: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.addToCartButton !== "undefined") ?
                klevu_uc_userOptions.addToCartButton :
                "Add to cart";
        },

        /**
         * Function to get no results found object from KMC js file
         */
        getNoResultsFoundObject: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.noResultsOptions !== "undefined") ?
                klevu_uc_userOptions.noResultsOptions : {};
        },

        /**
         * Function to get the show search box on landing page attribute value
         */
        getShowSearchOnLandingPageEnableValue: function () {
            return (typeof klevu_uc_userOptions !== "undefined" &&
                    typeof klevu_uc_userOptions.showSearchBoxOnLandingPage !== "undefined") ?
                klevu_uc_userOptions.showSearchBoxOnLandingPage :
                false;
        },

        /**
         * Function to get the show sku on landing page product block
         */
        getSkuOnPageEnableValue: function () {
            return (typeof klevu_showProductCode !== "undefined" &&
                    typeof klevu_showProductCode === "boolean") ?
                klevu_showProductCode :
                false;
        },

        /**
         * Function to get noImageUrl value
         */
        getKMCUserOptionsNoImageUrl: function () {
            return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.noImageUrl !== "undefined") ? klevu_uc_userOptions.noImageUrl : "https://js.klevu.com/klevu-js-v1/img-1-1/place-holder.jpg";
        },

        /**
         * Funcion to get showRolloverImage value
         */
        getShowRolloverImageValue: function () {
            return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRolloverImage !== "undefined") ? klevu_uc_userOptions.showRolloverImage : false;
        },

        /**
         *  Function to get VAT Caption
         */
        getVatCaption: function () {
            return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.vatCaption !== "undefined") ? klevu_uc_userOptions.vatCaption : false;
        },

        /**
         * Function to get show Prices value
         */
        getShowPrices: function () {
            return (typeof klevu_showPrices !== "undefined" && typeof klevu_showPrices === "boolean") ? klevu_showPrices : false;
        },

        /**
         * Function to return priceFormatter Object
         */
        getPriceFormatterObject: function (productCurrency) {
            var priceFormatterFinal = {};
            var priceFormatter = (typeof klevu_uc_userOptions !== "undefined" && klevu_uc_userOptions.priceFormatter) ? klevu_uc_userOptions.priceFormatter : undefined;

            if (typeof priceFormatter === "undefined" || typeof priceFormatter != "object") {
                if (typeof klevu_priceFormatters !== "undefined" && klevu_priceFormatters[productCurrency]) {
                    priceFormatter = klevu_priceFormatters[productCurrency];
                } else {
                    priceFormatterFinal = {
                        string: productCurrency,
                        format: "%s %s"
                    };
                    return priceFormatterFinal;
                }
            } else {
                if (typeof klevu_priceFormatters !== "undefined" && klevu_priceFormatters[productCurrency]) {
                    var matchedGlobalPriceFormatter = klevu_priceFormatters[productCurrency];
                    priceFormatter = klevu.extend(true, matchedGlobalPriceFormatter, priceFormatter);
                }
            }

            if (typeof priceFormatter.decimalPlaces !== "undefined" && priceFormatter.decimalPlaces != "") {
                priceFormatterFinal.precision = priceFormatter.decimalPlaces;
            }
            if (typeof priceFormatter.thousandSeparator !== "undefined" && priceFormatter.thousandSeparator != "") {
                priceFormatterFinal.thousand = priceFormatter.thousandSeparator;
            }
            if (typeof priceFormatter.decimalSeparator !== "undefined" && priceFormatter.decimalSeparator != "") {
                priceFormatterFinal.decimal = priceFormatter.decimalSeparator;
            }
            if (typeof priceFormatter.currencySymbol !== "undefined" && priceFormatter.currencySymbol != "") {
                priceFormatterFinal.string = priceFormatter.currencySymbol;
            }
            if (typeof priceFormatter.appendCurrencyAtLast !== "undefined" && priceFormatter.appendCurrencyAtLast != "") {
                priceFormatterFinal.atEnd = priceFormatter.appendCurrencyAtLast;
            }
            if (typeof priceFormatter.format !== "undefined" && priceFormatter.format != "") {
                priceFormatterFinal.format = priceFormatter.format;
            } else {
                priceFormatterFinal.format = "%s %s";
            }

            return priceFormatterFinal;
        },

        /**
         * Function to get recently viewed items details
         */
        getShowRecentlyViewedItemsValue: function () {
            var recentlyViewedItemsObject = {
                showRecentlyViewedItems: false,
                showRecentlyViewedItemsLimit: 10,
                showRecentlyViewedItemsCaption: "",
            };
            if (typeof klevu_uc_userOptions !== "undefined") {
                if (
                    typeof klevu_uc_userOptions.showRecentlyViewedItems !== "undefined"
                ) {
                    recentlyViewedItemsObject.showRecentlyViewedItems =
                        klevu_uc_userOptions.showRecentlyViewedItems;
                }
                if (
                    typeof klevu_uc_userOptions.showRecentlyViewedItemsCaption !==
                    "undefined"
                ) {
                    recentlyViewedItemsObject.showRecentlyViewedItemsCaption =
                        klevu_uc_userOptions.showRecentlyViewedItemsCaption;
                }
                if (
                    typeof klevu_uc_userOptions.showRecentlyViewedItemsLimit !==
                    "undefined"
                ) {
                    recentlyViewedItemsObject.showRecentlyViewedItemsLimit =
                        klevu_uc_userOptions.showRecentlyViewedItemsLimit;
                }
            }
            return recentlyViewedItemsObject;
        },

        /**
         * Function to get trending products details
         */
        getShowTrendingProductsValue: function () {
            var trendingProductsObject = {
                showTrendingProducts: false,
                showTrendingProductsLimit: 10,
                showTrendingProductsCaption: "",
            };
            if (typeof klevu_uc_userOptions !== "undefined") {
                if (typeof klevu_uc_userOptions.showTrendingProducts !== "undefined") {
                    trendingProductsObject.showTrendingProducts =
                        klevu_uc_userOptions.showTrendingProducts;
                }
                if (
                    typeof klevu_uc_userOptions.showTrendingProductsCaption !==
                    "undefined"
                ) {
                    trendingProductsObject.showTrendingProductsCaption =
                        klevu_uc_userOptions.showTrendingProductsCaption;
                }
                if (
                    typeof klevu_uc_userOptions.showTrendingProductsLimit !== "undefined"
                ) {
                    trendingProductsObject.showTrendingProductsLimit =
                        klevu_uc_userOptions.showTrendingProductsLimit;
                }
            }
            return trendingProductsObject;
        }
    };

    klevu.extend(true, klevu.search.modules, {
        kmcInputs: {
            base: kmcInputs,
            build: true,
            hasAllResourcesLoaded: false
        }
    });
})(klevu);

klevu.coreEvent.build({
    name: "setRemoteKMCInputs",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.settings.search.apiKey)
        ) {
            return false;
        }
        return true;
    },
    maxCount: 1000,
    delay: 30
});

klevu.coreEvent.attach("setRemoteKMCInputs", {
    name: "assignAPIKeyForCookie",
    fire: function () {
        var apiKeyForCookie = klevu.settings.search.apiKey.replace(/-/g, "_");
        klevu.setObjectPath(klevu.settings, "constants.COOKIE_KLEVU_RCP", "klevu_rcp_" + apiKeyForCookie);
    }
});

klevu.coreEvent.attach("setRemoteKMCInputs", {
    name: "initKMCInputs",
    fire: function () {
        klevu_urlProtocol = klevu.settings.url.protocol;
        klevu.search.modules.kmcInputs.base.appendScriptsToHeader(klevu.settings.search.apiKey);
        //klevu.search.modules.kmcInputs.base.appendScriptsToHeader("klevu-160320037354512854"); //Dev live store
    }
});
/**
 * Klevu Analytics Utility
 */

(function (klevu) {

    /**
     * Function to get term request option
     * @param {*} scope 
     * @param {*} isExtended 
     */
    function getTermOptions(scope, isExtended) {

        var analyticsTermOptions = {
            klevu_term: (scope.data.context.termOriginal) ? scope.data.context.termOriginal : "*",
            klevu_pageNumber: "",
            klevu_src: "",
            klevu_limit: "",
            klevu_sort: "",
            klevu_totalResults: "0",
            klevu_typeOfQuery: "WILDCARD_AND",
            filters: false
        };

        var currentSection = scope.data.context.section;
        if (!currentSection) {
            return analyticsTermOptions;
        }

        //TO-DO: Get cached data

        var reqQueries = klevu.getObjectPath(scope.data, "request.current.recordQueries");
        if (!reqQueries) {
            reqQueries = klevu.getObjectPath(scope.data, "request.original.recordQueries");
        }

        if (reqQueries) {
            var reqQueryObj = reqQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (reqQueryObj) {
                analyticsTermOptions.klevu_limit = reqQueryObj.settings.limit;
                analyticsTermOptions.klevu_sort = reqQueryObj.settings.sort;
                analyticsTermOptions.klevu_src = "[[typeOfRecord:" + reqQueryObj.settings.typeOfRecords[0] + "]]";
            }
        }
        var resQueries = scope.data.response.current.queryResults;
        if (resQueries) {
            var resQueryObj = resQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (resQueryObj) {

                analyticsTermOptions.klevu_totalResults = resQueryObj.meta.totalResultsFound;
                analyticsTermOptions.klevu_typeOfQuery = resQueryObj.meta.typeOfSearch;

                var productListLimit = resQueryObj.meta.noOfResults;
                analyticsTermOptions.klevu_pageNumber = Math.ceil(resQueryObj.meta.offset / productListLimit) + 1;

                if (isExtended) {
                    var selectedFiltersStr = " [[";
                    var isAnyFilterSelected = false;
                    klevu.each(resQueryObj.filters, function (key, filter) {
                        if (filter.type == "SLIDER") {
                            if (filter.start != filter.min || filter.end != filter.max) {
                                if (isAnyFilterSelected) {
                                    selectedFiltersStr += ";;";
                                }
                                isAnyFilterSelected = true;
                                selectedFiltersStr += filter.key + ":" + filter.start + " - " + filter.end;
                            }
                        } else {
                            klevu.each(filter.options, function (key, option) {
                                if (option.selected) {
                                    if (isAnyFilterSelected) {
                                        selectedFiltersStr += ";;";
                                    }
                                    isAnyFilterSelected = true;
                                    selectedFiltersStr += filter.key + ":" + option.name;
                                }
                            });
                        }
                    });
                    selectedFiltersStr += "]]";
                    if (isAnyFilterSelected) {
                        analyticsTermOptions.filters = true;
                        analyticsTermOptions.klevu_term += selectedFiltersStr;
                    }
                }

            }
        }
        return analyticsTermOptions;
    }

    /**
     * Function to get product details  
     * @param {*} productId 
     * @param {*} scope 
     */
    function getProductDetailsFromId(productId, scope) {
        var dataListId = scope.data.context.section;
        var product;
        var results = scope.data.response.current.queryResults;
        if (results) {
            var dataList = results.filter(function (obj) {
                return obj.id == dataListId;
            })[0];
            if (dataList) {
                var records = dataList.records;
                var matchedProduct = records.filter(function (prod) {
                    return prod.id == productId;
                })[0];
                if (matchedProduct) {
                    product = matchedProduct;
                }
            }
        }
        return product;
    }

    /**
     * Function to get object details from URL and Name
     * @param {*} url 
     * @param {*} name 
     * @param {*} scope 
     * @param {*} dataListId 
     */
    function getDetailsFromURLAndName(url, name, scope, dataListId) {
        var category = {};
        var results = scope.data.response.current.queryResults;
        if (results) {
            var categoryList = results.filter(function (obj) {
                return obj.id == dataListId;
            })[0];
            if (categoryList) {
                var records = categoryList.records;
                var matchedCategory = records.filter(function (cat) {
                    return cat.name == name && cat.url == url;
                })[0];
                if (matchedCategory) {
                    category = matchedCategory;
                }
            }
        }
        return category;
    }

    /**
     * Function to store analytics event data
     * @param {*} eventOptions 
     */
    function storeAnalyticsEvent(dictionary, element, eventOptions) {
        var autoSug = klevu.dictionary(dictionary);
        if (autoSug && eventOptions) {
            autoSug.setStorage("local");
            autoSug.mergeFromGlobal();

            var dataList = [];
            var existingDataList = autoSug.getElement(element);
            if (existingDataList && existingDataList.length && existingDataList != element) {
                existingDataList = JSON.parse(existingDataList);
                if (existingDataList.length) {
                    existingDataList.push(eventOptions);
                    dataList = existingDataList;
                }
            } else {
                dataList.push(eventOptions);
            }

            autoSug.addElement(element, JSON.stringify(dataList));
            autoSug.mergeToGlobal();
        }
    }

    /**
     * Function to register auto suggestion product click event
     * @param {*} scope 
     * @param {*} className 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerAutoSuggestProductClickEvent(scope, className, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".trackProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var productId = value.dataset.id;
                var searchResultContainer = klevu.dom.find(className, target)[0];
                var dataSection;
                if (searchResultContainer) {
                    dataSection = searchResultContainer.dataset.section;
                }
                if (!dataSection) {
                    return;
                }
                scope.data.context.section = dataSection;
                if (productId) {
                    var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                    if (product) {
                        var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                        if (termOptions) {
                            termOptions.klevu_keywords = termOptions.klevu_term;
                            termOptions.klevu_productId = product.id;
                            termOptions.klevu_productName = product.name;
                            termOptions.klevu_productUrl = product.url;
                            termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:quick-search]]";
                            delete termOptions.klevu_term;
                            klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                        }
                    }
                }
            }, true);
        });
    }

    /**
     * Function to register search auto suggestion click event
     * @param {*} scope 
     * @param {*} className 
     */
    function registerAutoSuggestTermEvent(scope, className, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (key, value) {
            klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, sugEle) {
                klevu.event.attach(sugEle, "click", function (event) {
                    var searchResultContainer = klevu.dom.find(".klevuQuickSearchResults", target)[0];
                    var dataSection;
                    if (searchResultContainer) {
                        dataSection = searchResultContainer.dataset.section;
                    }
                    if (!dataSection) {
                        return;
                    }
                    scope.data.context.section = dataSection;
                    var suggestionText = sugEle.dataset.content;
                    var termOptions = klevu.analyticsUtil.base.getTermOptions(scope, true);
                    if (termOptions) {
                        termOptions.klevu_originalTerm = termOptions.klevu_term;
                        termOptions.klevu_term = suggestionText;
                        termOptions.klevu_src = "[[template:ac-suggestions]]";
                        klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                    }
                });
            });
        });
    }

    /**
     * Function to register auto-suggestion page click event
     * @param {*} scope 
     * @param {*} className 
     * @param {*} dataListId 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerAutoSuggestPageClickEvent(scope, className, dataListId, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(className, target), function (key, value) {
            klevu.each(klevu.dom.find(".klevu-track-click", value), function (key, catEle) {
                klevu.event.attach(catEle, "click", function (event) {
                    var url = catEle.dataset.url;
                    var catName = catEle.dataset.name;
                    var category = klevu.analyticsUtil.base.getDetailsFromURLAndName(url, catName, scope, dataListId);
                    var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                    if (termOptions) {
                        termOptions.klevu_keywords = termOptions.klevu_term;
                        termOptions.klevu_productId = category.id;
                        termOptions.klevu_productName = category.name;
                        termOptions.klevu_productUrl = category.url;
                        termOptions.klevu_src = "[[typeOfRecord:" + category.typeOfRecord + ";;template:quick-search]]";
                        delete termOptions.klevu_term;
                        klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                    }
                });
            });
        });
    }


    /**
     * Function to add product click event on landing page
     * @param {*} scope 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerLandingProductClickEvent(scope, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                if (parent && parent !== null) {
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:landing]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                }
            });
        });
    }


    /**
     * Function to send term analytics request from local storage
     * @param {*} dictionary 
     * @param {*} element 
     */
    function sendAnalyticsEventsFromStorage(dictionary, element) {
        var autoSug = klevu.dictionary(dictionary);
        autoSug.setStorage("local");
        autoSug.mergeFromGlobal();
        var storedEvents = autoSug.getElement(element);
        if (storedEvents && storedEvents != element) {
            storedEvents = JSON.parse(storedEvents);
            klevu.each(storedEvents, function (index, value) {
                delete value.filters;
                if (element == klevu.analyticsUtil.base.storage.click) {
                    if (klevu.analyticsEvents.click) {
                        klevu.analyticsEvents.click(value);
                    }
                } else if (element == klevu.analyticsUtil.base.storage.buy) {
                    if (klevu.analyticsEvents.buy) {
                        klevu.analyticsEvents.buy(value);
                    }
                } else if (element == klevu.analyticsUtil.base.storage.categoryClick) {
                    if (klevu.analyticsEvents.catclick) {
                        klevu.analyticsEvents.catclick(value);
                    }
                } else if (element == klevu.analyticsUtil.base.storage.bannerClick) {
                    if (klevu.analyticsEvents.bannerClick) {
                        klevu.analyticsEvents.bannerClick(value);
                    }
                } else if (element == klevu.analyticsUtil.base.storage.personalizedSearchTracking) {
                    if (klevu.analyticsEvents.personalizedSearchTracking) {
                        klevu.analyticsEvents.personalizedSearchTracking(value);
                    }
                } else {
                    klevu.analyticsEvents.term(value);
                }
            });
            autoSug.addElement(element, "");
            autoSug.mergeToGlobal();
        }
    }

    /**
     * Function to get Category view options
     * @param {*} scope 
     */
    function getCategoryViewOptions(scope) {
        var analyticsCategoryOptions = {
            klevu_categoryName: "",
            klevu_src: "",
            klevu_categoryPath: "",
            klevu_productIds: "",
            klevu_pageStartsFrom: "",
            filters: false
        };

        var currentSection = scope.data.context.section;
        if (!currentSection) {
            return analyticsCategoryOptions;
        }

        //TO-DO: Get cached data

        var reqQueries = klevu.getObjectPath(scope.data, "request.current.recordQueries");
        if (!reqQueries) {
            reqQueries = klevu.getObjectPath(scope.data, "request.original.recordQueries");
        }

        if (reqQueries) {
            var reqQueryObj = reqQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (reqQueryObj) {
                if (reqQueryObj.settings.query && reqQueryObj.settings.query.categoryPath) {
                    analyticsCategoryOptions.klevu_categoryName = reqQueryObj.settings.query.categoryPath;
                }
                analyticsCategoryOptions.klevu_limit = reqQueryObj.settings.limit;
                analyticsCategoryOptions.klevu_sort = reqQueryObj.settings.sort;
                analyticsCategoryOptions.klevu_src = "[[typeOfRecord:" + reqQueryObj.settings.typeOfRecords[0] + "]]";
            }
        }

        var resQueries = scope.data.response.current.queryResults;
        if (resQueries) {
            var resQueryObj = resQueries.filter(function (obj) {
                return obj.id == currentSection;
            })[0];
            if (resQueryObj) {
                analyticsCategoryOptions.klevu_pageStartsFrom = resQueryObj.meta.offset;
                if (resQueryObj.records && resQueryObj.records.length) {
                    analyticsCategoryOptions.klevu_productIds = "";
                    klevu.each(resQueryObj.records, function (key, value) {
                        if (analyticsCategoryOptions.klevu_productIds &&
                            analyticsCategoryOptions.klevu_productIds !== "") {
                            if (value.id) {
                                analyticsCategoryOptions.klevu_productIds += ",";
                            }
                        }
                        if (value.id) {
                            analyticsCategoryOptions.klevu_productIds += value.id;
                        }
                    });
                    if (resQueryObj.records[0].klevu_category) {
                        analyticsCategoryOptions.klevu_categoryPath = resQueryObj.records[0].klevu_category;
                    }
                }

            }
        }

        return analyticsCategoryOptions;
    }

    /**
     * Function to register category product click event analytics
     * @param {*} scope 
     * @param {*} dictionary 
     * @param {*} element 
     */
    function registerCategoryProductClickEvent(scope, dictionary, element) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                if (parent && parent !== null) {
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var categoryOptions = klevu.analyticsUtil.base.getCategoryViewOptions(scope);
                            categoryOptions.klevu_productId = product.id;
                            categoryOptions.klevu_productName = product.name;
                            categoryOptions.klevu_productUrl = product.url;
                            categoryOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:category]]";
                            categoryOptions.klevu_productSku = product.sku;
                            categoryOptions.klevu_salePrice = product.salePrice;
                            categoryOptions.klevu_productRatings = product.rating;
                            categoryOptions.klevu_productPosition = categoryOptions.klevu_pageStartsFrom;

                            delete categoryOptions.klevu_term;
                            delete categoryOptions.klevu_pageStartsFrom;

                            klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, categoryOptions);
                        }
                    }
                }
            });
        });
    }

    /**
     * Function store custom analytics click event
     * @param {*} scope 
     * @param {*} dictionary 
     * @param {*} element 
     * @param {*} targetContainerClass 
     * @param {*} parentProductClass 
     * @param {*} termName 
     * @param {*} srcTemplateName 
     */
    function registerAnalyticsClickEvent(scope, dictionary, element, targetContainerClass, parentProductClass, termName, srcTemplateName) {
        var target = klevu.dom.find(targetContainerClass);
        target = (target && target.length) ? target[0] : undefined;
        if (!target) {
            return;
        }
        klevu.each(klevu.dom.find(".klevuProductClick", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var parent = klevu.dom.helpers.getClosest(value, parentProductClass);
                if (parent && parent !== null) {
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termName;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:" + srcTemplateName + "]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * Function to get data tracking request payload options
     * @param {*} scope 
     */
    function getDataTrackingOptions(scope) {
        var analyticsDataTrackingOptions = {
            klevu_term: (scope.data.context.termOriginal) ? scope.data.context.termOriginal : "*",
            klevu_bannerId: "",
            klevu_bannerName: "",
            klevu_image: "",
            klevu_target: "",
            klevu_userID: "",
            klevu_loginCustomerEmail: "",
            klevu_request: "click",
            type: "banner"
        };
        return analyticsDataTrackingOptions;
    }

    var storageOptions = {
        dictionary: "analytics-util",
        term: "termList",
        click: "clickList",
        categoryClick: "categoryClickList",
        buy: "buyList"
    };

    var analyticsUtilBase = {
        storage: storageOptions,
        getTermOptions: getTermOptions,
        getProductDetailsFromId: getProductDetailsFromId,
        getDetailsFromURLAndName: getDetailsFromURLAndName,
        getCategoryViewOptions: getCategoryViewOptions,
        registerAutoSuggestProductClickEvent: registerAutoSuggestProductClickEvent,
        registerAutoSuggestTermEvent: registerAutoSuggestTermEvent,
        registerAutoSuggestPageClickEvent: registerAutoSuggestPageClickEvent,
        registerLandingProductClickEvent: registerLandingProductClickEvent,
        registerCategoryProductClickEvent: registerCategoryProductClickEvent,
        registerAnalyticsClickEvent: registerAnalyticsClickEvent,
        sendAnalyticsEventsFromStorage: sendAnalyticsEventsFromStorage,
        storeAnalyticsEvent: storeAnalyticsEvent,
        getDataTrackingOptions: getDataTrackingOptions
    };

    if (klevu.analyticsUtil && klevu.analyticsUtil.base) {
        klevu.extend(true, klevu.analyticsUtil.base, analyticsUtilBase);
    } else {
        klevu.extend({
            analyticsUtil: {
                base: analyticsUtilBase
            }
        });
    }

    klevu.analyticsUtil.build = true;

})(klevu);

/**
 * Analytics Event build
 */
klevu.coreEvent.build({
    name: "analyticsPowerUp",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            !klevu.analytics.build ||
            !klevu.analyticsUtil.build
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Analytics Event build
 */
klevu.coreEvent.build({
    name: "analyticsSendStoredData",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            !klevu.analytics.build ||
            !klevu.analyticsUtil.build ||
            !klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage
        ) {
            return false;
        }
        return true;
    },
    maxCount: 50,
    delay: 300
});

/**
 * Event to send request from queue
 */
klevu.coreEvent.attach("analyticsSendStoredData", {
    name: "attachSendRequestEvent",
    fire: function () {
        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.term
        );

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.click
        );

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.categoryClick
        );

        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.buy
        );
    }
});
/**
 * Module to update product information from search results
 */

(function (klevu) {

    /**
     * Function to update image path in products
     * @param {*} scope 
     */
    function updateImagePath(scope) {
        var data = scope.data;
        var queryResults = klevu.getObjectPath(data, "response.current.queryResults");
        if (queryResults) {
            klevu.each(queryResults, function (key, queryResult) {
                if (queryResult && queryResult.records) {
                    klevu.each(queryResult.records, function (rKey, record) {
                        if (typeof (klevu_pubIsInUse) == "undefined" || klevu_pubIsInUse) {
                            record.image = (record.image) ? record.image.replace('needtochange/', '') : "";
                        } else {
                            record.image = (record.image) ? record.image.replace('needtochange/', 'pub/') : "";
                        }
                    });
                }
            });
        }
    }

    var productDataModification = {
        updateImagePath: updateImagePath
    };

    klevu.extend(true, klevu.search.modules, {
        productDataModification: {
            base: productDataModification,
            build: true
        }
    });

})(klevu);

/**
 * productDataModification module build event
 */
klevu.coreEvent.build({
    name: "productDataModificationModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.productDataModification ||
            !klevu.search.modules.productDataModification.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});
/**
 * Klevu request loader component
 */

(function (klevu) {

    /**
     * Function to manage the status of a request UI
     * @param {*} scope 
     * @param {*} status 
     */
    function requestLoaderState(scope, status) {
        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
        if (status == "start") {
            target.classList.add("searchRequestLoading");
        } else {
            target.classList.remove("searchRequestLoading");
        }
    };

    klevu.extend(true, klevu.search.modules, {
        requestLoader: {
            base: {
                /**
                 * Function to init request loader
                 * @param {*} scope 
                 */
                initSearchRequestLoader: function (scope) {

                    scope.chains.request.send.add({
                        name: "startLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "start");
                        }
                    });

                    scope.chains.response.success.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });
                    scope.chains.response.fail.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });
                    scope.chains.response.done.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });

                    scope.chains.response.ajax.success.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });
                    scope.chains.response.ajax.fail.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });
                    scope.chains.response.ajax.done.add({
                        name: "stopLoader",
                        fire: function (data, scope) {
                            requestLoaderState(scope, "stop");
                        }
                    });

                }
            },
            build: true
        }
    });
})(klevu);
/**
 * Initialize facets
 */

(function (klevu) {

    /**
     * Function to attach event on facet items
     * @param {*} scope 
     */
    function attachFacetItemsClickEvent(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".klevuFilterOption", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                var parentElem = klevu.dom.helpers.getClosest(this, ".klevuFilter");
                if (parentElem !== null && (parentElem.dataset.singleselect === 'true') && !this.classList.contains("klevuFilterOptionActive")) {
                    var listSingleSelect = klevu.dom.find(".klevuFilterOptionActive", parentElem);
                    klevu.each(listSingleSelect, function (key, value) {
                        value.classList.remove("klevuFilterOptionActive");
                    });
                }
                this.classList.toggle("klevuFilterOptionActive");

                //getScope
                var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                if (target === null) {
                    return;
                }

                var elScope = target.kElem;
                elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                elScope.kScope.data.context.keyCode = 0;
                elScope.kScope.data.context.eventObject = event;
                elScope.kScope.data.context.event = "keyUp";
                elScope.kScope.data.context.preventDefault = false;

                //override local variables

                var options = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                if (options === null) {
                    return;
                }
                //calculate new filters
                //getAllActiveFilters
                var listActive = klevu.dom.find(".klevuFilterOptionActive", options);
                if (listActive.length > 0) {
                    var filterList = [];
                    klevu.each(listActive, function (key, value) {
                        var filter = klevu.dom.helpers.getClosest(value, ".klevuFilter");

                        if (filter !== null) {
                            var objectToChange = filterList.filter(function (element) {
                                return element.key == filter.dataset.filter;
                            });
                            if (objectToChange.length === 0) {
                                filterList.push({
                                    key: filter.dataset.filter,
                                    settings: {
                                        singleSelect: (klevu.isUndefined(filter.dataset.singleselect) ? false : filter.dataset.singleselect)
                                    },
                                    values: [(klevu.isUndefined(value.dataset.value) ? false : value.dataset.value)]
                                });
                            } else {
                                objectToChange[0].values.push((klevu.isUndefined(value.dataset.value) ? false : value.dataset.value));
                            }
                        }
                    });
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters.filters", filterList);
                } else {
                    klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters", {});
                }
                //reset offset after filter change
                klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
            }, true);
        });
    }

    var facets = {
        attachFacetItemsClickEvent: attachFacetItemsClickEvent
    };

    klevu.extend(true, klevu.search.modules, {
        facets: {
            base: facets,
            build: true
        }
    });

})(klevu);

/**
 * facets module build event
 */
klevu.coreEvent.build({
    name: "facetsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.facets ||
            !klevu.search.modules.facets.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});
/**
 * Add to cart base component
 */

(function (klevu) {

    /**
     * Function to send Add to cart request
     * @param {*} variantId 
     * @param {*} productURL 
     * @param {*} quantity 
     */
    function sendAddToCartRequest(variantId, productURL, quantity) {
        /**
         * Call back function to perform framework specific operations for add to cart functionality
         */
        if (typeof (klevu_addtocart) === "function") {
            klevu_addtocart(variantId, productURL, quantity);
        }
    }

    var addToCart = {
        sendAddToCartRequest: sendAddToCartRequest
    };

    klevu.extend(true, klevu.search.modules, {
        addToCart: {
            base: addToCart,
            build: true
        }
    });

})(klevu);

/**
 * addToCart module build event
 */
klevu.coreEvent.build({
    name: "addToCartModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.addToCart ||
            !klevu.search.modules.addToCart.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});
/**
 * Color swatch base extension
 */

(function (klevu) {

    /**
     * Function to prepare keyValue pair object
     * @param {*} keyValuePair 
     */
    function parseKeyValuePairs(keyValuePair) {
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
    }

    /**
     * Function to parse swatches info data string
     * @param {*} str 
     */
    function getColorSwatchesInfoFromString(str) {
        if (str && str[0] && str[0].variantId) {
            return str;
        }
        var dataArray = str.split(";;;;");
        var keyValuePair = [];
        dataArray.forEach(function (str) {
            if (str.length) {
                var obj = {};
                var trimmedStr = str.trim();
                var splittedStr = trimmedStr.split(":");
                if (splittedStr.length === 2) {
                    obj = {
                        name: splittedStr[0],
                        value: splittedStr[1]
                    };
                } else if (splittedStr.length > 2) {
                    var shiftedArray = splittedStr.shift();
                    obj = {
                        name: shiftedArray,
                        value: splittedStr.join(":")
                    };
                }
                keyValuePair.push(obj);
            }
        });
        return this.parseKeyValuePairs(keyValuePair);
    }

    /**
     * Function to update data in existing product object
     * @param {*} scope 
     * @param {*} listName 
     */
    function parseProductColorSwatch(scope, listName) {
        var self = this;
        var items = klevu.getObjectPath(scope.data.template.query, listName);
        if (items && items.result) {
            klevu.each(items.result, function (key, value) {
                if (value.swatchesInfo && value.swatchesInfo.length) {
                    value.swatchesInfo = self.getColorSwatchesInfoFromString(value.swatchesInfo);
                }
            });
        }
    }

    var colorSwatches = {
        parseProductColorSwatch: parseProductColorSwatch,
        getColorSwatchesInfoFromString: getColorSwatchesInfoFromString,
        parseKeyValuePairs: parseKeyValuePairs
    };

    klevu.extend(true, klevu.search.modules, {
        colorSwatches: {
            base: colorSwatches,
            build: true
        }
    });

})(klevu);


/**
 * colorSwatches module build event
 */
klevu.coreEvent.build({
    name: "colorSwatchesModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.colorSwatches ||
            !klevu.search.modules.colorSwatches.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});
(function (klevu) {

    var options = {
        analytics: {
            url: {
                bannerClick: "dataTracking"
            }
        }
    };
    klevu(options);

    klevu.coreEvent.build({
        name: "analyticsBannerPowerUp",
        fire: function () {
            if (
                !klevu.analytics ||
                !klevu.analytics.build
            ) {
                return false;
            }
            return true;
        },
        maxCount: 500,
        delay: 30
    });

    klevu.coreEvent.attach("analyticsBannerPowerUp", {
        name: "registerChain",
        fire: function () {
            // build the chain
            klevu.setObjectPath(klevu.analytics.base.getScope().element.kScope, "chains.events.bannerClick", klevu.chain({
                stopOnFalse: true
            }));
        }
    });

    klevu.coreEvent.attach("analyticsBannerPowerUp", {
        name: "populateChain",
        fire: function () {
            //add the banner click analitics checks
            klevu.analytics.base.getScope().chains.events.bannerClick.add({
                name: "bannerClickRequestCheck",
                fire: function (data, scope) {
                    klevu.clean(data.request.analytics);
                    var analytics = data.request.analytics;
                    try {
                        var hasError = false;
                        var errorPrefix = "";
                        if (klevu.isUndefined(analytics.klevu_bannerId)) {
                            hasError = true;
                            errorPrefix = "klevu_bannerId";
                        } else if (klevu.isUndefined(analytics.klevu_target)) {
                            hasError = true;
                            errorPrefix = "klevu_target";
                        } else if (klevu.isUndefined(analytics.type)) {
                            hasError = true;
                            errorPrefix = "type";
                        }
                        if (hasError) {
                            throw new Error(errorPrefix + " parameter is missing from the banner click analytics request!");
                        }
                    } catch (error) {
                        /* DEBUG CODE START */
                        if (klevu.settings.console.type.event) {
                            klevu.logError("chains.events.bannerClick - bannerClickRequestCheck - check paramaters.");
                            klevu.logError("chains.events.bannerClick - bannerClickRequestCheck - error:");
                            klevu.logError(error);
                        }
                        /* DEBUG CODE END */
                        return false;
                    }
                }
            });
            //add the banner click analitics url generation
            klevu.analytics.base.getScope().chains.events.bannerClick.add({
                name: "generateURL",
                fire: function (data, scope) {
                    var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analyticsCat", false);
                    if (analyticsUrl) {
                        data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.bannerClick", false);
                    } else {
                        return false;
                    }
                }
            });
            //add the banner click analitics request
            klevu.analytics.base.getScope().chains.events.bannerClick.add({
                name: "doAnalytics",
                fire: function (data, scope) {
                    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");
                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if (data.context.preventDefault === true) return false;
                }
            });
            //add to supported ajax types
            klevu.analytics.base.getScope().chains.request.send.addBefore("requestTypeAjaxV1", {
                name: "requestTypeAjaxBanner",
                fire: function (data, scope) {
                    if (data.context.eventAction === "bannerClick") {
                        data.context.eventAction = "analyticsAjaxV1";
                    }
                }
            });
        }
    });

    klevu.coreEvent.attach("analyticsBannerPowerUp", {
        name: "buildEvent",
        fire: function () {
            // build the event
            klevu.extend(true, klevu.analyticsEvents, {
                bannerClick: function (data, kObject) {
                    if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
                    var kScope = kObject.getScope();
                    kScope.data = kObject.resetData();
                    kScope.data.context.eventAction = "bannerClick";
                    //set up data for request
                    kScope.data.request.analytics = data;
                    kScope.data.context.preventDefault = false;

                    klevu.event.fireChain(kScope, "chains.events.bannerClick", kScope.element, kScope.data, null);
                    return kObject;
                }

            });

        }
    });

    klevu.coreEvent.attach("analyticsBannerPowerUp", {
        name: "buildEvent",
        fire: function () {
            klevu.extend(true, klevu.support, {
                analytics: {
                    bannerClick: true
                }
            });
        }
    });

})(klevu);

klevu.coreEvent.build({
    name: "promotionBannerModule",
    fire: function () {
        if (
            !klevu.search.modules ||
            !klevu.search.modules.promotionBanner ||
            !klevu.search.modules.promotionBanner.build ||
            !klevu.support.analytics ||
            !klevu.support.analytics.bannerClick ||
            !klevu.analyticsUtil ||
            !klevu.analyticsUtil.build
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});


/**
 * Addon for the analytics util component for the banner
 */
klevu.coreEvent.attach("promotionBannerModule", {
    name: "attachPromotionalBannerModuleEvents",
    fire: function () {

        klevu.extend(true, klevu.analyticsUtil.base, {
            storage: {
                bannerClick: "bannerClickList"
            },

            /**
             * Function to register banner click event and store the relevant information
             * @param {*} scope 
             * @param {*} dictionary 
             * @param {*} element 
             */
            registerBannerClickEvent: function (scope, dictionary, element) {
                var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuTrackBannerClick", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var dataTrackingOptions = klevu.analyticsUtil.base.getDataTrackingOptions(scope);
                        if (value.dataset) {
                            if (value.dataset.id) {
                                dataTrackingOptions.klevu_bannerId = value.dataset.id;
                            }
                            if (value.dataset.name) {
                                dataTrackingOptions.klevu_bannerName = encodeURIComponent(value.dataset.name);
                            }
                            if (value.dataset.image) {
                                dataTrackingOptions.klevu_image = encodeURIComponent(value.dataset.image);
                            }
                            if (value.dataset.redirect) {
                                dataTrackingOptions.klevu_target = encodeURIComponent(value.dataset.redirect);
                            }
                        }
                        klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, dataTrackingOptions);
                    });
                });
            }

        });
    }
});

/**
 * Event to send the stored analytics event
 */
klevu.coreEvent.attach("analyticsSendStoredData", {
    name: "sendStoredBannerClickEvent",
    fire: function () {
        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.bannerClick
        );
    }
});
/**
 * Base component for Promotion Module
 */
(function (klevu) {
    var bannerDataObject = {
        banners: []
    };
    /**
     * Function to get the product ids
     * @param {*} landingOrQuick
     * @param {*} activeOnPage
     */
    function getBanners(bannerList, activeOnPage) {
        var bannerListSanitized = [];
        if (bannerList.length) {
            klevu.each(bannerList, function (index, value) {
                if (activeOnPage === "all" ||
                    (value.hasOwnProperty('showOnLandingPage') && value.showOnLandingPage === true && activeOnPage === "landing") ||
                    (value.hasOwnProperty('showOnQuickSearch') && value.showOnQuickSearch === true && activeOnPage === "quick") ||
                    (value.hasOwnProperty('showOnCategoryPage') && value.showOnCategoryPage === true && activeOnPage === "category")) {
                    bannerListSanitized.push(value);
                }
            });
        }
        return bannerListSanitized;
    }

    /**
     * Function to Merge banners
     */
    function mergeData() {
        var bannerList = [];
        var self = this;
        var staticBannerListClone = klevu.extend(true, [], self.bannerDataObject.banners);
        var klevuBanner = typeof klevu_banner !== "undefined" && !klevu.isEmptyObject(klevu_banner) ? klevu_banner : [];
        bannerList = arrayUnique(staticBannerListClone.concat(klevuBanner));
        return bannerList;
    }

    /**
     * Function to get all the banners
     */
    function getAllBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "all");
    }

    /**
     * Function to get banners for Quck Search
     */
    function getQuickSearchBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "quick");
    }

    /**
     * Function to get banners for Landing Page
     */
    function getLandingPageBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "landing");
    }

    /**
     * Function to get banners for Category Page
     */
    function getCategoryPageBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "category");
    }

    /**
     * Function to get the product ids
     * @param {*} klevu_banner: Array of banner objects
     */
    function validateBanners(klevu_banner) {
        var klevu_banner_validated = [];
        if (klevu_banner.length > 0) {
            var today = new Date(),
                startDate, endDate, removeCurrent = false;
            today.setHours(0, 0, 0, 0);
            for (var i = 0; i < klevu_banner.length; i++) {
                startDate = new Date(klevu_banner[i].startDate);
                removeCurrent = false;
                if ('undefined' !== typeof klevu_banner[i].endDate && klevu_banner[i].endDate) {
                    endDate = new Date(klevu_banner[i].endDate);
                    removeCurrent = (startDate > today || endDate < today);
                } else {
                    removeCurrent = (startDate > today);
                }
                if (removeCurrent) {
                    klevu_banner.splice(i, 1);
                    i--;
                }
            }
            klevu_banner_validated = klevu_banner;
        }
        return klevu_banner_validated;
    }

    /**
     * Function to remove duplicate elements from array
     */
    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (klevu.isEqualObj(a[i], a[j]))
                    a.splice(j--, 1);
            }
        }
        return a;
    }

    var promotionBanner = {
        bannerDataObject: bannerDataObject,
        init: function (staticBannerList) {
            var self = this;
            if (!klevu.isEmptyObject(staticBannerList)) {
                this.bannerDataObject.banners = arrayUnique(this.bannerDataObject.banners.concat(staticBannerList));
                var validatedBannerList = validateBanners(staticBannerList);
                this.bannerDataObject.banners = arrayUnique(this.bannerDataObject.banners.concat(validatedBannerList));
            }
        },
        mergeData: mergeData,
        getAllBanners: getAllBanners,
        getQuickSearchBanners: getQuickSearchBanners,
        getLandingPageBanners: getLandingPageBanners,
        getCategoryPageBanners: getCategoryPageBanners
    };

    klevu.extend(true, klevu.search.modules, {
        promotionBanner: {
            base: promotionBanner,
            build: true
        }
    });

})(klevu);
(function (klevu) {
    /**
     * Method to get no results found message.
     * @param {*} searchTerm
     *
     */
    function getMessage(searchTerm) {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();

        var message = "We're sorry, no results found for ===" + searchTerm + "===.";
        if (!noResultsFound.messages || !noResultsFound.messages.length) {
            return message;
        }

        if (noResultsFound.messages && noResultsFound.messages.length == 1) {
            message = noResultsFound.messages[0].message;
            var messageHtml = document.createElement("textarea");
            messageHtml.innerHTML = message;
            message = messageHtml.value;
            message = message.replace(/#/g, "===#===");
            message = message.replace(/#/g, searchTerm.replace(/(<([^>]+)>)/ig, "").replace(/[=()]/ig, ""));
            return sanitizeTxt(message);
        }

        var termExists = noResultsFound.messages.find(function (msg) {
            return msg.showForTerms != null ?
                msg.showForTerms.find(function (term) {
                    return term.toLowerCase() == searchTerm.toLowerCase();
                }) :
                false;
        });

        if (termExists) {
            message = termExists.message;
            var messageHtml = document.createElement("textarea");
            messageHtml.innerHTML = message;
            message = messageHtml.value;
            message = message.replace(/#/g, "===#===");
            message = message.replace(/#/g, searchTerm.replace(/(<([^>]+)>)/ig, "").replace(/[=()]/ig, ""));
            return sanitizeTxt(message);
        } else {
            var defaultMessageObj = noResultsFound.messages.find(function (msg) {
                return msg.showForTerms == null;
            });
            message = defaultMessageObj.message;
            var messageHtml = document.createElement("textarea");
            messageHtml.innerHTML = message;
            message = messageHtml.value;
            message = message.replace(/#/g, "===#===");
            message = message.replace(/#/g, searchTerm.replace(/(<([^>]+)>)/ig, "").replace(/[=()]/ig, ""));
            return sanitizeTxt(message);
        }
    }

    function sanitizeTxt(text) {
        return text.replace(/<[^>]*>?/gm, '');
    }

    /**
     * Method to get no results found landing banners.
     * @param {*} searchTerm
     *
     */
    function getLandingBanners(searchTerm) {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();
        if (noResultsFound.banners) {
            var banners = noResultsFound.banners.filter(function (banner) {
                return banner.showOnLandingPage;
            });
            var keywordSpecificBanners = banners.filter(function (banner) {
                return banner.showForTerms == null ?
                    false :
                    banner.showForTerms.find(function (term) {
                        return term.toLowerCase() == searchTerm.toLowerCase();
                    });
            });
            if (keywordSpecificBanners && keywordSpecificBanners.length) {
                return keywordSpecificBanners;
            } else {
                return banners.filter(function (banner) {
                    banner.showForTerms == null
                });
            }
        }
    }

    /**
     * Method to get no results found quick search banners.
     * @param {*} searchTerm
     *
     */
    function getQuickSearchBanners(searchTerm) {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();
        if (noResultsFound.banners) {
            var banners = noResultsFound.banners.filter(function (banner) {
                return banner.showOnQuickSearch;
            });
            var keywordSpecificBanners = banners.filter(function (banner) {
                return banner.showForTerms == null ?
                    false :
                    banner.showForTerms.find(function (term) {
                        return term.toLowerCase() == searchTerm.toLowerCase();
                    });
            });

            if (keywordSpecificBanners && keywordSpecificBanners.length) {
                return keywordSpecificBanners;
            } else {
                return banners.filter(function (banner) {
                    return banner.showForTerms == null;
                });
            }
        }
    }

    function isPopularSearchesKeywordsEnabled() {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();
        return noResultsFound.showPopularKeywords ? noResultsFound.showPopularKeywords : false;
    }

    function setPopularSearchesKeyword() {
        var self = this;
        var isPopularSearchesEnabled = self.isPopularSearchesEnabled();
        if (isPopularSearchesEnabled) {
            var kuPopularSearchTermItem = klevu.dom.find(".kuPopularSearchTermItem");
            klevu.each(kuPopularSearchTermItem, function (key, termItem) {
                klevu.event.attach(termItem, "click", function () {
                    var term = termItem.dataset.value;
                    term = encodeURIComponent(term);
                    var inputElement = klevu.dom.find(
                        klevu.getSetting(
                            scope.kScope.settings,
                            "settings.search.searchBoxSelector"
                        )
                    )[0];
                    var nameAttr = inputElement.name;
                    if (nameAttr) {
                        window.location = "/?" + nameAttr + "=" + term;
                    }
                });
            });
        }
    }

    function isPopularProductsEnabled() {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();
        return noResultsFound.showPopularProducts ? noResultsFound.showPopularProducts : false;
    }

    function buildPopularProductsReq(data, scope, limit) {
        var self = this;
        var isPopularProductsEnabled = self.isPopularProductsEnabled();

        if (isPopularProductsEnabled) {
            var parameterMap = klevu.getSetting(
                scope.kScope.settings,
                "settings.search.map",
                false
            );

            var popularProductQuery = klevu.extend(
                true, {},
                parameterMap.recordQuery
            );

            popularProductQuery.id = "noResultsFoundPopularProductList";
            popularProductQuery.typeOfRequest = "RECS_TRENDING";
            popularProductQuery.settings.typeOfRecords = ["KLEVU_PRODUCT"];
            popularProductQuery.settings.query = {
                term: "*",
            };
            popularProductQuery.settings.limit = limit;

            data.request.current.recordQueries.push(popularProductQuery);
            data.context.doSearch = true;
            data.context.section = popularProductQuery.id;
        }


    }

    function popularProductsHeading() {
        var self = this;
        var noResultsFound = self.kmcInputs.getNoResultsFoundObject();
        return noResultsFound.productsHeading;
    }


    var noResultsFound = {
        getMessage: getMessage,
        kmcInputs: klevu.search.modules.kmcInputs.base,
        getLandingBanners: getLandingBanners,
        getQuickSearchBanners: getQuickSearchBanners,
        isPopularSearchesKeywordsEnabled: isPopularSearchesKeywordsEnabled,
        isPopularProductsEnabled: isPopularProductsEnabled,
        setPopularSearchesKeyword: setPopularSearchesKeyword,
        buildPopularProductsReq: buildPopularProductsReq,
        popularProductsHeading: popularProductsHeading
    };

    klevu.extend(true, klevu.search.modules, {
        noResultsFound: {
            base: noResultsFound,
        },
    });
})(klevu);

/**
 * noResultsFound module build event
 */
klevu.coreEvent.build({
    name: "noResultsFoundModuleBuild",
    fire: function () {
        if (
            !klevu.search.modules ||
            klevu.isUndefined(klevu.search.modules.kmcInputs)
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30,
});
(function (klevu) {

    klevu.extend(true, klevu.search.modules, {
        recentViewedProducts: {
            base: {
                limit: 10,

                /**
                 * Function to add product ids
                 * @param {*} scope 
                 * @param {*} productId 
                 */
                addProductId: function (scope, productId) {
                    if (!productId || productId == "") {
                        return;
                    }
                    var limit = (this.limit) ? this.limit : 10;
                    var storage = klevu.getSetting(scope.settings, "settings.storage");
                    storage.recentViewedProducts.setStorage("local");
                    storage.recentViewedProducts.mergeFromGlobal();

                    var storedKeywords = storage.recentViewedProducts.getElement("ku_products");
                    if (storedKeywords && storedKeywords != "ku_products") {
                        storedKeywords = storedKeywords.replace(new RegExp(productId + ",", "g"), "");
                        storedKeywords = storedKeywords.replace(new RegExp(productId), "", "g");
                        productId = productId + "," + storedKeywords;
                    } else {
                        productId = productId + ",";
                    }

                    var updatedList = [];
                    var productIdList = productId.split(",");
                    klevu.each(productIdList, function (key, item) {
                        if (item) {
                            if (updatedList.length < limit) {
                                updatedList.push(item);
                            }
                        }
                    });
                    productId = updatedList.join(",");
                    storage.recentViewedProducts.addElement("ku_products", productId);
                    storage.recentViewedProducts.mergeToGlobal();
                },

                /**
                 * Function to get product ids
                 * @param {*} scope 
                 */
                getProductIds: function (scope) {
                    var storedProductIds = [];
                    var storage = klevu.getSetting(scope.settings, "settings.storage");
                    storage.recentViewedProducts.setStorage("local");
                    storage.recentViewedProducts.mergeFromGlobal();
                    var storedKeywords = storage.recentViewedProducts.getElement("ku_products");
                    if (storedKeywords && storedKeywords != "ku_products") {
                        storedProductIds = storedKeywords.split(",");
                    }
                    return storedProductIds;
                },

                /**
                 * Function to add request payload
                 * @param {*} scope 
                 * @param {*} data 
                 */
                getRecentViewedProductListPayload: function (scope, data) {
                    var recentViewedProductList;
                    var storedProductIds = this.getProductIds(scope);
                    if (storedProductIds && storedProductIds.length) {
                        var productIdObjectList = [];
                        klevu.each(storedProductIds, function (key, pId) {
                            var productObject = {
                                "key": "id",
                                "value": pId
                            }
                            productIdObjectList.push(productObject);
                        });

                        var parameterMap = klevu.getSetting(scope.settings, "settings.search.map", false);
                        recentViewedProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        recentViewedProductList.id = "recentViewedProductList";
                        recentViewedProductList.typeOfRequest = "SEARCH";
                        recentViewedProductList.settings.query.term = data.context.term;
                        recentViewedProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        recentViewedProductList.settings.limit = productIdObjectList.length;
                        recentViewedProductList.settings.typeOfSearch = "WILDCARD_AND";
                        recentViewedProductList.settings.includeIds = productIdObjectList;
                        recentViewedProductList.settings.topIds = productIdObjectList;
                    }
                    return recentViewedProductList;
                }
            },
            build: true
        }
    });

})(klevu);
/**
 * Product carousel slider 
 */
(function (klevu) {
    klevu.extend({
        productCarousel: {
            base: {
                initProductsSlider: function (kuCarousel) {
                    if (!kuCarousel) {
                        return;
                    }
                    var kuCarouselContent = kuCarousel.querySelector('.kuCarousel-content');
                    if (!kuCarouselContent) {
                        return;
                    }
                    var slides = kuCarousel.querySelectorAll('.kuSlide');
                    if (!slides) {
                        return;
                    }

                    var arrayOfSlides = Array.prototype.slice.call(slides);
                    var kuCarouselDisplaying;
                    var screenSize;
                    var lengthOfSlide;

                    function addClone() {
                        var lastSlide = kuCarouselContent.lastElementChild.cloneNode(true);
                        lastSlide.style.left = (-lengthOfSlide) + "px";
                        kuCarouselContent.insertBefore(lastSlide, kuCarouselContent.firstChild);
                    }

                    function removeClone() {
                        var firstSlide = kuCarouselContent.firstElementChild;
                        firstSlide.parentNode.removeChild(firstSlide);
                    }

                    function moveSlidesRight() {
                        var slides = kuCarousel.querySelectorAll('.kuSlide');
                        var slidesArray = Array.prototype.slice.call(slides);
                        var width = 0;

                        slidesArray.forEach(function (el, i) {
                            el.style.left = width + "px";
                            width += lengthOfSlide;
                        });
                        addClone();
                    }

                    moveSlidesRight();

                    function moveSlidesLeft() {
                        var slides = kuCarousel.querySelectorAll('.kuSlide');
                        var slidesArray = Array.prototype.slice.call(slides);
                        slidesArray = slidesArray.reverse();
                        var maxWidth = (slidesArray.length - 1) * lengthOfSlide;
                        slidesArray.forEach(function (el, i) {
                            maxWidth -= lengthOfSlide;
                            el.style.left = maxWidth + "px";
                        });
                    }

                    window.addEventListener('resize', setScreenSize);

                    function setScreenSize() {
                        if (kuCarousel.offsetWidth >= 500) {
                            kuCarouselDisplaying = 3;
                        } else if (kuCarousel.offsetWidth >= 300) {
                            kuCarouselDisplaying = 2;
                        } else {
                            kuCarouselDisplaying = 1;
                        }
                        getScreenSize();
                    }

                    function getScreenSize() {
                        var slides = kuCarousel.querySelectorAll('.kuSlide');
                        var slidesArray = Array.prototype.slice.call(slides);
                        lengthOfSlide = (kuCarousel.offsetWidth / kuCarouselDisplaying);
                        var initialWidth = -lengthOfSlide;
                        slidesArray.forEach(function (el) {
                            el.style.width = lengthOfSlide + "px";
                            el.style.left = initialWidth + "px";
                            initialWidth += lengthOfSlide;
                        });
                    }

                    var rightNav = kuCarousel.querySelector('.nav-right');
                    rightNav.addEventListener('click', moveLeft);

                    var moving = true;

                    function moveRight() {
                        if (moving) {
                            var slides = kuCarousel.querySelectorAll('.kuSlide');
                            var totalSlidesLength = slides.length - 1;
                            if (parseInt(slides[0].id) >= totalSlidesLength) {
                                return;
                            }
                            moving = false;
                            var lastSlide = kuCarouselContent.lastElementChild;
                            lastSlide.parentNode.removeChild(lastSlide);
                            kuCarouselContent.insertBefore(lastSlide, kuCarouselContent.firstChild);
                            removeClone();
                            var firstSlide = kuCarouselContent.firstElementChild;
                            firstSlide.addEventListener('transitionend', activateAgain);
                            moveSlidesRight();
                        }
                    }

                    function activateAgain() {
                        var firstSlide = kuCarouselContent.firstElementChild;
                        moving = true;
                        firstSlide.removeEventListener('transitionend', activateAgain);
                    }

                    var leftNav = kuCarousel.querySelector('.nav-left');
                    leftNav.addEventListener('click', moveRight);

                    function moveLeft() {
                        if (moving) {
                            var slides = kuCarousel.querySelectorAll('.kuSlide');
                            var totalSlidesLength = slides.length - 1;
                            if (parseInt(slides[1].id) + kuCarouselDisplaying > totalSlidesLength) {
                                return;
                            }
                            moving = false;
                            removeClone();
                            var firstSlide = kuCarouselContent.firstElementChild;
                            firstSlide.addEventListener('transitionend', replaceToEnd);
                            moveSlidesLeft();
                        }
                    }

                    function replaceToEnd() {
                        var firstSlide = kuCarouselContent.firstElementChild;
                        firstSlide.parentNode.removeChild(firstSlide);
                        kuCarouselContent.appendChild(firstSlide);
                        firstSlide.style.left = ((arrayOfSlides.length - 1) * lengthOfSlide) + "px";
                        addClone();
                        moving = true;
                        firstSlide.removeEventListener('transitionend', replaceToEnd);
                    }

                    kuCarouselContent.addEventListener('mousedown', seeMovement);

                    var initialX;
                    var initialPos;

                    function seeMovement(e) {
                        initialX = e.clientX;
                        getInitialPos();
                        kuCarouselContent.addEventListener('mousemove', slightMove);
                        kuCarousel.addEventListener('mouseup', moveBasedOnMouse);
                    }

                    function slightMove(e) {
                        if (moving) {
                            var movingX = e.clientX;
                            var difference = initialX - movingX;
                            if (Math.abs(difference) < (lengthOfSlide / 4)) {
                                slightMoveSlides(difference);
                            }
                        }
                    }

                    function getInitialPos() {
                        var slides = kuCarousel.querySelectorAll('.kuSlide');
                        var slidesArray = Array.prototype.slice.call(slides);
                        initialPos = [];
                        slidesArray.forEach(function (el) {
                            var left = Math.floor(parseInt(el.style.left.slice(0, -2)));
                            initialPos.push(left);
                        });
                    }

                    function slightMoveSlides(newX) {
                        var slides = kuCarousel.querySelectorAll('.kuSlide');
                        var slidesArray = Array.prototype.slice.call(slides);
                        slidesArray.forEach(function (el, i) {
                            var oldLeft = initialPos[i];
                            el.style.left = (oldLeft + newX) + "px";
                        });
                    }

                    function moveBasedOnMouse(e) {
                        var finalX = e.clientX;
                        if (initialX - finalX > 0) {
                            moveRight();
                        } else if (initialX - finalX < 0) {
                            moveLeft();
                        }
                        kuCarousel.removeEventListener('mouseup', moveBasedOnMouse);
                        kuCarouselContent.removeEventListener('mousemove', slightMove);
                    }

                    setScreenSize();
                }
            }
        }
    });
})(klevu);
/**
 * Analytics Event for personalizedSearchTracking
 */
(function (klevu) {
    var options = {
        analytics: {
            url: {
                personalizedSearchTracking: "personalizedSearchTracking"
            }
        }
    };
    klevu(options);

    klevu.coreEvent.build({
        name: "analyticsPersonalizedSearchTrackingPowerUp",
        fire: function () {
            if (
                !klevu.analytics ||
                !klevu.analytics.build
            ) {
                return false;
            }
            return true;
        },
        maxCount: 500,
        delay: 30
    });

    klevu.coreEvent.attach("analyticsPersonalizedSearchTrackingPowerUp", {
        name: "registerChain",
        fire: function () {
            // build the chain
            klevu.setObjectPath(klevu.analytics.base.getScope().element.kScope, "chains.events.personalizedSearchTracking", klevu.chain({
                stopOnFalse: true
            }));
        }
    });

    klevu.coreEvent.attach("analyticsPersonalizedSearchTrackingPowerUp", {
        name: "populateChain",
        fire: function () {
            //add the personalizedSearchTracking analytics checks
            klevu.analytics.base.getScope().chains.events.personalizedSearchTracking.add({
                name: "personalizedSearchTrackingRequestCheck",
                fire: function (data, scope) {
                    klevu.clean(data.request.analytics);
                    var analytics = data.request.analytics;
                    try {
                        var hasError = false;
                        var errorPrefix = "";
                        if (klevu.isUndefined(analytics.klevu_productId)) {
                            hasError = true;
                            errorPrefix = "klevu_productId";
                        }
                        if (hasError) {
                            throw new Error(errorPrefix + " parameter is missing from the banner click analytics request!");
                        }
                    } catch (error) {
                        /* DEBUG CODE START */
                        if (klevu.settings.console.type.event) {
                            klevu.logError("chains.events.personalizedSearchTracking - personalizedSearchTrackingRequestCheck - check parameters.");
                            klevu.logError("chains.events.personalizedSearchTracking - personalizedSearchTrackingRequestCheck - error:");
                            klevu.logError(error);
                        }
                        /* DEBUG CODE END */
                        return false;
                    }
                }
            });
            //add the personalizedSearchTracking analytics url generation
            klevu.analytics.base.getScope().chains.events.personalizedSearchTracking.add({
                name: "generateURL",
                fire: function (data, scope) {
                    var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analyticsCat", false);
                    if (analyticsUrl) {
                        data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.personalizedSearchTracking", false);
                    } else {
                        return false;
                    }
                }
            });
            //add the personalizedSearchTracking analytics request
            klevu.analytics.base.getScope().chains.events.personalizedSearchTracking.add({
                name: "doAnalytics",
                fire: function (data, scope) {
                    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");
                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if (data.context.preventDefault === true) return false;
                }
            });
            //add to supported ajax types
            klevu.analytics.base.getScope().chains.request.send.addBefore("requestTypeAjaxV1", {
                name: "requestTypeAjaxPersonalizedSearchTracking",
                fire: function (data, scope) {
                    if (data.context.eventAction === "personalizedSearchTracking") {
                        data.context.eventAction = "analyticsAjaxV1";
                    }
                }
            });
        }
    });

    klevu.coreEvent.attach("analyticsPersonalizedSearchTrackingPowerUp", {
        name: "buildEvent",
        fire: function () {
            // build the event
            klevu.extend(true, klevu.analyticsEvents, {
                personalizedSearchTracking: function (data, kObject) {
                    if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
                    var kScope = kObject.getScope();
                    kScope.data = kObject.resetData();
                    kScope.data.context.eventAction = "personalizedSearchTracking";
                    //set up data for request
                    kScope.data.request.analytics = data;
                    kScope.data.context.preventDefault = false;

                    klevu.event.fireChain(kScope, "chains.events.personalizedSearchTracking", kScope.element, kScope.data, null);
                    return kObject;
                }
            });
        }
    });

    klevu.coreEvent.attach("analyticsPersonalizedSearchTrackingPowerUp", {
        name: "buildEvent",
        fire: function () {
            klevu.extend(true, klevu.support, {
                analytics: {
                    personalizedSearchTracking: true
                }
            });
        }
    });


})(klevu);

klevu.coreEvent.build({
    name: "personalizedSearchTrackingModule",
    fire: function () {
        if (
            !klevu.search.modules ||
            !klevu.search.modules.trendingProducts ||
            !klevu.search.modules.trendingProducts.build ||
            !klevu.support.analytics ||
            !klevu.support.analytics.personalizedSearchTracking ||
            !klevu.analyticsUtil ||
            !klevu.analyticsUtil.build
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});


/**
 * Addon for the analytics util component for the banner
 */
klevu.coreEvent.attach("personalizedSearchTrackingModule", {
    name: "attachPersonalizedSearchTrackingModuleEvents",
    fire: function () {

        klevu.extend(true, klevu.analyticsUtil.base, {
            storage: {
                personalizedSearchTracking: "personalizedSearchTrackingList"
            },

            /**
             * Function to register banner click event and store the relevant information
             * @param {*} scope 
             * @param {*} dictionary 
             * @param {*} element 
             */
            registerPersonalizedSearchTrackingClickEvent: function (scope, className, dictionary, element) {
                var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(className + " .kuTrackPersonalizedProductClick", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var productId = value.dataset.id;
                        var searchResultContainer = klevu.dom.find(className, target)[0];
                        var dataSection;
                        var dataSource;
                        if (searchResultContainer) {
                            dataSection = searchResultContainer.dataset.section;
                            dataSource = searchResultContainer.dataset.source;
                        }
                        if (!dataSection) {
                            return;
                        }
                        var klevuProduct = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                        scope.data.context.section = dataSection;

                        var recentSearchesValue = "";
                        var recentSearches = klevu.getObjectPath(scope.data, "template.recentSearches");
                        if (recentSearches && recentSearches.length) {
                            recentSearches = recentSearches.join("#-#");
                            recentSearchesValue = encodeURIComponent(recentSearches);
                        }

                        if (productId) {
                            var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                            if (product) {
                                var psTrackingOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                                if (psTrackingOptions) {
                                    psTrackingOptions.klevu_term = "";
                                    psTrackingOptions.klevu_keywords = "";
                                    psTrackingOptions.klevu_productId = product.id;
                                    psTrackingOptions.klevu_productName = encodeURIComponent(product.name);
                                    psTrackingOptions.klevu_productUrl = product.url;
                                    psTrackingOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;template:trending]]";


                                    psTrackingOptions.klevu_source = dataSource;
                                    psTrackingOptions.klevu_recentsearch = recentSearchesValue;
                                    psTrackingOptions.klevu_salePrice = product.salePrice;
                                    psTrackingOptions.klevu_rating = (typeof product.rating != "undefined") ? product.rating : "";
                                    psTrackingOptions.klevu_rank = (klevuProduct && klevuProduct.id) ? klevuProduct.id : "";
                                    psTrackingOptions.klevu_type = "clicked";

                                    delete psTrackingOptions.filters;
                                    delete psTrackingOptions.klevu_limit;
                                    delete psTrackingOptions.klevu_pageNumber;
                                    delete psTrackingOptions.klevu_totalResults;
                                    delete psTrackingOptions.klevu_typeOfQuery;
                                    delete psTrackingOptions.klevu_sort;

                                    klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, psTrackingOptions);
                                }
                            }
                        }
                    });
                });
            }

        });
    }
});

/**
 * Event to send the stored analytics event
 */
klevu.coreEvent.attach("analyticsSendStoredData", {
    name: "sendStoredPersonalizedSearchTrackingEvent",
    fire: function () {
        klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
            klevu.analyticsUtil.base.storage.dictionary,
            klevu.analyticsUtil.base.storage.personalizedSearchTracking
        );
    }
});
klevu.coreEvent.build({
    name: "appendLandingPageLoaderEvent",
    fire: function () {
        if (!klevu.dom.find(".klevuLanding") ||
            !klevu.dom.find(".klevuLanding").length) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 10
});

klevu.coreEvent.attach("appendLandingPageLoaderEvent", {
    name: "renderLoaderUI",
    fire: function () {
        var kuLandingTarget = klevu.dom.find(".klevuLanding")[0];
        var removeResourceLoader = function () {
            document.body.classList.remove("kuFeatureResourcesLoading");
            var elements = document.getElementsByClassName("kuResourceLoader");
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        };
        var appendResourceLoader = function () {
            removeResourceLoader();
            document.body.classList.add("kuFeatureResourcesLoading");
            var kuLoader = document.createElement("div");
            kuLoader.classList.add("kuResourceLoader");
            kuLandingTarget.appendChild(kuLoader);
        };
        appendResourceLoader();
    }
});

klevu.coreEvent.build({
    name: "setRemoteConfigLanding",
    fire: function () {
        if (!klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.search.landing) ||
            klevu.isUndefined(klevu.search.modules.kmcInputs)
        ) {
            return false;
        }
        if (
            klevu.search.modules.kmcInputs.build &&
            !klevu.search.modules.kmcInputs.hasAllResourcesLoaded
        ) {
            return false;
        }
        var showSearchBoxOnLandingPage = klevu.search.modules.kmcInputs.base.getShowSearchOnLandingPageEnableValue();
        if (
            showSearchBoxOnLandingPage &&
            klevu.search.modules.resultsSearchBar &&
            klevu.search.modules.resultsSearchBar.build &&
            !klevu.search.extra
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-locale",
    fire: function () {
        klevu.search.landing.getScope().template.getTranslator().mergeFromGlobal();
        klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
    }
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-templates",
    fire: function () {
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateBase"), "klevuTemplateLanding", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplatePagination"), "pagination", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResults"), "results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateProductBlock"), "productBlock", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResultsHeadingTitle"), "klevuLandingTemplateResultsHeadingTitle", true);
    }
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-chains",
    fire: function () {

        /** Event to add pagination */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "addPagination",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuPaginate", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();

                        var element = event.target;
                        var target = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                        if (target === null) {
                            return;
                        }

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        var options = klevu.dom.helpers.getClosest(element, ".klevuMeta");
                        var offset = element.dataset.offset;
                        offset = (offset < 0) ? 0 : offset;

                        klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", parseInt(offset));
                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    }, true);
                });
            }
        });

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processCurrencySetting",
            fire: function (data, scope) {
                var landingCurrencies = klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().getCurrencys();
                var productCurrency = "";
                klevu.each(data.template.query, function (key, items) {
                    if (!klevu.isUndefined(items) && productCurrency == "") {
                        klevu.each(items.result, function (key, result) {
                            if (result.currency && result.currency.length) {
                                productCurrency = result.currency;
                            }
                        });
                    }
                });
                if (productCurrency.length && !landingCurrencies[productCurrency]) {
                    landingCurrencies[productCurrency] = klevu.search.modules.kmcInputs.base.getPriceFormatterObject(productCurrency);
                    var currencyLanding = klevu.search.landing.getScope().template.getTranslator().getCurrencyObject();
                    currencyLanding.setCurrencys(landingCurrencies);
                    currencyLanding.mergeToGlobal();
                }
            }
        });

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processFilters",
            fire: function (data, scope) {
                var queryIds = [];
                klevu.each(data.template.query, function (key, value) {
                    queryIds.push(key);
                });
                if (queryIds.length) {
                    data.template.queryIds = queryIds;
                    klevu.each(data.template.queryIds, function (key, value) {
                        var items = klevu.getObjectPath(data.template.query, value);
                        if (!klevu.isUndefined(items)) {
                            klevu.each(items.filters, function (keyFilter, filter) {
                                filter.multiselect = klevu.search.modules.kmcInputs.base.getFilterMultiSelectValue();
                            });
                        }
                    });
                }
            }
        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "manageKlevuTemplateBlocksStatus",
            fire: function (data, scope) {
                klevu.baseStructure.base.initialize(scope);
            }
        });

        klevu.search.landing.getScope().chains.template.render.add({
            name: "renderResponse",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    scope.kScope.template.setData(data.template);
                    var targetBox = "klevuTemplateLanding";
                    var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.innerHTML = '';
                    target.classList.add("klevuTarget");
                    target.classList.add("kuSearchResultsPageContainer");
                    target.classList.remove("searchRequestLoading");
                    document.body.classList.remove("kuFeatureResourcesLoading");
                    scope.kScope.element.kData = data.template;
                    scope.kScope.template.insertTemplate(target, element);
                }
            }
        });

        klevu.search.landing.getScope().chains.request.control.addBefore("sanitiseRequestSuggestions", {
            name: "storeOriginRequestSuggestions",
            fire: function (data, scope) {
                var reqSuggestions = klevu.getObjectPath(data, "request.current.suggestions");
                klevu.setObjectPath(data, "request.original.suggestions", klevu.extend([], reqSuggestions));
            }
        });

        klevu.search.landing.getScope().chains.request.control.addBefore("sanitiseRequestQuery", {
            name: "storeOriginRequestRecordQueries",
            fire: function (data, scope) {
                var reqRecordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                klevu.setObjectPath(data, "request.original.recordQueries", klevu.extend([], reqRecordQueries));
            }
        });

    }
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-template-helpers",
    fire: function () {
        var quickStorage = klevu.getSetting(klevu.settings, "settings.storage");
        klevu.search.landing.getScope().template.setHelper("cropText", function cropText(textValue, length) {
            if (textValue.length <= length) return textValue;
            return textValue.substring(0, length) + "...";
        });
        klevu.search.landing.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });
    }
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachSearchRequestLoader",
    fire: function () {
        klevu.search.modules.requestLoader.base.initSearchRequestLoader(klevu.search.landing.getScope());
    }
});
/**
 * Addon JS file for the module which will be
 * overwrite by the catnav
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addQueryForSearchRequest",
    fire: function () {

        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductList",
            fire: function (data, scope) {
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                var productList = klevu.extend(true, {}, parameterMap.recordQuery);

                productList.id = "productList";
                productList.typeOfRequest = "SEARCH";
                productList.settings.query.term = data.context.term;
                productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                productList.settings.limit = 12;
                productList.settings.fallbackQueryId = "productListFallback";
                productList.filters.filtersToReturn.enabled = true;
                data.request.current.recordQueries.push(productList);

                data.context.doSearch = true;
            }
        });

        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductListFallback",
            fire: function (data, scope) {
                var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                var productListFallback = klevu.extend(true, {}, parameterMap.recordQuery);

                productListFallback.id = "productListFallback";
                productListFallback.typeOfRequest = "SEARCH";
                productListFallback.isFallbackQuery = "true";
                productListFallback.settings.query.term = "*";
                productListFallback.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productListFallback.settings.searchPrefs = ["excludeDescription", "searchCompoundsAsAndQuery"];
                productListFallback.settings.limit = 3;
                productListFallback.settings.sort = "RELEVANCE";

                data.request.current.recordQueries.push(productListFallback);

                data.context.doSearch = true;
            }
        });
    }
});

/**
 * Attach code event to landing page analytics
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachSearchResultLandingPageAnalyticsEvents",
    fire: function () {

        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachAnalyticsActionEvent",
            fire: function (data, scope) {

                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".klevuMeta", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        data.context.section = value.dataset.section;
                        scope.kScope.data.context.section = value.dataset.section;
                    });
                }, true);

                var tabStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                if (tabStorage && tabStorage.tabs) {
                    tabStorage.tabs.setStorage("local");
                    tabStorage.tabs.mergeFromGlobal();
                    var currentSection = tabStorage.tabs.getElement("active");
                    if (currentSection && currentSection.length && currentSection != "active") {
                        data.context.section = currentSection;
                        scope.kScope.data.context.section = currentSection;
                    } else {
                        if (klevu.dom.find(".klevuMeta", target)[0]) {
                            klevu.dom.find(".klevuMeta", target)[0].click();
                        }
                    }
                } else {
                    if (klevu.dom.find(".klevuMeta", target)[0]) {
                        klevu.dom.find(".klevuMeta", target)[0].click();
                    }
                }

                var termOptions = klevu.analyticsUtil.base.getTermOptions(scope.kScope, true);
                if (termOptions.klevu_src) {
                    termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;template:landing]]");
                    if (termOptions.filters) {
                        termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;source:filters]]");
                    }
                }

                delete termOptions.filters;
                klevu.analyticsEvents.term(termOptions);

                klevu.analyticsUtil.base.registerLandingProductClickEvent(
                    scope.kScope,
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );

            }
        });
    }
});
/**
 * Facets implementation
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addFacetsOnLandingPage",
    fire: function () {

        var hasFilterEnabled = klevu.search.modules.kmcInputs.base.getFiltersEnableValue();
        var filterPosition = klevu.search.modules.kmcInputs.base.getLandingFilterPosition();
        if (!hasFilterEnabled || (hasFilterEnabled && filterPosition !== "left")) {
            return;
        }

        /** Load filters template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeFilterLeft",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
        });
    }
});
/**
 * Facets implementation
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addTopFacetsOnLandingPage",
    fire: function () {

        var hasFilterEnabled = klevu.search.modules.kmcInputs.base.getFiltersEnableValue();
        var filterPosition = klevu.search.modules.kmcInputs.base.getLandingFilterPosition();
        if (!hasFilterEnabled || (hasFilterEnabled && filterPosition !== "top")) {
            return;
        }

        /** Load filters template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTopFilters"), "filtersTop", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeFilterTop",
            fire: function (data, scope) {
                klevu.search.modules.facets.base.attachFacetItemsClickEvent(scope.kScope);
            }
        });
    }
});
/**
 * Extend addToCart base module for landing page
 */


klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForLandingPage",
    fire: function () {

        /**
         * Landing page Add to cart button click event
         * @param {*} ele 
         * @param {*} event 
         * @param {*} productList 
         */
        function attachProductAddToCartBtnEvent(ele, event, productList) {
            event = event || window.event;
            event.preventDefault();

            var selected_product;
            var target = klevu.dom.helpers.getClosest(ele, ".kuAddtocart");
            var productId = target.getAttribute("data-id");
            klevu.each(productList, function (key, product) {
                if (product.id == productId) {
                    selected_product = product;
                }
            });
            if (selected_product) {
                ele.selected_product = selected_product;
                if (selected_product) {
                    klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, selected_product.url, 1);
                }
            }
        }

        /**
         * Function to bind events to landing page product add to cart button
         * @param {*} scope 
         */
        function bindLandingProductAddToCartBtnClickEvent(scope) {
            var self = this;
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");

            klevu.each(klevu.dom.find(".kuLandingAddToCartBtn", target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                    if (parent && parent.dataset && parent.dataset.section) {
                        var productList = klevu.getObjectPath(scope.data.template.query, parent.dataset.section);
                        self.attachProductAddToCartBtnEvent(this, event, productList.result);
                    }
                });
            });
        }

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindLandingProductAddToCartBtnClickEvent: bindLandingProductAddToCartBtnClickEvent,
            attachProductAddToCartBtnEvent: attachProductAddToCartBtnEvent
        });
    }
});

/**
 *  Add to cart button functionality on landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addAddToCartButtonLandingPage",
    fire: function () {
        var isAddToCartEnabled = klevu.search.modules.kmcInputs.base.getAddToCartEnableValue();
        if (isAddToCartEnabled) {
            /** Set Template */
            klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingPageProductAddToCart"), "landingPageProductAddToCart", true);

            /** Bind landing page add to cart button click event */
            klevu.search.landing.getScope().chains.template.events.add({
                name: "landingPageProductAddToCartEvent",
                fire: function (data, scope) {
                    klevu.search.modules.addToCart.base.bindLandingProductAddToCartBtnClickEvent(scope.kScope);
                }
            });
        }
    }
});
/**
 * Klevu analyticsUtil base extension
 */
klevu.coreEvent.attach("analyticsPowerUp", {
    name: "extAddToCartAnalyticsUtil",
    fire: function () {

        /**
         * Function to register analytics on landing page add to cart button
         * @param {*} scope 
         * @param {*} className 
         * @param {*} dictionary 
         * @param {*} element 
         */
        function registerProductAddToCartClickEvent(scope, className, dictionary, element) {
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(className, target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                    if (parent === null) {
                        return;
                    }
                    var productId = parent.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[shortlist:add-to-cart;;template:landing]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            registerProductAddToCartClickEvent: registerProductAddToCartClickEvent
        });

    }
});


/**
 * Function to attach analytics event on add to cart button
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachLandingProductAddToCartButtonAnalytics",
    fire: function () {

        /**
         * Event to bind analytics on add to cart click event
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnAddToCartButtonEvent",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerProductAddToCartClickEvent(
                    scope.kScope,
                    ".kuAddtocart",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );
            }
        });
    }
});
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
            var firstImg = klevu.dom.find(".klevuImgWrap img", parentElem)[0];
            if (firstImg) {
                img = firstImg;
            }
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

        var hasColorSwatchesEnabled = klevu.search.modules.kmcInputs.base.getColorSwatchesEnableValue();
        if (!hasColorSwatchesEnabled) {
            return;
        }

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
            klevu.each(klevu.dom.find('.klevuLandingSwatchColorGrid'), function (key, value) {
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

        var hasColorSwatchesEnabled = klevu.search.modules.kmcInputs.base.getColorSwatchesEnableValue();
        if (!hasColorSwatchesEnabled) {
            return;
        }

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
        if (klevu.search.landing.getScope().chains.quickView) {
            klevu.search.landing.getScope().chains.quickView.add({
                name: "bindColorGridEvents",
                fire: function (data, scope) {
                    klevu.search.modules.colorSwatches.base.bindColorGridEvents();
                }
            });
        }
    }
});
/**
 * Attach Product stock availability label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductavailabilityLabel",
    fire: function () {


        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingSearchResultProductStock"), "landingProductStock", true);

    }
});
/**
 * Attach Product VAT label
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addProductVATLabel",
    fire: function () {
        var getVAT = klevu.search.modules.kmcInputs.base.getVatCaption();
        if (!getVAT || getVAT == "") {
            return;
        }

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductVATLabel"), "searchResultProductVATLabel", true);
    }
});
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-sort",
    fire: function () {
        var options = {
            storage: {
                sort: klevu.dictionary("sort")
            }
        };
        klevu(options);

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateSortBy"), "sortBy", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "setSortBy",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var sort = (landingStorage.sort.getElement(query.id) == query.id) ? false : landingStorage.sort.getElement(query.id);
                    if (sort) {
                        query.settings.sort = sort;
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.sort.setStorage("local");
        storage.sort.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getSortBy", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var sorting = (landingStorage.sort.getElement(name) == name) ? "RELEVANCE" : landingStorage.sort.getElement(name);
            var returnedValue = "";
            switch (sorting) {
                case "RELEVANCE":
                    returnedValue = 'Relevance';
                    break;
                case "PRICE_ASC":
                    returnedValue = 'Price: Low to high';
                    break;
                case "PRICE_DESC":
                    returnedValue = 'Price: High to low';
                    break;
                default:
                    returnedValue = 'Relevance';
                    break;
            }
            return returnedValue;

        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "SortBySort",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuSort", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");

                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");

                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.sort.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.sort.mergeToGlobal();

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + section.dataset.section + ".settings.offset", 0);
                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    });
                });
            }
        });
    }
});
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-limit",
    fire: function () {
        var options = {
            storage: {
                limits: klevu.dictionary("limits")
            }
        };
        klevu(options);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateLimit"), "limit", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "setLimits",
            fire: function (data, scope) {
                var landingStorage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                klevu.each(data.request.current.recordQueries, function (key, query) {
                    var limit = (landingStorage.limits.getElement(query.id) == query.id) ? false : landingStorage.limits.getElement(query.id);
                    if (limit) {
                        query.settings.limit = limit;
                    } else {
                        query.settings.limit = 12;
                        landingStorage.limits.addElement(query.id, 12);
                        landingStorage.limits.mergeToGlobal();
                    }
                });
            }
        });

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.limits.setStorage("local");
        storage.limits.mergeFromGlobal();

        klevu.search.landing.getScope().template.setHelper("getLimit", function (name) {
            var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
            var limit = (landingStorage.limits.getElement(name) == name) ? 12 : landingStorage.limits.getElement(name);
            return limit;
        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "SortByLimit",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuDropdown .kuLimit", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var section = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.limits.addElement(section.dataset.section, this.dataset.value);
                        storageEngine.limits.mergeToGlobal();

                        var scope = target.kElem;
                        scope.kScope.data = scope.kObject.resetData(scope.kElem);
                        scope.kScope.data.context.keyCode = 0;
                        scope.kScope.data.context.eventObject = event;
                        scope.kScope.data.context.event = "keyUp";
                        scope.kScope.data.context.preventDefault = false;

                        klevu.setObjectPath(scope.kScope.data, "localOverrides.query." + section.dataset.section + ".settings.offset", 0);
                        klevu.event.fireChain(scope.kScope, "chains.events.keyUp", scope, scope.kScope.data, event);
                    });
                });
            }
        });
    }
});
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-tabs",
    fire: function () {

        var options = {
            storage: {
                tabs: klevu.dictionary("tabs")
            }
        };
        klevu(options);

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
        storage.tabs.setStorage("local");
        storage.tabs.mergeFromGlobal();

        /** set templates */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTabResults"), "tab-results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateContentBlock"), "contentBlock", true);

        var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue();
        if (isCmsEnabled) {
            /** Tab results list */
            klevu.search.landing.getScope().tabResultsList = ['productList', 'contentList'];
        } else {
            klevu.search.landing.getScope().tabResultsList = ['productList'];
        }

        var translatorLanding = klevu.search.landing.getScope().template.getTranslator();
        translatorLanding.addTranslation("Search", "Search");
        translatorLanding.addTranslation("<b>%s</b> productList", "<b>%s</b> Products");
        translatorLanding.addTranslation("<b>%s</b> contentList", "<b>%s</b> Other results");
        translatorLanding.mergeToGlobal();

        // /** move object attribute */
        klevu.search.landing.getScope().moveObjectElement = function (currentKey, afterKey, obj) {
            var result = {};
            var val = obj[currentKey];
            delete obj[currentKey];
            var next = -1;
            var i = 0;
            if (typeof afterKey === 'undefined' || afterKey === null) {
                afterKey = '';
            }

            Object.keys(obj).forEach(function (key) {
                var k = key;
                var v = obj[key];
                if ((afterKey === '' && i === 0) || next === 1) {
                    result[currentKey] = val;
                    next = 0;
                }
                if (k === afterKey) {
                    next = 1;
                }
                result[k] = v;
                ++i;

            });

            if (next === 1) {
                result[currentKey] = val;
            }
            if (next !== -1) {
                return result;
            } else {
                return obj;
            }
        };


        // add the tab text name to the query data
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "processTabs",
            fire: function (data, scope) {

                if (klevu.search.landing.getScope().tabResultsList && klevu.search.landing.getScope().tabResultsList.length) {
                    var tempTabList = [];
                    klevu.each(klevu.search.landing.getScope().tabResultsList, function (key, value) {
                        var items = klevu.getObjectPath(data.template.query, value);
                        if (!klevu.isUndefined(items)) {
                            items.id = value;
                            items.tab = true;
                            items.tabText = "<b>%s</b> " + value;
                            items.sort = key + 1;
                            tempTabList.push(items);
                        }
                    });

                    var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue();
                    if (isCmsEnabled) {
                        if (tempTabList.length) {
                            tempTabList.sort(function (a, b) {
                                return b.sort - a.sort;
                            });
                            tempTabList.forEach(function (tabObj) {
                                data.template.query = klevu.search.landing.getScope().moveObjectElement(tabObj.id, '', data.template.query);
                            });
                        }
                    }
                }
            }
        });

        klevu.search.landing.getScope().template.setHelper("hasResults", function hasResults(data, name) {
            if (data.query[name]) {
                if (data.query[name].result.length > 0) return true;
            }
            return false;
        });

        /**
         * Function to initialize tab selection
         */
        klevu.search.landing.getScope().initializeTabSelection = function (data, scope, target) {
            var isTabSelected;

            klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                var landingStorage = klevu.getSetting(klevu.settings, "settings.storage");
                var selectedTab = landingStorage.tabs.getElement("active");
                value.classList.remove("kuTabSelected");
                if (selectedTab && value.dataset && value.dataset.section) {
                    if (selectedTab == value.dataset.section) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(value, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        data.context.section = value.dataset.section;
                        klevuWrap.classList.add(value.dataset.section + "Active");
                        isTabSelected = true;
                    }
                }
            });
            if (!isTabSelected) {
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    value.classList.remove("kuTabSelected");
                    if (key === 0) {
                        value.classList.add("kuTabSelected");
                        var klevuWrap = klevu.dom.helpers.getClosest(value, ".klevuWrap");
                        if (klevuWrap === null) {
                            return;
                        }
                        klevuWrap.classList.add(value.dataset.section + "Active");
                    }
                });
            }
        };

        //tab swap
        klevu.search.landing.getScope().chains.template.events.add({
            name: "tabContent",
            fire: function (data, scope) {

                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.search.landing.getScope().initializeTabSelection(data, scope, target);
                klevu.each(klevu.dom.find(".kuTab", target), function (key, value) {
                    // onclick
                    klevu.event.attach(value, "click", function (event) {

                        event = event || window.event;
                        event.preventDefault();

                        //getScope
                        var section = klevu.dom.helpers.getClosest(this, ".klevuWrap");
                        if (section === null) {
                            return;
                        }
                        //removeSelectionFromAllTabs
                        klevu.each(klevu.dom.find(".kuTab.kuTabSelected", section), function (key, value) {
                            value.classList.remove("kuTabSelected");
                            section.classList.remove(value.dataset.section + "Active");
                        });

                        //add Selection to current tab
                        this.classList.add("kuTabSelected");
                        section.classList.add(this.dataset.section + "Active");
                        var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                        var storageEngine = klevu.getSetting(target.kScope.settings, "settings.storage");
                        storageEngine.tabs.addElement("active", this.dataset.section);
                        storageEngine.tabs.mergeToGlobal();

                        /** Initialize price filter slider on tab change */
                        if (klevu.search.modules.filterPriceSlider) {
                            klevu.search.modules.filterPriceSlider.base.initSlider(data, scope.kScope);
                        }
                    });
                });
            }
        });

    }
});

/**
 * Core event to attach content list in request
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachContentListRequest",
    fire: function () {
        var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue();
        if (isCmsEnabled) {

            /**
             * Erase result heading template in case of tab results
             */
            klevu.search.landing.getScope().template.setTemplate("", "klevuLandingTemplateResultsHeadingTitle", true);

            klevu.search.landing.getScope().chains.request.build.add({
                name: "addContentList",
                fire: function (data, scope) {
                    var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                    var contentList = klevu.extend(true, {}, parameterMap.recordQuery);
                    contentList.id = "contentList";
                    contentList.typeOfRequest = "SEARCH";
                    contentList.settings.query.term = data.context.term;
                    contentList.settings.typeOfRecords = ["KLEVU_CMS"];
                    contentList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    contentList.settings.limit = 12;
                    contentList.filters.filtersToReturn.enabled = true;
                    data.request.current.recordQueries.push(contentList);
                    data.context.doSearch = true;
                }
            });
        }
    }
});
/**
 * Attach Product badge
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addSearchResultProductBadges",
    fire: function () {

        /** Set Template */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductBadge"), "landingProductBadge", true);
    }
});
/**
 * Promotional Banner module for Quick Search results
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "promotionalBannerInit",
    fire: function () {
        var staticLandingPageBannerData = [];
        klevu.search.modules.promotionBanner.base.init(staticLandingPageBannerData);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingPromotionBanner"), "klevuLandingPromotionBanner", true);

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "validateResultSetForPromotionalBanner",
            fire: function (data, scope) {
                var hasEmptyFound = false;
                var productList = klevu.getObjectPath(data, "template.query.productList.result");
                if (!productList || !productList.length) {
                    var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue();
                    if (isCmsEnabled) {
                        var cmsCompressed = klevu.getObjectPath(data, "template.query.cmsCompressed.result");
                        if (!cmsCompressed || !cmsCompressed.length) {
                            hasEmptyFound = true;
                        }
                    } else {
                        hasEmptyFound = true;
                    }
                }
                var term = klevu.getObjectPath(data, "template.settings.term");
                if (!term || !term.length) {
                    hasEmptyFound = true;
                }
                klevu.setObjectPath(data, "template.modules.promotionalBanner.hasNoResultFound", hasEmptyFound);
            }
        });

        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachBannerClickEvent",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerBannerClickEvent(
                    scope.kScope,
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.bannerClick
                );
            }
        });

    }
});
/**
 * Promotional Banner module for Search Results Landing Page
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "updatePromotionalBannerData",
    fire: function () {

        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "appendLandingBanners",
            fire: function (data) {
                var landingBannerList = klevu.search.modules.promotionBanner.base.getLandingPageBanners();
                if (landingBannerList && landingBannerList.length) {
                    data.template.banners = {
                        "top": [],
                        "bottom": []
                    };
                    var defaultBanner = '';
                    var isDefaultAppear = true;
                    var defaultBannerPosition = 'top';
                    klevu.each(landingBannerList, function (index, value) {
                        if (value.hasOwnProperty("showForTerms")) {
                            if (value.showForTerms == null) {
                                defaultBannerPosition = value.position;
                                defaultBanner = value;
                            } else if (!klevu.isEmptyObject(value.showForTerms)) {
                                klevu.each(value.showForTerms, function (i, term) {
                                    if (data.context.term == term) {
                                        var position = value.position ? value.position : 'top';
                                        data.template.banners[position].push(value);
                                        isDefaultAppear = false;
                                    }
                                });
                            }
                        }
                    });
                    if (isDefaultAppear && defaultBanner) {
                        data.template.banners[defaultBannerPosition].push(defaultBanner);
                    }
                }
            }
        });

    }
});
/**
 *  Product image path update for Magento framework
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {
        /**
         * Event to update product image url for magento store 
         */
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "updateProductImagePath",
            fire: function (data, scope) {
                var productDataModification = klevu.search.modules.productDataModification;
                if (productDataModification) {
                    productDataModification.base.updateImagePath(scope.kScope);
                }
            }
        });
    }
});
/**
 * Extension for collapse filter functionality
 */

(function (klevu) {

    /**
     * Initialize collapsing for filter items
     * @param {*} scope 
     */
    function initialize(scope) {
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");

        klevu.each(klevu.dom.find(".kuFilterHead", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                var kuFilterHead = value;
                event = event || window.event;
                event.preventDefault();

                var hasClass = false;
                var storage = klevu.getSetting(scope.settings, "settings.storage");
                storage.filterCollapse.setStorage("session");
                storage.filterCollapse.mergeFromGlobal();
                var existingKeys = storage.filterCollapse.getElement("keys");

                this.classList.toggle("kuCollapse");
                this.classList.toggle("kuExpand");

                var parentElem = klevu.dom.helpers.getClosest(this, ".kuFilterBox");
                klevu.each(klevu.dom.find(".kuFilterNames", parentElem), function (key, value) {
                    value.classList.toggle("kuFilterCollapse");
                    hasClass = value.classList.contains("kuFilterCollapse");
                    if (kuFilterHead.classList.contains("kuCollapse") && value.dataset && parseInt(value.dataset.optioncount) < 5) {
                        value.classList.add("kuFilterShowAll");
                    } else {
                        value.classList.remove("kuFilterShowAll");
                    }
                });

                var parentElem = klevu.dom.helpers.getClosest(this, ".kuFilterBox");
                var clickedFilterKey = (parentElem && parentElem.dataset && parentElem.dataset.filter) ? parentElem.dataset.filter : "";
                if (clickedFilterKey && clickedFilterKey.length) {
                    if (hasClass) {
                        existingKeys += clickedFilterKey + ",";
                    } else {
                        existingKeys = existingKeys.replace(new RegExp(clickedFilterKey + ",", "g"), "");
                    }
                    storage.filterCollapse.addElement("keys", existingKeys);
                    storage.filterCollapse.mergeToGlobal();
                }

            });
        });

        klevu.each(klevu.dom.find(".kuFilterBox", target), function (key, value) {
            var clickedFilterKey = (value && value.dataset && value.dataset.filter) ? value.dataset.filter : "";
            if (clickedFilterKey.length) {

                var storage = klevu.getSetting(scope.settings, "settings.storage");
                var isKeyFoundInStorage = function (sessionStorage, key) {
                    var hasFoundInStorage = false;
                    sessionStorage.setStorage("session");
                    sessionStorage.mergeFromGlobal();
                    var existingKeys = sessionStorage.getElement("keys");
                    if (existingKeys.indexOf(key) > -1) {
                        hasFoundInStorage = true;
                    }
                    return hasFoundInStorage;
                }

                var isShowMoreKeyFound = isKeyFoundInStorage(storage.filterShowMore, clickedFilterKey);
                if (isShowMoreKeyFound) {
                    klevu.each(klevu.dom.find(".kuFilterNames", value), function (key, element) {
                        element.classList.add("kuFilterShowAll");
                    });
                }

                var isCollapseKeyFound = isKeyFoundInStorage(storage.filterCollapse, clickedFilterKey);
                if (isCollapseKeyFound) {
                    klevu.each(klevu.dom.find(".kuFilterHead", value), function (key, element) {
                        element.classList.remove("kuCollapse");
                        element.classList.add("kuExpand");
                    });
                    klevu.each(klevu.dom.find(".kuFilterNames", value), function (key, element) {
                        element.classList.remove("kuFilterShowAll");
                        element.classList.add("kuFilterCollapse");
                    });
                }

            }
        });

        klevu.each(klevu.dom.find(".kuShowOpt", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();

                var storage = klevu.getSetting(scope.settings, "settings.storage");
                storage.filterShowMore.setStorage("session");
                storage.filterShowMore.mergeFromGlobal();
                var existingKeys = storage.filterShowMore.getElement("keys");

                var hasClass = false;
                var parentElem = klevu.dom.helpers.getClosest(this, ".kuFilterBox");
                klevu.each(klevu.dom.find(".kuFilterNames", parentElem), function (key, value) {
                    value.classList.toggle("kuFilterShowAll");
                    hasClass = value.classList.contains("kuFilterShowAll");
                });

                var clickedFilterKey = (parentElem && parentElem.dataset && parentElem.dataset.filter) ? parentElem.dataset.filter : "";
                if (clickedFilterKey && clickedFilterKey.length) {
                    if (hasClass) {
                        existingKeys += clickedFilterKey + ",";
                    } else {
                        existingKeys = existingKeys.replace(new RegExp(clickedFilterKey + ",", "g"), "");
                    }
                    storage.filterShowMore.addElement("keys", existingKeys);
                    storage.filterShowMore.mergeToGlobal();
                }
            });
        });
    };

    /**
     * Function to collapse filter list as per the priority list
     * @param {*} data 
     * @param {*} collapsedFilters 
     */
    function collapse(data, collapsedFilters, itemListId) {
        if (data && data.template && data.template.query && collapsedFilters && collapsedFilters.length) {
            var items = klevu.getObjectPath(data.template.query, itemListId);
            if (items && items.filters) {
                var filters = items.filters;
                filters.forEach(function (filter) {
                    filter.isCollapsed = false;
                });
                collapsedFilters.forEach(function (collapsedFilter) {
                    filters.forEach(function (filter) {
                        if (collapsedFilter.key == filter.key) {
                            filter.isCollapsed = true;
                        }
                    });
                });
            }
        }
    };

    var collapseFilters = {
        collapse: collapse,
        initialize: initialize
    };

    klevu.extend(true, klevu.search.modules, {
        collapseFilters: {
            base: collapseFilters,
            build: true
        }
    });
})(klevu);

/**
 * collapseFilters module build event
 */
klevu.coreEvent.build({
    name: "collapseFiltersModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.collapseFilters ||
            !klevu.search.modules.collapseFilters.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Collapse filter
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "collapseFilters",
    fire: function () {

        var apiKey = klevu.settings.search.apiKey;
        var filterShowMore = (apiKey && apiKey.length) ? "filterShowMore_" + apiKey : "filterShowMore";
        var filterCollapse = (apiKey && apiKey.length) ? "filterCollapse_" + apiKey : "filterCollapse";

        var options = {
            storage: {
                filterShowMore: klevu.dictionary(filterShowMore),
                filterCollapse: klevu.dictionary(filterCollapse)
            }
        };
        klevu(options);

        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");

        storage.filterShowMore.setStorage("session");
        storage.filterShowMore.mergeFromGlobal();
        storage.filterShowMore.addElement("keys", "");
        storage.filterShowMore.mergeToGlobal();

        storage.filterCollapse.setStorage("session");
        storage.filterCollapse.mergeFromGlobal();
        storage.filterCollapse.addElement("keys", "");
        storage.filterCollapse.mergeToGlobal();

        /**
         * Function to enable collapsing for filter items
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "enableFilterCollapse",
            fire: function (data, scope) {
                klevu.search.modules.collapseFilters.base.initialize(scope.kScope);
            }
        });

        /**
         * Function to set filter priority list and reorder filter list
         */
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "collapseFilterPosition",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    var collapsedFilters = [];
                    klevu.search.modules.collapseFilters.base.collapse(data, collapsedFilters, 'productList');
                }
            }
        });
    }
});
/**
 * Module for No Results Found
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "addNoResultsFoundEvents",
    fire: function () {

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateNoResultFound"), "noResultsFoundLanding", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingNoResultsFoundBanners"), "landingNoResultsFoundBanners", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuNoResultsPopularSearchesLanding"), "noResultsLandingPopularSearches", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuNoResultsPopularProductsLanding"), "noResultsLandingPopularProductsTemplate", true);

        klevu.search.landing.getScope().chains.request.build.add({
            name: "addPopularProductsRequest",
            fire: function (data, scope) {
                klevu.search.modules.noResultsFound.base.buildPopularProductsReq(data, scope, 4);
            },
        });

        /**
         * Event to add no results found object into the data template object
         */
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "addNoResultsFoundData",
            fire: function (data, scope) {
                data.template.noResultsFoundMsg = klevu.search.modules.noResultsFound.base.getMessage(data.context.term);
                data.template.landingNoResultsFoundBanners = klevu.search.modules.noResultsFound.base.getLandingBanners(data.context.term);
                data.template.landingNoResultsPopularHeading = klevu.search.modules.noResultsFound.base.popularProductsHeading();
                var isPopularSearchesEnabled = klevu.search.modules.noResultsFound.base.isPopularSearchesKeywordsEnabled();
                if (isPopularSearchesEnabled) {
                    if (typeof klevu_webstorePopularTerms !== "undefined" && klevu_webstorePopularTerms) {
                        data.template.noResultsFoundPopularSearches = klevu_webstorePopularTerms;
                    }
                }
            }
        });
    }
});
/**
 * Module for filter tags
 */

(function (klevu) {
    klevu.extend(true, klevu.search.modules, {
        filterTags: {
            base: {
                init: function (scope) {
                    var template = scope.data.template;
                    if (template.query) {
                        template.filterTags.query = {};
                        klevu.each(template.query, function (key, value) {
                            var filterData = {
                                tags: []
                            };
                            if (value.filters) {
                                klevu.each(value.filters, function (key, filter) {
                                    var tag = {
                                        key: filter.key,
                                        label: filter.label,
                                        values: []
                                    };
                                    var isAnyFilterSelected = false;
                                    if (filter.options) {
                                        klevu.each(filter.options, function (key, option) {
                                            if (option.selected) {
                                                isAnyFilterSelected = true;
                                                tag.values.push(option.name);
                                            }
                                        });
                                    }
                                    if (isAnyFilterSelected) {
                                        filterData.tags.push(tag);
                                    }
                                });
                            }
                            template.filterTags.query[key] = filterData;
                        });
                    }
                },
                attachEvents: function (scope) {
                    klevu.each(klevu.dom.find(".kuFilterTagClearAll"), function (key, element) {
                        klevu.event.attach(element, "click", function (event) {
                            var target = klevu.dom.helpers.getClosest(this, ".klevuTarget");
                            if (target === null) {
                                return;
                            }
                            var options = klevu.dom.helpers.getClosest(this, ".klevuMeta");
                            if (options === null) {
                                return;
                            }
                            var elScope = target.kElem;
                            elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                            elScope.kScope.data.context.keyCode = 0;
                            elScope.kScope.data.context.eventObject = event;
                            elScope.kScope.data.context.event = "keyUp";
                            elScope.kScope.data.context.preventDefault = false;

                            klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".settings.offset", 0);
                            klevu.setObjectPath(elScope.kScope.data, "localOverrides.query." + options.dataset.section + ".filters.applyFilters", {});
                            klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
                        });
                    });
                    klevu.each(klevu.dom.find(".kuFilterTagValue"), function (key, element) {
                        klevu.event.attach(element, "click", function (e) {
                            var kuFilterTag = klevu.dom.helpers.getClosest(element, ".kuFilterTag");
                            var parentKeyValue = (kuFilterTag && kuFilterTag.dataset.key) ? kuFilterTag.dataset.key : undefined;
                            if (parentKeyValue) {
                                var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
                                klevu.each(klevu.dom.find(".kuFilterBox", target), function (key, value) {
                                    var filterKey = (value.dataset && value.dataset.filter) ? value.dataset.filter : undefined;
                                    if (parentKeyValue == filterKey) {
                                        klevu.each(klevu.dom.find(".klevuFilterOption", value), function (key, option) {
                                            var optionValue = (option.dataset && option.dataset.value) ? option.dataset.value : undefined;
                                            var selectedOptionValue = (element.dataset && element.dataset.value) ? element.dataset.value : undefined;
                                            if (optionValue && optionValue == selectedOptionValue) {
                                                option.click();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            },
            build: true
        }
    });
})(klevu);

/**
 * Filter tags module build event
 */
klevu.coreEvent.build({
    name: "filterTagsModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.filterTags ||
            !klevu.search.modules.filterTags.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Event to append filter tags
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "renderFilterTags",
    fire: function () {

        /**
         * Register filter tags template
         */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuFilterTagsTemplate"), "kuFilterTagsTemplate", true);

        klevu.setObjectPath(klevu.search.landing.getScope().data, "template.filterTags", {});

        /**
         * Event to prepare data for filter tags
         */
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "prepareDataForFilterTags",
            fire: function (data, scope) {
                klevu.search.modules.filterTags.base.init(scope.kScope);
            }
        });

        /**
         * Attach filter tags events
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachFilterTagEvents",
            fire: function (data, scope) {
                klevu.search.modules.filterTags.base.attachEvents(scope.kScope);
            }
        });

    }
});
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "kuModuleResultViewSwitch",
    fire: function () {

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuTemplateLandingResultsViewSwitch"), "kuTemplateLandingResultsViewSwitch", true);

        var viewStorageKey = (klevu.settings.search.apiKey) ? "view_" + klevu.settings.search.apiKey : "view_";
        var options = {
            storage: {
                view: klevu.dictionary(viewStorageKey)
            }
        };
        klevu(options);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachViewSwitchEvents",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuViewSwitch", target), function (key, element) {

                    setTimeout(function () {
                        var section = klevu.dom.helpers.getClosest(element, ".klevuMeta");
                        if (section) {
                            var hasListMatched = false;
                            klevu.each(klevu.dom.find(".kuViewSwitch", section), function (key, element) {
                                var storage = klevu.getSetting(scope.kScope.settings, "settings.storage");
                                storage.view.setStorage("local");
                                storage.view.mergeFromGlobal();
                                var storedValue = storage.view.getElement(section.dataset.section);
                                section.dataset.resultView = storedValue;
                                if (storedValue == element.dataset.value) {
                                    element.classList.add("kuCurrent");
                                    hasListMatched = true;
                                }
                            });
                            if (!hasListMatched) {
                                klevu.each(klevu.dom.find(".kuViewSwitch", section), function (key, element) {
                                    if (element.dataset.value == "grid") {
                                        element.classList.add("kuCurrent");
                                    }
                                });
                            }
                        }
                    }, 10);

                    klevu.event.attach(element, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();

                        var section = klevu.dom.helpers.getClosest(element, ".klevuMeta");
                        if (section) {
                            klevu.each(klevu.dom.find(".kuViewSwitch", section), function (key, element) {
                                element.classList.remove("kuCurrent");
                            });
                        }

                        var storage = klevu.getSetting(klevu.search.landing.getScope().settings, "settings.storage");
                        element.classList.add("kuCurrent");
                        var eleValue = (element.dataset && element.dataset.value) ? element.dataset.value : "value";

                        var queryId = "";
                        if (section) {
                            section.dataset.resultView = eleValue;
                            queryId = section.dataset.section;
                        }

                        storage.view.setStorage("local");
                        storage.view.mergeFromGlobal();
                        storage.view.addElement(queryId, eleValue);
                        storage.view.mergeToGlobal();
                    });
                });
            }
        });
    }
});
/**
 * Module for Search results search bar
 */

(function (klevu) {
    klevu.extend(true, klevu.searchEvents, {
        bindLatestQuickSearchBox: {
            name: "interactive-results-search-boxes-activate",
            fire: function () {
                // deactivate all search boxes
                klevu.search.active = null;
                //grab all the input boxes from the document
                var searchBoxSelector = klevu.getSetting(klevu.settings, "settings.search.searchBoxSelector", klevu.randomId());
                var list = klevu.dom.find(searchBoxSelector);

                // loop in the list of elements

                klevu.each(list, function (key, element) {
                    if (element.type === "text" || element.type === "search" || element.type === "input") {
                        // check if klevu is already active on the search box
                        if (!klevu.isUndefined(element.kObject)) return true;
                        // build a new klevu search object from base
                        var search = klevu.searchObjectClone(klevu.search.extra);
                        search.getScope().element = element;
                        // attach the klevu search object to input box for future reference
                        element.kObject = search;
                        element.kScope = element.kObject.getScope();
                        element.kElem = element.kObject.getScope().element;
                        // build target element
                        var searchBoxTarget = klevu.getSetting(klevu.settings, "settings.search.searchBoxTarget", false);
                        if (!searchBoxTarget) {
                            klevu.dom.helpers.addElementToParent(null, "div", {
                                id: element.kScope.id,
                                "class": "klevu-fluid"
                            });
                            klevu.setSetting(element.kScope.settings, "settings.search.searchBoxTarget", document.getElementById(element.kScope.id));
                        }
                        searchBoxTarget = klevu.getSetting(element.kScope.settings, "settings.search.searchBoxTarget", false);
                        searchBoxTarget.kObject = element.kObject;
                        searchBoxTarget.kScope = element.kScope;
                        searchBoxTarget.kElem = element.kElem;
                        //todo: Need extraPolyfill.js
                        searchBoxTarget.classList.add("klevuTarget");

                        // add events to element
                        klevu.event.attach(search.getScope().element, "focus", klevu.searchEvents.box.focus, true);
                        klevu.event.attach(search.getScope().element, "keyup", klevu.searchEvents.box.keyUp, true);
                        klevu.event.attach(search.getScope().element, "paste", function (event) {
                            setTimeout(function () {
                                klevu.searchEvents.box.keyUp.call(event.target, event);
                            }, 10);
                        }, true);

                        // add the form submit event and also attach the klevu search object to the form
                        if (element.form) {
                            element.form.kObject = search;
                            element.form.kScope = element.form.kObject.getScope();
                            element.form.kElem = element.form.kObject.getScope().element;
                            klevu.event.attach(search.getScope().element.form, "submit", klevu.searchEvents.box.submit, true);
                        }
                        // stop the autocomplete
                        search.getScope().element.setAttribute("autocomplete", "off");
                        var maxLength = klevu.getSetting(element.kScope.settings, "settings.search.maxChars", 128);
                        search.getScope().element.setAttribute("maxlength", maxLength);

                        if (typeof klevu.search.resultsQuick !== "undefined") {
                            klevu.search.extraSearchBox[klevu.search.resultsQuick] = search;
                        } else {
                            klevu.search.extraSearchBox.push(search);
                            klevu.search.resultsQuick = klevu.search.extraSearchBox.length - 1;
                        }

                        return true;
                    }
                });
            }
        }
    });
    klevu.extend(true, klevu.search.modules, {
        resultsSearchBar: {
            build: true
        }
    });
})(klevu);

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "landingSearchBarModule",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().chains.events.focus.addBefore("displayOverlay", {
                name: "hideAllOverlay",
                fire: function (data, scope) {
                    klevu.each(klevu.search.extraSearchBox, function (key, box) {
                        var fullPage = klevu.getSetting(box.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
                        if (!fullPage) {
                            var target = klevu.getSetting(box.getScope().settings, "settings.search.searchBoxTarget");
                            target.style = "display: none !important;";
                        }
                    });
                }
            });
        });

        klevu.search.extra = klevu.searchObjectClone(klevu.search.quick);
    }
});

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "landingSearchBarModule",
    fire: function () {
        var showSearchBoxOnLandingPage = klevu.search.modules.kmcInputs.base.getShowSearchOnLandingPageEnableValue();
        if (klevu.search.extra && showSearchBoxOnLandingPage) {} else {
            return;
        }
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateSearchBar"), "klevuLandingTemplateSearchBar", true);
        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeResultsSearch",
            fire: function (data, scope) {
                setTimeout(function () {
                    klevu.searchEvents.bindLatestQuickSearchBox.fire();
                    var termValue = klevu.getObjectPath(data, "context.term");
                    if (termValue && termValue.length && termValue != "*" && klevu.search.extraSearchBox[klevu.search.resultsQuick]) {
                        klevu.search.extraSearchBox[klevu.search.resultsQuick].getScope().element.value = termValue;
                    }

                    if (klevu.search.extraSearchBox[klevu.search.resultsQuick]) {

                        var parentForm = klevu.dom.helpers.getClosest(klevu.search.quick.getScope().element, 'form');
                        if (parentForm) {
                            var action = parentForm.getAttribute("action");
                            var name = parentForm.getAttribute("name");
                            var currentParent = klevu.dom.helpers.getClosest(klevu.search.extraSearchBox[klevu.search.resultsQuick].getScope().element, 'form');
                            if (currentParent && action && action.length) {
                                if (action && action.length) {
                                    currentParent.setAttribute("action", action);
                                }
                                if (name && name.length) {
                                    currentParent.setAttribute("name", name);
                                }
                            }
                        }

                        klevu.search.extraSearchBox[klevu.search.resultsQuick].getScope().chains.template.events.add({
                            name: "positionTemplate",
                            fire: function (data, scope) {
                                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                                var bodyRect = document.body.getBoundingClientRect();
                                var elemRect = scope.kScope.element.getBoundingClientRect();
                                var offsetTop = elemRect.top - bodyRect.top;
                                klevu.dom.find(".klevuWrap", target)[0].style = "top:" + ((offsetTop + elemRect.height) > 0 ? (offsetTop + elemRect.height) : 0) + "px;left: " + ((elemRect.left) ? elemRect.left : 0) + "px;right: auto;";
                            }
                        });
                    }

                }, 10);
            }
        });
    }
});
/**
 * Recent view module event
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachRecentViewClickEvents",
    fire: function () {

        var recentlyViewedItemsObject = klevu.search.modules.kmcInputs.base.getShowRecentlyViewedItemsValue();
        if (!recentlyViewedItemsObject.showRecentlyViewedItems) {
            return;
        }

        klevu.search.modules.recentViewedProducts.base.limit = recentlyViewedItemsObject.showRecentlyViewedItemsLimit;

        var apiKey = klevu.settings.search.apiKey;
        var recentViewedProducts = (apiKey && apiKey.length) ? "recentViewedProducts_" + apiKey : "recentViewedProducts";

        var options = {
            storage: {
                recentViewedProducts: klevu.dictionary(recentViewedProducts)
            }
        };
        klevu(options);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "attachRecentViewProductClick",
            fire: function (data, scope) {
                if (klevu.search.modules.recentViewedProducts) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find(".kuTrackRecentView", target), function (key, element) {
                        klevu.event.attach(element, "click", function (event) {
                            var productId = element.dataset.id;
                            if (productId) {
                                klevu.search.modules.recentViewedProducts.base.addProductId(scope.kScope, productId);
                            }
                        });
                    });
                }
            }
        });

    }
});
/**
 * extending module to define initImageRollover functionality which will be called for landing and quick view
 */
(function (klevu) {

    klevu.extend(true, klevu.search.modules, {
        imageRollover: {
            base: {
                initImageRollover: function (parentClassName, target, hoverClassName, srcClassName) {
                    klevu.each(klevu.dom.find(parentClassName, target), function (key, element) {
                        var landingImgHover;
                        var landingImgEleHover = klevu.dom.find(hoverClassName, element);
                        var landingImgEleSrc = klevu.dom.find(srcClassName, element)[0];
                        klevu.event.attach(element, "mouseover", function (event) {
                            if (landingImgEleHover) {
                                if (landingImgEleHover[0]) {
                                    landingImgHover = landingImgEleHover[0];
                                    landingImgEleSrc.style.display = "none";
                                    landingImgHover.style.display = "inline-block";
                                }
                            }
                        });

                        klevu.event.attach(element, "mouseout", function (event) {
                            if (landingImgEleHover) {
                                if (landingImgEleHover[0]) {
                                    landingImgHover = landingImgEleHover[0];
                                    landingImgEleSrc.style.display = "inline-block";
                                    landingImgHover.style.display = "none";
                                }
                            }
                        });
                    });
                },
            },
            build: true
        }
    });
})(klevu);

/**
 * Attach image rollover functionality while hovering
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "imageRollover",
    fire: function () {
        var isLandingRolloverImageEnable = klevu.search.modules.kmcInputs.base.getShowRolloverImageValue();
        if (!isLandingRolloverImageEnable) {
            return;
        }

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#landingImageRollover"), "landingImageRollover", true);

        klevu.search.landing.getScope().chains.template.events.add({
            name: "initializeLandingImageRollover",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.search.modules.imageRollover.base.initImageRollover(".klevuImgWrap", target, ".kuProdImgHover", ".kuProdImg");
            }
        })
    }
});
/**
 * Event to fire landing search request
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "search-landing-init",
    fire: function () {
        if (klevu.dom.find(".klevuLanding").length > 0) {
            klevu.search.landing.setTarget(klevu.dom.find(".klevuLanding")[0]);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
            klevu.setSetting(klevu.search.landing.getScope().settings, "settings.search.minChars", 0);
            var klevuUrlParams = klevu.getAllUrlParameters();
            if (klevuUrlParams.length > 0) {
                klevu.each(klevuUrlParams, function (key, elem) {
                    if (elem.name == "q") {
                        var tempElement = klevu.search.landing.getScope().element;
                        tempElement.value = decodeURIComponent(elem.value).split("+").join(" ");
                        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
                        klevu.event.fireChain(tempElement.kScope, "chains.events.keyUp", tempElement, tempElement.kScope.data, null);
                    }
                });
            }
        }
    }
});