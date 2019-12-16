<script type="template/klevu" id="klevuLandingTemplateTabResults">
    <div class="kuTabs">
        <% var selectedTab = false; %>
        <% helper.each(data.query,function(key,query){ %>
            <% if(query.tab == true) { %>
                <% if(helper.hasResults(data,query.id)) { %>
                    <a target="_self" class="kuTab<% if(!selectedTab){ selectedTab = true; %> kuTabSelected<% } %>" data-section="<%=query.id%>">
                        <%=helper.translate(query.tabText,data.query[query.id].meta.totalResultsFound)%>
                    </a>
                <% } else { %>
                    <a target="_self" class="kuTabDeactive" data-section="<%=query.id%>">
                        <%=helper.translate(query.tabText,0)%>
                    </a>
                <% } %>
            <% } %>
        <% }); %>
    </div>
</script>
