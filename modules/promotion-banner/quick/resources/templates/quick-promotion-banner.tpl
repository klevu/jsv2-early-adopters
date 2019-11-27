<!--
Quick search results banner template
-->
<script type="template/klevu" id="klevuQuickPromotionBanner">
    <% if(data.banners && data.banners.length) { klevu.each(data.banners, function(index, banner){ %>
        <div class="klevu-banner-ad kuBannerContainer">
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