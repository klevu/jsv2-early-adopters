# Add Facets in any framework

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component, usage instructions are included below.

You may notice that the search results page does not have any facets. Let’s add them.

![Facets left](/getting-started/2-facets/images/image001.png)

In order to make the required changes to you'll need to modify the static HTML files created
during the [hello-world](/getting-started/1-hello-world/custom) tutorial.

Copy the following files into your theme:
- `klevu-facets.js` from [facet component JS](/components/facets/resources/assets/js) into `assets/js`.
- `klevu-facets.css` from [facet component CSS](/components/facets/resources/assets/css) into `assets/css`.
- [this module resources](/getting-started/2-facets/custom/resources) into the root of your web accessible folder.

Next we need to include these assets and templates in our page,
so edit the file `index.php`.

Include the new JavaScript and CSS files by modifying the contents like this:

```html
...
<script src="/assets/js/klevu-facets.js"></script>
<script src="/assets/js/landing/klevu-landing-filter-left.js"></script>

<link href='/assets/css/klevu-facets.css' rel='stylesheet'>
<link href='/assets/css/landing/klevu-landing-filter-left.css' rel='stylesheet'>
...
```

Include the `landing-filter-left.tpl` template by adding:

```php
<?php include(dirname(__FILE__) . '/templates/landing/landing-filter-left.tpl') ?>
```

Finally, we need to include the facets in our search results template,
so find and edit `templates/landing/landing-results.tpl`.

Add a new filter renderer after the `kuResultContent` opening div:

```html
<div class="kuResultsListing">
    <div class="productList klevuMeta" data-section="productList">
        <div class="kuResultContent">
            
            <%=helper.render('filters',scope,data,"productList") %>
            ...

        </div>        
    </div>
</div>
```

Reload your page and **try the Facets**!

## What's next?

Next, let's [Add a Sort-By Dropdown](/getting-started/3-sort/custom)
