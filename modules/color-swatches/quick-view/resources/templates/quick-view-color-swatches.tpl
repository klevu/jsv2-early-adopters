<!--
    Color swatch for Product Quick view. 
-->

<script type="template/klevu" id="quickViewProductColorSwatches">
    <% var swatchesInfoList = dataLocal.swatchesInfo; var quickViewSwatchIndex = 1; %>
    <% if(swatchesInfoList && swatchesInfoList.length){ %>
        <div class="productQuick-colorInStock">
            <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>								
            <div class="kuSwatches">
                <% helper.each(swatchesInfoList,function(key,item){ if(quickViewSwatchIndex > 3){ return true;} %>
                    <div class="kuSwatchItem"> <a target="_self" href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
                <% quickViewSwatchIndex++; });%>
                <% if(swatchesInfoList.length > 3){ %>
                    <div class="kuSwatchItem kuSwatchMore">
                         <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
                            <span class="kuSwatchMoreText">
                                +<%=(swatchesInfoList.length-3)%>
                            </span>
                        </a>
                    </div>
                <% } %>
            </div>								
        </div>
    <% } %>
</script>


