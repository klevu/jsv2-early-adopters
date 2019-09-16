# Add Color swatches for landing page

![Search-landing color swatches](/modules/color-swatches-landing-page/images/image001.png)

Prerequisite:
- Add color swatches base module first to use base functionalities. Base module necessary [resources](/modules/color-swatches/resources).

You will find the necessary resources for this module available here:
[resources](/modules/color-swatches-landing-page/resources). Please add these with the
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