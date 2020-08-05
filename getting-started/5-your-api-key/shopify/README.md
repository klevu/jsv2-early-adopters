# Using your own API Key with Shopify

_This tutorial assumes you already completed the
[Shopify Hello World](/getting-started/1-hello-world/shopify)
tutorial, which included installing the Shopify Klevu App on your store._

- Log in to your Shopify Store Admin Panel.
- Navigate to Apps > Klevu Search.
- Next, click the Shop Info link near the top right.
- Copy the value of your `JS API Key` and the subdomain from `Cloud Search URL`.

![Shop Info](/getting-started/5-your-api-key/images/shop-info.jpg)

## Where to add API key and Search endpoint?

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`

**API key:**  
Add your own API Key (i.e., `klevu-12345678901234567`) in the appropriate location. Please, find the reference code snippet at the bottom of this page [here](#reference-code-snippet).

**Search endpoint:**  
The search endpoint looks like the following:

```js
https://<subdomain>v2.ksearchnet.com/cs/v2/search
```

A subdomain is assigned to your store depending on the plan of your account and the country of your store. The inclusion of **v2** is important. Omitting this will cause degraded performance as it will not utilize our Content Delivery Network (CDN).

For example:

```js
https://eucs18v2.ksearchnet.com/cs/v2/search
```

> **Note:**  
> As we maintain a separate index for each of your stores, it is possible that you have totally different sub-domains assigned to your other stores.

It is important to take note of these parameters and use the relevant values when firing search queries to the Klevu Search engine.
Add your own search endpoint in the appropriate location.

#### Reference code snippet:

```js
function startup(klevu) {
  var options = {
    url: {
      search:
        klevu.settings.url.protocol +
        "//<subdomain>v2.ksearchnet.com/cs/v2/search",
    },
    search: {
      apiKey: "<API-key>",
    },
    analytics: {
      apiKey: "<API-key>",
    },
  };
}
```

Save the file and reload the frontend to **search your own data!**

## What's next?

- [Click here for Category layout](/getting-started/6-category-navigation/shopify)
- [Click here for more tutorials](/modules)!
