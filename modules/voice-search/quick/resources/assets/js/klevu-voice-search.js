/**
 * Module to add speech to text in the Klevu Search
 */

(function (klevu) {
    klevu.extend(true, klevu.search.modules, {
        voiceSearch: {
            base: {
                options: {
                    micImage: "https://js.klevu.com/klevu-js-v1/img-1-1/speech.png",
                    micAnimationImage: "https://js.klevu.com/klevu-js-v1/img-1-1/mic-animate.gif",
                    voiceSearchPlaceholder: "Listening..."
                },
                isBrowserSupported: function (b) {
                    var a = "0";
                    if (b.indexOf("Chrome") > -1 && b.indexOf("Edge") < 0) {
                        a = b.substring(b.indexOf("Chrome/") + 7);
                        a = a.substring(0, a.indexOf("."))
                    }
                    return (+(a) >= 26)
                },
                startVoiceDictation: function (e) {
                    var d = this.options.micImage,
                        c = this.options.micAnimationImage,
                        a = this.options.voiceSearchPlaceholder,
                        g = e.nextElementSibling,
                        f = g.placeholder,
                        b = new webkitSpeechRecognition();
                    b.continuous = false;
                    b.interimResults = true;
                    b.start();
                    b.onstart = function () {
                        g.placeholder = a;
                        g.value = "";
                        g.focus();
                        recognizing = true;
                        e.src = c
                    };
                    b.onresult = function (m) {
                        var k = m.results,
                            l = "",
                            h, j;
                        for (j = m.resultIndex; j < k.length; ++j) {
                            h = k[j];
                            if (h.isFinal) {
                                l = k[0][0].transcript;
                                b.stop();
                                g.value = l;
                                g.dispatchEvent(new Event("keyup"))
                            } else {
                                l += h[0].transcript
                            }
                        }
                        g.value = l
                    };
                    b.onspeechend = function (h) {
                        e.src = d;
                        g.placeholder = f
                    };
                    b.onerror = function (h) {
                        if (h.error === "no-speech") {
                            e.src = d
                        }
                        if (h.error === "audio-capture") {
                            e.src = d
                        }
                        b.stop()
                    };
                    b.onend = function () {
                        e.src = d;
                        g.placeholder = f
                    }
                },
                init: function (scope, options) {
                    for (objectKey in options) {
                        if (options.hasOwnProperty(objectKey)) {
                            this.options[objectKey] = options[objectKey];
                        }
                    }
                    if (!this.options.inputElement) {
                        this.options.inputElement = klevu.dom.find(klevu.getSetting(scope.getScope().settings, "settings.search.searchBoxSelector"))[0];
                    }
                    if (this.isBrowserSupported(window.navigator.userAgent) === true && window
                        .hasOwnProperty("webkitSpeechRecognition")) {
                        var b, a = 0;
                        b = document.createElement("img");
                        b.setAttribute("name", "klevuVoiceSearchImage");
                        b.setAttribute("alt", "Search by Voice");
                        b.setAttribute("title", "Search by Voice");
                        b.setAttribute("class", "klevuVoiceSearchImage");
                        b.setAttribute("onclick", "klevu.search.modules.voiceSearch.base.startVoiceDictation(this)");
                        b.setAttribute("src", this.options.micImage);
                        b.id = "kvsi-" + a;
                        this.options.inputElement.before(b);
                    }
                }
            },
            build: true
        }
    });
})(klevu);

/**
 * Event to add voice search functionality
 */
klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "addVoiceSearch",
    fire: function () {
        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            var options = {
                inputElement: klevu.dom.find(klevu.getSetting(box.getScope().settings, "settings.search.searchBoxSelector"))[0]
            };
            klevu.search.modules.voiceSearch.base.init(box, options);
        });
    }
});