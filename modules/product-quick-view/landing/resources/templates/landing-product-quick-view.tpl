<!--
	Search result product grid quick view modal template file
-->
<script type="template/klevu" id="klevuLandingTemplateQuickView">
	<div class="kuModal"  data-id="<%=data.selected_product.id%>">
		<div class="kuModal-content">
			<div class="productQuickViewWrapper">
				<div class="productQuick-Close">
					<span class="close-button">×</span>
				</div>
				<div class="productQuick-imgBlock">
					<div class="imgWrap">
						<img src="<%= data.selected_product.image %>" alt="<%=helper.translate(data.selected_product.name)%>" title="
							<%=helper.translate(data.selected_product.name)%>" />
						</div>
					</div>
					<div class="productQuick-contentBlock">
						<div class="productQuick-title kuModalProductName"><%=helper.translate(data.selected_product.name)%>
						</div>
						<div class="productQuick-sku">
							<span class="productQuick-label"><%=helper.translate("SKU:") %>                            
                            </span>
							<span><%=data.selected_product.sku%>
							</span>
						</div>
						<div class="productQuick-divider"></div>
						<div class="productQuick-Price">
							<div class="productQuick-salePrice">
								<span><%=helper.processCurrency(data.selected_product.currency,parseFloat(data.selected_product.salePrice))%>
								</span>
							</div>
						</div>
						<div class="productQuick-shortDesc"><% var shortDesc = (data.selected_product.shortDesc) ? data.selected_product.shortDesc + "..." : ""%>
							<span><%=shortDesc%>
							</span>
						</div>
						<div class="productQuick-extraInfo">
							<div class="productQuick-stockStatus">
								<span class="productQuick-label"><%=helper.translate("Stock Status:") %></span>
								<span><% var productStock = (data.selected_product.inStock == "yes") ? helper.translate("In Stock") : helper.translate("Out Of Stock") %><%=productStock%>
								</span>
							</div>
                            
                            
                            <%=helper.render('quickViewProductSwatch',scope,data,data.selected_product) %>
                            
							<div class="productQuick-tags">
								<span class="productQuick-label"><%=helper.translate("Tags:") %></span>
								<span><%=helper.translate(data.selected_product.tags)%>
								</span>
							</div>
						</div>
						<div class="productQuick-addToCart">
							<a target="_self" href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary-outline kuModalProductURL"><%=helper.translate("View details") %>
							</a>
							<a target="_self" href="<%=data.selected_product.url%>" class="kuBtn kuBtn-primary kuModalProductCart"><%=helper.translate("Add to cart") %></a>
						</div>
					</div>
					<div class="kuClearfix"></div>
				</div>
			</div>
		</div>
	</script>