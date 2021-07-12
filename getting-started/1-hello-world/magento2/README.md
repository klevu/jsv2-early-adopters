# Hello World Tutorial for Magento 2

> :bulb: **Update June 2021**  
> Get up and running even faster with our fully functional, production-ready **[Klevu Theme](https://developers.klevu.com/javascript-library/integration/klevu-theme)**.

The current Klevu Magento extension currently automatically integrates JSv1,
so for the time being this tutorial will not include a full data integration with Klevu
and will instead be used to showcase the templating and frontend functionality only.

![Klevu Quick Search](/getting-started/1-hello-world/images/intro-quick-search.jpg)

## Integrate Klevu JS Library with Magento 2

First create a new vanilla Magento store with your own preferred approach.

In the resources folder we have included an
[example extension](/getting-started/1-hello-world/magento2/resources)
for getting up and running with Magento 2. 

Add this extension to your demo store, and once you have enabled the extension,
**try searching for "bag"**.

The results you see will be from our demo store since this example uses our API Key.
To see your own product data, please complete the remaining hello-world tutorials below.

_Note that Klevu JS Library is as flexible as Magento 2. This example is just one
way to integrate Klevu JS Library for illustrative purposes and has settings such
as the API key hard-coded into the JS files. Feel free to use your own preferred approach
to move files around, your own layout implementation and make the necessary data
configurable via Store Configuration, etc._

## Make some Changes!

Now you have Klevu functionality entirely hosted on your own infrastructure
and are ready to make some more changes to customise your search results!

Next, let's [Add some Facets / Filters](/getting-started/2-facets/magento2)
