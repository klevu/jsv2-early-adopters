//build event chain to check when quick is powered up
klevu.coreEvent.build({
    name : "setRemoteConfigQuick",
    fire: function(){
        if (
            !klevu.getSetting(klevu.settings,"settings.localSettings",false) ||
            klevu.isUndefined(klevu.search.extraSearchBox) ||
            (klevu.search.extraSearchBox.length == 0)
        ) {return false;}return true;
    },
    maxCount: 500,
    delay:30

});
// add templates
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-templates" ,
    fire: function(){


        //set templates
        klevu.each(klevu.search.extraSearchBox,function(key,box){
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickTemplateBase"), "klevuTemplateBase", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickAutoSuggestions"), "klevuQuickAutoSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPageSuggestions"), "klevuQuickPageSuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickCategorySuggestions"), "klevuQuickCategorySuggestions", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProducts"), "klevuQuickProducts", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickProductBlock"), "klevuQuickProductBlock", true);
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickNoResultFound"), "klevuQuickNoResultFound", true);
        });

    }
});
//attach click out defocus
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-click-out" ,
    fire: function(){
        klevu.coreEvent.attach("buildSearch",{
            name:"clickOutEvent",
            fire: function(){
                klevu.settings.chains.documentClick.add({
                    name: "hideOverlay",
                    fire: function(data, scope) {
                        if(klevu.search.active) {
                            var fullPage =  klevu.getSetting(klevu.search.active.getScope().settings,"settings.search.fullPageLayoutEnabled",true);
                            if(!fullPage){
                                var target =  klevu.getSetting(klevu.search.active.getScope().settings,"settings.search.searchBoxTarget");
                                target.style = "display: none !important;";
                            }
                        }
                    }
                });
            }
        });
    }
});
//attach locale settings
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-locale" ,
    fire: function(){
        //add translations
        var translatorQuick = klevu.search.quick.getScope().template.getTranslator();
        translatorQuick.addTranslation("Search","Search");
        translatorQuick.addTranslation("<b>%s</b> productList","<b>%s</b> Products");
        translatorQuick.addTranslation("<b>%s</b> contentList","<b>%s</b> Other results");
        translatorQuick.mergeToGlobal();

        //set currency
        var currencyQuick = klevu.search.quick.getScope().currency;

        currencyQuick.setCurrencys({
            'GBP' : { string : "£", format: "%s%s", atEnd: false, precision: 2, thousands: ",", decimal: ".", grouping: 3 },
            'USD' : { string : "USD", atEnd: true },
            'EUR' : { string : "EUR", format: "%s %s", atEnd: true },
        });
        currencyQuick.mergeToGlobal();
    }
});
// attach all klevu chains
klevu.coreEvent.attach("setRemoteConfigQuick",{
    name: "search-quick-chains" ,
    fire: function(){
        klevu.each(klevu.search.extraSearchBox,function(key,box){
            //get the global translations
            box.getScope().template.getTranslator().mergeFromGlobal();
            //get the global currency
            box.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
            //what to do when you focus on a search
            box.getScope().chains.events.focus.add({
                name: "displayOverlay",
                fire: function(data, scope) {
                    var target =  klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                    target.style = "display: block !important;";

                }
            });
            box.getScope().chains.events.focus.add({
                name:"doSearch",
                fire:function(data,scope){
                    var chain = klevu.getObjectPath(scope.kScope , "chains.actions.doSearch");

                    if(!klevu.isUndefined(chain) &&  chain.list().length  !== 0){
                        chain.setScope(scope.kElem);
                        chain.setData(data);
                        chain.fire();
                    }
                    scope.kScope.data = data;
                    if(data.context.preventDefault === true) return false;
                }
            });

            // what will the request look for
            box.getScope().chains.request.build.add({
                name: "addAutosugestions",
                fire: function(data, scope) {
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);
                    var suggestion = klevu.extend( true , {}, parameterMap.suggestions );

                    suggestion.id= "autosuggestion";
                    suggestion.query = data.context.term;
                    suggestion.typeOfRequest= "AUTO_SUGGESTIONS";
                    suggestion.limit= 3;

                    data.request.current.suggestions.push(suggestion);
                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addCategoryCompressed",
                fire: function(data, scope) {
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var categoryCompressed = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    categoryCompressed.id = "categoryCompressed";
                    categoryCompressed.typeOfRequest = "SEARCH";
                    categoryCompressed.settings.query.term  = data.context.term;
                    categoryCompressed.settings.typeOfRecords = ["KLEVU_CATEGORY"];
                    categoryCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    categoryCompressed.settings.fields = ["name","shortDesc","url","typeOfRecord"];
                    categoryCompressed.settings.limit = 3;
                    categoryCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(categoryCompressed);

                    data.context.doSearch = true;

                }
            });
            box.getScope().chains.request.build.add({
                name: "addCmsCompressed",
                fire: function(data, scope) {
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var cmsCompressed = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    cmsCompressed.id = "cmsCompressed";
                    cmsCompressed.typeOfRequest = "SEARCH";
                    cmsCompressed.settings.query.term  = data.context.term;
                    cmsCompressed.settings.typeOfRecords = ["KLEVU_CMS"];
                    cmsCompressed.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    cmsCompressed.settings.fields = ["name","shortDesc","url","typeOfRecord"];
                    cmsCompressed.settings.limit = 3;
                    cmsCompressed.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(cmsCompressed);

                    data.context.doSearch = true;
                }
            });

            box.getScope().chains.request.build.add({
                name: "addProductList",
                fire: function(data, scope) {
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    var productList = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    productList.id = "productList";
                    productList.typeOfRequest = "SEARCH";
                    productList.settings.query.term  = data.context.term;
                    productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                    productList.settings.fallbackQueryId = "productListFallback";
                    productList.settings.limit = 3;
                    productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                    productList.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(productList);

                    data.context.doSearch = true;

                }
            });
            box.getScope().chains.request.build.add({
                name: "addProductListFallback",
                fire: function(data, scope) {
                    var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                    //setquery type
                    var productListFallback = klevu.extend( true , {}  , parameterMap.recordQuery );

                    //setquery type
                    productListFallback.id = "productListFallback";
                    productListFallback.typeOfRequest = "SEARCH";
                    productListFallback.isFallbackQuery = "true";
                    productListFallback.settings.query.term  = "*";
                    productListFallback.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                    productListFallback.settings.searchPrefs = ["excludeDescription","searchCompoundsAsAndQuery"];
                    productListFallback.settings.limit = 3;
                    productListFallback.settings.sort = "RELEVANCE";

                    data.request.current.recordQueries.push(productListFallback);


                    data.context.doSearch = true;

                }
            });

            // where to render the responce
            box.getScope().chains.template.render.add({
                name: "renderResponse",
                fire: function(data, scope) {
                    if(data.context.isSuccess){
                        scope.kScope.template.setData(data.template);
                        var targetBox = "klevuTemplateBase";
                        var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                        var target = klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                        target.innerHTML = '';
                        //todo: Need extraPolyfill.js
                        target.classList.add("klevuTarget");
                        scope.kScope.element.kData = data.template;
                        scope.kScope.template.insertTemplate(target, element);
                    }
                }
            });

            // where to position the templace
            box.getScope().chains.template.render.add({
                name: "positionTemplate",
                fire: function(data, scope) {
                    var target =  klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                    var positions = scope.kScope.element.getBoundingClientRect();
                    klevu.dom.find(".klevuWrap",target)[0].style = "top:"+positions.bottom+"px;left: "+((positions.right - 500)>0?(positions.right - 500):0)+"px;right: auto;";
                }
            });

            // overide form action
            box.getScope().element.kElem.form.action = klevu.getSetting(box.getScope().settings,"settings.url.landing", false);
        });
    }
});
