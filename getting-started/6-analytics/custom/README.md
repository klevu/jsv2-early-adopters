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

## Code Reference

Klevu Analytics can be added to both Quick Search and Search Results Landing Page,
please find the corresponding instructions for each below:

[klevu-quick.js](/getting-started/1-hello-world/custom/resources/assets/js/quick/klevu-quick.js#L279)  
This contains the initialization and implementation of analytics functionality for the Quick Search Getting started.   

[klevu-landing.js](/getting-started/1-hello-world/custom/resources/assets/js/landing/klevu-landing.js#L375)  
This contains the initialization and implementation of analytics functionality for the Search Result Landing Page Getting started.   
  
Furthermore, by clicking on result products it will also track the click event to improve the results of your search.  

Reload your page to **search your own data!**
