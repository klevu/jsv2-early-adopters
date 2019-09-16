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
-  Currently the mapped attribute in the template is `inclusiveVAT`, which is not a default Klevu attribute. Please update this attribute in template file based on the data you have available in your search response data.
