<script type="template/klevu" id="klevuLandingTemplateContentBlock">
    <li class="klevuProduct" data-id="<%=dataLocal.id%>">
        <div class="kuProdWrap">
            <%if(dataLocal.stickyLabelHead && dataLocal.stickyLabelHead != "") { %>
                <div class="kuDiscountBadge">
                    <span class="kuiscountTxt"><%=dataLocal.stickyLabelHead%><span><%=dataLocal.stickyLabelTail%></span></span>
                </div>
            <% } %>
            <div class="kuProdTop">
                <% if(dataLocal["image"] != undefined && dataLocal.image !== "") { %>
                <div class="klevuImgWrap">
                    <a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><span class="kuprodImgSpan"><img src="<%=dataLocal.image%>" alt="<%=dataLocal.name%>" class="kuProdImg"></span></a> </div>
                <% } %>
                </div>
                <% var desc = [dataLocal.summaryAttribute,dataLocal.packageText,dataLocal.summaryDescription].filter(function(el) { return el; }); desc = desc.join(" "); %>
            <div class="kuProdBottom">
                <div class="kuNameDesc">
                      <div class="kuName"><a target="_self" href="<%=dataLocal.url%>" class="klevuProductClick"><%=dataLocal.name%></a></div>
                      <div class="kuDesc"><%=desc%></div>
                </div>
            </div>
            <div class="kuClearLeft"></div>
        </div>
    </li>
</script>
