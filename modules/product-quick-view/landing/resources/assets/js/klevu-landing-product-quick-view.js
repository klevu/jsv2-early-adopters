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

klevu.interactive(function () {

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
        modal: modal,
        closeButton: closeButton,
        selected_product: selected_product,
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
});

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
        klevu.search.module.quickViewService.base.appendTemplateIntoBody();

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

                klevu.search.module.quickViewService.base.bindCloseBtnClick();
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