/**
 * Quick view service file
 */
klevu.extend({
    quickViewService: function () {
        klevu.search.landing.getScope().quickViewService = {
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
                var modalElement = klevu.dom.find("div.kuModal");
                if (modalElement.length) {
                    modal = modalElement[0];
                    modal.classList.toggle("show-modal");
                }
            },
            /*
             *	Function to fire on window click event to hide modal
             */
            windowOnClick: function (event) {
                var self = this;
                if (event.target === modal) {
                    self.toggleModal();
                }
            },
            /**
             * Function to bind event on close button
             */
            bindCloseBtnClick: function () {
                var self = this;
                var closeElement = klevu.dom.find(".close-button");
                if (closeElement.length) {
                    closeButton = closeElement[0];
                    klevu.event.attach(closeButton, "click", function () {
                        self.toggleModal();
                    });
                }
            },
            /**
             * Landing page onload event
             * @param {*} data 
             * @param {*} scope 
             */
            landingPageTemplateOnLoadEvent: function (data, scope) {
                var self = this;
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
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
                        klevu.event.fireChain(scope.kScope, "chains.quickView", scope, scope.kScope.data, event);
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

        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Initialize Quick view service */
        klevu.quickViewService();

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
                klevu.search.landing.getScope().quickViewService.landingPageTemplateOnLoadEvent(data, scope);
            }
        });
    }
});