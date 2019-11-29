/**
 * Extend addToCart base module for Quick view
 */

klevu.coreEvent.attach("addToCartModuleBuild", {
    name: "extendModuleForQuickView",
    fire: function () {

        /*
         *	Function to toggle Body scroll style
         */
        function toggleBodyScroll() {
            var body = klevu.dom.find("body")[0];
            var isScroll = '';
            if (!body.style.overflow) {
                isScroll = "hidden";
            }
            body.style.overflow = isScroll;
        };

        /*
         *	Function to toggle modal UI
         */
        function toggleModal() {
            this.toggleBodyScroll();
            var modalElement = klevu.dom.find("div.kuModal");
            if (modalElement.length) {
                modalElement[0].classList.toggle("show-modal");
            }
        };

        /**
         * Function to attach add to cart button event
         * @param {*} event 
         */
        function attachKlevuQuickViewAddToCartBtnEvent(event) {
            event = event || window.event;
            event.preventDefault();

            var selected_product;
            var target = klevu.dom.find(".productQuickView");
            if (target && target[0]) {
                selected_product = target[0].selected_product;
            }
            if (selected_product) {
                klevu.search.modules.addToCart.base.sendAddToCartRequest(selected_product.id, 1);
            }
            this.toggleModal();
        };

        /**
         * Function to bind add to cart button event
         */
        function bindAddToCartEvent() {
            var self = this;
            var addToCartElement = klevu.dom.find(".kuModalProductCart", ".productQuickView");
            if (addToCartElement.length) {
                klevu.event.attach(addToCartElement[0], "click", function (event) {
                    self.attachKlevuQuickViewAddToCartBtnEvent(event);
                });
            }
        };

        klevu.extend(true, klevu.search.modules.addToCart.base, {
            bindAddToCartEvent: bindAddToCartEvent,
            attachKlevuQuickViewAddToCartBtnEvent: attachKlevuQuickViewAddToCartBtnEvent,
            toggleModal: toggleModal,
            toggleBodyScroll: toggleBodyScroll
        });
    }
});

(function (klevu) {

    /*
     *	Add container for Product Quick view
     */
    function appendTemplateIntoBody() {
        var quickViewCont = document.createElement("div");
        quickViewCont.className = "quickViewWrap productQuickView";
        window.document.body.appendChild(quickViewCont);
    };
    /*
     *	Function to toggle Body scroll style
     */
    function toggleBodyScroll() {
        var body = klevu.dom.find("body")[0];
        var isScroll = '';
        if (!body.style.overflow) {
            isScroll = "hidden";
        }
        body.style.overflow = isScroll;
    };
    /*
     *	Function to toggle modal UI
     */
    function toggleModal() {
        this.toggleBodyScroll();
        var modalElement = klevu.dom.find("div.kuModal", '.productQuickView');
        if (modalElement.length) {
            this.modal = modalElement[0];
            this.modal.classList.toggle("show-modal");
        }
    };

    /*
     *	Function to fire on window click event to hide modal
     */
    function windowOnClick(event) {
        if (event.target === this.modal) {
            this.toggleModal();
        }
    };
    /**
     * Function to bind event on close button
     */
    function bindCloseBtnClick() {
        var self = this;
        var closeElement = klevu.dom.find(".close-button", '.productQuickView');
        if (closeElement.length) {
            self.closeButton = closeElement[0];
            klevu.event.attach(self.closeButton, "click", function () {
                self.toggleModal();
            });
        }
    };
    /**
     * Landing page onload event
     * @param {*} scope 
     */
    function landingPageTemplateOnLoadEvent(scope) {
        var self = this;
        var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
        klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
            klevu.event.attach(value, "click", function (event) {
                event = event || window.event;
                event.preventDefault();
                var selected_product_id = (this.getAttribute("data-id")) ? this.getAttribute("data-id") : null;
                var items = klevu.getObjectPath(scope.data.template.query, 'productList');
                if (items.result) {
                    klevu.each(items.result, function (key, value) {
                        if (value.id == selected_product_id) {
                            selected_product = value;
                        }
                    })
                }
                scope.data.template.selected_product = selected_product;
                var target = klevu.dom.find(".productQuickView");
                if (target && target[0]) {
                    target[0].selected_product = selected_product;
                }
                klevu.event.fireChain(scope, "chains.quickView", scope.element, scope.data, event);
                self.toggleModal();
            });
        });
    }

    var quickViewService = {
        modal: null,
        closeButton: null,
        selected_product: null,
        landingPageTemplateOnLoadEvent: landingPageTemplateOnLoadEvent,
        bindCloseBtnClick: bindCloseBtnClick,
        windowOnClick: windowOnClick,
        toggleModal: toggleModal,
        toggleBodyScroll: toggleBodyScroll,
        appendTemplateIntoBody: appendTemplateIntoBody
    };

    klevu.extend(true, klevu.search.modules, {
        quickViewService: {
            base: quickViewService,
            build: true
        }
    });
})(klevu);

/**
 * quickViewService module build event
 */
klevu.coreEvent.build({
    name: "quickViewServiceModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.quickViewService ||
            !klevu.search.modules.quickViewService.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

/**
 * Add Product Quick view functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Add Quick view wrapper container in body */
        klevu.search.modules.quickViewService.base.appendTemplateIntoBody();

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

                klevu.search.modules.quickViewService.base.bindCloseBtnClick();
                klevu.search.modules.addToCart.base.bindAddToCartEvent();
            }
        });

        /**
         *  Bind body click event
         */
        klevu.event.attach(window, "click", function (event) {
            klevu.search.modules.quickViewService.base.windowOnClick(event);
        });

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
                klevu.search.modules.quickViewService.base.landingPageTemplateOnLoadEvent(scope.kScope);
            }
        });
    }
});

/**
 * Klevu AnalyticsUtil base extension for Product Quick view
 */

klevu.coreEvent.attach("analyticsPowerUp", {
    name: "extProductQuickViewAnalyticsUtil",
    fire: function () {
        /**
         * Function to register event on product click quick view button click event
         * @param {*} scope 
         * @param {*} srcTerm 
         */
        function registerLandingProductQuickViewClickEvent(scope, srcTerm) {
            var target = klevu.getSetting(scope.settings, "settings.search.searchBoxTarget");
            klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function (key, value) {
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
                                termOptions.klevu_src = "[[" + srcTerm + "]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsEvents.click(termOptions);
                            }
                        }
                    }
                });
            });
        }

        /**
         * Function to register click event in quick view
         * @param {*} scope 
         * @param {*} srcTerm 
         * @param {*} className 
         * @param {*} dictionary 
         * @param {*} element 
         */
        function registerQuickViewButtonClickEvent(scope, srcTerm, className, dictionary, element) {
            var target = klevu.dom.find(".kuModal")[0];
            klevu.each(klevu.dom.find(className, target), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    var productId = target.dataset.id;
                    if (productId) {
                        var product = klevu.analyticsUtil.base.getProductDetailsFromId(productId, scope);
                        if (product) {
                            var termOptions = klevu.analyticsUtil.base.getTermOptions(scope);
                            if (termOptions) {
                                termOptions.klevu_keywords = termOptions.klevu_term;
                                termOptions.klevu_productId = product.id;
                                termOptions.klevu_productName = product.name;
                                termOptions.klevu_productUrl = product.url;
                                termOptions.klevu_src = "[[typeOfRecord:" + product.typeOfRecord + ";;" + srcTerm + "]]";
                                delete termOptions.klevu_term;
                                klevu.analyticsUtil.base.storeAnalyticsEvent(dictionary, element, termOptions);
                            }
                        }
                    }
                });
            });
        }

        klevu.extend(true, klevu.analyticsUtil.base, {
            registerLandingProductQuickViewClickEvent: registerLandingProductQuickViewClickEvent,
            registerQuickViewButtonClickEvent: registerQuickViewButtonClickEvent
        });
    }
});


/**
 *  Product Quick view attach analytics 
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "attachProductQuickViewAnalytics",
    fire: function () {

        /**
         * Attach events for quick view button
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "bindAnalyticsOnProductQuickView",
            fire: function (data, scope) {
                klevu.analyticsUtil.base.registerLandingProductQuickViewClickEvent(
                    scope.kScope,
                    "source:quick-view;;template:landing"
                );
            }
        });

        klevu.search.landing.getScope().chains.quickView.add({
            name: "bindAnalyticsOnProductQuickViewEvents",
            fire: function (data, scope) {

                klevu.analyticsUtil.base.registerQuickViewButtonClickEvent(
                    scope.kScope,
                    "source:quick-view",
                    ".kuModalProductURL",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );

                klevu.analyticsUtil.base.registerQuickViewButtonClickEvent(
                    scope.kScope,
                    "source:quick-view;;shortlist:add-to-cart",
                    ".kuModalProductCart",
                    klevu.analyticsUtil.base.storage.dictionary,
                    klevu.analyticsUtil.base.storage.click
                );
            }
        });

    }
});