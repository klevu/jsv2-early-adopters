# Color Swatches - Landing Page Product Quick View

>**Prerequisite:**  
> This module extends [Product Quick View](/modules/product-quick-view) module.  
> This module requires the [colorSwatches](/components/color-swatches) base component.   

![Quick-view color-swatches](/modules/color-swatches/images/image002.png)

This module extends the `color-swatches` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/color-swatches/resources).
- [This module's resources](/modules/color-swatches/quick-view/resources).

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

### Code Reference

[klevu-color-swatches.js](/components/color-swatches/resources/assets/js/klevu-color-swatches.js)
contains your framework-specific functionality to connect color swatches to your chosen framework.  

[klevu-quick-view-color-swatches.js](/modules/color-swatches/quick-view/resources/assets/js/klevu-quick-view-color-swatches.js)  
connects the base component to your search results landing page product quick view implementation
and show how to enable the base component for your targeted scope.  