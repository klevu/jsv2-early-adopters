# Filter list reordering

Reorder filters in Search result landing page.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-filter-option-reorder.js`

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-filter-option-reorder.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-filter-option-reorder.js' | asset_url }}"></script>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try filters on landing page products**!

Note:
- Filter order priority has been set in `klevu-filter-option-reorder.js`.
- In order to modify filter sequence, edit Assets > `klevu-filter-option-reorder.js` and update the `priorityFilterOptions` list inside.
- In this example, filter reordering is based on the filter key.