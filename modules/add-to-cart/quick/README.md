# Add to Cart - Quick Search Results

![Search-quick add-to-cart](/modules/add-to-cart/images/image002.png)

This module extends the `add-to-cart` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/add-to-cart/resources).
- [This module's resources](/modules/add-to-cart/landing/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Template Modifications

Modify `klevu-template-quick-productBlock.tpl` to add the 'Add to Cart' button in your preferred location.

```html
<li class="klevuProduct">
    ...

    <%=helper.render('quickSearchProductAddToCart',scope,data,dataLocal) %>
</li>
```

## Code Reference

[add-to-cart.js](/components/add-to-cart/resources/assets/js/add-to-cart.js)
contains your framework-specific functionality to connect add to cart to your chosen framework.

[add-to-cart-quick.js](/modules/add-to-cart/quick/resources/assets/js/add-to-cart-quick.js)
connects the base component to your quick search results implementation.

[quick-add-to-cart-initialize.js](/components/add-to-cart/resources/assets/js/quick-add-to-cart-initialize.js)
and [add-to-cart-quick-script.js](/modules/add-to-cart/quick/resources/assets/js/add-to-cart-quick-script.js)
show how to enable the base component for your targeted scope.