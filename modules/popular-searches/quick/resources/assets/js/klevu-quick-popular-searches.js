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
                        var head = document.getElementsByTagName("head");
                        var script = document.createElement("script");
                        script.src = "https://js.klevu.com/klevu-js-v1/klevu-js-api/" + apiKey + ".js";
                        head[0].appendChild(script);
                    }
                }
            },
            build: true
        }
    });
})(klevu);

var klevu_urlProtocol = "";
var klevu_javascriptDomain = "";
klevu.interactive(function () {
    klevu_urlProtocol = klevu.settings.url.protocol;
    klevu.search.modules.popularSearch.base.init();
});

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addPopularSearchEvents",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#kuTemplatePopularSearches"), "kuTemplatePopularSearches", true);

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
                        if (klevu_webstorePopularTerms) {
                            data.template.popularSearches = klevu_webstorePopularTerms;
                        }
                    }
                }
            });

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