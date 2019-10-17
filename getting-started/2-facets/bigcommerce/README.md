# Add Facets with BigCommerce

> **Prerequisite:**  
> This module requires the [facets](/components/facets) base component.

You may notice that the search results page does not have any facets. Let’s add them.

![Facets left](/getting-started/2-facets/images/image001.png)

As per the [hello-world](/getting-started/1-hello-world/bigcommerce) tutorial,
in order to make the required changes to your theme you'll need to download it
and use `stencil bundle` to compile, so go ahead and download your theme again.

Once downloaded, copy the files from the [resources](/getting-started/2-facets/bigcommerce/resources)
folder directly into your theme.

Next we need to include these assets and templates in our page,
so edit the file `templates/pages/search.html`.

Include `klevu-landing-filter-left.js` by modifying the contents like this:

```html
...
<script src="{{cdn '/assets/klevu/js/landing/klevu-landing-filter-left.js'}}" ></script>
...
```

Include the `landing-filter-left.html` template by modifying the contents like this:

```html
{{> klevu/landing/landing-filter-left }}
```

Finally, we need to include this sort dropdown in our main template,
so find and edit `templates/klevu/landing/landing-results.html`.

Locate the line that renders the filters:

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

Package your theme using `stencil bundle`, upload and apply your theme,
then visit a search results page on your BigCommerce store to **try the Facets**!

## What's next?

Next, let's [Add a Sort-By Dropdown](/getting-started/3-sort/bigcommerce)