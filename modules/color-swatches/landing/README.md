# Color Swatches - Search Results Landing Page

![Search-landing color swatches](/modules/color-swatches/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches/landing/resources). Please add these with the
method appropriate to your chosen framework.

This module will extend the [colorSwatches](/components/color-swatches) component. So, you need to first add the below prerequisites first and then add the module resources.

[Extend base for landing page](/modules/color-swatches/landing/resources/assets/js/color-swatches-landing.js)
- In this file, it extends the base component and add functions related to landing page functionality.

[Landing page implementation](/modules/color-swatches/landing/resources/assets/js/color-swatches-landing-script.js)
- In this file it has the code for adding functionality to landing page as well as usage of component extension.

## Prerequisite

This module has a dependecy of [colorSwatches](/components/color-swatches) component. To add the base component add necessary [resources](/components/color-swatches/resources).

[Base file](/components/color-swatches/resources/assets/js/color-swatches.js)
- Base file contains the core functionality of module

[Initialization](/components/color-swatches/resources/assets/js/landing-color-swatches-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope.

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

Now try **search result landing color swatches**!