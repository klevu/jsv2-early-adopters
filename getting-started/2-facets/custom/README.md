# Add Facets in any framework

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component.

You may notice that the search results page does not have a Facets. Let’s add one.

![Facets left](/getting-started/2-facets/images/image001.png)

In order to make the required changes to you'll need to modify the static HTML files created
during the [hello-world](/getting-started/1-hello-world/custom) tutorial.

Copy the files from the [resources](/getting-started/2-facets/custom/resources)
folder directly into your web accessible folder.

Next we need to include these assets and templates in our page,
so edit the file `index.php`.

Include `klevu-landing-filter-left.js` by modifying the contents like this:

```html
...
<script src="/assets/js/landing/klevu-landing-filter-left.js"></script>
...
```

Include the `landing-filter-left.tpl` template by modifying `index.php` like this:

```php
<?php include(dirname(__FILE__) . '/templates/landing/landing-filter-left.tpl') ?>
```

Finally, we need to include this facets in our main template,
so find and edit `templates/landing/landing-results.tpl`.

Locate the line that renders the filters:

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
