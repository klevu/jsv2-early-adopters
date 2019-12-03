/**
 * Event to add promotion banners to landing page
 */

klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "eventAddPromotionBannerLandingPage",
    fire: function () {

        var landing_promo_banners = [{
                default: true,
                id: "001",
                name: "Default Shirts Banner | Only the best sale 40% off on shirts",
                src: "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men/shirts.html"
            },
            {
                id: "002",
                name: "Shirts Banner | New in premium Shirts | Shop Now!",
                term: "shirts",
                src: "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/slide-3.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men.html"
            }
        ];

        var landingPromoBanners = klevu.dictionary("promo-banners");
        landingPromoBanners.mergeFromGlobal();
        landingPromoBanners.addElement("landing", JSON.stringify(landing_promo_banners));
        landingPromoBanners.mergeToGlobal();

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingPromotionBanner"), "klevuLandingPromotionBanner", true);
        klevu.search.landing.getScope().chains.template.render.addBefore("renderResponse", {
            name: "appendBanners",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    data.template.banners = [];

                    var defaultBanner;
                    var isDefaultAppear = true;
                    var bannerList = [];
                    var landingPromoBanners = klevu.dictionary("promo-banners");
                    landingPromoBanners.mergeFromGlobal();
                    var landingElement = landingPromoBanners.getElement("landing");
                    if (landingElement && landingElement.length && landingElement != "landing") {
                        landingElement = JSON.parse(landingElement);
                        if (landingElement && landingElement.length) {
                            bannerList = landingElement;
                        }
                    }
                    if (bannerList.length) {
                        klevu.each(bannerList, function (index, value) {
                            if (value.default) {
                                defaultBanner = value;
                            }
                            if (data.context.term == value.term) {
                                data.template.banners.push(value);
                                isDefaultAppear = false;
                            }
                        });
                        if (isDefaultAppear && defaultBanner) {
                            data.template.banners.push(defaultBanner);
                        }
                    }
                }
            }
        });
    }
});