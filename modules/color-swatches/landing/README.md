# Color Swatches - Search Results Landing Page

> **Prerequisite:**  
> This module requires the [colorSwatches](/components/color-swatches) base component.  

![Search-landing color swatches](/modules/color-swatches/images/image001.png)

This module extends the `color-swatches` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/color-swatches/resources).
- [This module's resources](/modules/color-swatches/landing/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Template Modifications

Add the template for rendering color swatch for related results,
so edit the corresponding `landing-product-block.tpl` to add color swatch renderer template.

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

### Code Reference

[klevu-color-swatches.js](/components/color-swatches/resources/assets/js/klevu-color-swatches.js)
contains your framework-specific functionality to connect color swatches to your chosen framework.  

[klevu-landing-color-swatches.js](/modules/color-swatches/landing/resources/assets/js/klevu-landing-color-swatches.js)  
connects the base component to your search results landing page implementation
and show how to enable the base component for your targeted scope. 