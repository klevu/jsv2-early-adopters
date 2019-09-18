# Add to cart base component

This is base component for product add to cart functionality. As this is component it won't have any output on UI. It only initialize core functions. 

You will find the necessary resources for this module available here:
[resources](/components/add-to-cart/resources). Please add these with the
method appropriate to your chosen framework. 

[Base file](/components/add-to-cart/resources/assets/js/add-to-cart.js)
- Base file is for code functions

[Initialization](/components/add-to-cart/resources/assets/js/add-to-cart-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope. 

```html
    /** Initalize base component to the scope*/
    klevu.addToCart(TARGET_SCOPE);
    
    /** Usage of base component functions */
    TARGET_SCOPE.addToCart.base.FUNCTION_NAME();
```

Try accessing addToCart base module.

Modules based on extention of this component:
- [Landing page product add to cart](/modules/add-to-cart-landing-page)
- [Quick view product add to cart](/modules/product-quick-view)