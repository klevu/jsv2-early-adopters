# Add Color Swatches on result page Product 

![Search-landing color swatches](/modules/product-color-swatches/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-color-swatches/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product color swatch rendering template

Add the template for rendering color swatch for related results,
so edit the corresponding product `productblock.tpl` to add color swatch renderer template.

```html
...
<div class="kuDesc">
<%=desc%>
...

<%=helper.render('landingProductSwatch',scope,data,dataLocal) %>

...
</div>
...
```


Now try **search result landing color swatches**!