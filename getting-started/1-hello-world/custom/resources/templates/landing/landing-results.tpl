<script type="template/klevu" id="klevuLandingTemplateResults">
    <div class="kuResultsListing">
        <div class="productList klevuMeta" data-section="productList">
            <div class="kuResultContent">

                <%=helper.render('filters',scope,data,"productList") %>

                <div class="kuResultWrap <%=(data.query.productList.filters.length == 0 )?'kuBlockFullwidth':''%>">

                    <%=helper.render('pagination',scope,data,"productList") %>

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
    </div>
</script>
