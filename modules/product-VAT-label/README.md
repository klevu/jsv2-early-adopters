# Product VAT label

![Product-VAT-label](/modules/product-VAT-label/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-VAT-label/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product VAT label rendering template

Add the template for rendering VAT label for related results,
so edit the corresponding product `productblock.tpl` to add VAT label renderer template.

```html
...
 <div class="kuProdBottom">
    ...
    <div class="kuPrice">
        ...
    </div>
    
    <%=helper.render('landingProductVATLabel', scope, data, dataLocal) %>
    
    ...
 </div>
...
```

Now try **VAT label on landing page products**!

Note:
- Currently mapped inclusiveVAT attribute for displaying VAT label.
- Modify `product-VAT-label.tpl` based on product data.
