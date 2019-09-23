# Add to Cart - Search Results Landing Page

![Search-landing color swatches](/modules/add-to-cart/images/image001.png)

This module extends the [add-to-cart](/components/add-to-cart) component.
You need to add the prerequisites in addition to this module's resources:

- [Base Component resources](/components/add-to-cart/resources).
- [This module resources](/modules/add-to-cart/landing/resources).

If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial.

## Template Modifications

Modify `landing-product-block.tpl`, to add your button to your preferred location.

```html
...
<div class="kuProdBottom">
    ...

    <%=helper.render('landingPageProductAddToCart', scope, data, dataLocal) %>
</div>
...
```

## Code Reference

[add-to-cart.js](/components/add-to-cart/resources/assets/js/add-to-cart.js)
This file contains your framework-specific functionality to connect add to cart to your chosen framework.

[add-to-cart-landing.js](/modules/add-to-cart/landing/resources/assets/js/add-to-cart-landing.js)
This file connects the base component to your search results landing page implementation.

[add-to-cart-initialize.js](/components/add-to-cart/resources/assets/js/add-to-cart-initialize.js)
[add-to-cart-landing-script.js](/modules/add-to-cart/landing/resources/assets/js/add-to-cart-landing-script.js)
These files show how to enable the base component for your targeted scope (ie. quick and/or landing).
