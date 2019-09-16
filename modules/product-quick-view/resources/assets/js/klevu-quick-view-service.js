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
                        var target = klevu.dom.find(".productQuickView");
                        if (target && target[0]) {
                            target[0].selected_product = selected_product;
                        }
                        klevu.event.fireChain(scope.kScope, "chains.quickView", scope, scope.kScope.data, event);
                        self.toggleModal();
                    });
                });
            }
        };
    }
});