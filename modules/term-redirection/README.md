# Add Search term redirection

_This tutorial assumes you already completed the [Hello world](/getting-started/1-hello-world) tutorial, which included  installing the Klevu App on your framework._

## Once your API Key has been activated

Once we have activated your API Key for APIv2 you can go ahead and change out
our demo API Key for your own, then you can start customising your own products
in the search results.

First, navigate to your `klevu-settings.js`.
Now, add your custom pairs of urls and search terms to the `redirect` object under the `search`. After completing modification, the updated code will look like below snippet. 

```js
function startup(klevu) {
    var options = {
        search : {
            apiKey: 'klevu-12345678901234567',
            redirects: {
                "klevu": "https://www.klevu.com/",
                "klevublogs": "https://info.klevu.com/blog"
            },
        }
    };
};
```

Save the file and reload the frontend to **search your own data!**