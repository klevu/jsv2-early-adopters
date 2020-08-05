# Using your own API Key with Shopify

_This tutorial assumes you already completed the
[Shopify Hello World](/getting-started/1-hello-world/shopify)
tutorial, which included installing the Shopify Klevu App on your store._

To find your API Key:

- Log in to your Shopify Store Admin Panel.
- Navigate to Apps > Klevu Search.
- Next, click the Shop Info link near the top right.
- Copy the value of your `JS API Key` and the subdomain from `Cloud Search URL`.

![Shop Info](/getting-started/5-your-api-key/images/shop-info.jpg)

## Where to your JS API Key and Search URL?

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`

#### Reference code snippet:

```js
function startup(klevu) {
  var options = {
    url: {
      search:
        klevu.settings.url.protocol
          + "//<your-subdomain>v2.ksearchnet.com/cs/v2/search",
    },
    search: {
      apiKey: "<your-js-api-key>",
    },
    analytics: {
      apiKey: "<your-js-api-key>",
    },
  };
}
```

**JS API Key:**  
Your JS API Key will look something like this: `klevu-12345678901234567`.

**Search URL:**  
The search endpoint looks like the following:

```js
https://<subdomain>v2.ksearchnet.com/cs/v2/search
```

**The inclusion of v2 is important.** Omitting this will cause degraded performance as it will not utilize our Content Delivery Network (CDN). For example, if your Cloud Search URL was 'eucs18.ksearchnet.com', you should use the following value:

```js
https://eucs18v2.ksearchnet.com/cs/v2/search
```

## What's next?

- [Click here for Category layout](/getting-started/6-category-navigation/shopify)
- [Click here for more tutorials](/modules)!
