<!--
    Search result Product stock availability label template file
-->

<script type="template/klevu" id="searchResultProductStock">
    <% var productStockStatus = (dataLocal.inStock == "yes") ? "In stock" : "Out of stock" %>
    <div class="<%=(dataLocal.inStock == 'yes') ? 'kuCaptionStockIn' : 'kuCaptionStockOut'%>">
    	<%= productStockStatus %>
    </div>
</script>