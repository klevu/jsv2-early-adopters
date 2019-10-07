# Add a Pagination Limit Dropdown in Magento 2

You may also notice that the search results page also does not have a limit option, so let’s add one of those too.

![Limit Dropdown](/getting-started/4-limit/images/limit-dropdown.jpg)

The steps to add a pagination limit are actually very similar to adding a Sort By,
so rather than spelling out each step, please go ahead and follow the same steps as
in that tutorial but with the following assets and code snippets:

```html
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/landing/klevu-landing-limit.js') ?>"></script>
```

```html
<block class="Magento\Framework\View\Element\Template" name="klevu_landing_limit" template="Klevu_JSv2::landing/landing-limit.phtml" after="-" />
```

```js
<%=helper.render('limit',scope,data,"productList") %>
```

The Assets and Templates you will need for this module can be found
in the [resources](/getting-started/4-limit/resources) folder.

You will notice these resources are structured in a slightly different format
so you will need to make the following amendments:

- copy `js/klevu-landing-limit.js` to `view/frontend/web/js/landing/klevu-landing-limit.js`
- copy `landing-limit.tpl` to `view/frontend/templates/landing/landing-limit.phtml`

Flush your cache then visit a search results page on your Magento website to **try the pagination limit**!

## What's next?

There are various other tutorials available for you to try,
however they are structured this more generic format in order
that they can be used across various frameworks such as Magento,
Shopify, BigCommerce, etc.

When trying those tutorials, you will need to rename files and place
the resources in the applicable file locations as per this tutorial.

- [Click here for more tutorials](/modules)!
- [Click here to use your own API Key](/getting-started/5-your-api-key/magento2)!
