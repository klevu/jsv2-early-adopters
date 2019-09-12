# Custom Filters collapsing

On page load collapsed particular filters.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-filter-collapse.js`

Next we need to include these assets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `klevu-filter-collapse.js` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-filter-collapse.js' | asset_url }}"></script>
...
```

Click Save to persist your changes.

Next, we need to modify filter template code for adding collapse functionality,
so edit Snippets > `klevu-template-landing-filters.liquid`.
Modify code as per below.

```html
...
<div class="kuFilters">
    ...
    <!-- <div class="kuFilterHead kuCollapse"> -->
    <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">    
    ...
    ...
    <!-- <div class="kuFilterNames"> -->
    <div class="kuFilterNames <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">
    ...
</div>
...
```

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try filters on landing page products**!

Note:
- Filter collapse has been set in `klevu-filter-collapse.js`.
- In order to modify filter collapse, edit Assets > `klevu-filter-collapse.js` and update the `collapsedFilters` list inside.
- In this example, filter collapse is based on the filter key.