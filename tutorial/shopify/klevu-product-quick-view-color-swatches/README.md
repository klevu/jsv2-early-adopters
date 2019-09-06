# Add Color swatches on Product Quick view 

Add Color swatches on Product Quick view.

![Quick-view color-swatches](/tutorial/shopify/klevu-product-quick-view-color-swatches/images/image001.png)

prerequisite:
- Add [klevu-product-quick-view](/tutorial/shopify/klevu-product-quick-view) module.

Now add color swatches in the Quick view UI.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-product-quick-view-color-swatches.js`.
- Assets > Add a new Asset > Upload `klevu-color-swatches-service.js`.
- Assets > Add a new Asset > Upload `klevu-color-swatches.css`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-product-quick-view-color-swatches`
    - Copy content from `klevu-product-quick-view-color-swatches.liquid` + Paste and click on Save.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `js files` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-color-swatches-service.js' | asset_url }}"></script>

<script src="{{ 'klevu-product-quick-view.js' | asset_url }}"></script>

<script src="{{ 'klevu-product-quick-view-color-swatches.js' | asset_url }}"></script>
...

```

Include `klevu-color-swatches.css` by modifying the contents like this:

```html
...
{{ 'klevu-color-swatches.css' | asset_url | stylesheet_tag }}
...

```

Include the `klevu-product-quick-view-color-swatches.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-product-quick-view-color-swatches" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next we need to add changes in Quick view UI file.
So edit Snippets > `klevu-template-product-quick-view.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
<div class="productQuick-extraInfo">
    <div class="productQuick-stockStatus">
        ...
    </div>

    <%=helper.render('quickViewProductSwatch',scope,data,data.selected_product) %>

    <div class="productQuick-sizeInStock">
        ...
    </div>
</div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Quick view color swatches**!

