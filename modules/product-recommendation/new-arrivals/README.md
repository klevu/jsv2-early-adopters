# New Arrival Products

> **Prerequisite:**  
> This module requires the [product-recommendation](/components/product-recommendation) base component.  
> This module requires the [analytics-utils](/components/analytics-utils) component to fire up the analytics events within this module.

![in-trends Products Banner](/modules/product-recommendation/images/prc-new-arrivals.png)

This module is to append new arrival products.

In this example, we have created a slider banner to demonstrate the products in the user interface which can be injected into any area of your website after rendering it's targeted HTML element and other dependencies.

> **Important:**  
> This module fire up the analytics events, you also need to add the resources of [analytics-utils](/components/analytics-utils/resources) component.

This module extends the `product-recommendation` component, so you need to add the resources from that in addition to this module's resources:

- [Base component](/components/product-recommendation/resources).
- [This module's resources](/modules/product-recommendation/new-arrivals/resources).

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
  <div class="klevuNewArrivalProductsTemplate"></div>
  ...
</body>
```

To fire up the `newArrivals` module you need to add the below-given code with the appropriate parameters.

```javascript
/**
 * @param {*} templateId
 * @param {*} appendToClass
 */
klevu.search.modules.productsRecommendation.base.newArrivals(
  "#klevuNewArrivalProductsTemplate",
  ".klevuNewArrivalProductsTemplate"
);
```

### Code Reference

[klevu-product-recommendation-new-arrivals.js](/modules/product-recommendation/new-arrivals/resources/assets/js/klevu-product-recommendation-new-arrivals.js)  
contains the logic for getting the products to result set.

[product-recommendation-new-arrivals.tpl](/modules/product-recommendation/new-arrivals/resources/templates/product-recommendation-new-arrivals.tpl)  
contains the HTML for the of the module. You can also add or modify the functionality based on your requirements.

[klevu-product-recommendation-new-arrivals.css](/modules/product-recommendation/new-arrivals/resources/assets/css/klevu-product-recommendation-new-arrivals.css)  
contains the styles of a module.

> **Note:**  
> Added analytics on this functionality. [Line reference](/modules/product-recommendation/new-arrivals/resources/assets/js/klevu-product-recommendation-new-arrivals.js#L77) in code file.
