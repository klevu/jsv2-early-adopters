# Also Viewed Products

> **Prerequisite:**  
> This module requires the [product-recommendation](/components/product-recommendation) base component.  
> This module requires the [analytics-utils](/components/analytics-utils) component to fire up the analytics events within this module.

![Hand-picked Products Banner](/modules/product-recommendation/images/prc-hand-picked.png)

This module is to append hand-picked products by adding a particular product id list.

In this example, we have created a slider banner to demonstrate the products in the user interface which can be injected into any area of your website after rendering it's targeted HTML element and other dependencies.

> **Important:**  
> This module fire up the analytics events, you also need to add the resources of [analytics-utils](/components/analytics-utils/resources) component.

This module extends the `product-recommendation` component, so you need to add the resources from that in addition to this module's resources:

- [Base component](/components/product-recommendation/resources).
- [This module's resources](/modules/product-recommendation/hand-picked/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Module Usage

As other JSv2 modules, this module will also have the HTML, JS, and CSS files to its resources. You need to add the targeted element with the given class name.

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
  <div class="klevuHandPickedProductsTemplate"></div>
  ...
</body>
```

To fire up the `handPicked` module you need to add the below-given code with the appropriate parameters.

```javascript
/**
 * @param {*} templateId
 * @param {*} appendToClass
 * @param {*} productIds
 */
klevu.search.modules.productsRecommendation.base.handPicked(
  "#klevuHandPickedProductsTemplate",
  ".klevuHandPickedProductsTemplate",
  ["40792255502", "40792256014", "40792916366", "40793536718", "40793534286"]
);
```

### Code Reference

[klevu-product-recommendation-hand-picked.js](/modules/product-recommendation/hand-picked/resources/assets/js/klevu-product-recommendation-hand-picked.js)  
contains the logic for getting the products to result set.

[product-recommendation-hand-picked.tpl](/modules/product-recommendation/hand-picked/resources/templates/product-recommendation-hand-picked.tpl)  
contains the HTML for the of the module. You can also add or modify the functionality based on your requirements.

[klevu-product-recommendation-hand-picked.css](/modules/product-recommendation/hand-picked/resources/assets/css/klevu-product-recommendation-hand-picked.css)  
contains the styles of a module.

> **Note:**  
> Added analytics on this functionality. [Line reference](/modules/product-recommendation/also-viewed/resources/assets/js/klevu-product-recommendation-also-viewed.js#L96) in code file.
