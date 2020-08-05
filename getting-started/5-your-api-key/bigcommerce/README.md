# Using your own API Key with BigCommerce

_This tutorial assumes you already completed the
[BigCommerce Hello World](/getting-started/1-hello-world/bigcommerce)
tutorial, and you already have an active Klevu API key.
Once we launch our BigCommerce App we will be able to streamline this process._

## Where to add your JS API Key and Search URL

Since BigCommerce requires `stencil bundle` to modify JavaScript files,
please download your theme as per the [Hello World](/getting-started/1-hello-world/bigcommerce)
tutorial, then modify the following file: `assets/klevu/js/klevu-settings.js`
to add your own API Key in the appropriate location.

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

Use `npm install` and `stencil bundle` to repackage the theme and upload once more.
Activate the new copy of your theme, then reload the frontend to **search your own data!**

## What's next?

- [Click here for more tutorials](/modules)!
