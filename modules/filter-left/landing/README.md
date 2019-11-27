# Filter-left - Search Results Landing Page

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component.  

![filter left](/modules/filter-left/images/image001.png)

This module extends the `facets` component, so you need to
add the resources from that in addition to this module's resources:

- [Base component](/components/facets/resources).
- [This module's resources](/modules/filter-left/landing/resources).

## Template Modifications

Modify `landing-results.tpl` to add the filter items on the left side of the landing page.

```html
<div class="kuResultsListing">
    <div class="productList klevuMeta" data-section="productList">
        <div class="kuResultContent">
            
            <%=helper.render('filters',scope,data,"productList") %>
            ...

        </div>        
    </div>
</div>
```

### Code Reference 

[klevu-landing-filter-left.js](/modules/filter-left/landing/resources/assets/js/klevu-landing-filter-left.js)  
connects the base component to your search results landing page implementation
and show how to enable the base component for your targeted scope.
