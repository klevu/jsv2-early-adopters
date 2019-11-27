# Product Stock Label - Search Results Landing Page

>**Note:**  
>Currently the mapped attribute in the template is `inStock`. Please update this attribute in template file based on the data you have available in your search response data.

![Product-stock-label](/modules/product-stock-label/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-stock-label/landing/resources). Please add these with the
method appropriate to your chosen framework. 

## Template Modifications

Add the template for rendering badge for related results.  
Edit the corresponding product `landing-product-block.tpl` to add badge renderer template.

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