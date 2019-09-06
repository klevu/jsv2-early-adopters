//build event chain to check when landing is powered up
klevu.coreEvent.build({
    name : "setRemoteConfigLanding",
    fire: function(){
        if ( !klevu.getSetting(klevu.settings,"settings.localSettings",false) ||
            klevu.isUndefined(klevu.search.landing) ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay:30

});
//attach locale settings
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-locale" ,
    fire: function(){
        //get the global translations
        klevu.search.landing.getScope().template.getTranslator().mergeFromGlobal();
        //get the global currency
        klevu.search.landing.getScope().template.getTranslator().getCurrencyObject().mergeFromGlobal();
    }
});
// add templates
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-templates" ,
    fire: function(){
        //set templates
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateBase"), "klevuTemplateLanding", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateNoResultFound"), "noResultFound", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplatePagination"), "pagination", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateFilters"), "filters", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateResults"), "results", true);
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateProductBlock"), "productBlock", true);

    }
});
// add chain extensions
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-chains" ,
    fire: function(){
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductList",
            fire: function(data, scope) {
                var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

                var productList = klevu.extend( true , {}  , parameterMap.recordQuery );
                var quickStorage = klevu.getSetting(scope.kScope.settings , "settings.storage");

                //setquery type
                productList.id = "productList";
                productList.typeOfRequest = "SEARCH";
                productList.settings.query.term  = data.context.term;
                productList.settings.typeOfRecords = ["KLEVU_PRODUCT"];
                productList.settings.searchPrefs = ["searchCompoundsAsAndQuery"];
                productList.settings.limit = 12;
                productList.settings.fallbackQueryId = "productListFallback";
                productList.filters.filtersToReturn.enabled = true;
                productList.filters.filtersToReturn.exclude = ["onprescription","ondiscount","availableonline","availableonletter"];
                data.request.current.recordQueries.push(productList);

                data.context.doSearch = true;

            }
        });
        klevu.search.landing.getScope().chains.request.build.add({
            name: "addProductListFallback",
            fire: function(data, scope) {
                var  parameterMap = klevu.getSetting(scope.kScope.settings, "settings.search.map", false);

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
        klevu.search.landing.getScope().chains.template.render.add({
            name: "renderResponse",
            fire: function(data, scope) {
                if(data.context.isSuccess){
                    scope.kScope.template.setData(data.template);
                    var targetBox = "klevuTemplateLanding";
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

        //add collapsable filters
        klevu.search.landing.getScope().chains.template.events.add({
            name: "colapsableFilters",
            fire: function(data, scope) {
                var target = klevu.getSetting(scope.kScope.settings,"settings.search.searchBoxTarget");
                //add colapsable filters
                klevu.each(klevu.dom.find(".kuFilterHead",target), function(key, value) {
                    // onclick
                    klevu.event.attach(value,"click",function(event){
                        event = event || window.event;
                        event.preventDefault();
                        this.classList.toggle("kuCollapse");
                        this.classList.toggle("kuExpand");

                        var parentElem = klevu.dom.helpers.getClosest(this,".kuFilterBox");
                        klevu.each(klevu.dom.find(".kuFilterNames",parentElem), function(key, value) {
                            value.classList.toggle("kuFilterCollapse");
                            value.classList.remove("kuFilterShowAll");
                        });

                    });
                });
                //add expandable filters
                klevu.each(klevu.dom.find(".kuShowOpt",target), function(key, value) {
                    // onclick
                    klevu.event.attach(value,"click",function(event){
                        event = event || window.event;
                        event.preventDefault();

                        var parentElem = klevu.dom.helpers.getClosest(this,".kuFilterBox");
                        klevu.each(klevu.dom.find(".kuFilterNames",parentElem), function(key, value) {
                            value.classList.toggle("kuFilterShowAll");
                        });

                    });
                });
            }
        });
    }
});

// add template helpers
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-template-helpers" ,
    fire: function(){
        //add extra helpers
        var quickStorage = klevu.getSetting(klevu.settings , "settings.storage");
        klevu.search.landing.getScope().template.setHelper("cropText",function cropText(textValue,length){
            if(textValue.length <= length) return textValue;
            return textValue.substring(0, length) + "...";
        });
        klevu.search.landing.getScope().template.setHelper("hasResults",function hasResults(data,name){
            if(data.query[name]) {
                if( data.query[name].result.length > 0 ) return true;
            }
            return false;
        });
    }
});
// add landing init
klevu.coreEvent.attach("setRemoteConfigLanding",{
    name: "search-landing-init" ,
    fire: function(){
        //read query param
        if(klevu.dom.find(".klevuLanding").length > 0){
            klevu.search.landing.setTarget(klevu.dom.find(".klevuLanding")[0]);
            klevu.setSetting(klevu.search.landing.getScope().settings,"settings.search.fullPageLayoutEnabled", true);
            klevu.setSetting(klevu.search.landing.getScope().settings,"settings.search.minChars", 0);
            var klevuUrlParams = klevu.getAllUrlParameters();
            if ( klevuUrlParams.length > 0 ) {
                klevu.each( klevuUrlParams , function ( key , elem ) {
                    if(elem.name == "q") {
                        var tempElement = klevu.search.landing.getScope().element;
                        tempElement.value = decodeURIComponent(elem.value).split("+").join(" ");
                        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
                        klevu.event.fireChain(tempElement.kScope ,"chains.events.keyUp",tempElement,tempElement.kScope.data,null);
                    }
                });
            }
        }
    }
});
// multi-select filters (except for category)
klevu.search.landing.getScope().chains.template.process.success.add({
    name: "processFilters",
    fire: function(data, scope) {
        var list = ["productList","contentCompressed"];
        klevu.each(list,function(key,value){
            var items = klevu.getObjectPath(data.template.query,value);
            if (!klevu.isUndefined(items)) {
                klevu.each(items.filters, function(keyFilter, filter) {
                    filter.multiselect = false;
                    if(filter.key != 'category') {
                        filter.multiselect = true;
                    }
                })
            }
        });

    }
});
