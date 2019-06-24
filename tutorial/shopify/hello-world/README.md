# Hello World Tutorial

Klevu already has a [Shopify App](https://apps.shopify.com/klevu-smart-search)
which uses Version 1 of our JavaScript Library.
We will use this as the basis for our tutorial, which will automatically create
a Klevu account and provide you with an API Key for use during this tutorial.

![Klevu Quick Search](/tutorial/shopify/hello-world/images/intro-quick-search.jpg)

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
    - Next extract the copy the contents of [resources](/tutorial/shopify/hello-world/resources) into your theme.
    - Zip the theme once again.
    - Navigate to Online Store > Themes.
    - Scroll down and click the "Upload theme" button, then select your Zip.
    - Once imported, select your new theme > Actions > Publish.

### Change Search Results Page Template

Modify the Shopify Page "Search Results" to use the template: `page.klevuSearch.liquid`.
You can leave the Page content as it is, since this is ignored in the above template.

- Navigate to Online Store > Pages.
- Edit the `Search Results` page.
- On the right hand side, change the template to `page.klevuSearch`.
- Save the Page.

![Search Results Page](/tutorial/shopify/hello-world/images/search-results-page.jpg)

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
(_apart from `jsv2.klevu.com/export/klevu.js`, but feel free to download this
and host it yourself if you wish_). In Version 1 of our Klevu JavaScript,
if you wanted to make any changes you’d need to contact our support.

**Let’s make some changes ourselves, without that bottleneck!**

1. [Add a Sort-By Dropdown.](/tutorial/shopify/sort)
1. [Add a Pagination Limit Dropdown.](/tutorial/shopify/limit)
1. [Search Shopify Pages and Articles.](/tutorial/shopify/tab-results)
1. [Using your own API Key.](/tutorial/shopify/your-api-key)
