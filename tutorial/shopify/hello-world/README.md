# Hello World Tutorial for Shopify

Klevu already has a [Shopify App](https://apps.shopify.com/klevu-smart-search)
which uses Version 1 of our JavaScript Library, will automatically create
a Klevu account and provide you with an API Key for use during this tutorial.

![Klevu Quick Search](/tutorial/hello-world/images/intro-quick-search.jpg)

## Install the Klevu App on Shopify

- Create a [Shopify free trial](https://www.shopify.com).
- Install Klevu App:
    - Apps > "Visit the Shopify App Store" button.
    - Search "Klevu" and click on "Klevu Search" App.
    - Click on the "Add app" button.
    - Follow the instructions to install the App.
    - Click on the Enterprise "Signup Now" button (_its Free, no CC needed_).
    - When you see "Congratulations!", click on the "Continue" button.
    - You should now see the Klevu Merchant Centre (_or KMC as we call it_).
- Disable the Klevu App: (_why? see introduction notes below_)
    - Click the "Settings" button at the top of the page.
    - Change the setting "Klevu Search on Frontend" to "Disable".
    - Scroll down and click the "Submit" button.

**Why do we disable the Klevu App?**

This is to remove Version 1 of the JavaScript Library,
which is automatically installed with the App.
We don’t need this since we will be using JSv2, however 
the benefit of installing the App is that it creates us a Klevu API key
and will begin synchronising your Shopify products immediately.

## Configure Klevu JSv2 on Shopify

Now you have a Shopify store with the Klevu App installed,
the next step is to configure JSv2 so you can get Klevu search up
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
- Add JSv2 to Theme
    - Next extract the copy the contents of [resources](/shopify/tutorial/hello-world/resources) into your theme.
    - Zip the theme once again.
    - Navigate to Online Store > Themes.
    - Scroll down and click the "Upload theme" button, then select your Zip.
    - Once imported, select your new theme > Actions > Publish.

### Activate JSv2

At this stage we have simply uploaded a number of files to our theme,
they are not actually doing anything just yet. So finally, edit your Theme
once more and modify the default Shopify layout file `theme.liquid`.

- Navigate to Online Store > Themes.
- Current Theme > Actions > Edit code.
- Edit Layout > theme.liquid
- Add the following snippet just before `</head>`
- Click save in the top right.

```html
{% comment %} KLEVU - START {% endcomment %}
    {{ 'klevu-quick.css' | asset_url | stylesheet_tag }}
    <script src="{{ '//jsv2.klevu.com/export/klevu.js' }}"></script>
    <script src="{{ 'klevu-settings.js' | asset_url }}" ></script>
    <script src="{{ 'klevu-quick.js' | asset_url }}" ></script>
    {% comment %} KLEVU TEMPLATES QUICK - START {% endcomment %}
        {% include "klevu-template-quick-base" %}
        {% include "klevu-template-quick-autoSuggestions" %}
        {% include "klevu-template-quick-pageSuggestions" %}
        {% include "klevu-template-quick-categorySuggestions" %}
        {% include "klevu-template-quick-products" %}
        {% include "klevu-template-quick-productBlock" %}
        {% include "klevu-template-quick-noResultFound" %}
    {% comment %} KLEVU TEMPLATES QUICK - END {% endcomment %}
{% comment %} KLEVU - END {% endcomment %}
```

Now visit the frontend of your Shopify store and **try searching for "bag"**.

## Make some Changes!

Now you have Klevu functionality entirely hosted on your own infrastructure
and are ready to make some more changes to customise your search results!

1. [Using your own API Key.](/tutorial/your-api-key/shopify)
1. [Try more tutorials.](/tutorial/shopify)
