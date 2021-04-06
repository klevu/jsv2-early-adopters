<script type="template/klevu" id="klevuLandingTemplateBase">
    <div ku-container data-container-id="ku_landing_main_container" data-container-role="main">

        <header ku-container data-container-id="ku_landing_main_header_container" data-container-role="header">
            <section ku-block data-block-id="ku_landing_main_header_sub_panel"></section>
            <section ku-block data-block-id="ku_landing_main_header_banner">
                <%=helper.render('klevuLandingPromotionBanner',scope,data,"top") %>
                <%=helper.render('klevuLandingPromotionBanner',scope,data,"bottom") %>
            </section>
            <section ku-block data-block-id="ku_landing_main_header_site_navigation"></section>
        </header>
            
        <div class="kuContainer">
            <% if(!helper.hasResults(data,"productList")) { %>                
                <%=helper.render('noResultsFoundLanding',scope) %>
            <% } else { %>
                <%= helper.render('klevuLandingTemplateSearchBar', scope) %>                
                <%= helper.render('tab-results', scope) %>                
                <%= helper.render('results',scope) %>
            <% } %>
            <div class="kuClearBoth"></div>
        </div>
    
        <footer ku-container data-container-id="ku_landing_main_footer_container" data-container-role="footer">
            <section ku-block data-block-id="ku_landing_main_footer_sub_panel"></section>
            <section ku-block data-block-id="ku_landing_main_footer_banner">                

            </section>
        </footer>
    
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

            <a href="javascript:void(0);" class="kuCurrent"><%=(Math.ceil(data.query[dataLocal].meta.offset/productListLimit)+1)%></a>&nbsp;

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

<script type="template/klevu" id="klevuLandingTemplateProductBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
    %>
    <li ku-product-block class="klevuProduct" data-id="<%=dataLocal.id%>">
        <div class="kuProdWrap">
            <header ku-block data-block-id="ku_landing_result_item_header">
                <%=helper.render('landingProductBadge', scope, data, dataLocal) %>
            </header>
            <% var desc = [dataLocal.summaryAttribute,dataLocal.packageText,dataLocal.summaryDescription].filter(function(el) { return el; }); desc = desc.join(" "); %>
            <main ku-block data-block-id="ku_landing_result_item_info">
                <div class="kuProdTop">
                    <div class="klevuImgWrap">
                        <% if(dataLocal["image"] != undefined && dataLocal.image !== "") { %>                    
                            <a data-id="<%=dataLocal.id%>" href="<%=dataLocal.url%>" class="klevuProductClick kuTrackRecentView">
                            <img src="<%=dataLocal.image%>" origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=updatedProductName%>" class="kuProdImg">
                            <%=helper.render('landingImageRollover', scope, data, dataLocal) %>
                            </a>                        
                        <% } %>
                    </div>
                    <!-- <div class="kuQuickView">
                        <button data-id="<%=dataLocal.id%>" class="kuBtn kuBtnLight kuQuickViewBtn" role="button" tabindex="0" area-label="">Quick view</button>
                    </div> -->
                </div>
            </main>
            <footer ku-block="" data-block-id="ku_landing_result_item_footer">
                <div class="kuProdBottom">               
                    <div class="kuName kuClippedOne"><a data-id="<%=dataLocal.id%>" href="<%=dataLocal.url%>" class="klevuProductClick kuTrackRecentView" title="<%= updatedProductName %>"><%= updatedProductName %></a></div>
                    <% if(dataLocal.inStock && dataLocal.inStock != "yes") { %>
                        <%=helper.render('landingProductStock', scope, data, dataLocal) %>              
                    <% } else { %>
                    <% if(klevu.search.modules.kmcInputs.base.getShowPrices()) { %>
                        <div class="kuPrice kuClippedOne">
                            <%
                                var kuTotalVariants = klevu.dom.helpers.cleanUpPriceValue(dataLocal.totalVariants);
                                var kuStartPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.startPrice,dataLocal.currency);
                                var kuSalePrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.salePrice,dataLocal.currency);
                                var kuPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.price,dataLocal.currency);
                            %>
                            <% if(!Number.isNaN(kuTotalVariants) && !Number.isNaN(kuStartPrice)) { %>
                                <div class="kuSalePrice kuStartPrice kuClippedOne">
                                    <span class="klevuQuickPriceGreyText"><%=helper.translate("Starting at")%></span>
                                    <span><%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.startPrice))%></span>                                
                                </div>
                            <% } else if(!Number.isNaN(kuSalePrice) && !Number.isNaN(kuPrice) && (kuPrice > kuSalePrice)){ %>
                                <span class="kuOrigPrice kuClippedOne">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                                <span class="kuSalePrice kuSpecialPrice kuClippedOne">
                                    <%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice))%>
                                </span>
                            <% } else if(!Number.isNaN(kuSalePrice)) { %>
                                <span class="kuSalePrice kuSpecialPrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice)) %>
                                </span>
                            <% } else if(!Number.isNaN(kuPrice)) { %>
                                <span class="kuSalePrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                            <% } %>
                            <%=helper.render('searchResultProductVATLabel', scope, data, dataLocal) %>
                        </div>
                    <% } %>
                    <% } %>
                </div>
                <div class="kuProdAdditional">
                    <div class="kuProdAdditionalData">
                        <div class="kuDesc kuClippedOne"><%=desc%></div>
                        <%=helper.render('landingProductSwatch',scope,data,dataLocal) %>
                        <% var isAddToCartEnabled = klevu.search.modules.kmcInputs.base.getAddToCartEnableValue(); %>
                        <% if(isAddToCartEnabled) { %>
                            <%=helper.render('landingPageProductAddToCart',scope,data,dataLocal) %> 
                        <% } %>
                    <div>
                </div>
             </footer>             
        </div>
    </li>
</script>

<script type="template/klevu" id="klevuLandingTemplateResultsHeadingTitle">
    <%
        var totalNumberOfResults = klevu.getObjectPath(data,"query."+dataLocal+".meta.totalResultsFound");
        var searchedTerm = data.settings.term;
        var isCATNAV = data.settings.isCATNAV;
        if(isCATNAV){
            searchedTerm = data.settings.categoryPath;
        }
    %>
    <div class="kuResultsHeadingTitleContainer">
        <strong class="kuResultsNumber"> <%= (totalNumberOfResults) ? totalNumberOfResults : 0 %> </strong> <%= (parseInt(totalNumberOfResults) > 1) ? " Results" : " Result" %> found <%= (searchedTerm && searchedTerm.length && searchedTerm != "*") ? "for '"+searchedTerm+"'" : "" %>
    </div>
</script>

<script type="template/klevu" id="klevuLandingTemplateResults">
    <div class="kuResultsListing">
        <div class="productList klevuMeta" data-section="productList">
            <div class="kuResultContent">
                <div class="kuResultWrap <%=(data.query.productList.filters.length == 0 )?'kuBlockFullwidth':''%>">

                    <div ku-container data-container-id="ku_landing_main_content_container" data-container-role="content">
                        <section ku-container data-container-id="ku_landing_main_content_left" data-container-position="left" data-container-role="left">
                            <div ku-block data-block-id="ku_landing_left_facets">                                
                                <%=helper.render('filters',scope,data,"productList") %>
                            </div>
                            <div ku-block data-block-id="ku_landing_left_call_outs"></div>
                            <div ku-block data-block-id="ku_landing_left_banner"></div>
                        </section>
                        <section ku-container data-container-id="ku_landing_main_content_center" data-container-position="center" data-container-role="center">
                            
                            <header ku-block data-block-id="ku_landing_result_header">
                                <%=helper.render('klevuLandingTemplateResultsHeadingTitle',scope,data,"productList") %>
                                <%=helper.render('filtersTop',scope,data,"productList") %>
                                <%= helper.render('kuFilterTagsTemplate',scope,data,"productList") %>
                                <%=helper.render('sortBy',scope,data,"productList") %>
                                <%=helper.render('limit',scope,data,"productList") %>
                                <%=helper.render('kuTemplateLandingResultsViewSwitch',scope,data,"productList") %>
                                <%=helper.render('pagination',scope,data,"productList") %>
                                <div class="kuClearBoth"></div>                            
                            </header>

                            <div ku-block data-block-id="ku_landing_result_items">                                
                                
                                <div class="kuResults">
                                    <ul>
                                        <% helper.each(data.query.productList.result,function(key,item){ %>
                                            <% if(item.typeOfRecord == "KLEVU_PRODUCT") { %>
                                                <%=helper.render('productBlock',scope,data,item) %>
                                            <% } %>
                                        <% }); %>
                                    </ul>
                                    <div class="kuClearBoth"></div>
                                </div>
    
                            </div>
                            <div ku-block data-block-id="ku_landing_other_items"></div>
                            <footer ku-block data-block-id="ku_landing_result_footer"></footer>
                        </section>
                        <section ku-container data-container-id="ku_landing_main_content_right" data-container-position="right" data-container-role="right">
                            <div ku-block data-block-id="ku_landing_right_facets"></div>
                            <div ku-block data-block-id="ku_landing_right_call_outs"></div>
                            <div ku-block data-block-id="ku_landing_right_banner"></div>
                        </section>
                    </div>
                    
                </div>
            </div>
        </div>

        <% if(data.query.contentList) { %>
            <div class="contentList klevuMeta" data-section="contentList" data-result-view="list">
                <div class="kuResultContent">
                    <div class="kuResultWrap <%=(data.query.contentList.filters.length == 0 )?'kuBlockFullwidth':''%>">
    
                        <div ku-container data-container-id="ku_landing_main_content_container" data-container-role="content">
                            <section ku-container data-container-id="ku_landing_main_content_left" data-container-position="left" data-container-role="left">
                                <div ku-block data-block-id="ku_landing_left_facets">
                                    
                                    <%=helper.render('filters',scope,data,"contentList") %>
    
                                </div>
                                <div ku-block data-block-id="ku_landing_left_call_outs"></div>
                                <div ku-block data-block-id="ku_landing_left_banner"></div>
                            </section>
                            <section ku-container data-container-id="ku_landing_main_content_center" data-container-position="center" data-container-role="center">
                                
                                <header ku-block data-block-id="ku_landing_result_header">
                                    <%=helper.render('filtersTop',scope,data,"contentList") %>
                                    <%= helper.render('kuFilterTagsTemplate',scope,data,"contentList") %>
                                    <%=helper.render('sortBy',scope,data,"contentList") %>
                                    <%=helper.render('limit',scope,data,"contentList") %>
                                    <%=helper.render('pagination',scope,data,"contentList") %>
                                    <div class="kuClearBoth"></div> 
                                </header>

                                <div ku-block data-block-id="ku_landing_result_items">
    
                                    <div class="kuClearBoth"></div>
                                    <div class="kuResults">
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
                                <div ku-block data-block-id="ku_landing_other_items"></div>
                                <footer ku-block data-block-id="ku_landing_result_footer"></footer>
                            </section>
                            <section ku-container data-container-id="ku_landing_main_content_right" data-container-position="right" data-container-role="right">
                                <div ku-block data-block-id="ku_landing_right_facets"></div>
                                <div ku-block data-block-id="ku_landing_right_call_outs"></div>
                                <div ku-block data-block-id="ku_landing_right_banner"></div>
                            </section>
                        </div>
                        
                    </div>
                </div>
            </div>
        <% } %> 

    </div>
</script>
<script type="template/klevu" id="klevuLandingTemplateFilters">
    <% if(data.query[dataLocal].filters.length > 0 ) { %>
        <div class="kuFilters" role="navigation" data-position="left" aria-label="Product Filters" tabindex="0">
        	<h3 class="kuFiltersTitleHeading">Narrow by</h3>
            <% helper.each(data.query[dataLocal].filters,function(key,filter){ %>
                <% if(filter.type == "OPTIONS"){ %>
                    <div class="kuFilterBox klevuFilter <%=(filter.multiselect)?'kuMulticheck':''%>" data-filter="<%=filter.key%>" <% if(filter.multiselect){ %> data-singleselect="false" <% } else { %> data-singleselect="true"<% } %>>
                        <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">
                            <% var filter_label = (filter.label=="klevu_price") ? "price" : filter.label; %>
                            <%=filter_label%>
                        </div>
                        <div data-optionCount="<%= filter.options.length %>" class="kuFilterNames <%= (filter.options.length < 5 ) ? 'kuFilterShowAll': '' %> <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">
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
                                <div class="kuShowOpt" tabindex="-1">
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
            
            <!-- <div class="kuFiltersFooter">
            	<a target="_self" href="javascript:void(0)" class="kuBtn kuFacetsSlideOut kuMobileFilterCloseBtn" role="button" tabindex="0" area-label=""><%=helper.translate("Close")%></a>
  			</div> -->
            
            
        </div>
    <% } %>
</script>
<script type="template/klevu" id="klevuLandingTemplateTopFilters">
    <% if(data.query[dataLocal].filters.length > 0 ) { %>
        <div class="kuFilters kuFiltersTop" role="navigation" data-position="top" aria-label="Product Filters" tabindex="0">
        	<h3 class="kuFiltersTitleHeading">Narrow by</h3>
            <% helper.each(data.query[dataLocal].filters,function(key,filter){ %>
                <% if(filter.type == "OPTIONS"){ %>
                    <div class="kuFilterBox klevuFilter <%=(filter.multiselect)?'kuMulticheck':''%>" data-filter="<%=filter.key%>" <% if(filter.multiselect){ %> data-singleselect="false" <% } else { %> data-singleselect="true"<% } %>>
                        <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">
                            <% var filter_label = (filter.label=="klevu_price") ? "price" : filter.label; %>
                            <%=filter_label%>
                        </div>
                        <div data-optionCount="<%= filter.options.length %>" class="kuFilterNames <%= (filter.options.length < 5 ) ? 'kuFilterShowAll': '' %> <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">
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
                                <div class="kuShowOpt" tabindex="-1">
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
            
            <!-- <div class="kuFiltersFooter">
            	<a target="_self" href="javascript:void(0)" class="kuBtn kuFacetsSlideOut kuMobileFilterCloseBtn" role="button" tabindex="0" area-label=""><%=helper.translate("Close")%></a>
  			</div> -->
              
        </div>
    <% } %>
</script>
<!-- 
    Landing page add to cart button template
-->
<script type="template/klevu" id="landingPageProductAddToCart">
    <% if(dataLocal.inStock != "no") { %>
    <% var addToCartCaption = klevu.search.modules.kmcInputs.base.getAddToCartButtonCaption(); %>
        <% if(addToCartCaption && addToCartCaption.indexOf("<img") !== -1) { %>
            <div class="kuAddtocart" data-id="<%=dataLocal.id%>">
                <a target="_self" href="javascript:void(0)" class="kuBtn  kuLandingAddToCartBtn" role="button" tabindex="0" area-label="Add to cart"><%= addToCartCaption %></a>
            </div>
        <% } else { %>
            <div class="kuAddtocart" data-id="<%=dataLocal.id%>">
                <a target="_self" href="javascript:void(0)" class="kuBtn kuBtnDark kuLandingAddToCartBtn" role="button" tabindex="0" area-label="<%= addToCartCaption %>"><%=helper.translate(addToCartCaption) %></a>       
            </div>
        <% } %>
    <% } %>
</script>
<!--
    Color swatch template for landing page products
-->

<script type="template/klevu" id="landingPageProductColorSwatches">

    <%  
        var hasAnyVariantImageAdded = false;
        if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length) {
            helper.each(dataLocal.swatchesInfo,function(key,item) {
                if(item.variantImage && item.variantImage.length) {
                    hasAnyVariantImageAdded = true;
                }
            });
        }
    %>

    <% if(((!dataLocal.swatchesInfo || !dataLocal.swatchesInfo.length) || !hasAnyVariantImageAdded) && dataLocal.totalVariants) { %>
        <div class="kuSwatches">
            <span class="kuSwatchesVariantCountText">+<%= dataLocal.totalVariants %> variant(s)</span>
        </div>
    <% } %>

    <% if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length && hasAnyVariantImageAdded) { %>
        <div class="kuSwatches">
            <% 
                var totalVariantIndex = dataLocal.swatchesInfo.length;
                var swatchIndex = 0;
                helper.each(dataLocal.swatchesInfo,function(key,item) {
                    var isSwatchInfoAdded = false;
                    if(swatchIndex > 2){ return true; }
                    if(item.variantImage && item.variantImage.length) {
            %>

                            <div class="kuSwatchItem">
                                <a 
                                    target="_self" 
                                    href="javascript:void(0)" 
                                    data-variant="<%= item.variantId %>" 
                                    class="kuSwatchLink klevuLandingSwatchColorGrid"
                                    <% if(item.variantColor && item.variantColor.length) { %>
                                        title="<%= item.variantColor %>"
                                    <% } %>
                                    style="<% if(item.variantColor && item.variantColor.length) { isSwatchInfoAdded = true; %>
                                            background-color:<%= item.variantColor %>;
                                        <% } %>
                                        <% if(item.variantSwatchImage && item.variantSwatchImage.length) { isSwatchInfoAdded = true; %>
                                            background-image: url('<%= item.variantSwatchImage %>');
                                        <% } %>
                                        <% if(!isSwatchInfoAdded) {  %>
                                            background-image: url('https://js.klevu.com/klevu-js-v1/img-1-1/default-swatch.jpg');
                                        <% } %>"
                                >
                                </a>
                            </div>

            <%          
                        swatchIndex++;
                    }                    
                });
            %>

            <% if(totalVariantIndex > swatchIndex) { %>
                <div class="kuSwatchItem kuSwatchMore">
                        <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
                        <span class="kuSwatchMoreText">
                            +<%= (totalVariantIndex - swatchIndex) %>
                        </span>
                    </a>
                </div>
            <% } %>

       </div>	
   <% } %>
</script>
<!--
    Color swatch for Product Quick view. 
-->

<script type="template/klevu" id="quickViewProductColorSwatches">

    <%  
        var hasAnyVariantImageAdded = false;
        if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length) {
            helper.each(dataLocal.swatchesInfo,function(key,item) {
                if(item.variantImage && item.variantImage.length) {
                    hasAnyVariantImageAdded = true;
                }
            });
        }
    %>

    <% if(((!dataLocal.swatchesInfo || !dataLocal.swatchesInfo.length) || !hasAnyVariantImageAdded) && dataLocal.totalVariants) { %>
        <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>
        <div class="kuSwatches">
            <span class="kuSwatchesVariantCountText">+<%= dataLocal.totalVariants %> variant(s)</span>
        </div>
    <% } %>

    <% if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length && hasAnyVariantImageAdded) { %>
    <div class="productQuick-colorInStock">
        <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>
        <div class="kuSwatches">
            <% 
                var totalVariantIndex = dataLocal.swatchesInfo.length;
                var swatchIndex = 0;
                helper.each(dataLocal.swatchesInfo,function(key,item) {
                    var isSwatchInfoAdded = false;
                    if(swatchIndex > 2){ return true; }
                    if(item.variantImage && item.variantImage.length) {
            %>

                            <div class="kuSwatchItem">
                                <a 
                                    target="_self" 
                                    href="javascript:void(0)" 
                                    data-variant="<%= item.variantId %>" 
                                    class="kuSwatchLink klevuLandingSwatchColorGrid"
                                    <% if(item.variantColor && item.variantColor.length) { %>
                                        title="<%= item.variantColor %>"
                                    <% } %>
                                    style="<% if(item.variantColor && item.variantColor.length) { isSwatchInfoAdded = true; %>
                                            background-color:<%= item.variantColor %>;
                                        <% } %>
                                        <% if(item.variantSwatchImage && item.variantSwatchImage.length) { isSwatchInfoAdded = true; %>
                                            background-image: url('<%= item.variantSwatchImage %>');
                                        <% } %>
                                        <% if(!isSwatchInfoAdded) {  %>
                                            background-image: url('https://js.klevu.com/klevu-js-v1/img-1-1/default-swatch.jpg');
                                        <% } %>"
                                >
                                </a>
                            </div>

            <%          
                        swatchIndex++;
                    }                    
                });
            %>

            <% if(totalVariantIndex > swatchIndex) { %>
                <div class="kuSwatchItem kuSwatchMore">
                        <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
                        <span class="kuSwatchMoreText">
                            +<%= (totalVariantIndex - swatchIndex) %>
                        </span>
                    </a>
                </div>
            <% } %>

       </div>
    </div>
    <% } %>
</script>
<!--
    Search result Product stock availability label template file
-->

<script type="template/klevu" id="landingSearchResultProductStock">
    <%
        var outOfStockCaption = klevu.search.modules.kmcInputs.base.getOutOfStockCaptionValue();
        var productStockStatus =  helper.translate(outOfStockCaption);
    %>
        <div class="kuClippedOne kuCaptionStockOut">
            <%= productStockStatus %>
        </div>
</script>
<!--
    Search result Product VAT label template file
-->

<script type="template/klevu" id="searchResultProductVATLabel">
    <%
        var caption = klevu.search.modules.kmcInputs.base.getVatCaption();
        var vatCaption =  helper.translate("(" + caption + ")");
    %>
    <div class="kuCaptionVat"><%= vatCaption %></div>
</script>
<script type="template/klevu" id="klevuLandingTemplateSortBy">
    <div class="kuDropdown kuDropSortBy" role="listbox">
        <div class="kuDropdownLabel"><%=helper.translate("Sort by : ")%> <%=helper.translate(helper.getSortBy(dataLocal))%></div>
        <div class="kuDropdownOptions">
            <div class="kuDropOption kuSort" data-value="RELEVANCE" role="option"><%=helper.translate("Relevance")%></div>
            <div class="kuDropOption kuSort" data-value="PRICE_ASC" role="option"><%=helper.translate("Price: Low to high")%></div>
            <div class="kuDropOption kuSort" data-value="PRICE_DESC" role="option"><%=helper.translate("Price: High to low")%></div>
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
<script type="template/klevu" id="klevuLandingTemplateContentBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
        var hasImageFound = (dataLocal.image && dataLocal.image != "") ? true : false;
    %>
    <li class="klevuProduct klevuCMSProduct" data-id="<%=dataLocal.id%>">
        <div class="kuProdWrap">
            <% if(dataLocal.image && dataLocal.image != "") { %>
                <main ku-block data-block-id="ku_landing_result_item_info">
                    <div class="kuProdTop">
                        <div class="klevuImgWrap">
                            <a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><img origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" src="<%=dataLocal.image%>" alt="<%=updatedProductName%>" class="kuProdImg"></a>
                        </div>
                    </div>
                </main>
            <% } %>
            <footer class="<%= (hasImageFound) ? '' : 'kuCMSProductNoImageFound' %>" ku-block="" data-block-id="ku_landing_result_item_footer">
                <div class="kuProdBottom">
                    <div class="kuNameDesc">
                        <div class="kuName"><a title="<%= updatedProductName %>" target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><%= updatedProductName %></a></div>
                        <div class="klevu-desc-l2"> <%=dataLocal.shortDesc%> </div>
                    </div>
                </div>
            </footer>            
        </div>
    </li>
</script>
<script type="template/klevu" id="klevuLandingTemplateTabResults">
    <% var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue(); %>        
    <div class="kuTabs" role="tablist" style="display:<%= isCmsEnabled ? 'block' : 'none'  %>">
        <% var selectedTab = false; %>
        <% helper.each(data.query,function(key,query){ %>
            <% if(query.tab == true) { %>
                <% if(helper.hasResults(data,query.id)) { %>
                    <a target="_self" class="kuTab<% if(!selectedTab){ selectedTab = true; %> kuTabSelected<% } %>" data-section="<%=query.id%>" role="tab" tabindex="0" aria-selected="" area-label="Products tab">
                        <%=helper.translate(query.tabText,data.query[query.id].meta.totalResultsFound)%>
                    </a>
                <% } else { %>
                    <a target="_self" class="kuTabDeactive" data-section="<%=query.id%>" role="tab" tabindex="0" aria-selected="" area-label="Products tab">
                        <%=helper.translate(query.tabText,0)%>
                    </a>
                <% } %>
            <% } %>
        <% }); %>
    </div>
</script>
<!--
    Search result Product badge template file
-->
<script type="template/klevu" id="searchResultProductBadge">
    <%if(dataLocal.stickyLabelHead && dataLocal.stickyLabelHead != "") { %>
        <div class="kuDiscountBadge"><span class="kuDiscountTxt"><%= dataLocal.stickyLabelHead %></span></div>
    <% } %>
</script>
<!--
Landing page banner template
-->
<script type="template/klevu" id="klevuLandingPromotionBanner">
    <% var hasNoResultFound = klevu.getObjectPath(data,"modules.promotionalBanner.hasNoResultFound"); %>
    <% if(data.banners && data.banners[dataLocal] && data.banners[dataLocal].length && !hasNoResultFound) { 
        klevu.each(data.banners[dataLocal], function(index, banner){ %>
            <div class="kuBannerAd kuBannerContainer">
                <a 
                    role="banner"
                    area-label="Promotion Banner label"
                    class="kuTrackBannerClick" 
                    target="_self" 
                    data-id="<%= banner.bannerRef %>" 
                    data-name="<%= banner.bannerName %>"
                    data-image="<%= banner.bannerImg %>"
                    data-redirect="<%= banner.redirectUrl %>" 
                    href="<%= banner.redirectUrl %>"
                    alt="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>"
                    title="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>"
                >
                    <img src="<%= banner.bannerImg %>" alt="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>"  />
                </a>
            </div>
        <% }); 
    } %>
</script><!-- No Results Found template for Landing Search Results -->
<script type="template/klevu" id="klevuLandingTemplateNoResultFound">
    <div class="kuContainer">
        <div class="kuLandingNoRecordFound">
            <div class="kuLandingNoResults">
                <div class="kuLandingNoResultsInner">

                    <div class="kuLandingNoResultsMessage">
                        <% if(data.settings&& data.settings.term && data.settings.term) { %>
                            <% var regExp = new RegExp("==="+data.settings.term+"===", "g"); %>
                            <%= helper.translate(data.noResultsFoundMsg.replace(regExp, '"<em>'+data.settings.term+'</em>"')) %>                            
                        <% } else { %>                          
                            <% data.noResultsFoundMsg = data.noResultsFoundMsg.replace("======",""); %>
                            <%= helper.translate(data.noResultsFoundMsg) %>
                        <% } %>                        
                    </div>

                    <%=helper.render('noResultsLandingPopularProductsTemplate', scope, data) %>
                    <%=helper.render('landingNoResultsFoundBanners', scope, data) %>
                    <%=helper.render('noResultsLandingPopularSearches', scope, data) %>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="template/klevu" id="klevuNoResultsPopularProductsLanding">
    <div class="kuNoResultsProductRecommendationSlider kuNoResultsPopularProducts" data-section="noResultsFoundPopularProductList">
        <% var popularProductList = klevu.getObjectPath(data,"query.noResultsFoundPopularProductList.result");%>
        <% if(popularProductList && popularProductList.length) { %>
            <div class="klevuNoResultsRecs" title="<%= helper.translate(data.landingNoResultsPopularHeading) %>">
                <h3><%= helper.translate(data.landingNoResultsPopularHeading) %> </h3>
            </div>
            <div class="klevuNoResultsRecsWrap">
                    <div class="klevuNoResultsRecsResults">
                        <div class="klevuNoResultsRecsResultsInner">
                            <% helper.each(popularProductList, function(key, product){ %>
                                <% 
                                var updatedProductName = product.name;
                                if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
                                    if(klevu.dom.helpers.cleanUpSku(product.sku)) {
                                        updatedProductName += klevu.dom.helpers.cleanUpSku(product.sku);
                                    }
                                }
                                %>
                                <div class="klevuNoResultsRecs-itemWrap klevuRecommendedProduct klevuProduct" data-id="<%= product.id %>">
                                    <div class="klevuNoResultsRecs-item">
                                        <div class="klevuNoResultsRecs-itemImg">
                                            <a href="<%= product.url %>" class="klevuProductClick kuTrackRecentView klevuNoResultsRecsImg" data-id="<%= product.id %>">
                                                <img 
                                                    src="<%= product.image %>"
                                                    origin="<%= product.image %>" 
                                                	onerror="klevu.dom.helpers.cleanUpProductImage(this)"
                                                    alt="<%= updatedProductName %>" 
                                                    class="prodImg"
                                                    width="100%" />
                                            </a>
                                        </div>
                                    </div>
                                    <div class="klevuNoResultsRecs-itemDesc">
                                        <a href="<%= product.url %>" title="<%= updatedProductName %>" data-id="<%= product.id %>" class="klevuProductClick kuTrackRecentView klevuNoResultsRecsTitle"><%= updatedProductName %></a>
                                        <% if(klevu.search.modules.kmcInputs.base.getShowPrices()) { %>
                                            <div class="klevuNoResultsRecs-itemPrice">
                                                <%
                                                    var kuTotalVariants = klevu.dom.helpers.cleanUpPriceValue(product.totalVariants);
                                                    var kuStartPrice = klevu.dom.helpers.cleanUpPriceValue(product.startPrice,product.currency);
                                                    var kuSalePrice = klevu.dom.helpers.cleanUpPriceValue(product.salePrice,product.currency);
                                                    var kuPrice = klevu.dom.helpers.cleanUpPriceValue(product.price,product.currency);
                                                %>
                                                <% if(!Number.isNaN(kuTotalVariants) && !Number.isNaN(kuStartPrice)) { %>                                
                                                    <div class="kuSalePrice kuStartPrice">
                                                        <span class="klevuQuickPriceGreyText"><%=helper.translate("Starting at")%></span>
                                                        <span><%=helper.processCurrency(product.currency,parseFloat(product.startPrice))%></span>                                
                                                    </div>
                                                <% } else if(!Number.isNaN(kuSalePrice) && !Number.isNaN(kuPrice) && (kuPrice > kuSalePrice)){ %>
                                                    <span class="kuOrigPrice kuClippedOne">
                                                        <%= helper.processCurrency(product.currency,parseFloat(product.price)) %>
                                                    </span>
                                                    <span class="kuSalePrice kuSpecialPrice kuClippedOne">
                                                        <%=helper.processCurrency(product.currency,parseFloat(product.salePrice))%>
                                                    </span>
                                                <% } else if(!Number.isNaN(kuSalePrice)) { %>
                                                    <span class="kuSalePrice kuSpecialPrice">
                                                        <%= helper.processCurrency(product.currency,parseFloat(product.salePrice)) %>
                                                    </span>
                                                <% } else if(!Number.isNaN(kuPrice)) { %>
                                                    <span class="kuSalePrice">
                                                        <%= helper.processCurrency(product.currency,parseFloat(product.price)) %>
                                                    </span>
                                                <% } %>
                                                <%=helper.render('searchResultProductVATLabel', scope, data, product) %>
                                            </div>
                                        <% } %>
                                    </div>
                                </div>
                            <% }) %>
                        </div>
                    </div>
                </div>
            </div>
        <% } %>
    </div>
</script>

<!-- Popular searches template for Landing Search Results -->
<script type="template/klevu" id="kuNoResultsPopularSearchesLanding">
    <% if(data.noResultsFoundPopularSearches && data.noResultsFoundPopularSearches.length) { %>
        <div class="kuNoResultsLandingPopularSearchesBlock">
            <div class="kuNoResultsLandingPopularSearchTerms">
                <span class="klevuHeadingText"><%=helper.translate("Popular Searches:")%></span>
                <ul>
                    <% helper.each(data.noResultsFoundPopularSearches, function(key,term){ %>
                        <% if(term && term.length) { %>
                            <% 
                                var landingURLPrefix = klevu.getObjectPath(klevu.settings,"url.landing");
                                if(typeof landingURLPrefix === "undefined" || landingURLPrefix === ""){
                                    landingURLPrefix = "/";
                                }
                            %>
                            <li class="kuNoResultsLandingPopularSearchTerm" data-value="<%= term %>">
                                <a href="<%= landingURLPrefix %>?q=<%= term %>" title="<%= term %>">
                                    <%= (data.noResultsFoundPopularSearches.length -1 != key) ? term + ", " : term %>
                                </a>
                            </li>
                        <% } %>
                    <% }); %>
                </ul>
            </div>
        </div>
    <% } %>
</script>

<script type="template/klevu" id="klevuLandingNoResultsFoundBanners">
    <% 
    if(data.landingNoResultsFoundBanners && data.landingNoResultsFoundBanners.length) { 
        klevu.each(data.landingNoResultsFoundBanners, function(index, banner){ 
    %>
        <div class="klevu-no-results-banner-ad">
            <a
                role="banner"
                class="kuTrackBannerClick" 
                target="_self" 
                data-id="<%= banner.bannerRef %>"
                data-image="<%= banner.bannerImageUrl %>" 
                data-redirect="<%= banner.redirectUrl %>"
                href="<%= banner.redirectUrl %>"
                alt="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>"
                title="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>"
            >
                <img src="<%= banner.bannerImageUrl %>" alt="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>" />
            </a>
        </div>
    <% 
        }); 
    } 
    %>
</script>
<script type="template/klevu" id="kuFilterTagsTemplate">
    <% 
        var filterTagsModule = data.filterTags;
        var filterTagsData = [];
        if(dataLocal && dataLocal.length){
            filterTagsData = filterTagsModule.query[dataLocal].tags;
        }
    %>
    <% if(filterTagsData.length) { %>
        <div class="kuFilterTagsContainer">        
            <% helper.each(filterTagsData, function(key,item){ %>
                <span class="kuFilterTag" data-key="<%= helper.translate(item.key) %>">
                    <span title="<%= helper.translate(item.label) %>" data-value="<%= helper.translate(item.label) %>" class="kuFilterTagKey"><%= helper.translate(item.label) %></span>
                    <% helper.each(item.values, function(key,option){ %>
                        <span title="<%= helper.translate(option) %>" data-value="<%= helper.translate(option) %>" class="kuFilterTagValue">
                            <%= helper.translate(option) %>
                            <span>&times;</span>
                        </span>
                    <% }); %>
                </span>
            <% }); %>
            <span title="Clear all" class="kuFilterTagClearAll">Clear all</span>        
        </div>
    <% } %>
</script>
<script type="template/klevu" id="kuTemplateLandingResultsViewSwitch">
    <div class="kuLandingResultsViewSwitchContainer">
        <a class="kuViewSwitch kuGridViewBtn" data-value="grid">
          <span class="icon-gridview"></span>
        </a>
        <a class="kuViewSwitch kuListViewBtn" data-value="list">
          <span class="icon-listview"></span>
        </a>
    </div>
</script>
<script type="template/klevu" id="klevuLandingTemplateSearchBar">
    <div class="kuSearchResultsSearchBarContainer">
        <form action="/" method="get">
            <input type="text" name="q" id="search" class="kuSearchInput header-bar__search-input" placeholder="Search text" />
        </form>
    </div>
</script>
<script type="template/klevu" id="landingImageRollover">
    <% if(dataLocal.imageHover) { %>
        <img style="display:none;"  class="kuProdImgHover" src="<%=dataLocal.imageHover%>" origin="<%=dataLocal.imageHover%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=dataLocal.name%>">
    <% } %>
</script>
<script type="template/klevu" id="landingQuickViewImageRollover">
    <% if(data.selected_product.imageHover) { %>
        <img style="display:none;" class="kuProdQuickviewImgHover" src="<%=data.selected_product.imageHover%>" origin="<%=data.selected_product.imageHover%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=data.selected_product.name%>">
    <% } %>
</script>