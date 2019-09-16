<!--
    Search result Product badge template file
-->

<script type="template/klevu" id="searchResultProductBadge">
    <%if(dataLocal.badgeLabel && dataLocal.badgeLabel != "") { %>
        <div class="kuDiscountBadge"><span class="kuDiscountTxt"><%=dataLocal.badgeLabel%></span></div>
    <% } %>
</script>