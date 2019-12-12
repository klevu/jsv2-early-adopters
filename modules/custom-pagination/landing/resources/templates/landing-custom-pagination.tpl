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
