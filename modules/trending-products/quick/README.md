# Add Trending Products - Quick Search Results

![Trending Products](/modules/trending-products/images/image001.png)

[This module's resources](/modules/trending-products/quick/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Settings Configuration

Open `klevu-settings.js` file,  
Add/Update the `minChars` attribute to `0` under the `search` option.
```js
{
    ...
    search: {
        ...
        minChars : 0
    }
}
```

## Template Modifications

Modify `quick-base.tpl` to add the trending products list in your quick search results.  

```html
<div class="klevu-fluid">
    <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
        ...
        <%=helper.render('klevuTrendingProducts',scope) %>
    </div>
</div>
```

### Code Reference

[klevu-quick-trending-products.js](/modules/trending-products/quick/resources/assets/js/klevu-quick-trending-products.js)  
contains the preparation of the `trendingProductList` request object and show how to add that object in the search request.



