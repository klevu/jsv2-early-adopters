<script type="template/klevu" id="klevuLandingTemplateBase">
    <div class="kuContainer">
    	<%=helper.render('klevuLandingPromotionBanner',scope) %>
        <%=helper.render('tab-results', scope) %>
        
        <% if(!helper.hasResults(data,"productList") && !helper.hasResults(data,"contentList")) { %>
            <%=helper.render('noResultFound',scope) %>
        <% } else { %>
            <%=helper.render('results',scope) %>
        <% }%>
        <div class="kuClearBoth"></div>
    </div>
</script>

<script type="template/klevu" id="klevuLandingTemplateNoResultFound">
    <div class="kuContainer">
        <div class="kuNoRecordFound">
            <div class="kuLandingNoResults">
                <div class="kuLandingNoResultsInner">
                    <div class="kuLandingNoResultsMessage">
                        <%=helper.translate("We're Sorry, No result found for <span>'%s'</span>",data.settings.termOriginal)%>. Please try another search term...
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>


<script type="template/klevu" id="klevuLandingTemplatePagination">
    <% if(data.query[dataLocal].result.length > 0 ) { %>
        <% var productListLimit = data.query[dataLocal].meta.noOfResults; %>
        <% var productListTotal = data.query[dataLocal].meta.totalResultsFound - 1; %>
        <div class="kuPagination">
            <% if(data.query[dataLocal].meta.offset > 0) { %>
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="0">&lt;&lt;</a>&nbsp;
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>">&lt;</a>&nbsp;
            <% } %>

            <% if(data.query[dataLocal].meta.offset > 0) { %>
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit))%></a>&nbsp;
            <% } %>

            <a href="javascript:void(0);"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+1)%></a>&nbsp;

            <% if(productListTotal >= data.query[dataLocal].meta.offset+productListLimit) { %>
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+2)%></a>&nbsp;
            <% } %>

            <% if(productListTotal >= data.query[dataLocal].meta.offset+productListLimit) { %>
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>">&gt;</a>&nbsp;
                <a target="_self" href="javascript:void(0)" class="klevuPaginate" data-offset="<%=(Math.floor(productListTotal/productListLimit)*productListLimit)%>">&gt;&gt;</a>
            <% } %>
        </div>
    <% } %>
</script>

<script type="template/klevu" id="klevuLandingTemplateResults">
    <div class="kuResultsListing">
    
        <div class="productList klevuMeta" data-section="productList">
            <div class="kuResultContent">
            
            	<a target="_self" href="javascript:void(0)" class="kuBtn kuFacetsSlideIn kuMobileFilterBtn"><%=helper.translate("Filters")%></a>
                
                <%=helper.render('filters',scope,data,"productList") %>
                
                <div class="kuResultWrap <%=(data.query.productList.filters.length == 0 )?'kuBlockFullwidth':''%>">                    
                    
                    <%=helper.render('sortBy',scope,data,"productList") %>
					<%=helper.render('limit',scope,data,"productList") %>
                    <!-- <%=helper.render('pagination',scope,data,"productList") %> -->
                    
                    <%=helper.render('customLandingPagePagination',scope,data,"productList") %>
                    
                    <div class="kuClearBoth"></div>
                    <div class="kuResults kuGridView">
                        <ul>
                            <% helper.each(data.query.productList.result,function(key,item){ %>
                                <% if(item.typeOfRecord == "KLEVU_PRODUCT") { %>
                                    <%=helper.render('productBlock',scope,data,item) %>
                                <% }%>
                            <% }); %>
                        </ul>
                        <div class="kuClearBoth"></div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="contentList klevuMeta" data-section="contentList">
          <div class="kuResultContent">
          
          	<a target="_self" href="javascript:void(0)" class="kuBtn kuFacetsSlideIn kuMobileFilterBtn"><%=helper.translate("Filters")%></a>
          
              <%=helper.render('filters',scope,data,"contentList") %>
              <div class="kuResultWrap <%=(data.query.contentList.filters.length == 0 )?'kuBlockFullwidth':''%>">
                  
                  <%=helper.render('sortBy',scope,data,"contentList") %>
                  <%=helper.render('limit',scope,data,"contentList") %>
                  <!-- <%=helper.render('pagination',scope,data,"contentList") %> -->
                  
                  <%=helper.render('customLandingPagePagination',scope,data,"contentList") %>
                  
                  <div class="kuClearBoth"></div>
                  <div class="kuResults kuGridView">
                      <ul>
                          <% helper.each(data.query.contentList.result,function(key,item){ %>
                              <% if(item.typeOfRecord == "KLEVU_CMS") { %>
                                  <%=helper.render('contentBlock',scope,data,item) %>
                              <% }%>
                          <% }); %>
                      </ul>
                      <div class="kuClearBoth"></div>
                  </div>
              </div>
          </div>
      </div>
    </div>    
</script>


<script type="template/klevu" id="klevuLandingTemplateProductBlock">
    <li class="klevuProduct" data-id="<%=dataLocal.id%>">
        <div class="kuProdWrap">
        
            <%=helper.render('landingProductBadge', scope, data, dataLocal) %>
            
            <div class="kuProdTop">
                <% if(dataLocal["image"] != undefined && dataLocal.image !== "") { %>
                    <div class="klevuImgWrap">
                        <a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><span class="kuprodImgSpan"><img src="<%=dataLocal.image%>" alt="<%=dataLocal.name%>" class="kuProdImg"></span></a>
                    </div>
                <% } %>        
                               
                <div class="kuQuickView">
                	<button data-id="<%=dataLocal.id%>" class="kuQuickViewBtn">Quick view</button>
  				</div>
            </div>
            <% var desc = [dataLocal.summaryAttribute,dataLocal.packageText,dataLocal.summaryDescription].filter(function(el) { return el; }); desc = desc.join(" "); %>
            <div class="kuProdBottom">
                <div class="kuNameDesc">
                    <div class="kuName"><a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><%=dataLocal.name%></a></div>
                    <div class="kuDesc">
                    	<%=desc%>
                                                
                        <%=helper.render('landingProductSwatch',scope,data,dataLocal) %>
                        
  					</div>
                </div>
                
                <%=helper.render('landingProductStock', scope, data, dataLocal) %>
                
                <div class="kuPrice">
                    <% if(dataLocal.ondiscount && dataLocal.ondiscount == "true") { %>
                        <% if(dataLocal.salePrice ) { %><div class="kuSalePrice kuSpecialPrice"><%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice) )%></div><% } %>
                        <% if(dataLocal.price) { %><div class="kuOrigPrice"><%=helper.translate("Original price %s",helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)))%></div><% } %>
                    <% } else { %>
                        <% if(dataLocal.salePrice ) { %><div class="kuSalePrice"><%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice) )%></div><% } %>
                    <% } %>
                    <div class="kuClearBoth"></div>
                </div>
                
                <%=helper.render('landingProductVATLabel', scope, data, dataLocal) %>
                
                <%=helper.render('landingPageProductAddToCart', scope, data, dataLocal) %>
                
            </div>
            <div class="kuClearLeft"></div>                
        </div>
    </li>
</script>


<script type="template/klevu" id="klevuLandingTemplateContentBlock">
    <li class="klevuProduct" data-id="<%=dataLocal.id%>">
        <div class="kuProdWrap">
            <div class="kuProdTop">
                <% if(dataLocal["image"] != undefined && dataLocal.image !== "") { %>
                <div class="klevuImgWrap">
                    <a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><span class="kuprodImgSpan"><img src="<%=dataLocal.image%>" alt="<%=dataLocal.name%>" class="kuProdImg"></span></a> </div>
                <% } %>
                </div>
                <% var desc = [dataLocal.summaryAttribute,dataLocal.packageText,dataLocal.summaryDescription].filter(function(el) { return el; }); desc = desc.join(" "); %>
            <div class="kuProdBottom">
                <div class="kuNameDesc">
                      <div class="kuName"><a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><%=dataLocal.name%></a></div>
                      <div class="kuDesc"><%=desc%></div>
                </div>
            </div>
            <div class="kuClearLeft"></div>
        </div>
    </li>
</script>

<script type="template/klevu" id="klevuLandingTemplateTabResults">
    <div class="kuTabs">
        <% var selectedTab = false; %>
        <% helper.each(data.query,function(key,query){ %>
            <% if(query.tab == true) { %>
                <% if(helper.hasResults(data,query.id)) { %>
                    <a target="_self" class="kuTab<% if(!selectedTab){ selectedTab = true; %> kuTabSelected<% } %>" data-section="<%=query.id%>">
                        <%=helper.translate(query.tabText,data.query[query.id].meta.totalResultsFound)%>
                    </a>
                <% } else { %>
                    <a target="_self" class="kuTabDeactive" data-section="<%=query.id%>">
                        <%=helper.translate(query.tabText,0)%>
                    </a>
                <% } %>
            <% } %>
        <% }); %>
    </div>
</script>

<script type="template/klevu" id="klevuLandingTemplateSortBy">
    <div class="kuDropdown kuDropSortBy">
        <div class="kuDropdownLabel"><%=helper.translate("Sort by : ")%> <%=helper.translate(helper.getSortBy(dataLocal))%></div>
        <div class="kuDropdownOptions">
            <div class="kuDropOption kuSort" data-value="RELEVANCE"><%=helper.translate("Relevance")%></div>
            <div class="kuDropOption kuSort" data-value="PRICE_ASC"><%=helper.translate("Price: Low to high")%></div>
            <div class="kuDropOption kuSort" data-value="PRICE_DESC"><%=helper.translate("Price: High to low")%></div>
        </div>
    </div>
</script>

<script type="template/klevu" id="klevuLandingTemplateLimit">
    <div class="kuDropdown kuDropItemsPerpage">
        <div class="kuDropdownLabel"><%=helper.translate("Items per page : %s",helper.getLimit(dataLocal))%></div>
        <div class="kuDropdownOptions">
            <div class="kuDropOption kuLimit" data-value="12">12</div>
            <div class="kuDropOption kuLimit" data-value="24">24</div>
            <div class="kuDropOption kuLimit" data-value="36">36</div>
        </div>
    </div>
</script>

<!-- 
    Landing page add to cart button template
-->

<script type="template/klevu" id="landingPageProductAddToCart">
    <div class="kuAddtocart" data-id="<%=dataLocal.id%>">
        <div class="kuCartBtn">
            <a target="_self" href="javascript:void(0)" class="kuAddtocartBtn kuLandingAddToCartBtn"><%=helper.translate("Add to cart") %></a>
        </div>
    </div>
</script>



<!--
    Color swatch template for landing page products
-->

<script type="template/klevu" id="landingPageProductColorSwatches">
    <% if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length){ %>
        <div class="kuSwatches">
           <% var swatchIndex = 1; helper.each(dataLocal.swatchesInfo,function(key,item){ if(swatchIndex > 3){ return true; } %>
               <div class="kuSwatchItem"><a target="_self" href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuLandingSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
           <% swatchIndex++; });%>
           <% if(dataLocal.swatchesInfo.length > 3){ %>
               <div class="kuSwatchItem kuSwatchMore">
                   <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
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
	Search result product grid quick view modal template file
-->
<script type="template/klevu" id="klevuLandingTemplateQuickView">
	<div class="kuModal"  data-id="<%=data.selected_product.id%>">
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
                            
							<div class="productQuick-tags">
								<span class="productQuick-label"><%=helper.translate("Tags:") %></span>
								<span><%=helper.translate(data.selected_product.tags)%>
								</span>
							</div>
						</div>
						<div class="productQuick-addToCart">
							<a target="_self" href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary-outline kuModalProductURL"><%=helper.translate("View details") %>
							</a>
							<a target="_self" href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary kuModalProductCart"><%=helper.translate("Add to cart") %></a>
						</div>
					</div>
					<div class="kuClearfix"></div>
				</div>
			</div>
		</div>
	</script>

<!--
    Color swatch for Product Quick view. 
-->

<script type="template/klevu" id="quickViewProductColorSwatches">
    <% var swatchesInfoList = dataLocal.swatchesInfo; var quickViewSwatchIndex = 1; %>
    <% if(swatchesInfoList && swatchesInfoList.length){ %>
        <div class="productQuick-colorInStock">
            <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>								
            <div class="kuSwatches">
                <% helper.each(swatchesInfoList,function(key,item){ if(quickViewSwatchIndex > 3){ return true;} %>
                    <div class="kuSwatchItem"><a target="_self" href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
                <% quickViewSwatchIndex++; });%>
                <% if(swatchesInfoList.length > 3){ %>
                    <div class="kuSwatchItem kuSwatchMore">
                        <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
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
    Custom pagination bar template
-->

<script type="template/klevu" id="customLandingPagePaginationBar">
    <% if(data.query[dataLocal].result.length > 0 ) { %>
        <% var productListLimit = data.query[dataLocal].meta.noOfResults; %>
        <% var productListTotal = data.query[dataLocal].meta.totalResultsFound - 1; %>
        <div class="kuPaginationBar">
            <% if(data.query[dataLocal].meta.offset > 0) { %>
                 <a target="_self" href="#" class="kuPaginate kuFirst" data-offset="0"><%=helper.translate("First")%></a>
                 <a target="_self" href="#" class="kuPaginate kuPrevious" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>"><%=helper.translate("Previous")%></a>
            <% } %>			 
            
            <% if(data.query[dataLocal].meta.offset > 0) { %>
                 <a target="_self" href="#" class="kuPaginate kuStart" data-offset="<%=(data.query[dataLocal].meta.offset-productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit))%></a>
            <% } %>

             <a target="_self" href="javascript:void(0);" class="kuActive"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+1)%></a>
			             
            <% if(productListTotal >= data.query[dataLocal].meta.offset+productListLimit) { %>
                 <a target="_self" href="#" class="kuPaginate kuEnd" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+2)%></a>
            <% } %>

            <% if(productListTotal >= data.query[dataLocal].meta.offset+productListLimit) { %>
                 <a target="_self" href="#" class="kuPaginate kuNext" data-offset="<%=(data.query[dataLocal].meta.offset+productListLimit)%>"><%=helper.translate("Next")%></a>
                 <a target="_self" href="#" class="kuPaginate kuLast" data-offset="<%=(Math.floor(productListTotal/productListLimit)*productListLimit)%>"><%=helper.translate("Last")%></a>
            <% } %>
        </div>
    <% } %>
</script>


<!--
    Search result Product badge template file
-->
<script type="template/klevu" id="searchResultProductBadge">
    <%if(dataLocal.sku && dataLocal.sku != "") { %>
        <div class="kuDiscountBadge"><span class="kuDiscountTxt"><%=dataLocal.sku%></span></div>
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
<script type="template/klevu" id="klevuLandingTemplateFilters">
    <% if(data.query[dataLocal].filters.length > 0 ) { %>
        <div class="kuFilters">
        	
            <% helper.each(data.query[dataLocal].filters,function(key,filter){ %>
                <% if(filter.type == "OPTIONS"){ %>
                    <div class="kuFilterBox klevuFilter <%=(filter.multiselect)?'kuMulticheck':''%>" data-filter="<%=filter.key%>" <% if(filter.multiselect){ %> data-singleselect="false" <% } else { %> data-singleselect="true"<% } %>>
                        <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">
                            <% var filter_label = (filter.label=="klevu_price") ? "price" : filter.label; %>
                            <%=filter_label%>
                        </div>
                        <div class="kuFilterNames <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">
                            <ul>
                                <% helper.each(filter.options,function(key,filterOption){ %>
                                    <li <% if(filterOption.selected ==true) { %> class="kuSelected"<% } %>>
                                         <a target="_self" href="#" title="<%=filterOption.value%>" class="klevuFilterOption<% if(filterOption.selected ==true) { %> klevuFilterOptionActive<% } %>" data-value="<%=filterOption.value%>">
                                            <span class="kuFilterIcon"></span>
                                            <span class="kufacet-text"><%=filterOption.name%></span>
                                            <% if(filterOption.selected ==true) { %>
                                                <span class="kuFilterCancel">X</span>
                                            <% } else { %>
                                                <span class="kuFilterTotal"><%=filterOption.count%></span>
                                            <% } %>
                                        </a>
                                    </li>
                                    
                                <%  }); %>
                            </ul>
                            <% if(filter.options.length > 5 ) { %>
                                <div class="kuShowOpt">
                                    <span class="kuFilterDot"></span><span class="kuFilterDot"></span><span class="kuFilterDot"></span>
                                </div>
                            <% } %>
                        </div>
                    </div>
                <% } else if(filter.type == "SLIDER")  { %>
                	<div class="kuFilterBox klevuFilter data-filter="<%=filter.key%>">
                        <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">
                        	<% var filter_label = (filter.label=="klevu_price") ? "price" : filter.label; %>
                            <%=filter_label%>
                        </div>
                        <div class="kuFilterNames sliderFilterNames <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">                           
  							<div class="kuPriceSlider klevuSliderFilter" data-query = "<%=dataLocal%>">
  								<div data-querykey = "<%=dataLocal%>" class="noUi-target noUi-ltr noUi-horizontal noUi-background kuSliderFilter kuPriceRangeSliderFilter<%=dataLocal%>"></div>
                                <div class="kuSliderVal">
                                    <div class="kuSliderVal-min">
                                        <span class="kulabel">Min</span> 
                                        <span class="kuCurrency"></span>
                                        <span class="minValue<%=dataLocal%>" ></span>
                                    </div>
                                    <span class="kuSliderTo">To</span>
                                    <div class="kuSliderVal-max">
                                        <span class="kulabel">Max</span> 
                                        <span class="kuCurrency"></span>
                                        <span class="maxValue<%=dataLocal%>"></span>
                                    </div>
                                </div>
  							</div>
                        </div>
                    </div>
                <% } else { %>
                    <!-- Other Facets -->
                <% } %>
            <% }); %>
        </div>
    <% } %>
</script>

<!--
Landing page banner template
-->
<script type="template/klevu" id="klevuLandingPromotionBanner">
    
    <% if(data.banners && data.banners.length) { klevu.each(data.banners, function(index, banner){ %>
        <div class="kuBannerAd kuBannerContainer">
            <a 
            class="kuTrackBannerClick" 
            target="_self" 
            data-id="<%= banner.id %>" 
            data-name="<%= banner.name %>"
            data-image="<%= banner.src %>"
            data-redirect="<%= banner.click %>" 
            href="<%= banner.click %>">
                <img src="<%= banner.src %>" alt="<%= banner.name %>" />
            </a>
        </div>
    <% }); } %>
</script>
