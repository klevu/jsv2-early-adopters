# Add Facets with Shopify

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component, usage instructions are included below.

You may notice that the search results page does not have any facets. Let’s add them.

![Facets left](/getting-started/2-facets/images/image001.png)

The files you will need for this module can be found in the
[resources](/getting-started/2-facets/shopify/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload:
    - `klevu-facets.js` from [facet component JS](/components/facets/resources/assets/js).
    - `klevu-facets.css` from [facet component CSS](/components/facets/resources/assets/css).
    - `klevu-landing-filter-left.js` from [this module's JS](/getting-started/2-facets/shopify/resources/assets).
    - `klevu-landing-filter-left.css` from [this module's CSS](/getting-started/2-facets/shopify/resources/assets).
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-landing-filter-left`
    - Copy the content from `landing-filter-left.liquid` and and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `search.liquid`.

Include the new JavaScript and CSS files by modifying the contents like this:

```html
...
<script src="{{ 'klevu-facets.js' | asset_url }}" ></script>
<script src="{{ 'klevu-landing-filter-left.js' | asset_url }}" ></script>

{{ 'klevu-facets.css' | asset_url | stylesheet_tag }}
{{ 'klevu-landing.css' | asset_url | stylesheet_tag }}
...
```

Include the `landing-filter-left.liquid` snippet by adding:

```html
{% include "klevu-landing-filter-left" %}
```

Click Save to persist your changes.

Finally, we need to include the facets in our search results template,
so find and edit Snippets > `klevu-landing-results.liquid`.

Add a new filter renderer after the `kuResultContent` opening div:

```html
<div class="kuResultContent">

    <%=helper.render('filters',scope,data,"productList") %>

    <div class="kuResultWrap <%=(data.query.productList.filters.length == 0 )?'kuBlockFullwidth':''%>">
    ...
</div>
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Facets**!

## What's next?

Next, let's [Add a Sort-By Dropdown](/getting-started/3-sort/shopify)
