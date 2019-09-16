# Add to cart functionality on landing page

![Search-landing color swatches](/modules/add-to-cart-landing-page/images/image001.png)

Prerequisite:
- Add color swatches base module first to use base functionalities. Base module necessary [resources](/modules/add-to-cart/resources).

You will find the necessary resources for this module available here:
[resources](/modules/add-to-cart-landing-page/resources). Please add these with the
method appropriate to your chosen framework.

# Add to cart rendering template

Add the template for rendering Add to cart for related results,
so edit the corresponding product `productblock.tpl` to add addToCart renderer template.

```html
...
<div class="kuProdBottom">
    ...

    <%=helper.render('landingPageProductAddToCart', scope, data, dataLocal) %>
</div>
...
```

Now try **search result landing add to cart**!