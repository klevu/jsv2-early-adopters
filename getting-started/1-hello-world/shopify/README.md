# Hello World Tutorial for Shopify

> :bulb: **Update June 2021**  
> Get up and running even faster with our fully functional, production-ready **[Klevu Theme](https://developers.klevu.com/javascript-library/integration/klevu-theme)**.

Klevu already has a [Shopify App](https://apps.shopify.com/klevu-smart-search)
which will automatically create a Klevu account and provide you with an API Key for use during this tutorial.

![Klevu Quick Search](/getting-started/1-hello-world/images/intro-quick-search.jpg)

## Quick Start

If you are already familiar with Shopify,
these quick instructions will likely be enough for you to get started.

1. Create a Shopify trial store
1. Install the Klevu Search App
1. Add [these files](/getting-started/1-hello-world/shopify/resources) to your Theme
1. Scroll down to ["Activate Klevu JS Library"](/getting-started/1-hello-world/shopify#activate-klevu-js-library) to add a snippet to your `theme.liquid`

If you struggle with any of the above, please refer to the detailed instructions below.

## Install the Klevu App on Shopify

- Create a [Shopify free trial](https://www.shopify.com).
- Install the Klevu Search App:
    - Apps > "Visit the Shopify App Store" button.
    - Search "Klevu" and click on "Klevu Search" App.
    - Click on the "Add app" button.
    - Follow the instructions to install the App.
    - Click on the Enterprise "Signup Now" button (_its Free, no CC needed_).
    - When you see "Congratulations!", click on the "Continue" button.
    - You should now see the Klevu Merchant Centre (_or KMC as we call it_).
- Disable Klevu Search on Frontend: (_why? see introduction notes below_)
    - Click the "Settings" button at the top of the page.
    - Change the setting "Klevu Search on Frontend" to "Disable".
    - Scroll down and click the "Submit" button.

**Why do we disable the Klevu App?**

This is to remove our hosted version of the JavaScript Library,
which is automatically installed with the App.
We don’t need this since we will be using the new Klevu JS Library,
however the benefit of installing the App is that it creates us a
Klevu API key which can be used in a subsequent tutorial
and will begin synchronising your Shopify products immediately.

## Configure Klevu JS Library on Shopify

Now you have a Shopify store with the Klevu App installed,
the next step is to configure Klevu JS Library so you can get search up
and running with full control over the search functionality, look and feel.

### Theme Modifications

The quickest and easiest way to make the required changes to the theme is to download a copy,
make the changes and then upload again as a new theme. For more information from Shopify on downloading
and uploading themes, [click here](https://help.shopify.com/en/themes/customization/troubleshooting/upload-multiple-files).

- Navigate to Online Store > Themes.
- Download Shopify Theme
    - On Current Theme, select Actions > Download Theme File.
        - _This will email the theme file to you for download._
    - Click the link in your email to download the theme and unzip locally.
- Add Klevu JS Library to Theme
    - Next extract the copy the contents of [resources](/getting-started/1-hello-world/shopify/resources) into your theme.
    - The next step contains the final manual modification required.

### Activate Klevu JS Library

At this stage we have simply added a number of files to your theme,
they are not actually doing anything just yet. So finally, edit your Theme
once more and modify the default Shopify layout file `theme.liquid`.

Add the following snippet just before `</head>`:

```html
{% comment %} KLEVU - START {% endcomment %}
    {% comment %} KLEVU - JS AND CSS ASSETS {% endcomment %}
    <script src="{{ '//js.klevu.com/klevu-js-v2/2.3.2/klevu.js' }}"></script>
    <script src="{{ 'klevu-settings.js' | asset_url }}" ></script>
    <script src="{{ 'klevu-quick.js' | asset_url }}" ></script>
    {{ 'klevu-quick.css' | asset_url | stylesheet_tag }}
    
    {% comment %} KLEVU - TEMPLATES FOR QUICK SEARCH {% endcomment %}
    {% include "klevu-quick-base" %}
    {% include "klevu-quick-auto-suggestions" %}
    {% include "klevu-quick-page-suggestions" %}
    {% include "klevu-quick-category-suggestions" %}
    {% include "klevu-quick-products" %}
    {% include "klevu-quick-product-block" %}
    {% include "klevu-quick-no-results-found" %}
{% comment %} KLEVU - END {% endcomment %}
```
Assign selector value to the Search input element same as the `searchBoxSelector` option from [klevu-settings.js](/getting-started/1-hello-world/shopify/resources/assets/klevu-settings.js) in your theme or implementation.  
In the example we have added `search__input` class to the search input element. 


### Upload and Apply your Theme

Theme modifications are now complete, so upload and apply this new theme:

- Zip the modified theme.
- Navigate to Online Store > Themes.
- Scroll down and click the "Upload theme" button, then select your Zip.
- Once uploaded, select your new theme > Actions > Publish.

Now visit the frontend of your Shopify store and **try searching for "bag"**.

The results you see will be from our demo store since this example uses our API Key.
To see your own product data, please complete the remaining hello-world tutorials below.

## Using an alternative Search Results Landing Page

This tutorial uses the native Shopify `/search` page, which will still process Shopify logic in the background
to generate search results even though we are replacing the entire page with Klevu, so you may prefer to use another
landing page for better performance. If you would like to use a different SRLP,
[please follow these steps](/getting-started/1-hello-world/shopify/alternate-landing-page).

## Make some Changes!

Now you have Klevu functionality entirely hosted on your own infrastructure
and are ready to make some more changes to customise your search results!

Next, let's [Add some Facets / Filters](/getting-started/2-facets/shopify)
