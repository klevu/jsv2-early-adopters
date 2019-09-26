# Custom pagination - Search Results Landing Page

![custom-pagination-bar](/modules/custom-pagination/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/custom-pagination/landing/resources). Please add these with the
method appropriate to your chosen framework. 

## Template Modifications

Add the template for rendering pagination for related results,
so edit the corresponding landing `landing-results.tpl` to add pagination renderer template.

```html
...
<div class="productList klevuMeta">
    ...
    <div class="kuResultWrap">
        ...
        <!-- <%=helper.render('pagination',scope,data,"productList") %> -->
        <%=helper.render('customLandingPagePagination',scope,data,"productList") %>
        ...
    </div>
</div>
...
```

Now try **pagination on landing page products**!