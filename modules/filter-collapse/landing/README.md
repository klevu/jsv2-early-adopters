# Filter Collapse - Search Results Landing Page

>**Prerequisite:**  
>This module requires the modules based on [filters](/components/facets) component. 

You will find the necessary resources for this module available here:
[resources](/modules/filter-collapse/landing/resources). Please add these with the
method appropriate to your chosen framework.

>**Note:**   
>In order to modify filter collapse, [klevu-landing-filter-collapse.js](/modules/filter-collapse/landing/resources/assets/js/klevu-landing-filter-collapse.js) and update the `collapsedFilters` list inside.  
>In this example, filter collapse is based on the filter key.


## Template Modifications

Add the template for rendering filter collapse for related results,
so edit the corresponding landing `landing-filters.tpl` to add filter collapse renderer template.

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