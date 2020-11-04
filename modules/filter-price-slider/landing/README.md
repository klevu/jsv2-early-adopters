# Filter Price Slider - Search Results Landing Page

>**Prerequisite:**  
>This module requires the modules based on [facets](/components/facets) component.  

You will find the necessary resources for this module available here:
[resources](/modules/filter-price-slider/landing/resources).

**Important**

- This module contains the updates/addition in the request header attributes. It is important to place the module's `JavaScript` implementation before this [line](https://github.com/klevu/jsv2-early-adopters/blob/master/getting-started/1-hello-world/custom/resources/assets/js/landing/klevu-landing.js#L453) in the `klevu-landing.js`.
- In the resources, you will find the separate `.js` file for the initialization request of landing page [here](/modules/filter-price-slider/landing/resources/assets/js/klevu-landing-init.js). 
You can also choose this way to create a separate file for the landing init and remove the event code from the landing file. Then import the init `.js` file at the end of your Klevu JSv2 `JavaScript` imports.  

### Slider UI Framework Usage

You need to add the slider UI framework for this module. In this example, we have used the [nouislider](https://refreshless.com/nouislider/). All the resources related to the slider framework have been added [here](/modules/filter-price-slider/landing/resources/assets/lib).

You can also use any other framework based on your UI but for that you need to change in the `JavaScript` implementation of this module to add/update the values to the slider. 


> Please add these resource files with the method appropriate to your chosen framework. 


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