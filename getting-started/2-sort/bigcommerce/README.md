# Add a Sort-By Dropdown with BigCommerce

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/getting-started/2-sort/images/sort-by-dropdown.jpg)

As per the [hello-world](/getting-started/1-hello-world/bigcommerce) tutorial,
in order to make the required changes to your theme you'll need to download it
and use `stencil bundle` to compile, so go ahead and download your theme again.

Once downloaded, copy the files from the [resources](/getting-started/2-sort/bigcommerce/resources)
folder directly into your theme.

Next we need to include these assets and templates in our page,
so edit the file `templates/pages/search.html`.

Include `klevu-landing-sort.js` by modifying the contents like this:

```html
...
<script src="{{cdn '/assets/klevu/js/landing/klevu-landing.js'}}" ></script>
<script src="{{cdn '/assets/klevu/js/landing/klevu-landing-sort.js'}}" ></script>
...
```

Include the `landing-sort.html` template by modifying the contents like this:

```html
{{> klevu/landing/landing-product-block }}
{{> klevu/landing/landing-sort }}
```

Finally, we need to include this sort dropdown in our main template,
so find and edit `templates/klevu/landing/landing-results.html`.

Locate the line that renders the pagination, and add a new sortBy render helper above it:

```html
...
<%=helper.render('sortBy',scope,data,"productList") %>
<%=helper.render('pagination',scope,data,"productList") %>
...
```

Package your theme using `stencil bundle`, upload and apply your theme,
then visit a search results page on your BigCommerce store to **try the sort ordering**!

## What's next?

Next, let's [add a pagination limit dropdown.](/getting-started/3-limit/bigcommerce)
