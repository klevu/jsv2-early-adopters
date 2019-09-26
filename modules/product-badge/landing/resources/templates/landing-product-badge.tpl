<!--
    Search result Product badge template file
-->
<script type="template/klevu" id="searchResultProductBadge">
    <%if(dataLocal.sku && dataLocal.sku != "") { %>
        <div class="kuDiscountBadge"><span class="kuDiscountTxt"><%=dataLocal.sku%></span></div>
    <% } %>
</script>