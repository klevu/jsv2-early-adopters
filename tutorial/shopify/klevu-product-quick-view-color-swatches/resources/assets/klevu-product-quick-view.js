/**
 * Add Product Quick view functionality
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "product-quick-view",
    fire: function () {

        /** Set template in landing UI */
        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateQuickView"), "quick-view", true);

        /** Create chain for Quick view */
        klevu.search.landing.getScope().chains.quickView = klevu.chain();

        /** Initialize Quick view service */
        klevu.quickViewService();
        /** Initialize add to cart service */
        klevu.addToCartService();
        /** Initalize color swatch service */
        klevu.colorSwatchesService();

        /** Add Quick view wrapper container in body */
        klevu.search.landing.getScope().quickViewService.appendTemplateIntoBody();

        /*
         *	Add Quick view template and update data into that
         */
        klevu.search.landing.getScope().chains.quickView.add({
            name: "chainQuickView",
            fire: function (data, scope) {
                event = event || window.event;
                event.preventDefault();
                scope.kScope.template.setData(data.template);
                var target = klevu.dom.find("div.quickViewWrap")[0];
                target.innerHTML = '';
                var element = scope.kScope.template.convertTemplate(scope.kScope.template.render("quick-view"));
                scope.kScope.template.insertTemplate(target, element);

                klevu.search.landing.getScope().quickViewService.bindCloseBtnClick();
                klevu.search.landing.getScope().addToCartService.bindAddToCartEvent();
                klevu.search.landing.getScope().colorSwatchesService.bindColorGridEvents();
            }
        });

        /**
         *  Bind body click event
         */
        klevu.event.attach(window, "click", function (event) {
            klevu.search.landing.getScope().quickViewService.windowOnClick(event);
        });

        /*
         *	Bind and handle click event on Quick view button 
         */
        klevu.search.landing.getScope().chains.template.events.add({
            name: "quickViewButtonClick",
            fire: function (data, scope) {
                klevu.search.landing.getScope().colorSwatchesService.parseProductColorSwatch(data, scope);
                klevu.search.landing.getScope().quickViewService.landingPageTemplateOnLoadEvent(data, scope);
            }
        });
    }
});