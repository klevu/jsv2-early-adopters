# Product Badge - Search Results Landing Page

>**Note:**  
>Currently the mapped attribute in the template is `sku`. Please update this attribute in template file based on the data you have available in your search response data.  

![Product-discount-badge](/modules/product-badge/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-badge/landing/resources). Please add these with the
method appropriate to your chosen framework. 


## Template Modifications

Add the template for rendering badge for related results,
so edit the corresponding product `landing-product-block.tpl` to add badge renderer template.

```html
...
 <div class="kuProdWrap">
    <%=helper.render('landingProductBadge', scope, data, dataLocal) %>     
    ...
 </div>
...
```
Now try **badges on the products**!