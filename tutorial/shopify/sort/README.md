# Add a Sort-By Dropdown

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/tutorial/shopify/sort/images/sort-by-dropdown.jpg)

The files you will need for this module can be found in the
[resources](/tutorial/shopify/sort/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-landing-sort.js`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-template-landing-sort`
    - Copy content from `klevu-template-landing-sort.liquid` + Paste and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-landing-sort.js` by modifying the contents like this:

```html
<script src="{{ 'klevu-landing.js' | asset_url }}"></script>
<script src="{{ 'klevu-landing-sort.js' | asset_url }}"></script>
...

```

Include the `klevu-template-landing-sort.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-template-landing-productBlock" %}
    {% include "klevu-template-landing-sort" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Finally, we need to include this sort dropdown in our main template,
so find and edit Snippets > `klevu-template-landing-results.liquid`.

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

Next, let's [add a pagination limit dropdown.](/tutorial/shopify/limit)
