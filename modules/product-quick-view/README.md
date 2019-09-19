# Add Product Quick View with Klevu Template

![Quick-view product-grid](/modules/product-quick-view/images/product-grid.png) 

![Quick-view template](/modules/product-quick-view/images/product-quick-view.png) 

You will find the necessary resources for this module available here:
[resources](/modules/product-quick-view/resources). Please add these with the
method appropriate to your chosen framework. 

This module will extend the [addToCart](/components/add-to-cart) component. So, you need to first add the below prerequisites first and then add the module resources.

[Extend base for Quick view](/modules/product-quick-view/resources/assets/js/add-to-cart-quick-view.js)
- In this file, it extends the base component and add functions related to quick view functionality.

[Quick view implementation](/modules/product-quick-view/resources/assets/js/klevu-product-quick-view.js)
- In this file it has the code for adding functionality to quick view as well as usage of component extension.

## Prerequisite
This module has a dependecy of [addToCart](/components/add-to-cart) component. To add the base component add necessary [resources](/components/add-to-cart/resources).

[Base file](/components/add-to-cart/resources/assets/js/add-to-cart.js)
- Base file is for code functions

[Initialization](/components/add-to-cart/resources/assets/js/add-to-cart-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope.

```html
/** Initialize base component */
klevu.addToCart(TARGET_SCOPE);

/** Usage of base component functions */
TARGET_SCOPE.addToCart.base.FUNCTION_NAME();
```

## Add product quick view rendering template

Add the template for rendering Quick view for related results,
so edit the corresponding `landing-product-block.tpl` to add Quick view renderer template.

```html
...
<div class="kuProdTop">
    ...
    <div class="kuQuickView">
        <button data-id="<%=dataLocal.id%>" class="kuQuickViewBtn">Quick view</button>
    </div>
</div>
...
```

Now, try **Quick view**!
