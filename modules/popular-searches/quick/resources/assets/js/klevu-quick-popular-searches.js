/**
 * Module for Popular products
 */

(function (klevu) {
    klevu.extend(true, klevu.search.modules, {
        popularSearch: {
            base: {
                init: function () {
                    var apiKey = klevu.settings.search.apiKey;
                    if (apiKey) {
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.async = false;
                        script.src = "https://js.klevu.com/klevu-js-v1/klevu-js-api/" + apiKey + ".js";
                        document.head.appendChild(script);
                    }
                }
            },
            build: true
        }
    });
})(klevu);

var klevu_urlProtocol = "";
var klevu_javascriptDomain = "";

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addPopularSearchEvents",
    fire: function () {

        klevu_urlProtocol = klevu.settings.url.protocol;
        klevu.search.modules.popularSearch.base.init();

        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuTemplatePopularSearches"), "kuTemplatePopularSearches", true);

            /**
             * Event to add popular searches data into the data template object
             */
            box.getScope().chains.template.process.success.add({
                name: "addPopularSearchData",
                fire: function (data, scope) {
                    data.template.popularSearches = [];
                    var inputElement = klevu.dom.find(klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxSelector"))[0];
                    var inputValue;
                    if (inputElement) {
                        inputValue = inputElement.value;
                    }
                    if (!inputValue || inputValue.length == 0) {
                        if (typeof klevu_webstorePopularTerms !== "undefined" && klevu_webstorePopularTerms) {
                            data.template.popularSearches = klevu_webstorePopularTerms;
                        }
                    }
                }
            });

            /**
             * Event to bind popular searches element click event
             */
            box.getScope().chains.template.events.add({
                name: "attachPopularSearchUIEvents",
                fire: function (data, scope) {
                    var kuPopularSearchTermItem = klevu.dom.find(".kuPopularSearchTermItem");
                    klevu.each(kuPopularSearchTermItem, function (key, termItem) {
                        klevu.event.attach(termItem, "click", function () {
                            var term = termItem.dataset.value;
                            term = encodeURIComponent(term);
                            var inputElement = klevu.dom.find(klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxSelector"))[0];
                            var nameAttr = inputElement.name;
                            if (nameAttr) {
                                window.location = "/?" + nameAttr + "=" + term;
                            }
                        });
                    });
                }
            });

        });
    }
});