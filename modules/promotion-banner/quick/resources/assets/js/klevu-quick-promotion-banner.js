/**
 * Event to add promotional banner for quick search result
 */


klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventPromotionalBanners",
    fire: function () {

        var quick_promo_banners = [{
                default: true,
                id: "001",
                name: "Default Shirts banner | Only the best sale 40% off on shirts",
                src: "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
                click: "https://demo.ksearchmisc.com/klevusearch/men/shirts.html"
            },
            {
                id: "002",
                name: "Bags banner | Travel Gear",
                term: "bags",
                src: "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/homepage-three-column-promo-03.png",
                click: "https://demo.ksearchmisc.com/klevusearch/accessories/bags-luggage.html"
            }
        ];

        var quickPromoBanners = klevu.dictionary("promo-banners");
        quickPromoBanners.mergeFromGlobal();
        quickPromoBanners.addElement("quick", JSON.stringify(quick_promo_banners));
        quickPromoBanners.mergeToGlobal();

        klevu.each(klevu.search.extraSearchBox, function (key, box) {

            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPromotionBanner"), "klevuQuickPromotionBanner", true);

            box.getScope().chains.template.render.addBefore("renderResponse", {
                name: "appendBanners",
                fire: function (data, scope) {
                    if (data.context.isSuccess) {
                        data.template.banners = [];

                        var defaultBanner;
                        var isDefaultAppear = true;
                        var bannerList = [];
                        var quickPromoBanners = klevu.dictionary("promo-banners");
                        quickPromoBanners.mergeFromGlobal();
                        var quickElement = quickPromoBanners.getElement("quick");
                        if (quickElement && quickElement.length && quickElement != "quick") {
                            quickElement = JSON.parse(quickElement);
                            if (quickElement && quickElement.length) {
                                bannerList = quickElement;
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

        });
    }
});