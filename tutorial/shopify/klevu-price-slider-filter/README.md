# Add Price Slider filter

Add Price slider filter on search resullt landing page.

The files you will need for this module can be found in the
[resources](/tutorial/shopify/klevu-price-slider-filter/resources) folder.

Edit the code of your current theme and create some assets and snippets in your theme.
This time let’s do this directly within the Shopify Theme editor, rather than downloading and Zipping.

- Navigate to Online Store > Themes.
- On Current Theme, select Actions > Edit Code.
- Assets > Add a new Asset > Upload `klevu-price-slider-filter.css`.
- Assets > Add a new Asset > Upload `klevu-price-slider-filter.js`.
- Assets > Add a new Asset > Upload `nouislider.js`.
- Assets > Add a new Asset > Upload `nouislider.min.css`.

Next we need to include these assets and snippets in our page,
so edit Templates > `page.klevuSearch.liquid`.

Include `nouislider.js` and `klevu-price-slider-filter.js` by modifying the contents like this:

```html
...
<script src="{{ 'nouislider.js' | asset_url }}"></script>
<script src="{{ 'klevu-price-slider-filter.js' | asset_url }}"></script>
...

```

Include `nouislider.min.css` and `klevu-price-slider-filter.css` by modifying the contents like this:

```html
{{ 'nouislider.min.css' | asset_url | stylesheet_tag }}
{{ 'klevu-price-slider-filter.css' | asset_url | stylesheet_tag }}
...

```
Click Save to persist your changes.

Note:

Search for the `search-landing-init` event in `klevu-landing.js`, if that is there then copy whole code and create new file in Assets named as `klevu-landing-init.js`. 
Now paste `search-landing-init` whole event code to that file.

Include `klevu-landing-init.js` in Templates > `page.klevuSearch.liquid` by modifying the contents like this:

```html
...
<script src="{{ 'klevu-landing-init.js' | asset_url }}"></script>
...
<div class="klevuLanding"></div>
...

```
Click Save to persist your changes.

Next we need to include slider filter UI in filters.
so edit Snippets > `klevu-template-landing-filtes.liquid`.
Add filter UI by modifying the content like this:

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
        <div class="kuFilterHead kuCollapse">
            <%=filter.label%>
        </div>
        <div class="sliderFilterNames">                           
            <div class="kuPriceSlider" data-query = "<%=dataLocal%>">
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

Click Save to persist your changes,
then visit a search results page on your Shopify store to **try the Price slider filter**!