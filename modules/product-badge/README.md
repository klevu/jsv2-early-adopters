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
- Currently mapped badgeLabel attribute for displaying offer text.
- Modify `product-badge.tpl` based on product data.