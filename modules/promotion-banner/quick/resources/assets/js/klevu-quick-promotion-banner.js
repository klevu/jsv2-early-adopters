/**
 * Event to add promotional banner for quick search result
 */

klevu.coreEvent.attach("setRemoteConfigQuick", {
    name: "eventAddPromotionalBannersOnQuickSearch",
    fire: function () {
        var staticQuickSearchBannerData = [{
            "default": true,
            "showOnLandingPage": true,
            "redirectUrl": "https://demo.ksearchmisc.com/klevusearch/men/shirts.html",
            "showOnQuickSearch": true,
            "endDate": "2099/12/05",
            "bannerName": "Test Banner",
            "position": "top",
            "bannerRef": 4515,
            "bannerImg": "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
            "showOnCategoryPage": false,
            "startDate": "2019/12/5"
        }, {
            "showForTerms": ["bags"],
            "showOnLandingPage": true,
            "redirectUrl": "https://demo.ksearchmisc.com/klevusearch/accessories/bags-luggage.html",
            "showOnQuickSearch": true,
            "endDate": "2099/12/05",
            "bannerName": "Test Banner",
            "position": "bottom",
            "bannerRef": 4515,
            "bannerImg": "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/homepage-three-column-promo-03.png",
            "showOnCategoryPage": false,
            "startDate": "2019/12/5"
        }];
        klevu.search.modules.promotionBanner.base.init(staticQuickSearchBannerData);

        klevu.each(klevu.search.extraSearchBox, function (key, box) {
            box.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuQuickPromotionBanner"), "klevuQuickPromotionBanner", true);

            box.getScope().chains.template.process.success.add({
                name: "appendBanners",
                fire: function (data) {
                    var quickBannerList = klevu.search.modules.promotionBanner.base.getQuickSearchBanners();
                    if (quickBannerList && quickBannerList.length) {
                        data.template.banners = {
                            "top": [],
                            "bottom": []
                        };
                        var defaultBanner = '';
                        var isDefaultAppear = true;
                        var defaultBannerPosition = 'top';
                        if (!klevu.isEmptyObject(quickBannerList)) {
                            klevu.each(quickBannerList, function (index, value) {
                                if (value.hasOwnProperty("showForTerms") && !klevu.isEmptyObject(value.showForTerms)) {
                                    klevu.each(value.showForTerms, function (i, term) {
                                        if (data.context.term == term) {
                                            var position = value.position ? value.position : 'top';
                                            data.template.banners[position].push(value);
                                            isDefaultAppear = false;
                                        }
                                    });
                                } else if (value.hasOwnProperty("default") && value.default) {
                                    defaultBannerPosition = value.position;
                                    defaultBanner = value;
                                }
                            });
                        }
                        if (isDefaultAppear && defaultBanner) {
                            data.template.banners[defaultBannerPosition].push(defaultBanner);
                        }
                    }
                }
            });
        });
    }
});