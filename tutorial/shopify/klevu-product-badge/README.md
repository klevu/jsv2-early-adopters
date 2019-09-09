# Search result Product badge

Add Product discount badge on result page products.

![Product-discount-badge](/tutorial/shopify/klevu-product-badge/images/image001.png)

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-product-badge.css`
- Assets > Add a new Asset > Upload `klevu-product-badge.js`
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-product-badge`
    - Copy content from `klevu-product-badge.liquid` + Paste and click on Save.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-product-badge.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-product-badge.js' | asset_url }}"></script>
...
```

Include `klevu-product-badge.css` by modifying the contents like this:

```html
...
{{ 'klevu-product-badge.css' | asset_url | stylesheet_tag }}
...
```

Include the `klevu-product-badge.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-product-badge" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next we need to add changes in Quick view UI file.
So edit Snippets > `klevu-template-landing-productBlock.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
 <div class="kuProdWrap">
    <%=helper.render('landingProductBadge', scope, data, dataLocal) %>     
    ...
 </div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the badges on landing page products**!

Note:
- Currently mapped stickyLabelHead and stickyLabelTail attributes for displaying offer text.
- Modify `klevu-product-badge.liquid` based on product data.
