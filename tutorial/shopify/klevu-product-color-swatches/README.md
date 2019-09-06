# Add Color Swatches on result page Product 

Add color swatches on search landing page.

![Search-landing color swatches](/tutorial/shopify/klevu-product-color-swatches/images/image001.png)

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
So edit Snippets > `klevu-template-landing-productBlock.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
<div class="kuDesc">
<%=desc%>
...

<% if(dataLocal.swatchesInfo.length){ %>
        <div class="kuSwatches">
        <% var swatchIndex = 1; helper.each(dataLocal.swatchesInfo,function(key,item){ if(swatchIndex > 3){ return true; } %>
            <div class="kuSwatchItem"><a href="javascript:void(0)" data-variant="<%=item.variantId%>" class="kuSwatchLink klevuLandingSwatchColorGrid" title="<%=item.variantColor%>" style="background-color:<%=item.variantColor%>"></a></div>
        <% swatchIndex++; });%>
        <% if(dataLocal.swatchesInfo.length > 3){ %>
            <div class="kuSwatchItem kuSwatchMore">
                <a href="<%=dataLocal.url%>" class="kuSwatchLink">
                    <span class="kuSwatchMoreText">
                        +<%=(dataLocal.swatchesInfo.length-3)%>
                    </span>
                </a>
            </div>
        <% } %>
    </div>	
<% } %>

...
</div>
...
```

Click Save to persist your changes.

Next we need to add changes in Asset file.
So edit Assets > `klevu-landing.js`
Add color swatches by the modifying the code as below:

```html
...
klevu.search.landing.getScope().chains.template.render.add({
    name: "renderResponse",
    fire: function(data, scope) {
        if(data.context.isSuccess){            
            ...
            
            /** Initalize color swatch service */
            klevu.colorSwatchesService();
            /**	Modify product swatchesInfo data */
            klevu.search.landing.getScope().colorSwatchesService.parseProductColorSwatch(data, scope);

            ...
        }
    }
});
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the search landing color swatches**!