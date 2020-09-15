/**
 * Base component for Promotion Module
 */
(function (klevu) {
    var bannerDataObject = {
        banners: []
    };
    /**
     * Function to get the product ids
     * @param {*} landingOrQuick
     * @param {*} activeOnPage
     */
    function getBanners(bannerList, activeOnPage) {
        var bannerListSanitized = [];
        if (bannerList.length) {
            klevu.each(bannerList, function (index, value) {
                if (activeOnPage === "all" ||
                    (value.hasOwnProperty('showOnLandingPage') && value.showOnLandingPage === true && activeOnPage === "landing") ||
                    (value.hasOwnProperty('showOnQuickSearch') && value.showOnQuickSearch === true && activeOnPage === "quick") ||
                    (value.hasOwnProperty('showOnCategoryPage') && value.showOnCategoryPage === true && activeOnPage === "category")) {
                    bannerListSanitized.push(value);
                }
            });
        }
        return bannerListSanitized;
    }

    /**
     * Function to Merge banners
     */
    function mergeData() {
        var bannerList = [];
        var self = this;
        var staticBannerListClone = klevu.extend(true, [], self.bannerDataObject.banners);
        var klevuBanner = typeof klevu_banner !== "undefined" && !klevu.isEmptyObject(klevu_banner) ? klevu_banner : [];
        bannerList = arrayUnique(staticBannerListClone.concat(klevuBanner));
        return bannerList;
    }

    /**
     * Function to get all the banners
     */
    function getAllBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "all");
    }

    /**
     * Function to get banners for Quck Search
     */
    function getQuickSearchBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "quick");
    }

    /**
     * Function to get banners for Landing Page
     */
    function getLandingPageBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "landing");
    }

    /**
     * Function to get banners for Category Page
     */
    function getCategoryPageBanners() {
        var self = this;
        var bannerList = self.mergeData();
        return getBanners(bannerList, "category");
    }

    /**
     * Function to get the product ids
     * @param {*} klevu_banner: Array of banner objects
     */
    function validateBanners(klevu_banner) {
        var klevu_banner_validated = [];
        if (klevu_banner.length > 0) {
            var today = new Date(),
                startDate, endDate, removeCurrent = false;
            today.setHours(0, 0, 0, 0);
            for (var i = 0; i < klevu_banner.length; i++) {
                startDate = new Date(klevu_banner[i].startDate);
                removeCurrent = false;
                if ('undefined' !== typeof klevu_banner[i].endDate && klevu_banner[i].endDate) {
                    endDate = new Date(klevu_banner[i].endDate);
                    removeCurrent = (startDate > today || endDate < today);
                } else {
                    removeCurrent = (startDate > today);
                }
                if (removeCurrent) {
                    klevu_banner.splice(i, 1);
                    i--;
                }
            }
            klevu_banner_validated = klevu_banner;
        }
        return klevu_banner_validated;
    }

    /**
     * Function to remove duplicate elements from array
     */
    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (klevu.isEqualObj(a[i], a[j]))
                    a.splice(j--, 1);
            }
        }
        return a;
    }

    var promotionBanner = {
        bannerDataObject: bannerDataObject,
        init: function (staticBannerList) {
            var self = this;
            if (!klevu.isEmptyObject(staticBannerList)) {
                this.bannerDataObject.banners = arrayUnique(this.bannerDataObject.banners.concat(staticBannerList));
                var validatedBannerList = validateBanners(staticBannerList);
                this.bannerDataObject.banners = arrayUnique(this.bannerDataObject.banners.concat(validatedBannerList));
            }
            var apiKey = klevu.settings.search.apiKey;
            var addedScript = document.getElementById("klevu-js-api-" + apiKey + "-banner");
            if (apiKey && (addedScript === null || (addedScript && addedScript.src !== "https://js.klevu.com/klevu-js-v1/klevu-js-api/" + apiKey + "-banner.js"))) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.async = false;
                script.src = "https://js.klevu.com/klevu-js-v1/klevu-js-api/" + apiKey + "-banner.js";
                script.id = "klevu-js-api-" + apiKey + "-banner";
                document.head.appendChild(script);
            }
        },
        mergeData: mergeData,
        getAllBanners: getAllBanners,
        getQuickSearchBanners: getQuickSearchBanners,
        getLandingPageBanners: getLandingPageBanners,
        getCategoryPageBanners: getCategoryPageBanners
    };

    klevu.extend(true, klevu.search.modules, {
        promotionBanner: {
            base: promotionBanner,
            build: true
        }
    });

})(klevu);

klevu.coreEvent.build({
    name: "promotionBannerModule",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.promotionBanner ||
            !klevu.search.modules.promotionBanner.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});