# Add a Sort-By Dropdown with Magento 2

You may notice that the search results page does not have a sorting option. Let’s add one.

![Sort-By Dropdown](/getting-started/2-sort/images/sort-by-dropdown.jpg)

In order to make the required changes to you'll need to modify the extension files created
during the [hello-world](/getting-started/1-hello-world/magento2) tutorial.

Copy the files from the [resources](/getting-started/2-sort/magento2/resources)
folder directly into your extension.

Next we need to include these assets and templates in our page,
so edit the file `view/frontend/templates/landing.phtml`.

Include `klevu-landing-sort.js` by modifying the contents like this:

```html
...
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing.js') ?>"></script>
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing-sort.js') ?>"></script>
...
```

Include the `landing-sort.phtml` template by modifying `catalogsearch_result_index.xml` like this:

```html
<block class="Magento\Framework\View\Element\Template" name="klevu_landing_results" template="Klevu_JSv2::landing/landing-results.phtml" after="-" />
<block class="Magento\Framework\View\Element\Template" name="klevu_landing_sort" template="Klevu_JSv2::landing/landing-sort.phtml" after="-" />
```

Finally, we need to include this sort dropdown in our main template,
so find and edit `view/frontend/templates/landing/landing-results.phtml`.

Locate the line that renders the pagination, and add a new sortBy render helper above it:

```html
...
<%=helper.render('sortBy',scope,data,"productList") %>
<%=helper.render('pagination',scope,data,"productList") %>
...
```

Flush your cache then visit a search results page on your Magento 2 store to **try the sort ordering**!

## What's next?

Next, let's [add a pagination limit dropdown.](/getting-started/3-limit/magento2)
