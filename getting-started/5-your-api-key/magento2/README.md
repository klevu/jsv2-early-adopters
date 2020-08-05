# Using your own API Key with Magento 2

_This tutorial assumes you already completed the
[Magento 2 Hello World](/getting-started/1-hello-world/magento2)
tutorial, and you already have an active Klevu API key._

## Where to add your JS API Key and Search URL

Simply modify the following file to add your own API Key in the appropriate location:

`app/code/Klevu/JSv2/view/frontend/web/js/klevu-settings.js`

```js
function startup(klevu) {
  var options = {
    url: {
      search:
        klevu.settings.url.protocol +
        "//<your-subdomain>v2.ksearchnet.com/cs/v2/search",
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

**The inclusion of v2 is important.** Omitting this will cause degraded performance as it will not utilize our Content Delivery Network (CDN). For example, if your Cloud Search URL was `eucs18.ksearchnet.com`, you should use the following value:

```js
https://eucs18v2.ksearchnet.com/cs/v2/search
```

Flush your Magento cache then reload the frontend to **search your own data!**
