<!--
Landing page banner template
-->
<script type="template/klevu" id="klevuLandingPromotionBanner">
    <% if(data.banners && data.banners[dataLocal] && data.banners[dataLocal].length) { 
        klevu.each(data.banners[dataLocal], function(index, banner){ %>
        <div class="kuBannerAd kuBannerContainer">
            <a 
            class="kuTrackBannerClick" 
            target="_self" 
            data-id="<%= banner.bannerRef %>" 
            data-name="<%= banner.bannerName %>"
            data-image="<%= banner.bannerImg %>"
            data-redirect="<%= banner.redirectUrl %>" 
            href="<%= banner.redirectUrl %>">
                <img src="<%= banner.bannerImg %>" alt="<%= banner.bannerName %>" />
            </a>
        </div>
    <% }); 
    } %>
</script>