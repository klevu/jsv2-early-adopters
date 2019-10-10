# Add Klevu Analytics in Shopify

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

>**Note:**  
>This tutorial assumes you already completed the [Hello World](/getting-started/1-hello-world/custom) tutorial, and you already have an active Klevu API key.  
>For activating API key, see [tutorial](/getting-started/5-your-api-key/shopify).  

## Add Analytics API key

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, then you can start customizing your own products
in the search results.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Modify Assets > `klevu-settings.js`
- Add your own API Key in the appropriate location.

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

Click on the Save button to store the settings.

## Include Resources

The assets you will need for this module can be found in the [resources](/getting-started/6-analytics/resources) folder. 

Edit the code of your current theme and create some assets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-quick-analytics.js`.
- Assets > Add a new Asset > Upload `klevu-landing-analytics.js`.
  
Next, we need to include these assets on our page,
so edit Templates > `search.liquid`.  

Include `klevu-quick-analytics.js` by modifying the contents like this:  

```html
...
<script src="{{ 'klevu-quick-analytics.js' | asset_url }}"></script>
```

Click Save to persist your changes.

Now, edit Templates > `page.klevuSearch.liquid`. 

Include `klevu-landing-analytics.js` by modifying the contents like this:  
```html
...
<script src="{{ 'klevu-landing-analytics.js' | asset_url }}"></script>
```

Click Save to persist your changes.  
Reload your page to **search your own data!**