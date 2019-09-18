<script type="template/klevu" id="klevuQuickTemplateBase">
    <div class="klevu-fluid">
        <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
            <div class="klevuSuggestionsBlock">
                <%=helper.render('klevuQuickAutoSuggestions',scope) %>
                <%=helper.render('klevuQuickPageSuggestions',scope) %>
                <%=helper.render('klevuQuickCategorySuggestions',scope) %>
            </div>
            <%=helper.render('klevuQuickProducts',scope) %>
        </div>
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
                        <li><a href="<%=helper.buildUrl(data.settings.landingUrl,'q' , helper.stripHtml(suggestion.suggest))%>" data-content="<%=helper.stripHtml(suggestion.suggest) %>" class="klevu-track-click"> <%=suggestion.suggest %> </a></li>
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
                        <li><a href="<%=cms.url%>"><%=cms.name%></a></li>
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
                        <li><a href="<%=category.url%>"><%=category.name%></a></li>
                    <% }); %>
                </ul>
            </div>
        <% } %>
    <% } %>
</script>


<script type="template/klevu" id="klevuQuickProducts">
    <% if(data.query.productList) { %>
        <% if(data.query.productList.result.length > 0 ) { %>
            <div class="klevuResultsBlock">
                <div class="klevuSuggestionHeading"><span class="klevuHeadingText"><%=helper.translate("Products")%></span></div>
                <div class="klevuQuickSearchResults" id="productsList">
                    <div class="klevuProductsViewAll">
                        <a href="<%=helper.buildUrl(data.settings.landingUrl,'q',helper.stripHtml(data.settings.term))%>" target="_parent"><%=helper.translate("View All")%></a>
                    </div>
                    <ul>
                      <% helper.each(data.query.productList.result,function(key,product){ %>
                          <%=helper.render('klevuQuickProductBlock',scope,data,product) %>
                      <% }); %>
                    </ul>
                </div>
            </div>
        <% } else { %>
            <%=helper.render('klevuQuickNoResultFound',scope) %>
        <% } %>
    <% } else { %>
        <%=helper.render('klevuQuickNoResultFound',scope) %>
    <% } %>
</script>


<script type="template/klevu" id="klevuQuickProductBlock">
    <li class="klevuProduct" data-id="<%=dataLocal.id%>">
        <a href="<%=dataLocal.url%>" class="klevuQuickProductInnerBlock trackProductClick">
            <div class="klevuProductItemTop">
                <div class="klevuQuickImgWrap">
                    <div class="klevuQuickDiscountBadge"><strong><%=dataLocal.stickyLabelHead%></strong></div>
                    <img src="<%=dataLocal.image%>" alt="<%=dataLocal.name%>" />
                </div>
            </div>
            <div class="klevuProductItemBottom">
                <div class="klevuQuickProductDescBlock">
                    <div class="klevuQuickProductName"><%=dataLocal.name%></div>
                    <div class="klevuQuickProductDesc">
                        <div class="klevuSpectxt"><%=dataLocal.summaryAttribute%><span><%=dataLocal.stickyLabelText%></span></div>
                    </div>
                    <div class="klevuQuickProductPrice">
                        <% if(dataLocal.ondiscount && dataLocal.ondiscount == "true") { %>
                            <% if(dataLocal.salePrice ) { %>
                                <span class="klevuQuickSalePrice klevuQuickSpecialPrice">
                                    <%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice))%>
                                </span>
                            <% } %>
                            <% if(dataLocal.price) { %>
                                <span class="klevuQuickOrigPrice"><%=helper.translate("Original price %s",helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.price)))%></span>
                            <% } %>
                        <% } else { %>
                            <% if(dataLocal.salePrice ) { %>
                                <span class="klevuQuickSalePrice">
                                    <span class="klevuQuickPriceGreyText"></span>
                                    <%=helper.processCurrency(dataLocal.currency,parseFloat(dataLocal.salePrice))%>
                                </span>
                            <% } %>
                        <% } %>
                    </div>
                </div>
            </div>
            <div class="klevuClearLeft"></div>
        </a>
    </li>
</script>


<script type="template/klevu" id="klevuQuickNoResultFound">
    <div class="klevuQuickNoResults">
        <div class="klevuQuickNoResultsInner">
            <div class="klevuQuickNoResultsMessage">We're Sorry, No result found for term '<span><%=data.settings.termOriginal%></span>'.</div>          
        </div>
    </div>
</script>


