# Sliding filter for mobile view

Add filters in slider in mobile view.

![mobile-filter-slider closed](/tutorial/shopify/klevu-mobile-sliding-filter/images/image001.png)
![mobile-filter-slider opened](/tutorial/shopify/klevu-mobile-sliding-filter/images/image002.png)

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-mobile-sliding-filter.css`
- Assets > Add a new Asset > Upload `klevu-mobile-sliding-filter.js`

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-mobile-sliding-filter.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-mobile-sliding-filter.js' | asset_url }}"></script>
...
```

Include `klevu-mobile-sliding-filter.css` by modifying the contents like this:

```html
...
{{ 'klevu-mobile-sliding-filter.css' | asset_url | stylesheet_tag }}
...
```

Click Save to persist your changes.

Next we need to add changes in landing result file.
So edit Snippets > `klevu-template-landing-results.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
<div class="kuResultsListing">
    
    <a href="javascript:void(0)" class="kuBtn kuFacetsSlideIn">Filters</a>
    
    ...
</div>
...
```

Click Save to persist your changes.

Next, edit Snippets > `klevu-template-landing-filters.liquid`
Add color swatches UI by the modifying the code as below:

```html
...
    <div class="kuFilters">
        ...

        <div class="kuFiltersFooter">
            <a href="javascript:void(0)" class="kuBtn kuFacetsSlideOut kuMobileFilterCloseBtn">Close</a>
  		</div>
    </div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try sliding filters on landing page products for mobile view**!