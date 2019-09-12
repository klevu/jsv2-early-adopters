# Filter list reordering

Reorder filters in Search result landing page.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-filter-reorder.js`

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-filter-reorder.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-filter-reorder.js' | asset_url }}"></script>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try filters on landing page products**!

Note:
- Filter order priority has been set in `klevu-filter-reorder.js`.
- In order to modify filter sequence, edit Assets > `klevu-filter-reorder.js` and update the `priorityFilters` list inside.
- In this example, filter reordering is based on the filter key.