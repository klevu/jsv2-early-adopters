# Hello World Tutorial

Klevu already has a Shopify App which uses Version 1 of our JavaScript Library.
We will use this as the basis for our tutorial, which will automatically create
a Klevu account and provide you with an API Key for use during this tutorial.

_No part of this tutorial requires a credit card or personal credentials._

## Install the Klevu App on Shopify

- Create a [Shopify free trial](https://www.shopify.com).
- Install Klevu App:
    - Go to Apps > Visit the Shopify App Store.
    - Search “Klevu” and click on “Klevu Search” App.
    - Click on the Add App button.
    - Follow the instructions to install the App.
    - Click on the “Enterprise” Sign-Up Now button (its Free, no CC needed).
    - You should now see the Klevu Merchant Centre (or KMC as we call it).
- Disable the Klevu App: (why? see introduction notes below)
    - Click the ‘Settings’ button at the top of the screen.
    - Change the setting “Klevu Search on Frontend” to “Disabled”.
    - Scroll down and click the Submit button.

**Why do we disable the Klevu App?**
This is to remove Version 1 of the JavaScript Library,
which is automatically installed with the App.
We don’t need this since we will be using JSv2.
The benefit of installing the App is that it creates us a Klevu API key
and will begin synchronising your Shopify products immediately.

## Send us your API Key

By default Klevu API Keys are not enabled for APIv2,
so please send us yours so we can activate it for you.
Don’t worry, in the meantime you can use our demo API Key for the rest of this tutorial.

- Click on the “Klevu Search” breadcrumb at the top to return to the KMC
- Next click the Shop Info link near the top right
- Copy the value of your “JS API Key” and email it to us
    - Send this to your Klevu contact (the person that gave you this document!) with email subject: “JSv2 early adopter API Key”
    - We will then convert your API key from V1 to V2.
    - In the meantime, please use this API key (it will have different product data to your own Shopify store, but at least you can get started!)
        - Api Key: `klevu-15192822724627551`

## Install Klevu JSv2 on Shopify

Now you have a Shopify store with the Klevu App installed,
the next step is to install JSv2 so you can get Klevu search up
and running with full control over the search functionality, look and feel.

### Theme Modifications

The quickest and easiest way to make the required changes to the theme is to download a copy,
make the changes and then upload again as a new theme.
You can also manually make the required changes via the Shopify admin panel,
but this tutorial will show the easier route. For more information on downloading
and uploading themes, [click here](https://help.shopify.com/en/themes/customization/troubleshooting/upload-multiple-files).

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Download Theme File.
    - This will email the theme file to you for download.
- Click the link in your email to download the theme and unzip locally.
- Next extract the JSv2 ZIP attached and copy the contents of the folder hello-world into your theme.
    - _Do not copy `add.me.to.theme.liquid`, ignore this file for now._
- Zip the theme once again.
- Navigate to Online Store > Themes.
- Click the Upload Theme button near the bottom and select your ZIP.
- Once imported, select your theme > Actions > Publish.

### Change Search Results Page Template

Modify the Shopify Page “Search Results” to use the template: `page.klevuSearch.liquid`.
You can leave the Page content as it is, since this is ignored in the above template.

![Search Results Page](/tutorial/shopify/hello-world/images/search-results-page.jpg)

- Navigate to Online Store > Pages.
- Edit the `Search Results` page.
- On the right hand side, change the template to `page.klevuSearch`.
- Save the Page.

### Activate JSv2

At this stage we have simply uploaded a number of files to our theme,
they are not actually doing anything just yet. So finally, edit your Theme
once more and modify the default Shopify layout file `theme.liquid`.
Add the snippet of HTML contained within add.me.to.theme.liquid just before `</head>`.
Now visit any page on your Shopify store and start searching!

## Make some Changes

Now you have Klevu functionality entirely hosted on your own infrastructure
(apart from `jsv2.klevu.com/export/klevu.js`, but feel free to download this
and host it yourself if you wish). In Version 1 of our Klevu JavaScript,
if you wanted to make any changes you’d need to contact our support.

**Let’s make some changes now without that bottleneck!**

Recommended order:

- 1. [Add a Sort-By Dropdown.](/tutorial/shopify/sort)
- 2. [Add a Pagination Limit Dropdown.](/tutorial/shopify/limit)
- 3. [Add a Content tab.](/tutorial/shopify/tab-results)
