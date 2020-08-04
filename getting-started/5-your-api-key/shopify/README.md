# Using your own API Key with Shopify

_This tutorial assumes you already completed the
[Shopify Hello World](/getting-started/1-hello-world/shopify)
tutorial, which included installing the Shopify Klevu App on your store._

## Add some dummy Products

In order that you can get started as soon as we activate your API Key,
begin populating your Shopify store with some sample Products, Categories and CMS Pages.
This way we can synchronise your data so it is ready to go as soon as we enable your API Key.

All you need to do is create the Products and publish them, the Klevu App will do the rest.

## File modification

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`
- Add your own API Key in the appropriate location.

```js
function startup(klevu) {
  var options = {
    search: {
      apiKey: "klevu-12345678901234567",
    },
    analytics: {
      apiKey: "klevu-12345678901234567",
    },
  };
}
```

Save the file and reload the frontend to **search your own data!**

## What's next?

- [Click here for Category layout](/getting-started/6-category-navigation/shopify)
- [Click here for more tutorials](/modules)!
