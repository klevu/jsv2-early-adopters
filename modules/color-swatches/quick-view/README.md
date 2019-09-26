# Color Swatches - Landing Page Product Quick View

>**Prerequisite:**  
>Before adding this module, first add [Product Quick View](/modules/product-quick-view) module.  
>This module has a dependecy of [colorSwatches](/components/color-swatches) component. To add the base component add necessary [resources](/components/color-swatches/resources).  
>[Base file](/components/color-swatches/resources/assets/js/klevu-color-swatches.js) contains the core logic of the functionality.  

![Quick-view color-swatches](/modules/color-swatches/images/image002.png)

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches/quick-view/resources). Please add these with the
method appropriate to your chosen framework.

For color swatches,
[klevu-quick-view-color-swatches.js](/modules/color-swatches/quick-view/resources/assets/js/klevu-quick-view-color-swatches.js)  
In this file, it extends the base component and add functions related to quick view functionality. Also, it has the code for adding functionality to quick view as well as usage of component extension.

## Template Modifications

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
