# Add Add to cart button in search result landing product page

![landing-product-add-to-cart] (/tutorial/shopify/klevu-landing-product-add-to-cart/images/image001.png)

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-add-to-cart-service.js`.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-add-to-cart-service.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-add-to-cart-service.js' | asset_url }}"></script>
<script src="{{ 'klevu-product-quick-view.js' | asset_url }}"></script>
...

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

        <div class="kuAddtocart">
            <div class="kuCartBtn">
                <a href="javascript:void(0)" class="kuAddtocartBtn kuLandingAddToCartBtn"><%=helper.translate("Add to cart") %></a>
            </div>
        </div>
        
        ...
    </div>
</div>
...
```

Click Save to persist your changes.

Next we need to add changes in Asset file.
So edit Assets > `klevu-landing.js`
Add color swatches by the modifying the code as below:

```html
...
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-chains" ,
    fire: function(){
        ...

        /*
        *	Bind landing page add to cart button click event
        */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "landingPageProductAddToCartEvent",
            fire: function (data, scope) {
                klevu.addToCartService();
                klevu.search.landing.getScope().addToCartService.bindLandingProductAddToCartBtnClickEvent(data, scope);
            }
        });

        ...
    }
});
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the search landing add to cart**!