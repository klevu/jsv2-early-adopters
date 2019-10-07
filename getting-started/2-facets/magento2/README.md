# Add Facets with Magento 2

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component.

You may notice that the search results page does not have a Facets. Let’s add one.

![Facets left](/getting-started/2-facets/images/image001.png)

In order to make the required changes to you'll need to modify the extension files created
during the [hello-world](/getting-started/1-hello-world/magento2) tutorial.

Copy the files from the [resources](/getting-started/2-facets/magento2/resources)
folder directly into your extension.

Next we need to include these assets and templates in our page,
so edit the file `view/frontend/templates/landing.phtml`.

Include `klevu-landing-filter-left.js` by modifying the contents like this:

```html
...
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing-filter-left.js') ?>"></script>
...
```

Include the `landing-filter-left.phtml` template by modifying `catalogsearch_result_index.xml` like this:

```html
<block class="Magento\Framework\View\Element\Template" name="klevu_landing_sort" template="Klevu_JSv2::landing/landing-filter-left.phtml" after="-" />
```

Finally, we need to include this sort dropdown in our main template,
so find and edit `view/frontend/templates/landing/landing-results.phtml`.

Locate the line that renders the filters:

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