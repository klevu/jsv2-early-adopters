# Product stock availability label

Add Product stock label on result page products.

![Product-stock-label](/tutorial/shopify/klevu-product-stoke-label/images/image001.png)

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-product-stoke-label.css`
- Assets > Add a new Asset > Upload `klevu-product-stoke-label.js`
- Snippets > Add a new Snippet:
    - Create a new Snippet called: `klevu-product-stoke-label`
    - Copy content from `klevu-product-stoke-label.liquid` + Paste and click on Save.

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-product-stoke-label.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-product-stoke-label.js' | asset_url }}"></script>
...
```

Include `klevu-product-stoke-label.css` by modifying the contents like this:

```html
...
{{ 'klevu-product-stoke-label.css' | asset_url | stylesheet_tag }}
...
```

Include the `klevu-product-stoke-label.liquid` snippet by modifying the contents like this:

```html
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-product-stoke-label" %}
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

Click Save to persist your changes.

Next we need to add changes in Quick view UI file.
So edit Snippets > `klevu-template-landing-productBlock.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
 <div class="kuProdBottom">
    <div class="kuNameDesc">
        ...
    </div>

    <%=helper.render('landingProductStock', scope, data, dataLocal) %>
    
    <div class="kuPrice">
        ...
    </div>
 </div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the stock labels on landing page products**!

Note:
- Currently mapped inStock attribute for displaying stock label.
- Modify `klevu-product-stoke-label.liquid` based on product data.
