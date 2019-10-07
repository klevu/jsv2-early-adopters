# Add Facets with Shopify

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component.

You may notice that the search results page does not have a Facets. Let’s add one.

![Facets left](/getting-started/2-facets/images/image001.png)

The files you will need for this module can be found in the
[resources](/getting-started/2-facets/shopify/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-landing-filter-left.js`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-landing-filter-left`
    - Copy the content from `landing-filter-left.liquid` and and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `search.liquid`.

Include `klevu-landing-filter-left.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-landing-filter-left.js' | asset_url }}"></script>
...
```

Include the `landing-filter-left.liquid` snippet by modifying the contents like this:

```html
{% include "landing-filter-left" %}
```

Click Save to persist your changes.

Finally, we need to include this sort dropdown in our main template,
so find and edit Snippets > `klevu-landing-results.liquid`.

Locate the line that renders the pagination, and add a new sortBy render helper above it:

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

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Facets**!

## What's next?

Next, let's [Add a Sort-By Dropdown](/getting-started/3-sort/shopify)
