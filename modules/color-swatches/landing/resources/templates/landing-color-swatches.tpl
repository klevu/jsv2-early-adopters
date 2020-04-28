<!--
    Color swatch template for landing page products
-->

<script type="template/klevu" id="landingPageProductColorSwatches">
    <% if(dataLocal.swatchesInfo && dataLocal.swatchesInfo.length){ %>
        <div class="kuSwatches">
           <% var swatchIndex = 1; helper.each(dataLocal.swatchesInfo,function(key,item){ if(swatchIndex > 3){ return true; } %>
               <div class="kuSwatchItem"> <a target="_self" href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuLandingSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
           <% swatchIndex++; });%>
           <% if(dataLocal.swatchesInfo.length > 3){ %>
               <div class="kuSwatchItem kuSwatchMore">
                    <a target="_self" href="<%=dataLocal.url%>" class="kuSwatchLink">
                       <span class="kuSwatchMoreText">
                           +<%=(dataLocal.swatchesInfo.length-3)%>
                       </span>
                   </a>
               </div>
           <% } %>
       </div>	
   <% } %>
</script>