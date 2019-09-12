# Add a Pagination Limit Dropdown in Shopify

You may also notice that the search results page also does not have a limit option, so let’s add one of those too.

![Limit Dropdown](/getting-started/3-limit/images/limit-dropdown.jpg)

The steps to add a pagination limit are actually very similar to adding a Sort By,
so rather than spelling out each step, please go ahead and follow the same steps as
in that tutorial but with the following assets and code snippets:

```html
<script src="{{ 'klevu-landing-limit.js' | asset_url }}"></script>
```

```html
{% include "klevu-landing-limit" %}
```

```js
<%=helper.render('limit',scope,data,"productList") %>
```

The Assets and Snippets you will need for this module can be found
in the [resources](/getting-started/3-limit/resources) folder.

You will notice these resources are structured in a slightly different format
so you will need to make the following amendments:

- upload `js/klevu-landing-limit.js` to your Shopify Assets
- rename `landing-limit.tpl` to `klevu-landing-limit.liquid`
- upload `klevu-template-landing-limit.liquid` as a new Shopify Snippet

## What's next?

There are various other tutorials available for you to try,
however they are structured this more generic format in order
that they can be used across various frameworks such as Magento,
Shopify, BigCommerce, etc.

When trying those tutorials, you will need to rename files and place
the resources in the applicable file locations as per this tutorial.

- [Click here for more tutorials](/modules)!
- [Click here to use your own API Key](/getting-started/4-your-api-key/shopify)!
