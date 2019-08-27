# Add Product Quick View

Add Product Quick view on search results landing page.

![Quick-view product-grid](/tutorial/shopify/landing-quick-view/images/product-grid.png) 

![Quick-view template](/tutorial/shopify/landing-quick-view/images/landing-quick-view.png) 

The files you will need for this module can be found in the
[resources](/tutorial/shopify/landing-quick-view/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-landing-quick-view.js`.
- Assets > Add a new Asset > Upload `klevu-landing-quick-view.css`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-template-landing-quick-view`
    - Copy content from `klevu-template-landing-quick-view.liquid` + Paste and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-landing-quick-view.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-landing-quick-view.js' | asset_url }}"></script>
...

```

Include `klevu-landing-quick-view.css` by modifying the contents like this:

```html
{{ 'klevu-landing-quick-view.css' | asset_url | stylesheet_tag }}
...

```

Include the `klevu-template-landing-quick-view.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-template-landing-quick-view" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next we need to include Quick view button to product block,
so edit Snippets > `klevu-template-landing-productBlock.liquid`.
Add Quick view button UI by modifying the content like this:

```html
...
<div class="kuProdTop">
    ...
    <div class="kuQuickView">
        <button data-id="<%=dataLocal.id%>" class="kuQuickViewBtn">Quick view</button>
    </div>
</div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Quick view**!
