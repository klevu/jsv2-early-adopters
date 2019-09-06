# Using your own API Key

By default Klevu API Keys are not enabled for APIv2,
so please send us yours so we can activate it for you.

_This tutorial assumes you already completed the
[BigCommerce Hello World](/tutorial/hello-world/bigcommerce)
tutorial, and you already have an active Klevu API key.
Once we launch our BigCommerce App we will be able to streamline this process._

## Once your API Key has been activated

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, then you can start customising your own products
in the search results.

Since BigCommerce requires `stencil bundle` to modify JavaScript files,
please download your theme as per the hello world tutorial. Modify the
following file: `assets/klevu/klevu-settings.js` to add your own API Key
in the appropriate location.

```js
function startup(klevu) {
    var options = {
        search : {
            apiKey: 'klevu-12345678901234567'
        }
    };
};
```

Use `npm install` and `stencil bundle` to repackage the theme and upload once more.
Activate the new copy of your theme, then reload the frontend to **search your own data!**
