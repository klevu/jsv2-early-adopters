<!-- Trending products template for Quick Search Results -->

<script type="template/klevu" id="klevuTrendingProducts">
    <% if(data.query.trendingProductList) { %>
        <% if(data.query.trendingProductList.result.length > 0 ) { %>
            <div class="klevuResultsBlock">
                <div class="klevuSuggestionHeading"><span class="klevuHeadingText"><%=helper.translate("Trending Products")%></span></div>
                <div class="klevuQuickSearchResults" data-section="trendingProductList" id="trendingProductList">
                    <ul>
                      <% helper.each(data.query.trendingProductList.result,function(key,product){ %>
                          <%=helper.render('klevuQuickTrendingProductBlock',scope,data,product) %>
                      <% }); %>
                    </ul>
                </div>
            </div>
        <% } %>
    <% } %>
</script>
