<script type="template/klevu" id="klevuHandPickedProductsTemplate">
    <div class="kuProductRecommendationSlider kuRecommendationHandPicked" data-section="handPickedProductList">

        <div class="klevuRecs">
            <h3>Hand-picked Products</h3>
        </div>

        <% var handPickedProductList = klevu.getObjectPath(data,"query.handPickedProductList.result");%>
        <% if(handPickedProductList && handPickedProductList.length) { %>
    
        <div class="klevuRecsWrap">
            <div class="klevuRecs">
                <div class="klevuRecsControl klevuRecsControl-left">
                    <button id="klevuRecsControl-left" class="klevuRecsControl-btn klevuRecsControl-left"
                        style="display: none;">
                        <svg viewBox="0 0 256 256">
                            <polyline fill="none" stroke="black" stroke-width="16" points="184,16 72,128 184,240">
                            </polyline>
                        </svg>
                    </button>
                </div>
                <div class="klevuRecsResults">
                    <div class="klevuRecsResultsInner" style="left: 0px;">

                        <% helper.each(handPickedProductList, function(key, product){ %>
                            <div class="klevuRecs-itemWrap klevuRecommendedProduct" data-id="<%= product.id %>">
                                <div class="klevuRecs-item">
                                    <div class="klevuRecs-itemImg">
                                        <a href="<%= product.url %>" class="klevuProductClick klevuRecsImg">
                                            <img 
                                                src="<%= product.image %>" 
                                                alt="<%= product.name %>" 
                                                class="prodImg"
                                                width="100%" />
                                        </a>
                                    </div>
                                    <div class="klevuRecs-itemDesc">
                                        <a href="<%= product.url %>" class="klevuProductClick klevuRecsTitle"><%= product.name %></a>
                                        <div class="klevuRecs-itemSku"><%= product.sku %></div>
                                        <div class="klevuRecs-itemPrice">
                                            <% if(product.ondiscount && product.ondiscount == "true") { %>
                                                <% if(product.salePrice ) { %><div class="kuSalePrice kuSpecialPrice"><%=helper.processCurrency(product.currency,parseFloat(product.salePrice) )%></div><% } %>
                                                <% if(product.price) { %><div class="kuOrigPrice"><%=helper.translate("Original price %s",helper.processCurrency(product.currency,parseFloat(product.price)))%></div><% } %>
                                            <% } else { %>
                                                <% if(product.salePrice ) { %><div class="kuSalePrice"><%=helper.processCurrency(product.currency,parseFloat(product.salePrice) )%></div><% } %>
                                            <% } %>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <% }) %>

                    </div>
                </div>
                <div class="klevuRecsControl klevuRecsControl-right">
                    <button id="klevuRecsControl-right" class="klevuRecsControl-btn klevuRecsControl-right"
                        style="display: block;">
                        <svg viewBox="0 0 256 256">
                            <polyline fill="none" stroke="black" stroke-width="16" points="72,16 184,128 72,240"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    
        <% } %>
    </div>
</script>