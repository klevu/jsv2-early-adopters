# Using your own API Key with Magento 2

_This tutorial assumes you already completed the
[Magento 2 Hello World](/getting-started/1-hello-world/magento2)
tutorial, and you already have an active Klevu API key._

## File modification

Simply modify the following file to add your own API Key in the appropriate location:

`app/code/Klevu/JSv2/view/frontend/web/js/klevu-settings.js`

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

Flush your Magento cache then reload the frontend to **search your own data!**
