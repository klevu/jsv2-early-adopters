# Custom pagination bar

![custom-pagination-bar](/modules/custom-pagination/images/image001.png)

You will find the necessary resources for this module available here:
[resources](/modules/custom-pagination/resources). Please add these with the
method appropriate to your chosen framework. 

## Template Modifications

Add the template for rendering pagination for related results,
so edit the corresponding landing `landing-results.tpl` to add pagination renderer template.

```html
...
<div class="productList klevuMeta">
    <div class="kuResultWrap">
        ...
        <!-- <%=helper.render('pagination',scope,data,"productList") %> -->
        <%=helper.render('customLandingPagePagination',scope,data,"productList") %>
        ...
    </div>
</div>
<div class="contentList klevuMeta">
    <div class="kuResultWrap">
        ...
        <!-- <%=helper.render('pagination',scope,data,"contentList") %> -->
        <%=helper.render('customLandingPagePagination',scope,data,"contentList") %>
        ...
    </div>
</div>
...
```

Now try **pagination on landing page products**!