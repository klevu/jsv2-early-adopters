/**
 *  JS file for Collecting and Mapping data for Product Quick View  
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

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
        var addToCartButton = document.querySelector(".kuModalProductCart");
        var selected_product = null;

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
        function addValueToSelectorClass(selector, text) {
            var element = document.getElementsByClassName(selector);
            if (element && element[0]) {
                element[0].innerHTML = (text !== undefined) ? text : "";
            }
        }

        /*
         *	Function to set attribute to selector
         */
        function addAtributeToSelectorClass(selector, attributeName, attributeValue) {
            var element = document.getElementsByClassName(selector);
            if (element && element[0]) {
                element[0].setAttribute(attributeName, (attributeValue !== undefined) ? attributeValue : "");
            }
        }

        /*
         *	Function to append product details in UI
         */
        function appendProductDetails(i_selectedProduct) {
            addValueToSelectorClass("kuModalProductName", i_selectedProduct.name);

            var shortDesc = i_selectedProduct.shortDesc;
            if (shortDesc) {
                shortDesc += "...";
            }
            addValueToSelectorClass("kuModalProductShortDesc", shortDesc);

            var productStatus = "In Stock";
            var status = i_selectedProduct.inStock;
            if (status != "yes") {
                productStatus = "Out of Stock"
            }

            addValueToSelectorClass("kuModalProductInStock", productStatus);
            addValueToSelectorClass("kuModalProductPrice", i_selectedProduct.salePrice);
            addValueToSelectorClass("kuModalProductPriceCurrency", i_selectedProduct.currency);
            addValueToSelectorClass("kuModalProductSize", i_selectedProduct.size);
            addValueToSelectorClass("kuModalProductSKU", i_selectedProduct.sku);
            addValueToSelectorClass("kuModalProductSwatchesInfo", i_selectedProduct.swatchesInfo);
            addValueToSelectorClass("kuModalProductTag", i_selectedProduct.tags);
            addValueToSelectorClass("kuModalProductType", i_selectedProduct.type);

            addAtributeToSelectorClass("kuModalProductImage", "src", i_selectedProduct.image);
            addAtributeToSelectorClass("kuModalProductImage", "alt", i_selectedProduct.name);

            addAtributeToSelectorClass("kuModalProductURL", "href", i_selectedProduct.url);
            addAtributeToSelectorClass("kuModalProductCart", "href", i_selectedProduct.url);
        }

        /**
         * Function to reset quick view data
         */
        function resetContainer() {
            addAtributeToSelectorClass("kuModalProductImage", "src", "");
            addAtributeToSelectorClass("kuModalProductImage", "alt", "");
            addAtributeToSelectorClass("kuModalProductURL", "href", "");
            addAtributeToSelectorClass("kuModalProductCart", "href", "");
        }

        /*
         *	Function to toggle modal UI
         */
        function toggleModal(i_selectedProduct) {
            toggleBodyScroll();
            modal.classList.toggle("show-modal");
            if (i_selectedProduct) {
                appendProductDetails(i_selectedProduct);
            } else {
                resetContainer();
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

        /**
         * Function to get updated cart count value from the response
         * @param {*} res 
         */
        function getTotalCardCountFromResponse(res) {
            var updatedCount = 0;;
            var hiddenElement = document.createElement("div");
            hiddenElement.style.display = "none";
            hiddenElement.innerHTML = res;
            var cartCount = hiddenElement.querySelectorAll('[data-cart-count]');
            if (cartCount.length) {
                updatedCount = cartCount[0].innerHTML;
            }
            hiddenElement = "";
            delete hiddenElement;
            return updatedCount;
        }

        /**
         * Function to add updated cart count value
         * @param {*} updatedCartCount 
         */
        function appendUpdatedCartCount(updatedCartCount) {
            if (parseInt(updatedCartCount)) {
                var cartContainer = document.querySelectorAll('[data-cart-count-bubble]');
                if (cartContainer.length) {
                    cartContainer[0].classList.remove('hide');
                }
                var cartCount = document.querySelectorAll('[data-cart-count]');
                if (cartCount.length) {
                    cartCount[0].innerHTML = updatedCartCount;
                }
            }
        }

        /**
         * Send Add to cart request
         * @param {*} product 
         */
        function sendAddToCartRequest(product) {
            var xhttp;
            if (window.XMLHttpRequest) {
                // code for modern browsers
                xhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    appendUpdatedCartCount(getTotalCardCountFromResponse(this.responseText));
                }
            };
            xhttp.open("POST", "/cart/add", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("id=" + product.id + "&quantity=1");
            toggleModal(null);
        }

        /**
         * Function to handle add to cart button event
         * @param {*} event 
         */
        function addToCartBtnEvent(event) {
            event = event || window.event;
            event.preventDefault();
            if (selected_product) {
                sendAddToCartRequest(selected_product);
            }
        }

        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
        addToCartButton.addEventListener("click", addToCartBtnEvent);

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
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
                        toggleModal(selected_product);
                    });
                });
            }
        });

    }
});