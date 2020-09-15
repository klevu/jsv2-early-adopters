# Add Promotion Banner - Quick Search Results

![quick promotion banner 001](/modules/promotion-banner/images/image001.png)
![quick promotion banner 002](/modules/promotion-banner/images/image002.png)

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

- [This module's resources](/modules/promotion-banner/quick/resources).

## Template Modifications

Modify `quick-base.tpl` to add promotion banner in your preferred location.

```html
<div class="klevu-fluid">
    <div id="klevuSearchingArea" class="klevuQuickSearchingArea">
        <%=helper.render('klevuQuickPromotionBanner',scope, data, "top") %>
        ...
        ...
        <%=helper.render('klevuQuickPromotionBanner',scope, data, "bottom") %>
    </div>
</div>
```

### Code Reference

[klevu-quick-promotion-banner.js](/modules/promotion-banner/quick/resources/assets/js/klevu-quick-promotion-banner.js)  
contains the static list of promotion banners and show how to enable promotion banner for quick search results.
Moreover, change banner on specific term functionality has also been added in this file.