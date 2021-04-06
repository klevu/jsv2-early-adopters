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
/**
 * build event chain to check when quick is powered up
 */
klevu.coreEvent.build({
    name: "setRemoteConfigQuick",
    fire: function () {
        if (
            !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
            klevu.isUndefined(klevu.search.extraSearchBox) ||
            (klevu.search.extraSearchBox.length === 0) ||
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
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add base quick search templates
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-templates",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTemplateBase"), "klevuTemplateBase", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuSearchPersonalizations"), "klevuSearchPersonalizations", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickAutoSuggestions"), "klevuQuickAutoSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPageSuggestions"), "klevuQuickPageSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickCategorySuggestions"), "klevuQuickCategorySuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProducts"), "klevuQuickProducts", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProductBlock"), "klevuQuickProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultFound"), "klevuQuickNoResultFound", true);
        });
    }
});

//attach locale settings
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-locale",
    fire: function () {
        //add translations
        var translatorQuick = klevu.search.quick.getScope().template.getTranslator();
        translatorQuick.addTranslation("Search", "Search");
        translatorQuick.addTranslation("<b>%s</b> productList", "<b>%s</b> Products");
        translatorQuick.addTranslation("<b>%s</b> contentList", "<b>%s</b> Other results");
        translatorQuick.mergeToGlobal();
    }
});

// attach all klevu chains
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "search-quick-chains",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            //get the global translations
            box.getScope().template.getTranslator().mergeFromGlobal();
            //get the global currency
            box.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();

            box.getScope().chains.events.focus.add({
                name: "displayOverlay",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.style = "display: block !important;";
                }
            });

            box.getScope().chains.events.focus.add({
                name: "doSearch",
                fire: function (data, scope) {
                    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doSearch");
                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if (data.context.preventDefault === true) return false;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addAutoSuggestions",
                fire: function (data, scope) {
                    if (data.context.term) {
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var suggestion = klevu.extend(true, {}, parameterMap.suggestions);
                        suggestion.id = "autosuggestion";
                        suggestion.query = data.context.term;
                        suggestion.typeOfRequest = "AUTO_SUGGESTIONS";
                        suggestion.limit = klevu.search.modules.kmcInputs.base.getMaxNumberOfAutoSuggestions();
                        data.request.current.suggestions.push(suggestion);
                    }
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addCategoryCompressed",
                fire: function (data, scope) {
                    if (data.context.term && data.context.term != "*") {
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var categoryCompressed = klevu.extend(true, {}, parameterMap.recordQuery);
                        categoryCompressed.id = "categoryCompressed";
                        categoryCompressed.typeOfRequest = "SEARCH";
                        categoryCompressed.settings.query.term = data.context.term;
                        categoryCompressed.settings.typeOfRecords = ["KLEVU_CATEGORY"];
                        categoryCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                        categoryCompressed.settings.fields = ["id", "name", "shortDesc", "url", "typeOfRecord"];
                        categoryCompressed.settings.limit = klevu.search.modules.kmcInputs.base.getMaxNumberOfProductSuggestions();
                        categoryCompressed.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(categoryCompressed);
                    }
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addCmsCompressed",
                fire: function (data, scope) {
                    var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue();
                    if (isCmsEnabled && data.context.term && data.context.term != "*") {
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var cmsCompressed = klevu.extend(true, {}, parameterMap.recordQuery);
                        cmsCompressed.id = "cmsCompressed";
                        cmsCompressed.typeOfRequest = "SEARCH";
                        cmsCompressed.settings.query.term = data.context.term;
                        cmsCompressed.settings.typeOfRecords = ["KLEVU_CMS"];
                        cmsCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                        cmsCompressed.settings.fields = ["id", "name", "shortDesc", "url", "typeOfRecord"];
                        cmsCompressed.settings.limit = 3;
                        cmsCompressed.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(cmsCompressed);
                    }
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addProductList",
                fire: function (data, scope) {
                    var suggestionsLimit = klevu.search.modules.kmcInputs.base.getMaxNumberOfProductSuggestions();
                    if (data.context.term && data.context.term != "" && data.context.term != "*" && suggestionsLimit) {
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var productList = klevu.extend(true, {}, parameterMap.recordQuery);
                        productList.id = "productList";
                        productList.typeOfRequest = "SEARCH";
                        productList.settings.query.term = data.context.term;
                        productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        productList.settings.fallbackQueryId = "productListFallback";
                        productList.settings.limit = suggestionsLimit;
                        productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                        productList.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(productList);
                    }
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addProductListFallback",
                fire: function (data, scope) {
                    if (data.context.term && data.context.term != "" && data.context.term != "*") {
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
                    }
                    data.context.doSearch = true;
                }
            });

            // where to render the response
            box.getScope().chains.template.render.add({
                name: "renderResponse",
                fire: function (data, scope) {
                    if (data.context.isSuccess) {
                        scope.kScope.template.setData(data.template);
                        var targetBox = "klevuTemplateBase";
                        var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                        target.innerHTML = '';
                        target.classList.add("klevuTarget");
                        target.classList.add("kuQuickSearchResultsContainer");
                        target.classList.remove("searchRequestLoading");
                        scope.kScope.element.kData = data.template;
                        scope.kScope.template.insertTemplate(target, element);
                    }
                }
            });

            box.getScope().chains.template.process.success.add({
                name: "processCurrencySetting",
                fire: function (data, scope) {
                    var landingCurrencies = box.getScope().template.getTranslator().getCurrencyObject().getCurrencys();
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
                        var currencyLanding = box.getScope().template.getTranslator().getCurrencyObject();
                        currencyLanding.setCurrencys(landingCurrencies);
                        currencyLanding.mergeToGlobal();
                    }
                }
            });

            // where to position the template
            box.getScope().chains.template.events.add({
                name: "positionTemplate",
                fire: function (data, scope) {

                    var position, leftPosition, topPosition, searchBoxWidth, searchBoxHeight,
                        screenWidth, minLtrWidth, halfScreen;

                    var getScreenWidth = function () {
                        var doc = document,
                            docBody = doc.body,
                            docElem = doc.documentElement,
                            win = window,
                            viewportWidth, viewportHeight;

                        // the more standards compliant browsers
                        // (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
                        if (typeof (docBody.clientWidth) == 'number') {
                            viewportWidth = docBody.clientWidth;
                        } else if (typeof win.innerWidth !== 'undefined') {
                            viewportWidth = win.innerWidth;
                        } else if (typeof docElem != 'undefined' &&
                            typeof docElem.clientWidth != 'undefined' &&
                            docElem.clientWidth != 0) {
                            // IE6 in standards compliant mode
                            // (i.e. with a valid doctype as the first line in the document)
                            viewportWidth = docElem.clientWidth;
                        } else {
                            // older versions of IE
                            viewportWidth = doc.getElementsByTagName('body')[0].clientWidth
                        }
                        return viewportWidth;
                    };

                    var getSearchBoxPosition = function (searchBox) {
                        var _x = 0,
                            _y = 0,
                            currEl = searchBox,
                            style,
                            position,
                            doc = document,
                            body = doc.body,
                            fixedPosition = false,
                            oldOffsetTop = 0,
                            win = window;

                        while (currEl && currEl.tagName.toLowerCase() !== 'body') {
                            if (!win.getComputedStyle) {
                                win.getComputedStyle = function (searchBox, pseudo) {
                                    this.searchBox = searchBox;
                                    this.getPropertyValue = function (prop) {
                                        var re = /(\-([a-z]){1})/g;
                                        if (prop === 'float') {
                                            prop = 'styleFloat';
                                        }
                                        if (re.test(prop)) {
                                            prop = prop.replace(re, function () {
                                                return arguments[2].toUpperCase();
                                            });
                                        }
                                        return searchBox.currentStyle[prop] ? searchBox.currentStyle[prop] : null;
                                    }
                                    return this;
                                }
                            }
                            style = win.getComputedStyle(currEl, null);
                            if (style) {
                                position = style.getPropertyValue('position');
                                if (position === 'fixed') {
                                    fixedPosition = true;
                                    break;
                                } else {
                                    currEl = currEl.parentNode;
                                }
                            } else {
                                currEl = currEl.parentNode;
                            }
                        }
                        var change = 1,
                            scrollTop = (win.pageYOffset !== undefined) ? win.pageYOffset :
                            (doc.documentElement || body.parentNode || body).scrollTop;
                        while (searchBox && !isNaN(searchBox.offsetLeft) &&
                            !isNaN(searchBox.offsetTop)) {
                            _x += searchBox.offsetLeft - searchBox.scrollLeft;
                            if (fixedPosition && change === 1) {
                                _y += searchBox.offsetTop + scrollTop;
                                change = 0;
                            } else {
                                _y += searchBox.offsetTop;
                            }
                            searchBox = searchBox.offsetParent;
                        }
                        return {
                            top: _y,
                            left: _x
                        };
                    };

                    screenWidth = getScreenWidth();
                    position = getSearchBoxPosition(scope.kElem);

                    topPosition = position.top;
                    leftPosition = position.left;
                    searchBoxWidth = scope.kElem.offsetWidth;
                    searchBoxHeight = scope.kElem.offsetHeight;

                    halfScreen = screenWidth / 2;
                    minLtrWidth = searchBoxWidth;

                    divTop = searchBoxHeight + topPosition + 'px';
                    if (leftPosition >= halfScreen) {
                        divRight = screenWidth - (leftPosition + searchBoxWidth) + 'px';
                        divLeft = 'auto';
                    } else {
                        divRight = 'auto';
                        divLeft = leftPosition + 'px';
                    }

                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    klevu.dom.find(".klevuWrap", target)[0].style = "top:" + divTop + ";left: " + divLeft + ";right: " + divRight + ";";
                }
            });

            box.getScope().chains.template.events.add({
                name: "manageKlevuTemplateBlocksStatus",
                fire: function (data, scope) {
                    klevu.baseStructure.base.initialize(scope);
                }
            });

            box.getScope().chains.request.control.addBefore("sanitiseRequestSuggestions", {
                name: "storeOriginRequestSuggestions",
                fire: function (data, scope) {
                    var reqSuggestions = klevu.getObjectPath(data, "request.current.suggestions");
                    klevu.setObjectPath(data, "request.original.suggestions", klevu.extend([], reqSuggestions));
                }
            });

            box.getScope().chains.request.control.addBefore("sanitiseRequestQuery", {
                name: "storeOriginRequestRecordQueries",
                fire: function (data, scope) {
                    var reqRecordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                    klevu.setObjectPath(data, "request.original.recordQueries", klevu.extend([], reqRecordQueries));
                }
            });

            var updateClassBasedOnTheTerm = function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                if (target) {
                    target.classList.remove("kuEmptySearchBox");
                    target.classList.remove("kuSearchBoxWithTerm");
                    var term = klevu.getObjectPath(data, "context.term");
                    if (term && term.length) {
                        target.classList.add("kuSearchBoxWithTerm");
                    } else {
                        target.classList.add("kuEmptySearchBox");
                    }
                }
            }

            box.getScope().chains.events.focus.add({
                name: "addSearchBoxStatusClass",
                fire: function (data, scope) {
                    updateClassBasedOnTheTerm(data, scope);
                }
            });

            box.getScope().chains.events.keyUp.add({
                name: "addSearchBoxStatusClass",
                fire: function (data, scope) {
                    updateClassBasedOnTheTerm(data, scope);
                }
            });

            try {
                klevu.event.attach(box.getScope().element, "paste", function (event) {
                    setTimeout(function () {
                        var tempElement = box.getScope().element;
                        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
                        klevu.event.fireChain(tempElement.kScope, "chains.events.focus", tempElement, tempElement.kScope.data, event);
                    }, 10);
                });
            } catch (error) {
                console.error(error);
            }

            // override form action
            box.getScope().element.kElem.form.action = klevu.getSetting(box.getScope().settings, "settings.url.landing", false);

            /**
             * Init search request loader
             */
            klevu.search.modules.requestLoader.base.initSearchRequestLoader(box.getScope());
        });
    }
});

/**
 * Attach core event to add quick search analytics
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachQuickSearchAnalyticsEvents",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().element.kScope.analyticsDelay = {
                analyticsReqTimeOut: null,
                delay: 1000
            };

            /**
             * Send term request for analytics
             */
            box.getScope().chains.template.events.add({
                name: "doAnalytics",
                fire: function (data, scope) {
                    if (box.getScope().element.kScope.analyticsDelay.analyticsReqTimeOut) {
                        clearTimeout(box.getScope().element.kScope.analyticsDelay.analyticsReqTimeOut);
                    }
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    var searchResultContainer = klevu.dom.find(".klevuQuickSearchResults", target)[0];

                    var dataSection = (searchResultContainer && searchResultContainer.dataset.section) ? searchResultContainer.dataset.section : "unknown";
                    scope.kScope.data.context.section = dataSection;

                    var boxScope = box.getScope().element.kScope;
                    box.getScope().element.kScope.analyticsDelay.analyticsReqTimeOut = setTimeout(function () {
                        var termOptions = klevu.analyticsUtil.base.getTermOptions(boxScope, true);
                        if (termOptions) {
                            termOptions.klevu_term = (termOptions.klevu_term) ? termOptions.klevu_term.trim() : "";
                            if (termOptions.klevu_term != "" && termOptions.klevu_term != "*") {
                                termOptions.klevu_src = termOptions.klevu_src.replace("]]", ";;template:quick-search]]");
                                klevu.analyticsEvents.term(termOptions);
                            }
                        }
                        if (boxScope.analyticsDelay) {
                            boxScope.analyticsDelay.analyticsReqTimeOut = null;
                        }
                    }, boxScope.analyticsDelay.delay);
                }
            });

            /**
             * Function to add result product click analytics
             */
            box.getScope().chains.template.events.add({
                name: "doResultProductsAnalytics",
                fire: function (data, scope) {
                    /**
                     * Event to fire on quick search product click
                     */

                    klevu.analyticsUtil.base.registerAutoSuggestTermEvent(
                        scope.kScope,
                        ".klevuAutosuggestions",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.term
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestPageClickEvent(
                        scope.kScope,
                        ".klevuCmsSuggestions",
                        "cmsCompressed",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestPageClickEvent(
                        scope.kScope,
                        ".klevuCategorySuggestions",
                        "categoryCompressed",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );

                    klevu.analyticsUtil.base.registerAutoSuggestProductClickEvent(
                        scope.kScope,
                        ".klevuQuickSearchResults",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );
                }
            });

        });
    }
});
/**
 * Promotional Banner module for Quick Search results
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventAddPromotionalBannersOnQuickSearch",
    fire: function () {

        var staticQuickSearchBannerData = [];
        klevu.search.modules.promotionBanner.base.init(staticQuickSearchBannerData);

        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPromotionBanner"), "klevuQuickPromotionBanner", true);

            box.getScope().chains.template.process.success.add({
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

            box.getScope().chains.template.process.success.add({
                name: "appendBanners",
                fire: function (data, scope) {
                    var quickBannerList = klevu.search.modules.promotionBanner.base.getQuickSearchBanners();
                    if (quickBannerList && quickBannerList.length) {
                        data.template.banners = {
                            "top": [],
                            "bottom": []
                        };
                        var defaultBanner = '';
                        var isDefaultAppear = true;
                        var defaultBannerPosition = 'top';
                        if (!klevu.isEmptyObject(quickBannerList)) {
                            klevu.each(quickBannerList, function (index, value) {
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
                        }
                        if (isDefaultAppear && defaultBanner) {
                            data.template.banners[defaultBannerPosition].push(defaultBanner);
                        }
                    }
                }
            });

            box.getScope().chains.template.events.add({
                name: "attachBannerClickEvent",
                fire: function (data, scope) {
                    klevu.analyticsUtil.base.registerBannerClickEvent(
                        scope.kScope,
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.bannerClick
                    );
                }
            });

        });
    }
});
/**
 *  Product image path update for Magento framework
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "updateMagentoSearchResultProductImagePath",
    fire: function () {

        /**
         * Event to update product image url for magento store 
         */
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().chains.template.process.success.add({
                name: "updateProductImagePath",
                fire: function (data, scope) {
                    var productDataModification = klevu.search.modules.productDataModification;
                    if (productDataModification) {
                        productDataModification.base.updateImagePath(scope.kScope);
                    }
                }
            });
        });
    }
});
/**
 * Module for Popular products
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addPopularSearchEvents",
    fire: function () {

        var isPopularSearchEnabled = klevu.search.modules.kmcInputs.base.getShowPopularSearchesValue();
        if (!isPopularSearchEnabled) {
            return;
        }


        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuTemplatePopularSearches"), "kuTemplatePopularSearches", true);

            /**
             * Event to add popular searches data into the data template object
             */
            box.getScope().chains.template.process.success.add({
                name: "addPopularSearchData",
                fire: function (data, scope) {
                    data.template.popularSearches = [];
                    if (!data.context.term || data.context.term == "" || data.context.term == "*") {
                        data.template.popularSearches = klevu.search.modules.kmcInputs.base.getWebstorePopularTermsValue();;
                    }
                }
            });

            /**
             * Event to bind popular searches element click event
             */
            box.getScope().chains.template.events.add({
                name: "attachPopularSearchUIEvents",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find(".kuPopularSearchTerm", target), function (key, element) {
                        klevu.event.attach(element, "click", function (event) {
                            var termValue = element.dataset.value;
                            if (termValue) {
                                scope.kElem.value = termValue;
                                var target = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                                if (target) {
                                    var elScope = target.kElem;
                                    elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                                    elScope.kScope.data.context.keyCode = 0;
                                    elScope.kScope.data.context.eventObject = event;
                                    elScope.kScope.data.context.event = "keyUp";
                                    elScope.kScope.data.context.preventDefault = false;
                                    klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
                                }
                            }
                        });
                    });
                }
            });

        });
    }
});
(function (klevu) {

    klevu.extend(true, klevu.search.modules, {
        recentSearches: {
            base: {
                limit: 4,

                /**
                 * Function to add search term to the local storage
                 * @param {*} scope 
                 * @param {*} term 
                 */
                addSearchTerm: function (scope, term) {
                    if (!term || term == "") {
                        return;
                    }
                    var limit = (this.limit) ? this.limit : 4;
                    var storage = klevu.getSetting(scope.settings, "settings.storage");
                    storage.recentSearches.setStorage("local");
                    storage.recentSearches.mergeFromGlobal();

                    var storedKeywords = storage.recentSearches.getElement("ku_keywords");
                    if (storedKeywords && storedKeywords != "ku_keywords") {
                        storedKeywords = storedKeywords.replace(new RegExp(term + ",", "g"), "");
                        storedKeywords = storedKeywords.replace(new RegExp(term), "", "g");
                        term = term + "," + storedKeywords;
                    } else {
                        term = term + ",";
                    }

                    var updatedList = [];
                    var termList = term.split(",");
                    klevu.each(termList, function (key, item) {
                        if (item) {
                            if (updatedList.length < limit) {
                                updatedList.push(item);
                            }
                        }
                    });
                    term = updatedList.join(",");
                    storage.recentSearches.addElement("ku_keywords", term);
                    storage.recentSearches.mergeToGlobal();
                },

                /**
                 * function to get search terms
                 * @param {*} scope 
                 */
                getSearchTerms: function (scope) {
                    var storedTerms = [];
                    var storage = klevu.getSetting(scope.settings, "settings.storage");
                    storage.recentSearches.setStorage("local");
                    storage.recentSearches.mergeFromGlobal();
                    var storedKeywords = storage.recentSearches.getElement("ku_keywords");
                    if (storedKeywords && storedKeywords != "ku_keywords") {
                        storedTerms = storedKeywords.split(",");
                    }
                    return storedTerms;
                }
            },
            build: true
        }
    });

})(klevu);


/**
 * Module for Recently Searched Keywords
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addRecentKMCSearchEvents",
    fire: function () {

        var showRecentSearches = klevu.search.modules.kmcInputs.base.getShowRecentSearchesValue();
        if (!showRecentSearches) {
            return;
        }

        var apiKey = klevu.settings.search.apiKey;
        var recentSearches = (apiKey && apiKey.length) ? "recentSearches_" + apiKey : "recentSearches";

        var options = {
            storage: {
                recentSearches: klevu.dictionary(recentSearches)
            }
        };
        klevu(options);

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            var storage = klevu.getSetting(box.getScope().settings, "settings.storage");
            storage.recentSearches.setStorage("local");

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuTemplateRecentSearches"), "kuTemplateRecentSearches", true);

            box.getScope().chains.events.submit.add({
                name: "addRecentSearchInputs",
                fire: function (data, scope) {
                    klevu.search.modules.recentSearches.base.addSearchTerm(scope.kScope, data.context.term);
                }
            });

            box.getScope().chains.template.process.success.add({
                name: "getRecentSearchesData",
                fire: function (data, scope) {
                    data.template.recentSearches = [];
                    if (!data.context.term || data.context.term == "" || data.context.term == "*") {
                        data.template.recentSearches = klevu.search.modules.recentSearches.base.getSearchTerms(scope.kScope);
                    }
                }
            });

            box.getScope().chains.template.events.add({
                name: "attachRecentSearchUIEvents",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    klevu.each(klevu.dom.find(".kuRecentSearchTerm", target), function (key, element) {
                        klevu.event.attach(element, "click", function (event) {
                            var termValue = element.dataset.value;
                            if (termValue) {
                                scope.kElem.value = termValue;
                                var target = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                                if (target) {
                                    var elScope = target.kElem;
                                    elScope.kScope.data = elScope.kObject.resetData(elScope.kElem);
                                    elScope.kScope.data.context.keyCode = 0;
                                    elScope.kScope.data.context.eventObject = event;
                                    elScope.kScope.data.context.event = "keyUp";
                                    elScope.kScope.data.context.preventDefault = false;
                                    klevu.event.fireChain(elScope.kScope, "chains.events.keyUp", elScope, elScope.kScope.data, event);
                                }
                            }
                        });
                    });
                }
            });

        });

    }
});
/**
 * Event to add trending products template and request
 */

(function (klevu) {
    klevu.extend(true, klevu.search.modules, {
        trendingProducts: {
            build: false
        }
    });
})(klevu);

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachTrendingProducts",
    fire: function () {

        var trendingProductsObject = klevu.search.modules.kmcInputs.base.getShowTrendingProductsValue();
        if (!trendingProductsObject.showTrendingProducts) {
            return;
        }

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTrendingProductBlock"), "klevuQuickTrendingProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuTrendingProducts"), "klevuTrendingProducts", true);

            box.getScope().chains.request.build.add({
                name: "addTrendingProductsList",
                fire: function (data, scope) {
                    if (!data.context.term) {
                        var trendingProductsObject = klevu.search.modules.kmcInputs.base.getShowTrendingProductsValue();
                        var parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                        var trendingProductList = klevu.extend(true, {}, parameterMap.recordQuery);
                        trendingProductList.id = "trendingProductList";
                        trendingProductList.typeOfRequest = "SEARCH";
                        trendingProductList.settings.query.term = data.context.term;
                        trendingProductList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                        trendingProductList.settings.limit = trendingProductsObject.showTrendingProductsLimit;
                        trendingProductList.settings.sort = "RELEVANCE";
                        data.request.current.recordQueries.push(trendingProductList);
                        data.context.doSearch = true;
                    }
                }
            });

            box.getScope().chains.template.process.success.add({
                name: "assignTrendingProductsLabelValues",
                fire: function (data, scope) {
                    var trendingProductsObject = klevu.search.modules.kmcInputs.base.getShowTrendingProductsValue();
                    klevu.setObjectPath(data, "template.modules.trendingProducts.title", trendingProductsObject.showTrendingProductsCaption);
                }
            });

            box.getScope().chains.template.events.add({
                name: "renderProductsSlider",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    if (target) {
                        target.classList.add("kuPersonalizedSearchRecsEnabled");
                    }
                    setTimeout(function () {
                        klevu.each(klevu.dom.find(".kuTrendingProductsCarousel", target), function (key, element) {
                            klevu.productCarousel.base.initProductsSlider(element);
                        });
                    }, 100);
                }
            });

            box.getScope().chains.template.events.add({
                name: "attachPersonalizedSearchTrackingEventTrending",
                fire: function (data, scope) {
                    klevu.analyticsUtil.base.registerPersonalizedSearchTrackingClickEvent(
                        scope.kScope,
                        ".klevuQuickSearchTrendingResults",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.personalizedSearchTracking
                    );
                }
            });

        });

        klevu.setObjectPath(klevu.search.modules, "trendingProducts.build", true);
    }
});
/**
 * Module for Recent viewed products
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "attachRecentViewedProducts",
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

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            var storage = klevu.getSetting(box.getScope().settings, "settings.storage");
            storage.recentViewedProducts.setStorage("local");

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickRecentViewedProductBlock"), "klevuQuickRecentViewedProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuRecentViewedProducts"), "klevuRecentViewedProducts", true);

            box.getScope().chains.request.build.add({
                name: "addRecentViewedProductsList",
                fire: function (data, scope) {
                    if (!data.context.term) {
                        var recentViewedProductList = klevu.search.modules.recentViewedProducts.base.getRecentViewedProductListPayload(scope.kScope, data);
                        if (recentViewedProductList) {
                            data.request.current.recordQueries.push(recentViewedProductList);
                        }
                        data.context.doSearch = true;
                    }
                }
            });

            box.getScope().chains.template.process.success.add({
                name: "assignRecentlyViewedProductsLabelValues",
                fire: function (data, scope) {
                    var recentlyViewedItemsObject = klevu.search.modules.kmcInputs.base.getShowRecentlyViewedItemsValue();
                    klevu.setObjectPath(data, "template.modules.recentlyViewedProducts.title", recentlyViewedItemsObject.showRecentlyViewedItemsCaption);
                }
            });

            box.getScope().chains.template.events.add({
                name: "attachRecentViewProductClick",
                fire: function (data, scope) {
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    if (target) {
                        klevu.each(klevu.dom.find(".kuTrackRecentView", target), function (key, element) {
                            klevu.event.attach(element, "click", function (event) {
                                var productId = element.dataset.id;
                                if (productId) {
                                    klevu.search.modules.recentViewedProducts.base.addProductId(scope.kScope, productId);
                                }
                            });
                        });
                        target.classList.add("kuPersonalizedSearchRecsEnabled");
                    }
                    setTimeout(function () {
                        klevu.each(klevu.dom.find(".kuRecentlyViewedProductsCarousel", target), function (key, element) {
                            klevu.productCarousel.base.initProductsSlider(element);
                        });
                    }, 100);
                }
            });

            box.getScope().chains.template.events.add({
                name: "attachPersonalizedSearchTrackingEventRecentSearch",
                fire: function (data, scope) {
                    klevu.analyticsUtil.base.registerPersonalizedSearchTrackingClickEvent(
                        scope.kScope,
                        ".klevuQuickSearchRecentResults",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.personalizedSearchTracking
                    );
                }
            });

        });
    }
});
/**
 * Module for fetch data for terms redirecting
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addTermRedirection",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            /**
             * Event to append URL Redirect Maps to current redirect object
             */
            box.getScope().chains.template.process.success.add({
                name: "addRedirectURLs",
                fire: function (data, scope) {
                    if (typeof klevu_keywordUrlMap !== "undefined" && !klevu.isEmptyObject(klevu_keywordUrlMap)) {
                        var redirectsFromSettings = klevu.getSetting(scope.kScope.settings, "settings.search.redirects");
                        redirectsFromSettings = !klevu.isUndefined(redirectsFromSettings) ? redirectsFromSettings : {};
                        var redirects = klevu.extend(true, {}, redirectsFromSettings);
                        klevu.each(klevu_keywordUrlMap, function (i, ele) {
                            if (!klevu.isEmptyObject(ele.keywords)) {
                                klevu.each(ele.keywords, function (i, a) {
                                    redirects[a] = ele.url;
                                });
                            }
                        });
                        klevu.setSetting(scope.kScope.settings, "settings.search.redirects", redirects);
                    }
                }
            });
        });
    }
});
/**
 * Module for No Results Found
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addNoResultsFoundEvents",
    fire: function () {

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuTemplateNoResultFoundQuick"), "noResultsFoundQuick", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultsFoundBanners"), "quickNoResultsFoundBanners", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuQuickNoResultsPopularSearches"), "quickNoResultsPopularSearches", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultsPopularProducts"), "quickNoResultsPopularProducts", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultsPopularProductBlock"), "quickNoResultsPopularProductBlock", true);

            box.getScope().chains.request.build.add({
                name: "addPopularProductsRequest",
                fire: function (data, scope) {
                    klevu.search.modules.noResultsFound.base.buildPopularProductsReq(data, scope, 4);
                },
            });

            /**
             * Event to add no results found object into the data template object
             */
            box.getScope().chains.template.process.success.add({
                name: "addNoResultsFoundData",
                fire: function (data, scope) {
                    data.template.noResultsFoundMsg = klevu.search.modules.noResultsFound.base.getMessage(data.context.term);
                    data.template.quickNoResultsFoundBanners = klevu.search.modules.noResultsFound.base.getQuickSearchBanners(data.context.term);
                    data.template.quickNoResultsPopularHeading = klevu.search.modules.noResultsFound.base.popularProductsHeading();
                    var isPopularSearchesEnabled = klevu.search.modules.noResultsFound.base.isPopularSearchesKeywordsEnabled();
                    if (isPopularSearchesEnabled) {
                        if (
                            typeof klevu_webstorePopularTerms !== "undefined" &&
                            klevu_webstorePopularTerms
                        ) {
                            data.template.noResultsFoundPopularSearches = klevu_webstorePopularTerms;
                        }
                    }
                },
            });

            /**
             * Function to add result product click analytics
             */
            box.getScope().chains.template.events.add({
                name: "registerNoResultFoundProductClickForAnalytics",
                fire: function (data, scope) {
                    klevu.analyticsUtil.base.registerAutoSuggestProductClickEvent(
                        scope.kScope,
                        ".klevuQuickSearchNoResultsPopular",
                        klevu.analyticsUtil.base.storage.dictionary,
                        klevu.analyticsUtil.base.storage.click
                    );
                }
            });

        });
    },
});
/**
 * Attach Product stock availability label
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addProductavailabilityLabel",
    fire: function () {
        /** Set Template */
        klevu.search.quick.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#quickSearchResultProductStock"), "quickProductStock", true);
    }
});
/**
 * Attach Product VAT label
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addProductVATLabel",
    fire: function () {
        var getVAT = klevu.search.modules.kmcInputs.base.getVatCaption();
        if (!getVAT || getVAT == "") {
            return;
        }
        /** Set Template */
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#searchResultProductVATLabelQuick"), "searchResultProductVATLabelQuick", true);
        });
    }
});
/**
 * Module to add delay in search requests
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "searchDelayModule",
    fire: function () {

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().element.kScope.searchDelay = {
                searchRequestTimeout: null,
                isFromTimeOut: false,
                delay: 250
            };

            box.getScope().chains.events.keyUp.addBefore("isCharacterNotAllowed", {
                name: "keyUpDelay",
                fire: function (data, scope) {
                    if (scope.kScope.searchDelay.searchRequestTimeout) {
                        clearTimeout(scope.kScope.searchDelay.searchRequestTimeout);
                    }
                    scope.kScope.searchDelay.searchRequestTimeout = setTimeout(function () {
                        clearTimeout(scope.kScope.searchDelay.searchRequestTimeout);
                        scope.kScope.searchDelay.searchRequestTimeout = null;
                        scope.kScope.searchDelay.isFromTimeOut = true;
                        var chain = klevu.getObjectPath(scope.kScope, "chains.events.keyUp");
                        if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                            chain.setScope(scope.kElem);
                            chain.setData(data);
                            chain.fire();
                        }
                    }, scope.kScope.searchDelay.delay);
                }
            });

            box.getScope().chains.events.keyUp.addAfter("keyUpDelay", {
                name: "validateKeyUpDelay",
                fire: function (data, scope) {
                    if (!scope.kScope.searchDelay.isFromTimeOut) {
                        return false;
                    }
                    scope.kScope.searchDelay.isFromTimeOut = false;
                    clearTimeout(scope.kScope.searchDelay.searchRequestTimeout);
                    scope.kScope.searchDelay.searchRequestTimeout = null;
                }
            });
        });
    }
});
/**
 * Module for document click events
 */
klevu.coreEvent.build({
    name: "setRemoteConfigDocumentClick",
    fire: function () {
        if (
            klevu.isUndefined(klevu.settings.chains.documentClick) ||
            klevu.isUndefined(klevu.search.extraSearchBox)
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.attach("setRemoteConfigDocumentClick", {
    name: "addEventsToDocumentClick",
    fire: function () {
        klevu.settings.chains.documentClick.add({
            name: "hideOverlay",
            fire: function (data, scope) {
                var parent = klevu.dom.helpers.getClosest(data.event.target, ".kuPreventDocumentClick");
                if (parent) {
                    return;
                }
                klevu.each(klevu.search.extraSearchBox, function (key, box) {
                    var fullPage = klevu.getSetting(box.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
                    if (!fullPage) {
                        var target = klevu.getSetting(box.getScope().settings, "settings.search.searchBoxTarget");
                        target.style = "display: none !important;";
                    }
                });
            }
        });
    }
});