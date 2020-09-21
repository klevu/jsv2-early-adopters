/**
 * Module for fetch data for terms redirecting
 */
(function (klevu) {
    klevu.extend(true, klevu.search.modules, {
        termRedirection: {
            base: {
                init: function () {
                    var apiKey = klevu.settings.search.apiKey;
                    if (apiKey) {
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.async = false;
                        script.src = "https://js.klevu.com/klevu-js-v1/klevu-js-api/" + apiKey + "-maps.js";
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
    name: "addTermRedirection",
    fire: function () {

        klevu_urlProtocol = klevu.settings.url.protocol;
        klevu.search.modules.termRedirection.base.init();

        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            /**
             * Event to append URL Redirect Maps to current redirect object
             */
            box.getScope().chains.template.process.success.add({
                name: "addRedirectURLs",
                fire: function (data, scope) {
                    if (!klevu.isUndefined(klevu_keywordUrlMap) && !klevu.isEmptyObject(klevu_keywordUrlMap)) {
                        var redirectsFromSettings = klevu.getSetting(scope.kScope.settings, "settings.search.redirects");
                        redirectsFromSettings = !klevu.isUndefined(redirectsFromSettings) ? redirectsFromSettings : {};
                        var redirects = klevu.extend(true, {}, redirectsFromSettings);
                        klevu.each(klevu_keywordUrlMap, function (i, ele) {
                            if (!klevu.isEmptyObject(ele.keywords)) {
                                klevu.each(ele.keywords, function (i, a) {
                                    redirects[a] = ele.url;
                                });
                            }
                        });
                        klevu.setSetting(scope.kScope.settings, "settings.search.redirects", redirects);
                    }
                }
            });
        });
    }
});