# Add a Pagination Limit Dropdown

You may also notice that the search results page does not have a limit option, so let’s add one of those too.

![Limit Dropdown](/tutorial/shopify/limit/images/limit-dropdown.jpg)

The steps to add a pagination limit are actually very similar to adding a Sort By,
so rather than spelling out each step, please go ahead and follow the same steps as
in that tutorial but with the following assets and code snippets:

```html
<script src="{{ 'klevu-landing-limit.js' | asset_url }}"></script>
```

```html
{% include "klevu-template-landing-limit" %}
```

```html
<%=helper.render('limit',scope,data,"productList") %>
```

The Assets and Snippets you will need for this module can be found
in the [resources](/tutorial/shopify/limit/resources) folder.

Next let's try something a little more interesting,
we'll add [a new tab to the search results to display Shopify Page and Article results](/tutorial/shopify/tab-results).
