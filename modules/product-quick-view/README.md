# Add Product Quick View with Klevu Template

![Quick-view product-grid](/modules/product-quick-view/images/product-grid.png) 

![Quick-view template](/modules/product-quick-view/images/product-quick-view.png) 

You will find the necessary resources for this module available here:
[resources](/modules/product-quick-view/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product quick view rendering template

Add the template for rendering Quick view for related results,
so edit the corresponding product `productblock.tpl` to add Quick view renderer template.


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

Now try **Quick view**!
