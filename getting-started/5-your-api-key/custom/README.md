# Using your own API Key in any framework

_This tutorial assumes you already completed the
[Hello World](/getting-started/1-hello-world/custom)
tutorial, and you already have an active Klevu API key._

## File modification

Simply modify the following file to add your own API Key in the appropriate location:

`assets/js/klevu-settings.js`

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

Reload your page to **search your own data!**

## What's next?

- [Click here for more tutorials](/modules)!
