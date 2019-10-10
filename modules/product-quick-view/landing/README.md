# Product Quick View - Search Results Landing Page

>**Prerequisite:**  
>This module requires the [add-to-cart](/components/add-to-cart) and [analytics-utils](/components/analytics-utils) base components.   

![Quick-view product-grid](/modules/product-quick-view/images/product-grid.png)
![Quick-view template](/modules/product-quick-view/images/product-quick-view.png) 

You will find the necessary resources for this module available here:
[resources](/modules/product-quick-view/landing/resources). Please add these with the
method appropriate to your chosen framework. 

[klevu-landing-product-quick-view.js](/modules/product-quick-view/landing/resources/assets/js/klevu-landing-product-quick-view.js)  
It extends the base component and add functions related to quick view functionality. Also, it has the code for adding functionality to a quick view as well as usage of component extension.

## Template Modifications

Add the template for rendering Quick view for related results,
so edit the corresponding `landing-product-block.tpl` to add a Quick view renderer template.

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
