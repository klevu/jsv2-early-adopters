# Using your own API Key in any framework

By default Klevu API Keys are not enabled for APIv2,
so please send us yours so we can activate it for you.

_This tutorial assumes you already completed the
[Hello World](/getting-started/1-hello-world/custom)
tutorial, and you already have an active Klevu API key._

## Once your API Key has been activated

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, then you can start customising your own products
in the search results.

Simply modify the following file to add your own API Key in the appropriate location:

`assets/js/klevu-settings.js` 

```js
function startup(klevu) {
    var options = {
        search : {
            apiKey: 'klevu-12345678901234567'
        },
        analytics: {
            apiKey: 'klevu-12345678901234567'
        }
    };
};
```

Reload your page to **search your own data!**

## What's next?

- [Click here for more tutorials](/modules)!
