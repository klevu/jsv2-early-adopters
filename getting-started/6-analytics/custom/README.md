# Add Klevu Analytics in any framework

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

>**Note:**  
>This tutorial assumes you already completed the [Hello World](/getting-started/1-hello-world/custom) tutorial, and you already have an active Klevu API key.  

## Add Analytics API key

Once you have added an API key to the `klevu-settings.js` file and get the demo work, you need to add `apiKey` for Analytics.  
Modify the `klevu-settings.js` file in the appropriate location.

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

Next, we need to include these assets on our page. So, edit the file `index.php`.  
Include the `klevu-quick-analytics.js` and `klevu-landing-analytics.js` by modifying the contents like this:

```html
<script src="/assets/js/landing/klevu-quick-analytics.js"></script>
<script src="/assets/js/landing/klevu-landing-analytics.js"></script>
```

Reload your page to **search your own data!**
