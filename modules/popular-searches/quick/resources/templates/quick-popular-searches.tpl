<!-- Popular searches template for Quick Search Results -->

<script type="template/klevu" id="kuTemplatePopularSearches">
    <% if(data.popularSearches && data.popularSearches.length) { %>
        <div class="kuPopularSearchesBlock">
            <div class="klevuSuggestionHeading kuPopularSearchHeading"><span class="klevuHeadingText"><%=helper.translate("Popular Searches")%></span></div>
            <div class="kuPopularSearchesTermContainer">
                <ul>
                    <% helper.each(data.popularSearches,function(key,term){ %>
                        <% if(term && term.length) { %>
                            <li class="kuPopularSearchTermItem" data-value="<%= term %>"><%= term %></li>
                        <% } %>
                    <% }); %>
                </ul>    
            </div>
        </div>
    <% } %>
</script>