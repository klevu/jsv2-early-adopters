# Related Products

> **Prerequisite:**  
> This module requires the [product-recommendation](/components/product-recommendation) base component.  
> This module requires the [analytics-utils](/components/analytics-utils) component to fire up the analytics events within this module.

![in-trends Products Banner](/modules/product-recommendation/images/prc-related.png)

This module is to append related products of a particular product(s).

In this example, we have created a slider banner to demonstrate the products in the user interface which can be injected into any area of your website after rendering it's targeted HTML element and other dependencies.

> **Important:**  
> This module fire up the analytics events, you also need to add the resources of [analytics-utils](/components/analytics-utils/resources) component.

This module extends the `product-recommendation` component, so you need to add the resources from that in addition to this module's resources:

- [Base component](/components/product-recommendation/resources).
- [This module's resources](/modules/product-recommendation/related/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Module Usage

Same as other JSv2 modules, this module will also have the HTML, JS, and CSS files to its resources. You need to add the targeted element with the given class name.

```html
<body>
  <!--
    Include the Template file.
    You can either copy+paste the HTML content directly,
    or you can use your programming language to include them.
    eg. with PHP <?php include('/path/to/folder/templates.tpl'); ?>
    -->
  <!-- ADD TEMPLATES HERE, USING YOUR PREFERRED APPROACH -->

  ...
  <div class="klevuRelatedProductsTemplate"></div>
  ...
</body>
```

To fire up the `related` module you need to add the below-given code with the appropriate parameters.

```javascript
/**
 * @param {*} templateId
 * @param {*} appendToClass
 * @param {*} productIds
 * @param {*} filters
 */
klevu.search.modules.productsRecommendation.base.related(
  "#klevuRelatedProductsTemplate",
  ".klevuRelatedProductsTemplate",
  ["40792255502"],
  null
);
```

### Code Reference

[klevu-product-recommendation-related.js](/modules/product-recommendation/related/resources/assets/js/klevu-product-recommendation-related.js)  
contains the logic for getting the products to result set.

[product-recommendation-related.tpl](/modules/product-recommendation/related/resources/templates/product-recommendation-related.tpl)  
contains the HTML for the of the module. You can also add or modify the functionality based on your requirements.

[klevu-product-recommendation-related.css](/modules/product-recommendation/related/resources/assets/css/klevu-product-recommendation-related.css)  
contains the styles of a module.

> **Note:**  
> Added analytics on this functionality. [Line reference](/modules/product-recommendation/related/resources/assets/js/klevu-product-recommendation-related.js#L97) in code file.
