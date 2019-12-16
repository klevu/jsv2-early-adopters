<!--
Landing page banner template
-->
<script type="template/klevu" id="klevuLandingPromotionBanner">
    
    <% if(data.banners && data.banners.length) { klevu.each(data.banners, function(index, banner){ %>
        <div class="kuBannerAd kuBannerContainer">
            <a 
            class="kuTrackBannerClick" 
            target="_self" 
            data-id="<%= banner.id %>" 
            data-name="<%= banner.name %>"
            data-image="<%= banner.src %>"
            data-redirect="<%= banner.click %>" 
            href="<%= banner.click %>">
                <img src="<%= banner.src %>" alt="<%= banner.name %>" />
            </a>
        </div>
    <% }); } %>
</script>
