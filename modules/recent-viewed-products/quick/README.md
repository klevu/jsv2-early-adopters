# Recently Viewed Products - Quick Search Results

![Recently Viewed products 001](/modules/recent-viewed-products/images/image001.png)

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

- [This module's resources](/modules/recent-viewed-products/quick/resources).

## Template Modifications

Modify `quick-base.tpl` to add 'Recently Viewed Products' UI in your preferred location.

```html
<div class="klevu-fluid">
    <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
        ...
        <%=helper.render('klevuRecentViewedProducts',scope) %>
    </div>
</div>
```

### Code Reference

[klevu-quick-recent-viewed-products.js](/modules/recent-viewed-products/quick/resources/assets/js/klevu-quick-recent-viewed-products.js)  
contains the recently viewed products implementation in Quick search results UI and show how product click event can be captured and stored. 

