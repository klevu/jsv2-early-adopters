<script type="template/klevu" id="klevuQuickTemplateBase">
    <div class="klevu-fluid kuPreventDocumentClick">
        <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
            <div ku-container data-container-id="ku_quick_main_container" data-container-role="main">
                <header ku-container data-container-id="ku_quick_main_header_container" data-container-role="header">
                    <section ku-block data-block-id="ku_quick_main_header_sub_panel"></section>
                    <section ku-block data-block-id="ku_quick_main_header_banner">
                        <%=helper.render('klevuQuickPromotionBanner',scope,data,"top") %>                    
                    </section>
                    <section ku-block data-block-id="ku_quick_main_header_site_navigation">
                        <div class="klevuSuggestionsBlock">                            
                            <%=helper.render('klevuQuickAutoSuggestions',scope) %>
                            <%=helper.render('klevuQuickPageSuggestions',scope) %>
                            <%=helper.render('klevuQuickCategorySuggestions',scope) %>
                        </div>
                    </section>
                </header>                
                
                <% if(data.query.productList) { %>
                    <%= helper.render('klevuQuickProducts',scope) %>
                <% } else { %>
                    <%= helper.render('klevuSearchPersonalizations',scope) %>
                <% } %>                
            
                <footer ku-container data-container-id="ku_quick_main_footer_container" data-container-role="footer">
                    <section ku-block data-block-id="ku_quick_main_footer_sub_panel"></section>
                    <section ku-block data-block-id="ku_quick_main_footer_banner">
                        <%=helper.render('klevuQuickPromotionBanner',scope,data,"bottom") %>
                    </section>
                </footer> 
            </div>
        </div>
    </div>
</script>

<script type="template/klevu" id="klevuSearchPersonalizations">
    <div ku-container data-container-id="ku_quick_main_content_container" data-container-role="content">
        <section ku-container data-container-id="ku_quick_main_content_left" data-container-position="left" data-container-role="left">
            <div ku-block data-block-id="ku_quick_left_facets"></div>
            <div ku-block data-block-id="ku_quick_left_call_outs">
                <%=helper.render('kuTemplatePopularSearches',scope) %>
                <%=helper.render('kuTemplateRecentSearches',scope) %>
            </div>
            <div ku-block data-block-id="ku_quick_left_banner"></div>
        </section>
        <section ku-container data-container-id="ku_quick_main_content_center" data-container-position="center" data-container-role="center">
            <header ku-block data-block-id="ku_quick_result_header"></header>
            <div ku-block data-block-id="ku_quick_result_items"></div>
                        
            <div ku-block data-block-id="ku_quick_other_items">
                <%=helper.render('klevuTrendingProducts',scope) %>
                <%=helper.render('klevuRecentViewedProducts',scope) %>
            </div>

            <footer ku-block data-block-id="ku_quick_result_footer"></footer>
        </section>
        <section ku-container data-container-id="ku_quick_main_content_right" data-container-position="right" data-container-role="right">
            <div ku-block data-block-id="ku_quick_right_facets"></div>
            <div ku-block data-block-id="ku_quick_right_call_outs"></div>
            <div ku-block data-block-id="ku_quick_right_banner"></div>
        </section>
    </div>
</script>


<script type="template/klevu" id="klevuQuickAutoSuggestions">
    <% if(data.suggestions.autosuggestion) { %>
        <% if(data.suggestions.autosuggestion.length> 0 ) { %>
            <div class="klevuAutoSuggestionsWrap klevuAutosuggestions">
                <div class="klevuSuggestionHeading">
                    <span class="klevuHeadingText"> <%=helper.translate("Suggestions")%></span>
                </div>
                <ul>
                    <% helper.each(data.suggestions.autosuggestion,function(key,suggestion){ %>
                        <li tabindex="-1"><a target="_self" href="<%=helper.buildUrl(data.settings.landingUrl, 'q' , helper.stripHtml(suggestion.suggest))%>" data-content="<%=helper.stripHtml(suggestion.suggest) %>" class="klevu-track-click"> <%=suggestion.suggest %> </a></li>
                    <% }); %>
                </ul>
            </div>
        <% } %>
    <% } %>
</script>

<script type="template/klevu" id="klevuQuickPageSuggestions">
    <% if(data.query.cmsCompressed) { %>
        <% if(data.query.cmsCompressed.result.length > 0 ){ %>
            <div class="klevuAutoSuggestionsWrap klevuCmsSuggestions" id="klevuCmsContentArea">
                <div class="klevuSuggestionHeading"><span class="klevuHeadingText"><%=helper.translate("Pages")%></span></div>
                <ul>
                    <% helper.each(data.query.cmsCompressed.result,function(key,cms){ %>
                        <li tabindex="-1"><a target="_self" href="<%=cms.url%>" class="klevu-track-click" data-url="<%=cms.url%>" data-name="<%=cms.name%>"><%=cms.name%></a></li>
                    <% }); %>
                </ul>
            </div>
        <% } %>
    <% } %>
</script>

<script type="template/klevu" id="klevuQuickCategorySuggestions">
    <% if(data.query.categoryCompressed) { %>
        <% if(data.query.categoryCompressed.result.length > 0 ){ %>
            <div class="klevuAutoSuggestionsWrap klevuCategorySuggestions" id="klevuCategoryArea">
                <div class="klevuSuggestionHeading">
                    <span class="klevuHeadingText"><%=helper.translate("Category")%></span>
                </div>
                <ul>
                    <% helper.each(data.query.categoryCompressed.result,function(key,category){ %>
                        <li tabindex="-1"><a target="_self" href="<%=category.url%>" class="klevu-track-click" data-url="<%=category.url%>" data-name="<%=category.name%>" ><%=category.name%></a></li>
                    <% }); %>
                </ul>
            </div>
        <% } %>
    <% } %>
</script>

<script type="template/klevu" id="klevuQuickProducts">
    <% if(data.query.productList) { %>
        <% if(data.query.productList.result.length > 0 ) { %>
            <div ku-container data-container-id="ku_quick_main_content_container" data-container-role="content">
                <section ku-container data-container-id="ku_quick_main_content_left" data-container-position="left"
                    data-container-role="left">
                    <div ku-block data-block-id="ku_quick_left_facets"></div>
                    <div ku-block data-block-id="ku_quick_left_call_outs"></div>
                    <div ku-block data-block-id="ku_quick_left_banner"></div>
                </section>
                <section ku-container data-container-id="ku_quick_main_content_center" data-container-position="center"
                    data-container-role="center">
                    <header ku-block data-block-id="ku_quick_result_header"></header>
                    <div ku-block data-block-id="ku_quick_result_items">
                        <div class="klevuResultsBlock">
                            <div class="klevuSuggestionHeading"><span
                                    class="klevuHeadingText"><%=helper.translate("Products")%></span></div>
                            <div class="klevuProductsViewAll">
                                <a href="<%=helper.buildUrl(data.settings.landingUrl,'q',helper.stripHtml(data.settings.term))%>"
                                    target="_parent"><%=helper.translate("View All")%></a>
                            </div>
                            <div class="klevuQuickSearchResults" data-section="productList" id="productsList">
                                <ul>
                                    <% helper.each(data.query.productList.result,function(key,product){ %>
                                        <%=helper.render('klevuQuickProductBlock',scope,data,product) %>
                                    <% }); %>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div ku-block data-block-id="ku_quick_other_items"></div>
                    <footer ku-block data-block-id="ku_quick_result_footer"></footer>
                </section>
                <section ku-container data-container-id="ku_quick_main_content_right" data-container-position="right"
                    data-container-role="right">
                    <div ku-block data-block-id="ku_quick_right_facets"></div>
                    <div ku-block data-block-id="ku_quick_right_call_outs"></div>
                    <div ku-block data-block-id="ku_quick_right_banner"></div>
                </section>
            </div>
        <% } else { %>
            <% var isCmsEnabled = klevu.search.modules.kmcInputs.base.getCmsEnabledValue(); %>
            <% if(isCmsEnabled) { %>
                <% if(data.query.cmsCompressed.result.length <= 0 ){ %>
                    <div ku-container data-container-id="ku_quick_main_content_container" data-container-role="content">
                        <section ku-container data-container-id="ku_quick_main_content_left" data-container-position="left"
                            data-container-role="left">
                        </section>
                        <section ku-container data-container-id="ku_quick_main_content_center" data-container-position="center"
                            data-container-role="center">
                            <div ku-block data-block-id="ku_quick_no_result_items">
                                <%=helper.render('noResultsFoundQuick',scope) %>
                            </div>
                        </section>
                        <section ku-container data-container-id="ku_quick_main_content_right" data-container-position="right"
                            data-container-role="right">
                        </section>
                    </div>
                <% } %>
            <% } else { %>
                <div ku-container data-container-id="ku_quick_main_content_container" data-container-role="content">
                    <section ku-container data-container-id="ku_quick_main_content_left" data-container-position="left"
                        data-container-role="left">
                    </section>
                    <section ku-container data-container-id="ku_quick_main_content_center" data-container-position="center"
                        data-container-role="center">
                        <div ku-block data-block-id="ku_quick_no_result_items">
                            <%=helper.render('noResultsFoundQuick',scope) %>
                        </div>
                    </section>
                    <section ku-container data-container-id="ku_quick_main_content_right" data-container-position="right"
                        data-container-role="right">
                    </section>
                </div>
            <% } %>
        <% } %>
    <% } else { %>        
    <% } %>
</script>

<script type="template/klevu" id="klevuQuickProductBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
    %>
    <li ku-product-block class="klevuProduct" data-id="<%=dataLocal.id%>">
        <a target="_self" href="<%=dataLocal.url%>" data-id="<%=dataLocal.id%>"  class="klevuQuickProductInnerBlock trackProductClick">
            <div class="klevuProductItemTop">
                <div class="klevuQuickImgWrap">
                    <div class="klevuQuickDiscountBadge"><strong><%=dataLocal.stickyLabelHead%></strong></div>
                    <img src="<%=dataLocal.image%>" origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=updatedProductName%>" />
                </div>
            </div>
            <div class="klevuProductItemBottom">
                <div class="klevuQuickProductDescBlock">
                    <div title="<%= updatedProductName %>" class="klevuQuickProductName kuClippedOne"> <%= updatedProductName %> </div>
                    <div class="klevu-desc-l2 kuClippedOne"> <%=dataLocal.shortDesc%> </div>
                    <div class="klevuQuickProductDesc kuClippedOne">
                        <div class="klevuSpectxt"><%=dataLocal.summaryAttribute%><span><%=dataLocal.stickyLabelText%></span></div>
                    </div>
                    <% if(dataLocal.inStock && dataLocal.inStock != "yes") { %>
                        <%=helper.render('quickProductStock', scope, data, dataLocal) %>              
                    <% } else { %>
                    <% if(klevu.search.modules.kmcInputs.base.getShowPrices()) { %>
                        <div class="klevuQuickProductPrice kuClippedOne">
                            <%
                                var kuTotalVariants = klevu.dom.helpers.cleanUpPriceValue(dataLocal.totalVariants);
                                var kuStartPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.startPrice,dataLocal.currency);
                                var kuSalePrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.salePrice,dataLocal.currency);
                                var kuPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.price,dataLocal.currency);
                            %>
                            <% if(!Number.isNaN(kuTotalVariants) && !Number.isNaN(kuStartPrice)) { %>                                
                                <div class="klevuQuickSalePrice kuStartPrice">
                                    <span class="klevuQuickPriceGreyText"><%=helper.translate("Starting at")%></span>
                                    <span><%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.startPrice))%></span>                                
                                </div>
                            <% } else if(!Number.isNaN(kuSalePrice) && !Number.isNaN(kuPrice) && (kuPrice > kuSalePrice)){ %>
                                <span class="klevuQuickOrigPrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                                <span class="klevuQuickSalePrice klevuQuickSpecialPrice">
                                    <%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice))%>
                                </span>
                            <% } else if(!Number.isNaN(kuSalePrice)) { %>
                                <span class="klevuQuickSalePrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice)) %>
                                </span>
                            <% } else if(!Number.isNaN(kuPrice)) { %>
                                <span class="klevuQuickSalePrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                            <% } %>
                        </div>
                        <%=helper.render('searchResultProductVATLabelQuick', scope, data, dataLocal) %>
                        <% } %>
                    <% } %>
                    <% if(dataLocal.rating && dataLocal.rating.length) { %>
                        <div class="klevu-stars-small-l2">
                            <div class="klevu-rating-l2" style="width:<%=(20*Number(dataLocal.rating))%>%;"></div>
                        </div>
                    <% } %>
                </div>
            </div>
            <div class="kuClearLeft"></div>
        </a>
         <%=helper.render('quickSearchProductAddToCart',scope,data,dataLocal) %>        
    </li>
</script>
<script type="template/klevu" id="klevuQuickPromotionBanner">
    <% var hasNoResultFound = klevu.getObjectPath(data,"modules.promotionalBanner.hasNoResultFound"); %>
    <% if(data.banners && data.banners[dataLocal] && data.banners[dataLocal].length && !hasNoResultFound) { 
        klevu.each(data.banners[dataLocal], function(index, banner){ %>
            <div class="klevu-banner-ad kuBannerContainer">
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
                    <img src="<%= banner.bannerImg %>" alt="<%= klevu.dom.helpers.getBannerAltTagText(banner) %>" />
                </a>
            </div>
        <% }); 
    } %>
</script><!-- Popular searches template for Quick Search Results -->
<script type="template/klevu" id="kuTemplatePopularSearches">
    <% if(data.popularSearches && data.popularSearches.length) { %>
        <div class="kuPopularSearchesBlock kuPreventDocumentClick">
            <div class="klevuSuggestionHeading kuPopularSearchHeading"><span class="klevuHeadingText"><%=helper.translate("Popular Searches")%></span></div>
            <div class="kuPopularSearchTerms">
                <ul>
                    <% helper.each(data.popularSearches,function(key,term){ %>
                        <% if(term && term.length) { %>
                            <li class="kuPopularSearchTerm" data-value="<%= term %>">
                                <a target="_self" href="javascript:void(0)"><%= term %></a>
                            </li>
                        <% } %>
                    <% }); %>
                </ul>    
            </div>
        </div>
    <% } %>
</script><!-- Recent searches template for Quick Search Results -->
<script type="template/klevu" id="kuTemplateRecentSearches">
    <% if(data.recentSearches && data.recentSearches.length) { %>
        <div class="kuRecentSearchesBlock kuPreventDocumentClick">
            <div class="klevuSuggestionHeading kuRecentSearchHeading"><span class="klevuHeadingText"><%=helper.translate("Recent Searches")%></span></div>
            <div class="kuRecentSearchTerms">
                <ul>
                    <% helper.each(data.recentSearches,function(key,term){ %>
                        <% if(term && term.length) { %>
                            <li class="kuRecentSearchTerm" data-value="<%= term %>">
                                <a target="_parent" href="javascript:void(0)"><%= term %></a>
                            </li>
                        <% } %>
                    <% }); %>
                </ul>    
            </div>
        </div>
    <% } %>
</script><!-- Product block template for Trending products in Quick Search Results -->

<script type="template/klevu" id="klevuQuickTrendingProductBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
    %>
    <a target="_self" href="<%=dataLocal.url%>" data-id="<%=dataLocal.id%>" class="klevuQuickProductInnerBlock kuTrackPersonalizedProductClick kuQSMenuItemTarget kuTrackRecentView">
        <div class="klevuProductItemTop">
            <div class="klevuQuickImgWrap">
                <div class="klevuQuickDiscountBadge"><strong><%=dataLocal.stickyLabelHead%></strong></div>
                <img src="<%=dataLocal.image%>" origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=updatedProductName%>" />
            </div>
        </div>
        <div class="klevuProductItemBottom">
            <div class="klevuQuickProductDescBlock">
                <div class="klevuQuickProductName kuClippedOne" title="<%= updatedProductName %>"><%= updatedProductName %></div>
                <div class="klevuQuickProductDesc">
                    <div class="klevuSpectxt"><%=dataLocal.summaryAttribute%><span><%=dataLocal.stickyLabelText%></span></div>
                </div>                
            </div>
        </div>        
    </a>    
</script><!-- Trending products template for Quick Search Results -->
<script type="template/klevu" id="klevuTrendingProducts">
    <% 
        var trendingProductsTitle = klevu.getObjectPath(data,"modules.trendingProducts.title"); 
        trendingProductsTitle = (trendingProductsTitle) ? trendingProductsTitle : "";
    %>
    <% if(data.query.trendingProductList) { %>
        <% if(data.query.trendingProductList.result.length > 0 ) { %>
            <div class="klevuResultsBlock kuPreventDocumentClick kuRecommendationSlider">
                <div class="klevuSuggestionHeading">
                    <span class="klevuHeadingText"><%= helper.translate(trendingProductsTitle) %></span>
                </div>
                <div class="klevuQuickSearchResults klevuQuickSearchTrendingResults" data-section="trendingProductList" data-source="trendingProducts" id="trendingProductList">
                    <div class="kuCarousel kuTrendingProductsCarousel">
                        <div class="nav nav-left">
                            <div class="ion-chevron-left kuCarousel-arrow-icon-left"></div>
                        </div>
                        <div class="kuCarousel-content">
                            <% helper.each(data.query.trendingProductList.result,function(key,product){ %>
                                <div class="klevuProduct kuQSMenuItem kuSlide" id="<%= (key + 1) %>" ku-product-block
                                    data-id="<%=product.id%>">
                                    <%=helper.render('klevuQuickTrendingProductBlock',scope,data,product) %>
                                </div>
                            <% }); %>
                        </div>
                        <div class="nav nav-right">
                            <div class="ion-chevron-right kuCarousel-arrow-icon-right"></div>
                        </div>
                    </div>
                </div>
            </div>
        <% } %>
    <% } %>
</script><!-- Product block template for Recently viewed products in Quick Search Results -->

<script type="template/klevu" id="klevuQuickRecentViewedProductBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
    %>
    <a target="_self" href="<%=dataLocal.url%>" data-id="<%=dataLocal.id%>" class="klevuQuickProductInnerBlock kuTrackPersonalizedProductClick kuTrackRecentView kuQSMenuItemTarget">
        <div class="klevuProductItemTop">
            <div class="klevuQuickImgWrap">
                <div class="klevuQuickDiscountBadge"><strong><%=dataLocal.stickyLabelHead%></strong></div>
                <img src="<%=dataLocal.image%>" origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=updatedProductName%>" />
            </div>
        </div>
        <div class="klevuProductItemBottom">
            <div class="klevuQuickProductDescBlock">
                <div class="klevuQuickProductName kuClippedOne" title="<%= updatedProductName %>"><%= updatedProductName %></div>
                <div class="klevuQuickProductDesc">
                    <div class="klevuSpectxt"><%=dataLocal.summaryAttribute%><span><%=dataLocal.stickyLabelText%></span></div>
                </div>               
            </div>
        </div>       
    </a>
</script>
<!-- Recent viewed products template for Quick Search Results -->

<script type="template/klevu" id="klevuRecentViewedProducts">
    <% 
        var recentlyViewedProductsTitle = klevu.getObjectPath(data,"modules.recentlyViewedProducts.title"); 
        recentlyViewedProductsTitle = (recentlyViewedProductsTitle) ? recentlyViewedProductsTitle : "";
    %>
    <% if(data.query.recentViewedProductList) { %>
        <% if(data.query.recentViewedProductList.result.length > 0 ) { %>
            <div class="klevuResultsBlock kuPreventDocumentClick kuRecommendationSlider">
                <div class="klevuSuggestionHeading">
                    <span class="klevuHeadingText"><%= helper.translate(recentlyViewedProductsTitle) %></span>
                </div>
                <div class="klevuQuickSearchResults klevuQuickSearchRecentResults" data-section="recentViewedProductList" data-source="recentlyClickedProducts" id="recentViewedProductList">
                    <div class="kuCarousel kuRecentlyViewedProductsCarousel">
                        <div class="nav nav-left">
                            <div class="ion-chevron-left kuCarousel-arrow-icon-left"></div>
                        </div>
                        <div class="kuCarousel-content">
                            <% helper.each(data.query.recentViewedProductList.result,function(key,product){ %>
                                <div class="klevuProduct kuQSMenuItem kuSlide" id="<%= (key + 1) %>" ku-product-block data-id="<%=dataLocal.id%>">
                                    <%=helper.render('klevuQuickRecentViewedProductBlock',scope,data,product) %>
                                </div>
                            <% }); %>
                        </div>
                        <div class="nav nav-right">
                            <div class="ion-chevron-right kuCarousel-arrow-icon-right"></div>
                        </div>
                    </div>
                </div>
            </div>
        <% } %>
    <% } %>
</script><!-- No Results Found template for Quick Search Results -->
<script type="template/klevu" id="klevuTemplateNoResultFoundQuick">
    <div class="kuQuickSearchNoRecordFound">
        <div class="kuQuickNoResults">
            <div class="kuQuickNoResultsInner">
                <div class="kuQuickNoResultsMessage">
                    <% 
                        data.noResultsFoundMsg = data.noResultsFoundMsg.replace("======","");
                        var regExp = new RegExp("==="+data.settings.term+"===", "g");
                    %>
                    <%= helper.translate(data.noResultsFoundMsg.replace(regExp, '"<em>'+data.settings.term+'</em>"')) %>
                </div>
            </div>
        </div>
        <div class="kuDividerLine"></div>
        <%=helper.render('quickNoResultsPopularProducts', scope, data) %>
        <%=helper.render('quickNoResultsFoundBanners', scope, data) %>
        <%=helper.render('quickNoResultsPopularSearches', scope, data) %>
    </div>
</script>


<script type="template/klevu" id="klevuQuickNoResultsPopularProducts">
    <% var popularProductList = klevu.getObjectPath(data,"query.noResultsFoundPopularProductList.result");%>
    <% if(popularProductList) { %>
        <% if(popularProductList.length > 0 ) { %>
            <div class="klevuNoResultsProductsBlock">           
                <div class="klevuPopularProductsHeading"><span class="klevuQuickHeadingText"><%= helper.translate(data.quickNoResultsPopularHeading) %></span></div>                
                <div class="klevuQuickSearchNoResultsPopular" data-section="noResultsFoundPopularProductList" id="noResultsFoundPopularProductList">
                    <ul>
                        <% helper.each(popularProductList,function(key, product){ %>
                            <%=helper.render('quickNoResultsPopularProductBlock',scope,data,product) %>
                        <% }); %>
                    </ul>
                </div>
            </div>
        <% } %>
    <% } %>
</script>

<script type="template/klevu" id="klevuQuickNoResultsPopularProductBlock">
    <% 
        var updatedProductName = dataLocal.name;
        if(klevu.search.modules.kmcInputs.base.getSkuOnPageEnableValue()) {
            if(klevu.dom.helpers.cleanUpSku(dataLocal.sku)) {
                updatedProductName += klevu.dom.helpers.cleanUpSku(dataLocal.sku);
            }
        }
    %>
    <li class="klevuPopularProduct" data-id="<%=dataLocal.id%>">
        <a target="_self" href="<%=dataLocal.url%>" data-id="<%=dataLocal.id%>"  class="klevuQuickPopularProductInnerBlock trackProductClick klevuProductClick kuTrackRecentView">
            <div class="klevuPopularProductItemTop">
                <div class="klevuQuickImgWrap">
                    <div class="klevuQuickDiscountBadge"><strong><%=dataLocal.stickyLabelHead%></strong></div>
                    <img src="<%=dataLocal.image%>" origin="<%=dataLocal.image%>" onerror="klevu.dom.helpers.cleanUpProductImage(this)" alt="<%=updatedProductName%>" />
                </div>
            </div>
            <div class="klevuPopularProductItemBottom">
                <div class="klevuQuickPopularProductDescBlock">
                    <div title="<%= updatedProductName %>" class="klevuQuickProductName kuClippedOne"><%= updatedProductName %></div>
                    <div class="klevu-desc-l2 kuClippedOne"> <%=dataLocal.shortDesc%> </div>
                     <% if(dataLocal.inStock && dataLocal.inStock != "yes") { %>
                        <%=helper.render('quickProductStock', scope, data, dataLocal) %>              
                    <% } else { %>
                    <% if(klevu.search.modules.kmcInputs.base.getShowPrices()) { %>
                        <div class="klevuQuickProductPrice kuClippedOne">
                            <%
                                var kuTotalVariants = klevu.dom.helpers.cleanUpPriceValue(dataLocal.totalVariants);
                                var kuStartPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.startPrice,dataLocal.currency);
                                var kuSalePrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.salePrice,dataLocal.currency);
                                var kuPrice = klevu.dom.helpers.cleanUpPriceValue(dataLocal.price,dataLocal.currency);
                            %>
                            <% if(!Number.isNaN(kuTotalVariants) && !Number.isNaN(kuStartPrice)) { %>                                
                                <div class="klevuQuickSalePrice kuStartPrice">
                                    <span class="klevuQuickPriceGreyText"><%=helper.translate("Starting at")%></span>
                                    <span><%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.startPrice))%></span>                                
                                </div>
                            <% } else if(!Number.isNaN(kuSalePrice) && !Number.isNaN(kuPrice) && (kuPrice > kuSalePrice)){ %>
                                <span class="klevuQuickOrigPrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                                <span class="klevuQuickSalePrice klevuQuickSpecialPrice">
                                    <%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice))%>
                                </span>
                            <% } else if(!Number.isNaN(kuSalePrice)) { %>
                                <span class="klevuQuickSalePrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice)) %>
                                </span>
                            <% } else if(!Number.isNaN(kuPrice)) { %>
                                <span class="klevuQuickSalePrice">
                                    <%= helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)) %>
                                </span>
                            <% } %>
                        </div>
                        <%=helper.render('searchResultProductVATLabelQuick', scope, data, dataLocal) %>
                    <% } %>
                    <% } %>
                    <% if(dataLocal.rating && dataLocal.rating.length) { %>
                        <div class="klevu-stars-small-l2">
                            <div class="klevu-rating-l2" style="width:<%=(20*Number(dataLocal.rating))%>%;"></div>
                        </div>
                    <% } %>
                </div>
            </div>
            <div class="kuClearLeft"></div>
        </a>
         <%=helper.render('quickSearchProductAddToCart',scope,data,dataLocal) %>
    </li>
</script>

<!-- Popular searches template for Quick Search Results -->
<script type="template/klevu" id="kuQuickNoResultsPopularSearches">
    <% if(data.noResultsFoundPopularSearches && data.noResultsFoundPopularSearches.length) { %>
        <div class="kuNoResultsPopularSearchesBlock">
            <div class="kuNoResultsPopularSearchHeading"><span class="klevuQuickHeadingText"><%=helper.translate("Popular Searches")%></span></div>
            <div class="kuNoResultsPopularSearchTerms">
                <ul>
                    <% helper.each(data.noResultsFoundPopularSearches, function(key,term){ %>
                        <% if(term && term.length) { %>
                            <% 
                                var landingURLPrefix = klevu.getObjectPath(klevu.settings,"url.landing");
                                if(typeof landingURLPrefix === "undefined" || landingURLPrefix === ""){
                                    landingURLPrefix = "/";
                                }
                            %>
                            <li class="kuNoResultsPopularSearchTerm" data-value="<%= term %>">
                                <a href="<%= landingURLPrefix %>?q=<%= term %>" title="<%= term %>"><%= term %></a>                                
                            </li>
                        <% } %>
                    <% }); %>
                </ul>    
            </div>
        </div>
    <% } %>
</script>


<script type="template/klevu" id="klevuQuickNoResultsFoundBanners">
    <% 
        if(data.quickNoResultsFoundBanners && data.quickNoResultsFoundBanners.length) { 
        klevu.each(data.quickNoResultsFoundBanners, function(index, banner){ 
    %>
        <div class="klevu-no-results-banner-ad-quick">
            <a 
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
    <% }); %>
    <div class="kuDividerLine"></div>
    <%  } %>
</script>
<!--
    Search result Product stock availability label template file
-->

<script type="template/klevu" id="quickSearchResultProductStock">
    <%
        var outOfStockCaption = klevu.search.modules.kmcInputs.base.getOutOfStockCaptionValue();
        var productStockStatus =  helper.translate(outOfStockCaption);
    %>
        <div class="kuClippedOne kuQuickCaptionStockOut">
            <%= productStockStatus %>
        </div>
</script>
<!--
    Search result Product VAT label template file
-->

<script type="template/klevu" id="searchResultProductVATLabelQuick">
    <%
        var caption = klevu.search.modules.kmcInputs.base.getVatCaption();
        var vatCaption =  helper.translate("(" + caption + ")");
    %>
    <div class="kuCaptionVat"><%= vatCaption %></div>
</script>