# Add a Sort-By Dropdown in any framework

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/getting-started/2-sort/images/sort-by-dropdown.jpg)

In order to make the required changes to you'll need to modify the static HTML files created
during the [hello-world](/getting-started/1-hello-world/custom) tutorial.

Copy the files from the [resources](/getting-started/2-sort/custom/resources)
folder directly into your web accessible folder.

Next we need to include these assets and templates in our page,
so edit the file `index.php`.

Include `klevu-landing-sort.js` by modifying the contents like this:

```html
...
<script src="/assets/js/landing/klevu-landing.js"></script>
<script src="/assets/js/landing/klevu-landing-sort.js"></script>
...
```

Include the `landing-sort.tpl` template by modifying `index.php` like this:

```php
<?php include(dirname(__FILE__) . '/templates/landing/landing-product-block.tpl') ?>
<?php include(dirname(__FILE__) . '/templates/landing/landing-sort.tpl') ?>
```

Finally, we need to include this sort dropdown in our main template,
so find and edit `templates/landing/landing-results.tpl`.

Locate the line that renders the pagination, and add a new sortBy render helper above it:

```html
...
<%=helper.render('sortBy',scope,data,"productList") %>
<%=helper.render('pagination',scope,data,"productList") %>
...
```

Reload your page and **try the sort ordering**!

## What's next?

Next, let's [add a pagination limit dropdown.](/getting-started/3-limit/custom)
