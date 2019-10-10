# Add Klevu Analytics in Magento 2

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

>**Note:**  
>This tutorial assumes you already completed the [Hello World](/getting-started/1-hello-world/magento2) tutorial, and you already have an active Klevu API key.  
>For activating API key, see [tutorial](/getting-started/5-your-api-key/magento2). 

## Add Analytics API key

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, then you can start customizing your products
in the search results.

Simply modify the following file to add your API Key in the appropriate location:

`app/code/Klevu/JSv2/view/frontend/web/js/klevu-settings.js` 

```js
function startup(klevu) {
    var options = {
        search: {
            apiKey: 'klevu-12345678901234567'
        },
        analytics: {
            apiKey: 'klevu-12345678901234567'
        }
    };
};
```
## Include Resources

The assets you will need for this module can be found in the [resources](/getting-started/6-analytics/resources) folder. 

Next, we need to include these assets in our page,
so edit the file `view/frontend/templates/quick.phtml`.
  
Include `klevu-quick-analytics.js` by modifying the contents like this:  
```html
...
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/quick/klevu-quick-analytics.js') ?>"></script>
...
```
Next, edit the file `view/frontend/templates/landing.phtml`.
  
Include `klevu-landing-analytics.js` by modifying the contents like this: 
```html
...
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing-analytics.js') ?>"></script>
...
```

Flush your Magento cache then reload the frontend to **search your data!**

## What's next?

- [Click here for more tutorials](/modules)!