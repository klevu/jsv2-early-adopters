/**
 *  JS file for Collecting and Mapping data for Product Quick View  
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function() {

        /*
         *	Add container for Product Quick view
         */
        function appendTemplateIntoBody() {
            var quickViewCont = document.createElement("div");
            quickViewCont.className = "quickViewWrap productQuickView";
            window.document.body.appendChild(quickViewCont);

            var modalElement = document.getElementsByClassName('product-data-modal')[0].innerHTML;
            document.getElementsByClassName('product-data-modal')[0].innerHTML = "";
            var target = document.getElementsByClassName('quickViewWrap')[0];
            target.innerHTML = modalElement;
        }

        appendTemplateIntoBody();
        var modal = document.querySelector(".kuModal");
        var closeButton = document.querySelector(".close-button");

        /*
         *	Function to toggle Body scroll style
         */
        function toggleBodyScroll() {
            var body = document.getElementsByTagName('body')[0];
            var isScroll = '';
            if (!body.style.overflow) {
                isScroll = "hidden";
            }
            body.style.overflow = isScroll;
        }

        /*
         *	Add text to selector
         */
        function addValueToSelector(selector, text) {
            var element = document.querySelector(selector);
            if (element) {
                element.innerHTML = text;
            }
        }

        /*
         *	Function to set attribute to selector
         */
        function addAtributeToSelector(selector, attributeName, attributeValue) {
            var element = document.querySelector(selector);
            if (element) {
                element.setAttribute(attributeName, attributeValue);
            }
        }

        /*
         *	Function to append product details in UI
         */
        function appendProductDetails(i_selectedProduct) {
            addValueToSelector(".kuModalProductName", i_selectedProduct.name);

            var shortDesc = i_selectedProduct.shortDesc;
            if (shortDesc) {
                shortDesc += "...";
            }
            addValueToSelector(".kuModalProductShortDesc", shortDesc);

            var productStatus = "In Stock";
            var status = i_selectedProduct.inStock;
            if (status != "yes") {
                productStatus = "Out of Stock"
            }

            addValueToSelector(".kuModalProductInStock", productStatus);
            addValueToSelector(".kuModalProductPrice", i_selectedProduct.salePrice);
            addValueToSelector(".kuModalProductPriceCurrency", i_selectedProduct.currency);
            addValueToSelector(".kuModalProductSize", i_selectedProduct.size);
            addValueToSelector(".kuModalProductSKU", i_selectedProduct.sku);
            addValueToSelector(".kuModalProductSwatchesInfo", i_selectedProduct.swatchesInfo);
            addValueToSelector(".kuModalProductTag", i_selectedProduct.tags);
            addValueToSelector(".kuModalProductType", i_selectedProduct.type);

            addAtributeToSelector(".kuModalProductImage", "src", i_selectedProduct.image);
            addAtributeToSelector(".kuModalProductURL", "href", i_selectedProduct.url);
            addAtributeToSelector(".kuModalProductCart", "href", i_selectedProduct.url);
        }

        /*
         *	Function to toggle modal UI
         */
        function toggleModal(i_selectedProduct) {
            toggleBodyScroll();
            modal.classList.toggle("show-modal");
            if (i_selectedProduct) {
                appendProductDetails(i_selectedProduct);
            }
        }

        /*
         *	Function to fire on window click event to hide modal
         */
        function windowOnClick(event) {
            if (event.target === modal) {
                toggleModal(null);
            }
        }

        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function(data, scope) {
                var selected_product = null;
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                klevu.each(klevu.dom.find(".kuQuickViewBtn", target), function(key, value) {
                    klevu.event.attach(value, "click", function(event) {
                        event = event || window.event;
                        event.preventDefault();
                        var selected_product_id = (this.getAttribute("data-id")) ? this.getAttribute("data-id") : null;
                        var items = klevu.getObjectPath(data.template.query, 'productList');
                        if (items.result) {
                            klevu.each(items.result, function(key, value) {
                                if (value.id == selected_product_id) {
                                    selected_product = value;
                                }
                            })
                        }
                        toggleModal(selected_product);
                    });
                });
            }
        });

    }
});