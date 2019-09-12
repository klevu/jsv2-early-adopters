# Add a Sort-By Dropdown with Shopify

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/getting-started/2-sort/images/sort-by-dropdown.jpg)

The files you will need for this module can be found in the
[resources](/getting-started/2-sort/shopify/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-landing-sort.js`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-landing-sort`
    - Copy the content from `klevu-landing-sort.liquid` and and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-landing-sort.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-landing.js' | asset_url }}"></script>
<script src="{{ 'klevu-landing-sort.js' | asset_url }}"></script>
...
```

Include the `klevu-landing-sort.liquid` snippet by modifying the contents like this:

```html
{% include "klevu-landing-product-block" %}
{% include "klevu-landing-sort" %}
```

Click Save to persist your changes.

Finally, we need to include this sort dropdown in our main template,
so find and edit Snippets > `klevu-landing-results.liquid`.

Locate the line that renders the pagination, and add a new sortBy render helper above it:

```html
...
<%=helper.render('sortBy',scope,data,"productList") %>
<%=helper.render('pagination',scope,data,"productList") %>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the sort ordering**!

## What's next?

Next, let's [add a pagination limit dropdown.](/getting-started/3-limit/shopify)
