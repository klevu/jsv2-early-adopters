# Add Color swatches on Product Quick view 

prerequisite:
- Add [klevu-product-quick-view](/modules/product-quick-view) module.

![Quick-view color-swatches](/modules/product-quick-view-color-swatches/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-quick-view-color-swatches/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product quick view color swatch rendering template

Add the template for rendering Quick view color swatch for related product,
so edit the product quick view template file `quick-view.tpl` to add Quick view color swatch renderer template.

```html
...
<div class="productQuick-extraInfo">
    <div class="productQuick-stockStatus">
        ...
    </div>

    <%=helper.render('quickViewProductSwatch',scope,data,data.selected_product) %>

    <div class="productQuick-sizeInStock">
        ...
    </div>
</div>
...
```

Now try **Quick view color swatches**!
