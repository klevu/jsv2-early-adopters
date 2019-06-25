# Add a new Tab for Content Search Results

_This tutorial assumes you have already completed and followed
[hello-world](/tutorial/shopify/hello-world) and [sort](/tutorial/shopify/sort) tutorials._

## Upload the Assets and Snippets

Start by uploading the Assets and Snippets in the usual fashion (_either ZIP download/upload
or manually via the Shopify Theme editor_), from the
[resources](/tutorial/shopify/tab-results/resources) folder of this tutorial.

Next let's include those new assets and snippets in our search results page,
so edit Templates > `page.klevuSearch.liquid` to add the four new items:

```html
...
<script src="{{ 'klevu-landing-sort.js' | asset_url }}"></script>
{{ 'klevu-landing-tab-results.css' | asset_url | stylesheet_tag }}
...
{% comment %} KLEVU TEMPLATES LANDING - START {% endcomment %}
    ...
    {% include "klevu-template-landing-contentBlock" %}
    {% include "klevu-template-landing-tab-results" %}
    ...
{% comment %} KLEVU TEMPLATES LANDING - END {% endcomment %}
```

## Add the 'tab' container

To add the [X Products] and [X Other results] tabs we need to edit Snippets > 
`add.me.to.klevu-template-landing-base.liquid` to render our tab-results template.

The line we are adding is: `<%=helper.render('tab-results', scope) %>`.
It will look something like this:

```html
<script type="template/klevu" id="klevuLandingTemplateBase">
    <div class="kuContainer">
        <%=helper.render('tab-results', scope) %>
        
        <% if(!helper.hasResults(data,"productList")) { %>
            <%=helper.render('noResultFound',scope) %>
        <% } else { %>
            <%=helper.render('results',scope) %>
        <% }%>
        <div class="kuClearBoth"></div>
    </div>
</script>
```

## Add the 'Other results' rendering template

Currently the snippet for rendering results only contains HTML for products,
so let's edit `add.me.to.klevu-template-landing-results.liquid` to add a new div.

Before the final `</script>` tag, add the following (which is essentially a copy+paste)
of what is already in the snippet, but with "product" replaced with "content":

```html
<div class="contentList klevuMeta" data-section="contentList">
    <div class="kuResultContent">
        <%=helper.render('filters',scope,data,"contentList") %>
        <div class="kuResultWrap <%=(data.query.contentList.filters.length == 0 )?'kuBlockFullwidth':''%>">
            <%=helper.render('sortBy',scope,data,"contentList") %>
            <%=helper.render('limit',scope,data,"contentList") %>
            <%=helper.render('pagination',scope,data,"contentList") %>
            <div class="kuClearBoth"></div>
            <div class="kuResults kuGridView">
                <ul>
                    <% helper.each(data.query.contentList.result,function(key,item){ %>
                        <% if(item.typeOfRecord == "KLEVU_CMS") { %>
                            <%=helper.render('contentBlock',scope,data,item) %>
                        <% }%>
                    <% }); %>
                </ul>
                <div class="kuClearBoth"></div>
            </div>
        </div>
    </div>
</div>
```

Once the above has been modified, the structure should look something like this:

```html
<script type="template/klevu" id="klevuLandingTemplateResults">
    <div class="kuResultsListing">
        <div class="productList klevuMeta" data-section="productList">
            ...
        </div>
        <div class="contentList klevuMeta" data-section="contentList" />
            ...
        </div>
    </div>
</script>
```

## Add the new API request!

This is the interesting part. Currently only Products are being queried in Klevu,
so we will introduce a new API request to also ask for some Pages and/or Articles.

Edit Assets > `klevu-landing.js` and find the line: 

```js
klevu.search.landing.getScope().chains.request.build.add({
```

You should find two instances of this:
- one with name "addProductList"
- another with name "addProductListFallback"

These are two search queries already active, so let's add another one by introducing a new
block of JavaScript immediately after these, and giving it a name "addContentList".

```js
klevu.search.landing.getScope().chains.request.build.add({
    name: "addContentList",
    fire: function(data, scope) {
        var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

        var contentList = klevu.extend( true , {}  , parameterMap.recordQuery );
        var quickStorage = klevu.getSetting(scope.kScope.settings , "settings.storage");

        contentList.id = "contentList";
        contentList.typeOfRequest = "SEARCH";
        contentList.settings.query.term  = data.context.term;
        contentList.settings.typeOfRecords = ["KLEVU_CMS"];
        contentList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
        contentList.settings.limit = 12;
        contentList.filters.filtersToReturn.enabled = true;
        data.request.current.recordQueries.push(contentList);

        data.context.doSearch = true;
    }
});
```

Now try **searching the frontend for "about"** to see product and content results!

## What's next?

In the meantime, [get your own API Key activated.](/tutorial/shopify/your-api-key)
