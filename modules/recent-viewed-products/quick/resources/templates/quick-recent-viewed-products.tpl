<!-- Recent viewed products template for Quick Search Results -->

<script type="template/klevu" id="klevuRecentViewedProducts">
    <% if(data.query.recentViewedProductList) { %>
        <% if(data.query.recentViewedProductList.result.length > 0 ) { %>
            <div class="klevuResultsBlock">
                <div class="klevuSuggestionHeading">
                    <span class="klevuHeadingText"><%=helper.translate("Recently Viewed Products")%></span>
                </div>
                <div class="klevuQuickSearchResults" data-section="recentViewedProductList" id="recentViewedProductList">
                    <ul>
                      <% helper.each(data.query.recentViewedProductList.result,function(key,product){ %>
                          <%=helper.render('klevuQuickRecentViewedProductBlock',scope,data,product) %>
                      <% }); %>
                    </ul>
                </div>
            </div>
        <% } %>
    <% } %>
</script>
