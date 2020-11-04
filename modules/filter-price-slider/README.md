# Filter Price Slider

> **Prerequisite:**  
> This module requires the modules based on [facets](/components/facets) component.

## Filter Price Slider - Search Results Landing Page

Range filters are not by default added in the filter result. To enable the functionality, there is an attribute `rangeFilterSettings` that needs to be added in the search request filters.

Below is the example structure of the request structure.

```json
"filters": {
  "filtersToReturn": {
    "enabled": BOOL,
    "rangeFilterSettings": [
      {
        "key": "STR",
        "minMax": BOOL,
        "rangeInterval": INT
      }
    ]
  }
}
```

For instance, to enable the price range filter slider, you need to add the values as mentioned below:

```json
"rangeFilterSettings": [
  {
    "key": "klevu_price",
    "minMax": true
  }
]
```

In addition, it is possible to display a range filter with a specific interval.

```json
"rangeFilterSettings": [
  {
    "key": "klevu_price",
    "minMax": false,
    "rangeInterval": 50
  }
]
```

For more information on request header attributes, please find the detailed document [here](https://developers.klevu.com/api/#filtering-results).

You will find the module available [here](/modules/filter-price-slider/landing).
