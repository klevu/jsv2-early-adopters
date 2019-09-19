# Add to cart functionality on landing page

![Search-landing color swatches](/modules/add-to-cart-landing-page/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/add-to-cart-landing-page/resources). Please add these with the
method appropriate to your chosen framework.

This module will extend the [addToCart](/components/add-to-cart) component. So, you need to first add the below prerequisites first and then add the module resources.

[Extend base for landing page](/modules/add-to-cart-landing-page/resources/assets/js/add-to-cart-landing-page.js)
- In this file, it extends the base component and add functions related to landing page functionality.

[Landing page implementation](/modules/add-to-cart-landing-page/resources/assets/js/landing-page-cart-script.js)
- In this file it has the code for adding functionality to landing page as well as usage of component extension.

```html
/** Initialization of component extension */
klevu.addToCartLanding(TARGET_SCOPE);

/** Usage of extension method */
TARGET_SCOPE.addToCart.landing.FUNCTION_NAME();
```

## Prerequisite
This module has a dependecy of [addToCart](/components/add-to-cart) component. To add the base component add necessary [resources](/components/add-to-cart/resources).

[Base file](/components/add-to-cart/resources/assets/js/add-to-cart.js)
- Base file is for code functions

[Initialization](/components/add-to-cart/resources/assets/js/add-to-cart-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope.

## Add to cart rendering template

Add the template for rendering Add to cart for related results,
so edit the corresponding `landing-product-block.tpl` to add addToCart renderer template.

```html
...
<div class="kuProdBottom">
    ...

    <%=helper.render('landingPageProductAddToCart', scope, data, dataLocal) %>
</div>
...
```

Now try **search result landing add to cart**!