# Hello World Tutorial for BigCommerce

Klevu is working on a [BigCommerce App](https://www.klevu.com/bigcommerce/)
which is currently still in beta, so this tutorial will not include this App for now, since
not everybody will have access to it.

![Klevu Quick Search](/getting-started/1-hello-world/images/intro-quick-search.jpg)

## Integrate Klevu JSv2 with BigCommerce

First create a [BigCommerce free trial](https://www.bigcommerce.com).

### Theme Modifications

This tutorial will assume the default BigCommerce Stencil theme 'Cornerstone' is being used.
JSv2 is supported on legacy Blueprint Themes, you will simply need to adjust some of the file paths
and syntax for the including of assets and templates.

The only way to make changes to a Stencil theme is to download a copy,
make the changes and then use `stencil bundle` to upload again as a new theme.
For more information from BigCommerce on using Stencil to bundle themes,
[click here](https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil).

- Navigate to Storefront > My Themes.
- Download the Cornerstone theme.
    - On Current Theme, select Advanced > Download Current Theme.
    - After a few moments the ZIP file containing the theme will download.
    - Unzip the theme locally ready to make some changes.
- Add JSv2 to Theme
    - First remove all existing search functionality
        - Delete the entire folder `templates/components/search`
    - Next extract the copy the contents of [resources](/getting-started/1-hello-world/bigcommerce/resources) into your theme.
    - Use `npm install` and `stencil bundle` to zip the theme once again.
        - _Important: you cannot simply zip the file using your operating system._
    - Navigate to Storefront > My Themes.
    - Scroll down and click the "Upload Theme" button, then select your Zip.

### Activate JSv2

At this stage we have simply uploaded a number of files to a new copy of our theme,
they are not actually doing anything just yet. So finally, edit your Theme
to modify the default BigCommerce layout file `base.html`.

- Navigate to Storefront > My Themes.
- On the uploaded Theme click "Edit Theme Files".
- Find and open the file `templates > layout > base.html`.
- Add the following snippet just before `</head>`
- Click "Save File" in the bottom right.

```html
{{!-- KLEVU - START --}}
    {{!-- KLEVU - JS AND CSS ASSETS --}}
    <script src="//jsv2.klevu.com/export/klevu.js"></script>
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

Finally lets activate our new theme.

- Navigate to Storefront > My Themes.
- Select your new theme and click on Apply. 

Now visit the frontend of your BigCommerce store and **try searching for "bag"**.

## Make some Changes!

Now you have Klevu functionality entirely hosted on your own infrastructure
and are ready to make some more changes to customise your search results!

Next, let's [Add a Sort-By Dropdown](/getting-started/2-sort/bigcommerce)
