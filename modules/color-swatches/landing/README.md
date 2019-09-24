# Color Swatches - Search Results Landing Page

>**Prerequisite:**  
>This module has a dependecy of [colorSwatches](/components/color-swatches) component. To add the base component add necessary [resources](/components/color-swatches/resources).  
>[Base file](/components/color-swatches/resources/assets/js/klevu-color-swatches.js) contains the core logic of the functionality.  


![Search-landing color swatches](/modules/color-swatches/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches/landing/resources). Please add these with the
method appropriate to your chosen framework.

This module will extend the [colorSwatches](/components/color-swatches) component. So, you need to first add the below prerequisites first and then add the module resources.

[klevu-landing-color-swatches.js](/modules/color-swatches/landing/resources/assets/js/klevu-landing-color-swatches.js)
- In this file, it extends the base component and add functions related to landing page functionality. Also, it has the code for adding functionality to the landing page as well as the usage of component extension.


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