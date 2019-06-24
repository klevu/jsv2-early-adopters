# Using your own API Key

By default Klevu API Keys are not enabled for APIv2,
so please send us yours so we can activate it for you.

![Shop Info](/tutorial/shopify/your-api-key/images/shop-info.jpg)

- Login to your Shopify Store Admin Panel.
- Navigate to Apps > Klevu Search.
- Next click the Shop Info link near the top right.
- Copy the value of your “JS API Key” and email it to us.
    - Send this to your Klevu contact (_the person that told you about this programme!_) with email subject: “JSv2 early adopter API Key”
- We will then convert your API key from V1 to V2.

## Add some dummy Products

In order that you can get started as soon as we activate your API Key,
begin populating your Shopify store with some sample Products, Categories and CMS Pages.
This way we can synchronise your data so it is ready to go as soon as we enable your API Key.

All you need to do is create the Products and publish them, the Klevu App will do the rest.

## Once your API Key has been activated

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, so you can start making changes to view your own products
in the search results.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`
- Add your own API Key in the appropriate location.

```html
function startup(klevu) {
    var options = {
        search : {
            apiKey: 'klevu-12345678901234567'
        }
    };
};
```

Save the file and reload the frontend to **search your own data!**
