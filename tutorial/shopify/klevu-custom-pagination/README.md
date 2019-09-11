# Custom pagination bar

Add custom pagination bar on search result landing page.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-custom-pagination.js`
- Assets > Add a new Asset > Upload `klevu-custom-pagination.css`
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-custom-pagination`
    - Copy content from `klevu-custom-pagination.liquid` + Paste and click on Save.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-custom-pagination.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-custom-pagination.js' | asset_url }}"></script>
...
```

Include `klevu-custom-pagination.css` by modifying the contents like this:

```html
...
{{ 'klevu-custom-pagination.css' | asset_url | stylesheet_tag }}
...
```

Include the `klevu-custom-pagination.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-custom-pagination" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next, we need to add changes in search result template file.
So edit Snippets > `klevu-template-landing-results.liquid`
Add code as per below:

```html
...
<div class="productList klevuMeta">
    <div class="kuResultWrap">
        ...
        <!-- <%=helper.render('pagination',scope,data,"productList") %> -->
        <%=helper.render('customLandingPagePagination',scope,data,"productList") %>
        ...
    </div>
</div>
<div class="contentList klevuMeta">
    <div class="kuResultWrap">
        ...
        <!-- <%=helper.render('pagination',scope,data,"contentList") %> -->
        <%=helper.render('customLandingPagePagination',scope,data,"contentList") %>
        ...
    </div>
</div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the pagination on landing page products**!