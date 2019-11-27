//startup settings
function startup(klevu) {
    var options = {
        url : {
            search: klevu.settings.url.protocol + '//cs2.ksearchnet.com/cs/v2/search',
            landing : '/catalogsearch/result/index',
            protocolFull: klevu.settings.url.protocol + "//"
        },
        localSettings: true,
        search : {
            searchBoxSelector : "#search" ,
            searchBoxTarget: false,
            minChars : 1 ,
            placeholder : "Search" ,
            showQuickOnEnter : false ,
            fullPageLayoutEnabled : false,
            personalisation: false,
            redirects: [],
            apiKey: 'klevu-14728819608184175'
        },
        analytics: {
            apiKey: 'klevu-14728819608184175'
        }
    };

    klevu(options);
}
//once klevu is interactive, setup the settings
klevu.interactive(function(){
    startup(klevu);
});
//check if klevu is interactive and also if all necessary search instances are powered up
klevu.coreEvent.build({
    name : "bindLocalBoxes",
    fire: function(){
        if ( !klevu.isInteractive || klevu.isUndefined(klevu.search) || klevu.isUndefined(klevu.search.build) || klevu.isUndefined(klevu.searchEvents) || klevu.isUndefined(klevu.searchEvents.functions) || klevu.isUndefined(klevu.searchEvents.functions.bindAllSearchBoxes) ) {return false;} return true;
    },
    maxCount: 500,
    delay:30
});
//attach to all search boxes on the page
klevu.coreEvent.attach("bindLocalBoxes",{
    name: "search-boxes-local-boxes" ,
    fire: function(){
        klevu.searchEvents.functions.bindAllSearchBoxes.fire();
    }
});
