# Add Category navigation with Shopify

The files you will need for this module can be found in the
[resources](/getting-started/6-category-navigation/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
Once again let’s do this directly within the Shopify Theme editor, rather than downloading and zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `category-navigation-scripts.js`.
- Assets > Add a new Asset > Upload `category-navigation-styles.css`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `category-navigation-templates`
    - Copy the content from `category-navigation-templates.tpl` and and click on Save.

Next we need to include these assets, snippets and custom code to fetch the information from the url in our page,
so edit Templates > `collection.liquid`.

Replace below code with the default template.

```html
<script>

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

</script>

<script src="{{ 'nouislider.js' | asset_url }}"></script>
<script src="{{ 'category-navigation-scripts.js' | asset_url }}"></script>

{{ 'nouislider.min.css' | asset_url | stylesheet_tag }}
{{ 'category-navigation-styles.css' | asset_url | stylesheet_tag }}

<div role="main" class="klevuCategoryPage"></div>

{% include "category-navigation-templates" %} 
```

> **Note:**
> `nouislider` has been added as a external library in the example. Please find the resources of it from the [vendor](/getting-started/6-category-navigation/resources/vendor) folder.


Click Save to persist your changes,
then visit your Shopify store to **try the Category pages**!

## What's next?

- [Click here for more tutorials](/modules)!