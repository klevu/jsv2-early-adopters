# Using your own API Key with Shopify

_This tutorial assumes you already completed the
[Shopify Hello World](/getting-started/1-hello-world/shopify)
tutorial, which included installing the Shopify Klevu App on your store._

## Where to find API keys and Search endpoint?

![Shopify info](/getting-started/5-your-api-key/images/shop-info.jpg)

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`

**API keys**  
Add your own API Key in the appropriate location.

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

**Search endpoint**  
The search endpoint looks like the following:

```js
https://<subdomain>v2.ksearchnet.com/cs/v2/search
```

A subdomain is assigned to your store depending on the plan of your account and the country of your store. The inclusion of **_v2_** is important. Omitting this will cause degraded performance as it will not utilise our Content Delivery Network (CDN).

For example:

```js
https://eucs18v2.ksearchnet.com/cs/v2/search
```

> **Note:**  
> As we maintain a separate index for each of your stores, it is possible that you have totally different sub-domains assigned to your other stores.

It is important to take a note of these parameters and use the relevant values when firing search queries to the Klevu Search engine.

Save the file and reload the frontend to **search your own data!**

## What's next?

- [Click here for Category layout](/getting-started/6-category-navigation/shopify)
- [Click here for more tutorials](/modules)!
