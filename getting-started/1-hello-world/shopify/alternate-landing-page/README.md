# Using an alternative Search Results Landing Page

The [hello-world](/getting-started/1-hello-world/shopify/README.md) tutorial
uses the native Shopify `/search` page, which will still process Shopify logic
in the background to generate search results even though we are replacing the entire
page with Klevu, so you may prefer to use another landing page for better performance.

## Theme Modifications

First we need to create a new template to use for the landing page.

- Navigate to Online Store > Themes.
- Current Theme > Actions > Edit code.
- Create a new Template for `page` called `klevu.search`
- Copy + Paste the search HTML from [our search.liquid](/getting-started/1-hello-world/shopify/resources/templates/search.liquid)
- Click save in the top right.

Next let's create a new CMS Page to use this template.

- Navigate to Online Store > Pages.
- Click on Add Page.
    - Title: Search Results
    - Template: `page.klevu.search` 
    - Content: leave this blank.
- Save the page in the bottom right.

Now we have a new page wich can be accessed via our frontend for seach results,
for example `/pages/search-results?q=bag`.

## Javascript Modifications

Finally we need to update Klevu JSv2 to tell it where to send search queries.

- Navigate to Online Store > Themes.
- Current Theme > Actions > Edit code.
- Open Assets > `klevu-settings.js`
- Find the option near the top `landing : '/search',`
- - Change this to `landing : '/pages/search-results',`
- Save the changes.

Now when you submit a search query you will be taken to this newly created
page instead of the native Shopify search results page. The actual content
will be identical, but you may find the performance better since no Shopify
search logic is being fired in the background.
