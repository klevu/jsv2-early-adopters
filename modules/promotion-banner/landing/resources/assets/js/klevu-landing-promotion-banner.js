/**
 * Event to add promotion banners to landing page
 */
klevu.coreEvent.attach("setRemoteConfigLanding", {
    name: "eventAddPromotionBannerOnLanding",
    fire: function () {

        /**
         * Example data to add in the data list
         */

        // var staticLandingPageBannerData = [{
        //     "default": true,
        //     "showOnLandingPage": true,
        //     "redirectUrl": "https://demo.ksearchmisc.com/klevusearch/men/shirts.html",
        //     "showOnQuickSearch": true,
        //     "endDate": "2099/12/05",
        //     "bannerName": "Test Banner",
        //     "position": "top",
        //     "bannerRef": 4515,
        //     "bannerImg": "https://demo.ksearchmisc.com/klevusearch/skin/frontend/base/default/images/klevubanner/klevu-banner-ad-shirt-new.jpg",
        //     "showOnCategoryPage": false,
        //     "startDate": "2019/12/5"
        // }, {
        //     "showForTerms": ["shirts"],
        //     "showOnLandingPage": true,
        //     "redirectUrl": "https://demo.ksearchmisc.com/klevusearch/men.html",
        //     "showOnQuickSearch": false,
        //     "endDate": "2099/12/05",
        //     "bannerName": "Test Banner",
        //     "position": "top",
        //     "bannerRef": 4515,
        //     "bannerImg": "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/slide-3.jpg",
        //     "showOnCategoryPage": false,
        //     "startDate": "2019/12/5"
        // }, {
        //     "showForTerms": ["bags"],
        //     "showOnLandingPage": true,
        //     "redirectUrl": "https://demo.ksearchmisc.com/klevusearch/accessories/bags-luggage.html",
        //     "showOnQuickSearch": true,
        //     "endDate": "2099/12/05",
        //     "bannerName": "Test Banner",
        //     "position": "bottom",
        //     "bannerRef": 4515,
        //     "bannerImg": "https://demo.ksearchmisc.com/klevusearch/media/wysiwyg/homepage-three-column-promo-03.png",
        //     "showOnCategoryPage": false,
        //     "startDate": "2019/12/5"
        // }];

        var staticLandingPageBannerData = [];
        klevu.search.modules.promotionBanner.base.init(staticLandingPageBannerData);

        klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingPromotionBanner"), "klevuLandingPromotionBanner", true);
        klevu.search.landing.getScope().chains.template.process.success.add({
            name: "appendLandingBanners",
            fire: function (data) {
                var landingBannerList = klevu.search.modules.promotionBanner.base.getLandingPageBanners();
                if (landingBannerList && landingBannerList.length) {
                    data.template.banners = {
                        "top": [],
                        "bottom": []
                    };
                    var defaultBanner = '';
                    var isDefaultAppear = true;
                    var defaultBannerPosition = 'top';
                    klevu.each(landingBannerList, function (index, value) {
                        if (value.hasOwnProperty("showForTerms")) {
                            if (value.showForTerms == null) {
                                defaultBannerPosition = value.position;
                                defaultBanner = value;
                            } else if (!klevu.isEmptyObject(value.showForTerms)) {
                                klevu.each(value.showForTerms, function (i, term) {
                                    if (data.context.term == term) {
                                        var position = value.position ? value.position : 'top';
                                        data.template.banners[position].push(value);
                                        isDefaultAppear = false;
                                    }
                                });
                            }
                        }
                    });
                    if (isDefaultAppear && defaultBanner) {
                        data.template.banners[defaultBannerPosition].push(defaultBanner);
                    }
                }
            }
        });
    }
});