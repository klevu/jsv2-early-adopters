# Add to Cart - Quick Search Results

>**Prerequisite:**  
>Module below uses [add-to-cart](/components/add-to-cart) base component. Before starting the implementation of the module, add base component files and include initialization.  

![Search-quick add-to-cart](/modules/add-to-cart/images/image002.png)

This module extends the `add-to-cart` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/add-to-cart/resources).
- [This module's resources](/modules/add-to-cart/quick/resources).

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


### Code Reference

[klevu-add-to-cart.js](/components/add-to-cart/resources/assets/js/klevu-add-to-cart.js)
contains your framework-specific functionality to connect add to cart to your chosen framework.

[klevu-quick-add-to-cart.js](/modules/add-to-cart/quick/resources/assets/js/klevu-quick-add-to-cart.js)
connects the base component to your quick search results implementation and show how to enable the base component for your targeted scope.