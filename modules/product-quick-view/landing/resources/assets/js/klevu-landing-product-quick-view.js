/**
 * Extend addToCart base module for Quick view
 */

klevu.extend({
    addToCartQuickView: function (mainScope) {

        if (!mainScope.addToCart) {
            console.log("Add to cart base module is missing!");
            return;
        }

        mainScope.addToCart.quickView = {

            /*
             *	Function to toggle Body scroll style
             */
            toggleBodyScroll: function () {
                var body = klevu.dom.find("body")[0];
                var isScroll = '';
                if (!body.style.overflow) {
                    isScroll = "hidden";
                }
                body.style.overflow = isScroll;
            },

            /*
             *	Function to toggle modal UI
             */
            toggleModal: function () {
                this.toggleBodyScroll();
                var modalElement = klevu.dom.find("div.kuModal");
                if (modalElement.length) {
                    modalElement[0].classList.toggle("show-modal");
                }
            },

            /**
             * Function to attach add to cart button event
             * @param {*} event 
             */
            attachKlevuQuickViewAddToCartBtnEvent: function (event) {
                event = event || window.event;
                event.preventDefault();
                var selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    selected_product = target[0].selected_product;
                }
                if (selected_product) {
                    mainScope.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
                }
                this.toggleModal();
            },

            /**
             * Function to bind add to cart button event
             */
            bindAddToCartEvent: function () {
                var self = this;
                var addToCartElement = klevu.dom.find(".kuModalProductCart", ".productQuickView");
                if (addToCartElement.length) {
                    klevu.event.attach(addToCartElement[0], "click", function (event) {
                        self.attachKlevuQuickViewAddToCartBtnEvent(event);
                    });
                }
            }
        };
    }
});

/**
 * Quick view service file
 */
klevu.extend({
    quickViewService: function (mainScope) {
        mainScope.quickViewService = {
            modal: null,
            closeButton: null,
            selected_product: null,
            /*
             *	Add container for Product Quick view
             */
            appendTemplateIntoBody: function () {
                var quickViewCont = document.createElement("div");
                quickViewCont.className = "quickViewWrap productQuickView";
                window.document.body.appendChild(quickViewCont);
            },
            /*
             *	Function to toggle Body scroll style
             */
            toggleBodyScroll: function () {
                var body = klevu.dom.find("body")[0];
                var isScroll = '';
                if (!body.style.overflow) {
                    isScroll = "hidden";
                }
                body.style.overflow = isScroll;
            },
            /*
             *	Function to toggle modal UI
             */
            toggleModal: function () {
                this.toggleBodyScroll();
                var modalElement = klevu.dom.find("div.kuModal", '.productQuickView');
                if (modalElement.length) {
                    this.modal = modalElement[0];
                    this.modal.classList.toggle("show-modal");
                }
            },
            /*
             *	Function to fire on window click event to hide modal
             */
            windowOnClick: function (event) {
                if (event.target === this.modal) {
                    this.toggleModal();
                }
            },
            /**
             * Function to bind event on close button
             */
            bindCloseBtnClick: function () {
                var self = this;
                var closeElement = klevu.dom.find(".close-button", '.productQuickView');
                if (closeElement.length) {
                    self.closeButton = closeElement[0];
                    klevu.event.attach(self.closeButton, "click", function () {
                        self.toggleModal();
                    });
                }
            },
            /**
             * Landing page onload event
             * @param {*} data 
             * @param {*} scope 
             */
            landingPageTemplateOnLoadEvent: function (data) {
                var self = this;
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        event = event || window.event;
                        event.preventDefault();
                        var selected_product_id = (this.getAttribute("data-id")) ? this.getAttribute("data-id") : null;
                        var items = klevu.getObjectPath(data.template.query, 'productList');
                        if (items.result) {
                            klevu.each(items.result, function (key, value) {
                                if (value.id == selected_product_id) {
                                    selected_product = value;
                                }
                            })
                        }
                        data.template.selected_product = selected_product;
                        var target = klevu.dom.find(".productQuickView");
                        if (target && target[0]) {
                            target[0].selected_product = selected_product;
                        }
                        klevu.event.fireChain(mainScope, "chains.quickView", mainScope.element, mainScope.data, event);
                        self.toggleModal();
                    });
                });
            }
        };
    }
});

/**
 * Add Product Quick view functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Include addToCart base module first to use base functionalities */
        klevu.addToCart(klevu.search.landing.getScope().element.kScope);

        /** Initalize add to cart service */
        klevu.addToCartQuickView(klevu.search.landing.getScope().element.kScope);

        /** Initialize Quick view service */
        klevu.quickViewService(klevu.search.landing.getScope().element.kScope);



        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Add Quick view wrapper container in body */
        klevu.search.landing.getScope().quickViewService.appendTemplateIntoBody();


        /*
         *	Add Quick view template and update data into that
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "chainQuickView",
            fire: function (data, scope) {
                event = event || window.event;
                event.preventDefault();
                scope.kScope.template.setData(data.template);
                var target = klevu.dom.find("div.quickViewWrap")[0];
                target.innerHTML = '';
                var element = scope.kScope.template.convertTemplate(scope.kScope.template.render("quick-view"));
                scope.kScope.template.insertTemplate(target, element);

                klevu.search.landing.getScope().quickViewService.bindCloseBtnClick();
                klevu.search.landing.getScope().addToCart.quickView.bindAddToCartEvent();
            }
        });

        /**
         *  Bind body click event
         */
        klevu.event.attach(window, "click", function (event) {
            klevu.search.landing.getScope().quickViewService.windowOnClick(event);
        });

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
                klevu.search.landing.getScope().quickViewService.landingPageTemplateOnLoadEvent(data);
            }
        });
    }
});

/**
 * Product Quick View page extension for Analytics utility
 */
klevu.extend({
    analyticsUtilsQuickView: function (mainScope) {
        if (!mainScope.analyticsUtils) {
            klevu.analyticsUtils(mainScope);
        }
        mainScope.analyticsUtils.quickView = {
            bindQuickViewBtnClickAnalytics: function (dataListId, callSrc) {
                var target = klevu.getSetting(mainScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var parent = klevu.dom.helpers.getClosest(value, ".klevuProduct");
                        if (parent === null) {
                            return;
                        }
                        var productId = parent.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope, dataListId);
                            var productOptions = {
                                term: mainScope.data.context.term,
                                productId: product.id,
                                productName: product.name,
                                productUrl: product.url,
                                src: callSrc
                            };
                            klevu.analyticsEvents.click(productOptions);
                        }
                    });
                });
            },
            bindProductDetailsButtonClick: function (dataListId, callSrc) {
                var target = klevu.dom.find(".kuModal")[0];
                klevu.each(klevu.dom.find(".kuModalProductURL", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var productId = target.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope, dataListId);
                            var productOptions = {
                                term: mainScope.data.context.term,
                                productId: product.id,
                                productName: product.name,
                                productUrl: product.url,
                                src: product.typeOfRecord + ":" + callSrc
                            };
                            klevu.analyticsEvents.click(productOptions);
                        }
                    });
                });
            },
            bindAddToCartButtonClick: function (dataListId, callSrc) {
                var target = klevu.dom.find(".kuModal")[0];
                klevu.each(klevu.dom.find(".kuModalProductCart", target), function (key, value) {
                    klevu.event.attach(value, "click", function (event) {
                        var productId = target.dataset.id;
                        if (productId) {
                            var product = mainScope.analyticsUtils.base.getProductDetailsFromId(productId, mainScope, dataListId);
                            var productOptions = {
                                term: mainScope.data.context.term,
                                productId: product.id,
                                productName: product.name,
                                productUrl: product.url,
                                src: "shortlist:add-to-cart:" + callSrc
                            };
                            klevu.analyticsEvents.click(productOptions);
                        }
                    });
                });
            }
        };
    }
});

/**
 *  Product Quick view attach analytics 
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewAnalytics",
    fire: function () {

        /** Initialize analytics for Product Quick View */
        klevu.analyticsUtilsQuickView(klevu.search.landing.getScope().element.kScope);

        /**
         * Attach events for quick view button
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnProductQuickView",
            fire: function (data, scope) {
                klevu.search.landing.getScope().analyticsUtils.quickView.bindQuickViewBtnClickAnalytics("productList", "quick-view:landing");
            }
        });

        klevu.search.landing.getScope().chains.quickView.add({
            name: "bindAnalyticsOnProductQuickViewEvents",
            fire: function (data, scope) {
                klevu.search.landing.getScope().analyticsUtils.quickView.bindProductDetailsButtonClick("productList", "quick-view");
                klevu.search.landing.getScope().analyticsUtils.quickView.bindAddToCartButtonClick("productList", "quick-view");
            }
        });

    }
});