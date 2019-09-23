# Add Color swatches on Product Quick view 

![Quick-view color-swatches](/modules/color-swatches/quick-view/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches/quick-view/resources). Please add these with the
method appropriate to your chosen framework. 

This module is based on [Product Quick View](/modules/product-quick-view) module.

For color swatches,
[Extend base for Quick view](/modules/color-swatches/quick-view/resources/assets/js/color-swatches-quick-view.js)
- In this file, it extends the base component and add functions related to quick view functionality.

[Quick view implementation](/modules/color-swatches/quick-view/resources/assets/js/color-swatches-quick-view-script.js)
- In this file it has the code for adding functionality to quick view as well as usage of component extension.

## Prerequisite

Before adding this module, first add [Product Quick View](/modules/product-quick-view) module.

In addition, this module has a dependecy of [colorSwatches](/components/color-swatches) component. To add the base component add necessary [resources](/components/color-swatches/resources).

[Base file](/components/color-swatches/resources/assets/js/color-swatches.js)
- Base file is for code functions

[Initialization](/components/color-swatches/resources/assets/js/color-swatches-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope.

## Add product quick view color swatch rendering template

Add the template for rendering Quick view color swatch for related product,
so edit the product quick view template file `product-quick-view.tpl` to add Quick view color swatch renderer template.

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
