# Search result Product badge

![Product-discount-badge](/modules/product-badge/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/product-badge/resources). Please add these with the
method appropriate to your chosen framework. 

# Add product badge rendering template

Add the template for rendering badge for related results,
so edit the corresponding product `productblock.tpl` to add badge renderer template.

```html
...
 <div class="kuProdWrap">
    <%=helper.render('landingProductBadge', scope, data, dataLocal) %>     
    ...
 </div>
...
```
Now try **badges on the products**!

Note:
Currently the mapped attribute in the template is `badgeLabel`, which is not a default Klevu attribute. Please update this attribute in template file based on the data you have available in your search response data.