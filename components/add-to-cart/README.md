# Add to Cart - Base Component

>**Note:**  
>This is a base component for product add to cart functionality.
>It won't have any output on user interface. It only initializes core functions.  

You will find the necessary resources for this module available here:
[resources](/components/add-to-cart/resources). Please add these with the
method appropriate to your chosen framework. 

[Base file](/components/add-to-cart/resources/assets/js/klevu-add-to-cart.js) contains the core logic of the functionality.

Below code snippet is to show, how to initialize and use base component into the relevant scope.

```javascript
/** Initalize base component to the scope*/
klevu.addToCart(TARGET_SCOPE);

/** Usage of base component functions */
TARGET_SCOPE.addToCart.base.FUNCTION_NAME();
```

Try accessing addToCart base component.

**Reference modules based on this component:**
- [Landing page product add to cart](/modules/add-to-cart/landing)
- [Quick search result products add to cart](/modules/add-to-cart/quick)
- [Quick view product add to cart](/modules/product-quick-view)