# Layout - "Category-navigation"

This category-navigation layout is an example of how you might bundle together various functionality
from the [modules](/modules) available within this repository, as well as adding
your own customizations.

You will find the necessary resources for this layout 
[available here](/layout/category-navigation/resources).
Please add these with the method applicable to your chosen framework.

## Usage

- Include `//jsv2.klevu.com/dist/2.0/klevu.js` and `klevu-settings.js` on every page.
- Add the [page resources](/layout/category-navigation/resources) to your category navigation landing page.

Below code snippet is for Shopify framework to accommodate the Shopify Collection inputs to the Category/Collection page.

```js
var klevu_collectionProductPath = '{{ collection.url | escape }}';
var q = GetURLParameter('q');
var klevu_pageCategory;
var klevuquery = '';
var klevucountslash;
var klevu_userLandingFilterResults = '';
  
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}
  
if (q == '' || q == null) {
    klevu_pageCategory = '{{ collection.title | escape }}';
    klevucountslash = window.location.pathname.split('/').length;
    if (klevucountslash == 4) {
        var klevutags = window.location.pathname.split('/').pop().split('+');
        for (i = 0; i < klevutags.length; i++) {
            klevuquery += 'tags:';
            klevuquery += klevutags[i] + ';;'
        }
        if (klevuquery !== '') {
            klevu_userLandingFilterResults = klevuquery.slice(0, -2)
        }
    }
} else {
    klevu_pageCategory = '';
    var attribute_key = window.location.pathname.split('/').pop();
    if (attribute_key == 'vendors') {
        attribute_key = 'brand'
    }
    if (attribute_key == 'types') {
        attribute_key = 'type'
    }
    klevu_userLandingFilterResults = attribute_key + ':' + q
}
sessionStorage.setItem("klevu_pageCategory", klevu_pageCategory);
sessionStorage.setItem("klevu_userLandingFilterResults", klevu_userLandingFilterResults);
```