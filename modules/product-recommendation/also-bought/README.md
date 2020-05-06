# Also Bought Products

> **Prerequisite:**  
> This module requires the [product-recommendation](/components/product-recommendation) base component.  
> This module requires the [analytics-utils](/components/analytics-utils) component to fire up the analytics events within this module.

![Also Bought Products Banner](/modules/product-recommendation/images/prc-also-bought.png)

This module is to append also bought products of a particular set of the product(s) or the facet items.

In this example, we have created a slider banner to demonstrate the products in the user interface which can be injected into any area of your website after rendering it's targeted HTML element and other dependencies.

> **Important:**  
> This module fire up the analytics events, you also need to add the resources of [analytics-utils](/components/analytics-utils/resources) component.

This module extends the `product-recommendation` component, so you need to add the resources from that in addition to this module's resources:

- [Base component](/components/product-recommendation/resources).
- [This module's resources](/modules/product-recommendation/also-bought/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

## Module Usage

As other JSv2 modules, this module will also have the HTML, JS and CSS files to its resources. You need to add the targeted element with the given class name.

```html
<body>
  ...
  <div class="klevuAlsoBoughtProductsTemplate"></div>
  ...
</body>
```

To fire up the `alsoBought` module you need to add the below given code with the appropriate parameters.

```javascript
/**
 * @param {*} templateId
 * @param {*} appendToClass
 * @param {*} productIds
 * @param {*} filters
 */
klevu.search.modules.productsRecommendation.base.alsoBought(
  "#klevuLandingTemplateAlsoBought",
  ".klevuAlsoBoughtProductsTemplate",
  ["40792255502"],
  null
);
```

### Code Reference

[klevu-product-recommendation-also-bought.js](/modules/product-recommendation/also-bought/resources/assets/js/klevu-product-recommendation-also-bought.js)  
contains the logic for getting the products result set.

[product-recommendation-also-bought.tpl](/modules/product-recommendation/also-bought/resources/templates/product-recommendation-also-bought.tpl)  
contains the HTML for the of the module. You can also add or modify the functionality based on your requirements.

[klevu-product-recommendation-also-bought.css](/modules/product-recommendation/also-bought/resources/assets/css/klevu-product-recommendation-also-bought.css)  
contains the styles of a module.
