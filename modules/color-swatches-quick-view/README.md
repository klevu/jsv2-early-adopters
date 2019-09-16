# Add Color swatches on Product Quick view 

![Quick-view color-swatches](/modules/color-swatches-quick-view/images/image001.png)

Prerequisite:
- Add color swatches base module first to use base functionalities. Base module necessary [resources](/modules/color-swatches/resources).

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches-quick-view/resources). Please add these with the
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
