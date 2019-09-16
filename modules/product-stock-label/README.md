# Product stock availability label

![Product-stock-label](/modules/product-stock-label/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-stock-label/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product stock label rendering template

Add the template for rendering badge for related results,
so edit the corresponding product `productblock.tpl` to add badge renderer template.

```html
...
 <div class="kuProdBottom">
    <div class="kuNameDesc">
        ...
    </div>

    <%=helper.render('landingProductStock', scope, data, dataLocal) %>
    
    <div class="kuPrice">
        ...
    </div>
 </div>
...
```

Now try **stock label on products**!

Note:
- Currently mapped inStock attribute for displaying stock label.
- Modify `product-stock-label.tpl` based on product data.


Note:
-  Currently the mapped attribute in the template is `inStock`. Please update this attribute in template file based on the data you have available in your search response data.