# Custom Filters collapsing

You will find the necessary resources for this module available here:
[resources](/modules/filter-collapse/resources). Please add these with the
method appropriate to your chosen framework.

# Add filter collapse rendering template

Add the template for rendering filter collapse for related results,
so edit the corresponding landing `filters.tpl` to add filter collapse renderer template.

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

Now try **filters on landing page products**!

Note:
- Filter collapse has been set in `klevu-filter-collapse.js`.
- In order to modify filter collapse, edit Assets > `klevu-filter-collapse.js` and update the `collapsedFilters` list inside.
- In this example, filter collapse is based on the filter key.