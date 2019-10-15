# Filter Price Slider - Search Results Landing Page

>**Prerequisite:**  
>This module requires the modules based on [facets](/components/facets) component.  

You will find the necessary resources for this module available here:
[resources](/modules/filter-price-slider/landing/resources). Please add these with the
method appropriate to your chosen framework. 

## Template Modifications

Add the template for rendering price slider filter for related results.  
Edit the corresponding `landing-filters.tpl` to add price slider filter renderer template.  
Replace below code  


```html
...
<% } else { %>
    <!-- Slider Facets, Price Slider, etc. -->
<% } %>
...
```

with this code

```html
...
<% } else if(filter.type == "SLIDER")  { %>
    <div class="kuFilterBox klevuFilter data-filter="<%=filter.key%>">
        <div class="kuFilterHead <%=(filter.isCollapsed) ? 'kuExpand' : 'kuCollapse'%>">
            <% var filter_label = (filter.label=="klevu_price") ? "price" : filter.label; %>
            <%=filter_label%>
        </div>
        <div class="kuFilterNames sliderFilterNames <%=(filter.isCollapsed) ? 'kuFilterCollapse' : ''%>">                           
            <div class="kuPriceSlider klevuSliderFilter" data-query = "<%=dataLocal%>">
                <div data-querykey = "<%=dataLocal%>" class="noUi-target noUi-ltr noUi-horizontal noUi-background kuSliderFilter kuPriceRangeSliderFilter<%=dataLocal%>"></div>
                <div class="kuSliderVal">
                    <div class="kuSliderVal-min">
                        <span class="kulabel">Min</span> 
                        <span class="kuCurrency"></span>
                        <span class="minValue<%=dataLocal%>" ></span>
                    </div>
                    <span class="kuSliderTo">To</span>
                    <div class="kuSliderVal-max">
                        <span class="kulabel">Max</span> 
                        <span class="kuCurrency"></span>
                        <span class="maxValue<%=dataLocal%>"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
<% } else { %>
    <!-- Other Facets -->
<% } %>
...
```

Now try, **Price slider filter**!