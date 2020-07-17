# Add Popular Searches - Quick Search Results

![Popular Searches](/modules/popular-searches/images/image001.png)

[This module's resources](/modules/popular-searches/quick/resources).

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

Modify `quick-base.tpl` to add the popular searches in your quick search results.

```html
<div class="klevu-fluid">
  <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
    ... 
    <%=helper.render('kuTemplatePopularSearches',scope) %> 
    ...
  </div>
</div>
```

### Code Reference

[klevu-quick-popular-searches.js](/modules/popular-searches/quick/resources/assets/js/klevu-quick-popular-searches.js)  
contains the implementation of fetching the popular search terms and display it in Quick Search Results.
