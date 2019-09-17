<!--
    Color swatch for Product Quick view. 
-->

<script type="template/klevu" id="quickViewProductColorSwatches">
    <% var swatchesInfoList = dataLocal.swatchesInfo; var quickViewSwatchIndex = 1; %>
    <% if(swatchesInfoList.length){ %>
        <div class="productQuick-colorInStock">
            <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>								
            <div class="kuSwatches">
                <% helper.each(swatchesInfoList,function(key,item){ if(quickViewSwatchIndex > 3){ return true;} %>
                    <div class="kuSwatchItem"><a href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
                <% quickViewSwatchIndex++; });%>
                <% if(swatchesInfoList.length > 3){ %>
                    <div class="kuSwatchItem kuSwatchMore">
                        <a href="<%=dataLocal.url%>" class="kuSwatchLink">
                            <span class="kuSwatchMoreText">
                                +<%=(swatchesInfoList.length-3)%>
                            </span>
                        </a>
                    </div>
                <% } %>
            </div>								
        </div>
    <% } %>
</script>




<!--
	Search result product grid quick view modal template file
-->
<script type="template/klevu" id="klevuLandingTemplateQuickView">
	<div class="kuModal">
		<div class="kuModal-content">
			<div class="productQuickViewWrapper">
				<div class="productQuick-Close">
					<span class="close-button">×</span>
				</div>
				<div class="productQuick-imgBlock">
					<div class="imgWrap">
						<img src="<%= data.selected_product.image %>" alt="<%=helper.translate(data.selected_product.name)%>" title="
							<%=helper.translate(data.selected_product.name)%>" />
						</div>
					</div>
					<div class="productQuick-contentBlock">
						<div class="productQuick-title kuModalProductName"><%=helper.translate(data.selected_product.name)%>
						</div>
						<div class="productQuick-sku">
							<span class="productQuick-label"><%=helper.translate("SKU:") %>                            
                            </span>
							<span><%=data.selected_product.sku%>
							</span>
						</div>
						<div class="productQuick-divider"></div>
						<div class="productQuick-Price">
							<div class="productQuick-salePrice">
								<span><%=helper.processCurrency(data.selected_product.currency,parseFloat(data.selected_product.salePrice))%>
								</span>
							</div>
						</div>
						<div class="productQuick-shortDesc"><% var shortDesc = (data.selected_product.shortDesc) ? data.selected_product.shortDesc + "..." : ""%>
							<span><%=shortDesc%>
							</span>
						</div>
						<div class="productQuick-extraInfo">
							<div class="productQuick-stockStatus">
								<span class="productQuick-label"><%=helper.translate("Stock Status:") %></span>
								<span><% var productStock = (data.selected_product.inStock == "yes") ? helper.translate("In Stock") : helper.translate("Out Of Stock") %><%=productStock%>
								</span>
							</div>
                            
                            
                            <%=helper.render('quickViewProductSwatch',scope,data,data.selected_product) %>
                            
                            
							<div class="productQuick-sizeInStock">
								<span class="productQuick-label"><%=helper.translate("Size Variants:") %></span>
								<span><%=helper.translate(data.selected_product.size)%>
								</span>
							</div>
							<div class="productQuick-tags">
								<span class="productQuick-label"><%=helper.translate("Tags:") %></span>
								<span><%=helper.translate(data.selected_product.tags)%>
								</span>
							</div>
						</div>
						<div class="productQuick-addToCart">
							<a href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary-outline kuModalProductURL"><%=helper.translate("View details") %>
							</a>
							<a href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary kuModalProductCart"><%=helper.translate("Add to cart") %></a>
						</div>
					</div>
					<div class="kuClearfix"></div>
				</div>
			</div>
		</div>
	</script>

<!--
    Color swatch template for landing page products
-->

<script type="template/klevu" id="landingPageProductColorSwatches">
    <% if(dataLocal.swatchesInfo.length){ %>
        <div class="kuSwatches">
           <% var swatchIndex = 1; helper.each(dataLocal.swatchesInfo,function(key,item){ if(swatchIndex > 3){ return true; } %>
               <div class="kuSwatchItem"><a href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuLandingSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
           <% swatchIndex++; });%>
           <% if(dataLocal.swatchesInfo.length > 3){ %>
               <div class="kuSwatchItem kuSwatchMore">
                   <a href="<%=dataLocal.url%>" class="kuSwatchLink">
                       <span class="kuSwatchMoreText">
                           +<%=(dataLocal.swatchesInfo.length-3)%>
                       </span>
                   </a>
               </div>
           <% } %>
       </div>	
   <% } %>
</script>

<!--
    Search result Product stock availability label template file
-->

<script type="template/klevu" id="searchResultProductStock">
    <% var productStockStatus = (dataLocal.inStock == "yes") ? "In stock" : "Out of stock" %>
    <div class="<%=(dataLocal.inStock == 'yes') ? 'kuCaptionStockIn' : 'kuCaptionStockOut'%>">
    	<%= productStockStatus %>
    </div>
</script>

<!--
    Search result Product VAT label template file
-->

<script type="template/klevu" id="searchResultProductVATLabel">
	<% if(dataLocal.inclusiveVAT == true){ %>
    	<div class="kuCaptionVat">Incl. VAT</div>
    <% } %>
</script>

<!--
    Custom pagination bar template
-->

<script type="template/klevu" id="customLandingPagePaginationBar">
    <% if(data.query[dataLocal].result.length > 0 ) { %>
        <% var productListLimit = data.query[dataLocal].meta.noOfResults; %>
        <div class="kuPaginationBar">
            <% if(data.query[dataLocal].meta.offset > 0) { %>
                <a href="#" class="kuPaginate kuFirst" data-offset="0"><%=helper.translate("First")%></a>
                <a href="#" class="kuPaginate kuPrevious" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>"><%=helper.translate("Previous")%></a>
            <% } %>			 
            
            <% if(data.query[dataLocal].meta.offset > 0) { %>
                <a href="#" class="kuPaginate kuStart" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit))%></a>
            <% } %>

            <a href="javascript:void(0);" class="kuActive"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+1)%></a>
			             
            <% if(data.query[dataLocal].meta.totalResultsFound >= data.query[dataLocal].meta.offset+productListLimit) { %>
                <a href="#" class="kuPaginate kuEnd" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+2)%></a>
            <% } %>

            <% if(data.query[dataLocal].meta.totalResultsFound >= data.query[dataLocal].meta.offset+productListLimit) { %>
                <a href="#" class="kuPaginate kuNext" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>"><%=helper.translate("Next")%></a>
                <a href="#" class="kuPaginate kuLast" data-offset="<%=(Math.floor(data.query[dataLocal].meta.totalResultsFound/productListLimit)*productListLimit)%>"><%=helper.translate("Last")%></a>
            <% } %>
        </div>
    <% } %>
</script>


<!-- 
    Landing page add to cart button template
-->

<script type="template/klevu" id="landingPageProductAddToCart">
    <div class="kuAddtocart" data-id="<%=dataLocal.id%>">
        <div class="kuCartBtn">
            <a href="javascript:void(0)" class="kuAddtocartBtn kuLandingAddToCartBtn"><%=helper.translate("Add to cart") %></a>
        </div>
    </div>
</script>



<!--
    Search result Product badge template file
-->

<script type="template/klevu" id="searchResultProductBadge">
    <%if(dataLocal.badgeLabel && dataLocal.badgeLabel != "") { %>
        <div class="kuDiscountBadge"><span class="kuDiscountTxt"><%=dataLocal.badgeLabel%></span></div>
    <% } %>
</script>

