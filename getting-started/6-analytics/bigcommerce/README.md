# Add Klevu Analytics in BigCommerce

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

>**Note:**  
>This tutorial assumes you already completed the [Hello World](/getting-started/1-hello-world/bigcommerce) tutorial, and you already have an active Klevu API key.  
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


## Code Reference

Klevu Analytics can be added to both Quick Search and Search Results Landing Page,
please find the corresponding instructions for each below:

[klevu-quick.js](/getting-started/1-hello-world/bigcommerce/resources/assets/klevu/js/quick/klevu-quick.js#L279)  
contains Klevu Analytics extension for Quick Search results. By including this file to the application, it enables the analytics for the Quick Search input.  

[klevu-landing.js](/getting-started/1-hello-world/bigcommerce/resources/assets/klevu/js/landing/klevu-landing.js#L375)  
contains Klevu Analytics extension for Search Results Landing Page. By including this file to the application, it enables the analytics of each search call fires from the landing page.  
  
Furthermore, by clicking on result products it will also track the click event to improve the results of your search.  

Reload your page to **search your own data!**
