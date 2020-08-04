# Using your own API Key with BigCommerce

_This tutorial assumes you already completed the
[BigCommerce Hello World](/getting-started/1-hello-world/bigcommerce)
tutorial, and you already have an active Klevu API key.
Once we launch our BigCommerce App we will be able to streamline this process._

## File modification

Since BigCommerce requires `stencil bundle` to modify JavaScript files,
please download your theme as per the [Hello World](/getting-started/1-hello-world/bigcommerce)
tutorial, then modify the following file: `assets/klevu/js/klevu-settings.js`
to add your own API Key in the appropriate location.

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

Use `npm install` and `stencil bundle` to repackage the theme and upload once more.
Activate the new copy of your theme, then reload the frontend to **search your own data!**

## What's next?

- [Click here for more tutorials](/modules)!
