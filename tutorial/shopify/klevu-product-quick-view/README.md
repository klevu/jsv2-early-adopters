# Add Product Quick View with Klevu Template

Add Product Quick view on search results landing page.

![Quick-view product-grid](/tutorial/shopify/klevu-product-quick-view/images/product-grid.png) 

![Quick-view template](/tutorial/shopify/klevu-product-quick-view/images/product-quick-view.png) 

The files you will need for this module can be found in the
[resources](/tutorial/shopify/product-quick-view/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-product-quick-view.js`.
- Assets > Add a new Asset > Upload `klevu-product-quick-view.css`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-template-product-quick-view`
    - Copy content from `klevu-template-product-quick-view.liquid` + Paste and click on Save.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-product-quick-view.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-product-quick-view.js' | asset_url }}"></script>
...

```

Include `klevu-product-quick-view.css` by modifying the contents like this:

```html
{{ 'klevu-product-quick-view.css' | asset_url | stylesheet_tag }}
...

```

Include the `klevu-template-product-quick-view.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-template-product-quick-view" %}
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
