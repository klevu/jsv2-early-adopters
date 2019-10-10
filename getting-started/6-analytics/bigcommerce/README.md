# Add Klevu Analytics in BigCommerce

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

>**Note:**  
>This tutorial assumes you already completed the [Hello World](/getting-started/1-hello-world/custom) tutorial, and you already have an active Klevu API key.  
>For activating API key, see [tutorial](/getting-started/5-your-api-key/bigcommerce). 

## Add Analytics API key

Since BigCommerce requires `stencil bundle` to modify JavaScript files,
please download your theme as per the [Hello World](/getting-started/1-hello-world/bigcommerce)
tutorial, then modify the following file: `assets/klevu/js/klevu-settings.js`
to add your own API Key in the appropriate location.

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

Once downloaded, copy the files from the [resources](/getting-started/6-analytics/resources)
folder directly into your theme.

Next, we need to include these assets and templates on our page,
so edit the file `templates/pages/search.html`.  
Include `klevu-quick-analytics.js` and `klevu-landing-analytics.js` by modifying the contents like this:

```html
...
<script src="{{cdn '/assets/klevu/js/quick/klevu-quick-analytics.js'}}" ></script>
<script src="{{cdn '/assets/klevu/js/landing/klevu-landing-analytics.js'}}" ></script>
```

Use `npm install` and `stencil bundle` to repackage the theme and upload once more.  
Activate the new copy of your theme, then reload the frontend to **search your own data!**
