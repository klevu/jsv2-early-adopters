# Hello World Tutorial for BigCommerce

Klevu already has a [BigCommerce App](https://www.bigcommerce.com/apps/klevu-search/?search=klevu)
which will automatically create a Klevu account and provide you with an API Key for use during this tutorial.

![Klevu Quick Search](/getting-started/1-hello-world/images/intro-quick-search.jpg)

## Quick Start

If you are already familiar with BigCommerce,
these quick instructions will likely be enough for you to get started.

1. Create a BigCommerce trial store
1. Install the Klevu Search App
1. Add [these files](/getting-started/1-hello-world/bigcommerce/resources) to your Theme
1. Scroll down to ["Activate Klevu JS Library"](/getting-started/1-hello-world/bigcommerce#activate-klevu-js-library) to add a snippet to your `base.html`

If you struggle with any of the above, please refer to the detailed instructions below.

## Install the Klevu App on BigCommerce

- Create a [BigCommerce free trial](https://www.bigcommerce.com).
- Install the Klevu Search App:
    - Apps > "BIGCOMMERCE.COM/APPS" button.
    - Search "Klevu" and click on "Klevu Search" App.
    - Click on the "GET THIS APP" button.
    - Follow the instructions to install the App (_its Free, no CC needed_).
    - When you see "Congratulations", click on the "Continue" then "Launch" buttons.
    - You should now see the Klevu Merchant Centre (_or KMC as we call it_).

**Do not follow the instructions to Integrate Search.**

This automated installer and manual instructions are for version 1 of our JS Library. 
We don’t need this since we will be using the new Klevu JS Library,
however the benefit of installing the App is that it creates us a
Klevu API key which can be used in a subsequent tutorial
and will begin synchronising your BigCommerce products immediately.

## Integrate Klevu JS Library with BigCommerce

Now you have a BigCommerce store with the Klevu App installed,
the next step is to configure Klevu JS Library so you can get search up
and running with full control over the search functionality, look and feel.

### Theme Modifications

This tutorial will assume the default BigCommerce Stencil theme 'Cornerstone' is being used.
Klevu JS Library is supported on legacy Blueprint Themes where you will need to adjust some of the file paths
and syntax for the including of assets and templates.

The only way to add new files to a Stencil theme is to download a copy,
make the changes and then use the `stencil bundle` to upload again as a new theme.
For more information from BigCommerce on using Stencil to bundle themes,
[click here](https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil).

- Navigate to Storefront > My Themes.
- Download the Cornerstone theme.
    - On Current Theme, select Advanced > Download Current Theme.
    - After a few moments, the ZIP file containing the theme will download.
    - Unzip the theme locally ready to make some changes.
- Add Klevu JS Library to Theme
    - First, remove all existing search functionality
        - Delete the entire folder `templates/components/search`
    - Next extract the [resources](/getting-started/1-hello-world/bigcommerce/resources) and copy the contents of it into your theme.
    - The next step contains the final manual modification required.

### Activate Klevu JS Library

At this stage we have simply added several files to a new copy of our theme,
they are not doing anything just yet. So finally, edit your Theme
to modify the default BigCommerce layout file `templates/layout/base.html`.

Add the following snippet just before `</head>`:

```html
{{!-- KLEVU - START --}}
    {{!-- KLEVU - JS AND CSS ASSETS --}}
    <script src="//js.klevu.com/klevu-js-v2/2.0/klevu.js"></script>
    <script src="{{cdn '/assets/klevu/js/klevu-settings.js'}}" ></script>
    <script src="{{cdn '/assets/klevu/js/quick/klevu-quick.js'}}" ></script>
    {{{stylesheet '/assets/klevu/css/quick/klevu-quick.css'}}}
    
    {{!-- KLEVU - TEMPLATES FOR QUICK SEARCH --}}
    {{> klevu/quick/quick-base }}
    {{> klevu/quick/quick-auto-suggestions }}
    {{> klevu/quick/quick-page-suggestions }}
    {{> klevu/quick/quick-category-suggestions }}
    {{> klevu/quick/quick-products }}
    {{> klevu/quick/quick-product-block }}
    {{> klevu/quick/quick-no-results-found }}
{{!-- KLEVU - END --}}
```
### Upload and Apply your Theme

Theme modifications are now complete, so upload and apply this new theme:

- Use `npm install` and `stencil bundle` to zip the theme once again.
    - _Important: you cannot simply zip the theme using your operating system._
- Navigate to Storefront > My Themes.
- Scroll down and click the "Upload Theme" button, then select your Zip.
- Once uploaded, select your new theme > Apply.

Now visit the frontend of your BigCommerce store and **try searching for "bag"**.

The results you see will be from our demo store since this example uses our API Key.
To see your own product data, please complete the remaining hello-world tutorials below.

## Make some Changes!

Now you have Klevu functionality entirely hosted on your infrastructure
and are ready to make some more changes to customize your search results!

Next, let's [Add some Facets / Filters](/getting-started/2-facets/bigcommerce)
