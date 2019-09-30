# Hello World Tutorial for Magento 2

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

_Note that Klevu JS Library is as flexible as Magento 2. This example is just one
way to integrate Klevu JS Library for illustrative purposes and has settings such
as the API key hard-coded into the JS files. Feel free to use your own preferred approach
to move files around, your own layout implementation and make the necessary data
configurable via Store Configuration, etc._

## Make some Changes!

Now you have Klevu functionality entirely hosted on your own infrastructure
and are ready to make some more changes to customise your search results!

Next, let's [Add a Sort-By Dropdown](/getting-started/2-sort/magento2)
