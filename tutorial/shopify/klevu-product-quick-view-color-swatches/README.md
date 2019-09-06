# Add Color swatches on Product Quick view 

Add Color swatches on Product Quick view.

![Quick-view color-swatches](/tutorial/shopify/klevu-product-quick-view-color-swatches/images/image001.png)

prerequisite:
- Add [klevu-product-quick-view](/tutorial/shopify/klevu-product-quick-view) module.

Now add color swatches in the Quick view UI.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-color-swatches-service.js`.
- Assets > Add a new Asset > Upload `klevu-color-swatches.css`.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-color-swatches-service.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-color-swatches-service.js' | asset_url }}"></script>
<script src="{{ 'klevu-product-quick-view.js' | asset_url }}"></script>
...

```

Include `klevu-color-swatches.css` by modifying the contents like this:

```html
...
{{ 'klevu-color-swatches.css' | asset_url | stylesheet_tag }}
...

```

Click Save to persist your changes.

Next we need to add changes in Quick view UI file.
So edit Snippets > `klevu-template-product-quick-view.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
<div class="productQuick-extraInfo">
    <div class="productQuick-stockStatus">
        ...
    </div>

    <% var swatchesInfoList = data.selected_product.swatchesInfo; var quickViewSwatchIndex = 1; %>
    <% if(swatchesInfoList.length){ %>
        <div class="productQuick-colorInStock">
            <span class="productQuick-label"><%=helper.translate("Color Variants:") %></span>
            <div class="kuSwatches">
                <% helper.each(swatchesInfoList,function(key,item){ if(quickViewSwatchIndex > 3){ return true;} %>
                    <div class="kuSwatchItem"><a href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
                <% quickViewSwatchIndex++; });%>
                <% if(swatchesInfoList.length > 3){ %>
                    <div class="kuSwatchItem kuSwatchMore">
                        <a href="<%=data.selected_product.url%>" class="kuSwatchLink">
                            <span class="kuSwatchMoreText">
                                +<%=(swatchesInfoList.length-3)%>
                            </span>
                        </a>
                    </div>
                <% } %>
            </div>								
        </div>
    <% } %>

    <div class="productQuick-sizeInStock">
        ...
    </div>
</div>
...
```

Click Save to persist your changes.

Next we need to add changes in Asset file.
So edit Assets > `klevu-product-quick-view.js`
Add color swatches by the modifying the code as below:

```html
...
klevu.addToCartService();

/** Initalize color swatch service */
klevu.colorSwatchesService();

...

klevu.search.landing.getScope().addToCartService.bindAddToCartEvent();
klevu.search.landing.getScope().colorSwatchesService.bindColorGridEvents();
...

...
klevu.search.landing.getScope().colorSwatchesService.parseProductColorSwatch(data, scope);
klevu.search.landing.getScope().quickViewService.landingPageTemplateOnLoadEvent(data, scope);
...

```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Quick view color swatches**!

