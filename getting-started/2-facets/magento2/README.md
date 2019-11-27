# Add Facets with Magento 2

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component, usage instructions are included below.

You may notice that the search results page does not have any facets. Let’s add them.

![Facets left](/getting-started/2-facets/images/image001.png)

In order to make the required changes to you'll need to modify the extension files created
during the [hello-world](/getting-started/1-hello-world/magento2) tutorial.

Copy the following files into your theme:
- `klevu-facets.js` from [facet component JS](/components/facets/resources/assets/js) into `view/frontend/web/js`.
- `klevu-facets.css` from [facet component CSS](/components/facets/resources/assets/css) into `view/frontend/web/css`.
- [this module resources](/getting-started/2-facets/magento2/resources) into the root of your extension.

Next we need to include these assets and templates in our page,
so edit the file `view/frontend/templates/landing.phtml`.

Include `klevu-landing-filter-left.js` by modifying the contents like this:

```html
...
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/klevu-facets.js') ?>"></script>
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing-filter-left.js') ?>"></script>

<link rel="stylesheet" type="text/css" media="all" href="<?= $block->getViewFileUrl('Klevu_JSv2::css/klevu-facets.css'); ?>" />
<link rel="stylesheet" type="text/css" media="all" href="<?= $block->getViewFileUrl('Klevu_JSv2::css/landing/klevu-landing-filter-left.css'); ?>" />
...
```

Include the `landing-filter-left.phtml` template by modifying `catalogsearch_result_index.xml` like this:
Include the new JavaScript and CSS files by modifying the contents like this:

```html
<block class="Magento\Framework\View\Element\Template" name="klevu_landing_sort" template="Klevu_JSv2::landing/landing-filter-left.phtml" after="-" />
```

Finally, we need to include the facets in our search results template,
so find and edit `view/frontend/templates/landing/landing-results.phtml`.

Add a new filter renderer after the `kuResultContent` opening div:

```html
<div class="kuResultsListing">
    <div class="productList klevuMeta" data-section="productList">
        <div class="kuResultContent">
            
            <%=helper.render('filters',scope,data,"productList") %>
            ...

        </div>        
    </div>
</div>
```

Flush your cache then visit a search results page on your Magento 2 store to **try the Facets**!

## What's next?

Next, let's [Add a Sort-By Dropdown](/getting-started/3-sort/magento2)