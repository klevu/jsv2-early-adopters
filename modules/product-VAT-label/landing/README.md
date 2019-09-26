# Product VAT Label - Search Results Landing Page

>**Note:**  
>Currently the mapped attribute in the template is `inclusiveVAT`, which is not a default Klevu attribute. Please update this attribute in template file based on the data you have available in your search response data.  

![Product-VAT-label](/modules/product-VAT-label/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-VAT-label/landing/resources). Please add these with the
method appropriate to your chosen framework. 

## Template Modifications

Add the template for rendering VAT label for related results,
so edit the corresponding `landing-product-block.tpl` to add VAT label renderer template.

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