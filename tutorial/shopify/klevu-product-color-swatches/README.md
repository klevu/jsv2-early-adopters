# Add Color Swatches on result page Product 

Add color swatches on search landing page.

![Search-landing color swatches](/tutorial/shopify/klevu-product-color-swatches/images/image001.png)

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-product-color-swatches.js`.
- Assets > Add a new Asset > Upload `klevu-color-swatches-service.js`.
- Assets > Add a new Asset > Upload `klevu-color-swatches.css`.
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-product-color-swatches`
    - Copy content from `klevu-product-color-swatches.liquid` + Paste and click on Save.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-color-swatches-service.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-color-swatches-service.js' | asset_url }}"></script>
<script src="{{ 'klevu-product-color-swatches.js' | asset_url }}"></script>
...

```

Include `klevu-color-swatches.css` by modifying the contents like this:

```html
...
{{ 'klevu-color-swatches.css' | asset_url | stylesheet_tag }}
...

```

Include the `klevu-product-color-swatches.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-product-color-swatches" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next we need to add changes in Quick view UI file.
So edit Snippets > `klevu-template-landing-productBlock.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
<div class="kuDesc">
<%=desc%>
...

<%=helper.render('landingProductSwatch',scope,data,dataLocal) %>

...
</div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the search landing color swatches**!