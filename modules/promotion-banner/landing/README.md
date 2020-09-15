# Add Promotion Banner - Search Results Landing Page

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

- [This module's resources](/modules/promotion-banner/landing/resources).

## Template Modifications

Modify `landing-base.tpl` to add promotion banner in your preferred location.

```html
<div class="kuContainer">
    <%=helper.render('klevuLandingPromotionBanner',scope, data, "top") %>
    ...
    ...
    <%=helper.render('klevuLandingPromotionBanner',scope, data, "bottom") %>
</div>
```

### Code Reference

[klevu-landing-promotion-banner.js](/modules/promotion-banner/landing/resources/assets/js/klevu-landing-promotion-banner.js)  
contains the static list of promotion banners and show how to enable promotion banner for Search Results Landing Page.
Moreover, change banner on specific term functionality has also been added in this file.