# Add Klevu Analytics to the application

Klevu Analytics is mainly focused on improving search results.  

- **[Add Klevu Analytics with Shopify](/getting-started/6-analytics/shopify)**
- **[Add Klevu Analytics with BigCommerce](/getting-started/6-analytics/bigcommerce)**
- **[Add Klevu Analytics with Magento 2](/getting-started/6-analytics/magento2)**

The following code reference has two analytics functionality. Klevu Analytics functionality can be added in places based on the data you want to capture.

**Term Analytics**  
This functionality is for capturing search event data. In the code reference files, this functionality has been added on Quick Search and Search Result Landing Page. 
Below snippet illustrates the usage of this functionality.
```js
var termOptions = {
	term: "bags",
	totalResults: 100,
	typeOfQuery: "WILDCARD_AND"	
};
klevu.analyticsEvents.term(termOptions);
```
**Click Analytics**  
This functionality is for capturing product click event. In the code reference file, this functionality has been added to capture details from Quick Search and Landing page products click.  
Below snippet illustrates the usage of this functionality.  
```js
var clickOptions = {
	term: "bags",
	productId: 40791907918,
	productName: "Voyage Yoga Bag",
	productUrl: "http://shopify-demo.klevu.com/products/voyage-yoga-bag"	
};
klevu.analyticsEvents.click(clickOptions);
```

## Code Reference

Klevu Analytics can be added to both Quick Search and Search Results Landing Page,
please find the corresponding instructions for each below:

[klevu-quick-analytics.js](/getting-started/6-analytics/resources/assets/js/quick/klevu-quick-analytics.js)  
contains Klevu Analytics extension for Quick Search results. By including this file to the application, it enables the analytics of each character written in the Quick Search input.  

[klevu-landing-analytics.js](/getting-started/6-analytics/resources/assets/js/landing/klevu-landing-analytics.js)  
contains Klevu Analytics extension for Search Results Landing Page. By including this file to the application, it enables the analytics of each search call fires from the landing page.  
  
Furthermore, by clicking on result products it will also track the click event to improve the results of your search.  