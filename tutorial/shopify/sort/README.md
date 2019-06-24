# Add a Sort-By Dropdown

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/tutorial/shopify/sort/images/sort-by-dropdown.jpg)

The files you will need for this module can be found in the
[resources](/tutorial/shopify/sort/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly with the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset
    - Upload `klevu-landing-sort.js`.
- Snippets > Add a new Snippet
    - Create a new Snippet called: `klevu-template-landing-sort`
    - Copy + Paste the content and click on Save.

Next we need to include these assets and snippets in our page,
so edit the template `page.klevuSearch.liquid`.

Add the following snippet near the top of the liquid template:

```html
<script src="{{ 'klevu-landing.js' | asset_url }}"></script>
<script src="{{ 'klevu-landing-sort.js' | asset_url }}"></script>
...

```

Near the bottom of the liquid template, add following:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-template-landing-productBlock" %}
    {% include "klevu-template-landing-sort" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save on this `page.klevuSearch.liquid` template.

Finally, we need to include this sort dropdown in our main template,
so find and edit the liquid snippet template `klevu-template-landing-results.liquid`.
Locate the line that renders the pagination, and add a new rendering helper above it:

```html
...
<%=helper.render('sortBy',scope,data,"productList") %>
<%=helper.render('pagination',scope,data,"productList") %>
...
```

Now visit a search results page on your Shopify store and **try the sort ordering**!
