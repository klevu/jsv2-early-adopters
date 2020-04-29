# Checkout Analytics Request

> **Note:**  
> Please ensure your backend isn’t already sending checkout data to Klevu, as this will result in duplicates.

> **Prerequisite:**  
> This module requires the [analytics-utils](/components/analytics-utils) base component.

This module extends the `analytics-utils` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/analytics-utils/resources).
- [This module's resources](/modules/checkout-analytics-request/resources).

_If you are not familiar with where to add these resources,
please follow the appropriate ['hello world'](/getting-started/1-hello-world) tutorial._

### Module Usability

This extension module will enable the `sendCheckoutAnalyticsRequest` function to `analyticsUtil` base component.

Function contains the product information as parameters. Based on the implementation, add the product data inputs to the function parameters and it will fire the Klevu checkout analytics request to the server.

```javascript
/**
 * @param {*} productId
 * @param {*} unit
 * @param {*} salePrice
 * @param {*} currency
 * @param {*} shopperIp
 */
klevu.analyticsUtil.base.sendCheckoutAnalyticsRequest(
  "40791867278",
  "1",
  "34.0",
  "EUR",
  ""
);
```

### Code Reference

[klevu-checkout-analytics-request.js](/modules/checkout-analytics-request/resources/assets/js/klevu-checkout-analytics-request.js)  
contains the component extension code for Klevu checkout analytics request. It has the standalone function with necessary product data inputs as parameters.
