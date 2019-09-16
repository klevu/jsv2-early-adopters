# Sliding filter for mobile view

![mobile-filter-slider closed](/modules/mobile-sliding-filter/images/image001.png)
![mobile-filter-slider opened](/modules/mobile-sliding-filter/images/image002.png)

You will find the necessary resources for this module available here:
[resources](/modules/mobile-sliding-filter/resources). Please add these with the
method appropriate to your chosen framework. 

# Add sliding filter rendering template

Add the template for rendering sliding filter for related results,
so edit the corresponding landing `results.tpl` to add sliding filter renderer template.

```html
...
<div class="kuResultsListing">
    <div class="klevuMeta">
        <div class="kuResultContent">            
            <a href="javascript:void(0)" class="kuBtn kuFacetsSlideIn"><%=helper.translate("Filters")%></a>

            ...
        </div>
    </div>
    ...
</div>
...
```

Next, Add the template for rendering sliding filter for related results,
so edit the corresponding landing `filters.tpl` to add sliding filter renderer template.

```html
...
    <div class="kuFilters">
        ...

        <div class="kuFiltersFooter">
            <a href="javascript:void(0)" class="kuBtn kuFacetsSlideOut kuMobileFilterCloseBtn"><%=helper.translate("Close")%></a>
  		</div>
    </div>
...
```

Now try **sliding filters on landing page products for mobile view**!