/**
 * Base component for Product Recommendation Module
 */
(function (klevu) {

    /**
     * Function to add Record query object
     * @param {*} scope 
     * @param {*} requestQuery 
     */
    function addRecordQueryObject(scope, requestQuery) {
        scope.chains.request.build.add({
            name: "addProductRecommendationReq",
            fire: function (data, scope) {
                data.request.current.recordQueries.push(requestQuery);
                data.context.doSearch = true;
                data.context.section = requestQuery.id;
            }
        });
    }

    /**
     * Function to render module response 
     * @param {*} scopeVariable 
     * @param {*} appendToClass 
     * @param {*} templateElement 
     */
    function renderResponse(scopeVariable, appendToClass, templateElement) {
        var scope = scopeVariable.getScope();
        scope.chains.template.render.add({
            name: "renderResponse",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    scopeVariable.setTarget(klevu.dom.find(appendToClass)[0]);
                    scope.kScope.template.setData(data.template);
                    var targetBox = templateElement;
                    var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                    var target = klevu.dom.find(appendToClass)[0];
                    if (target) {
                        target.innerHTML = '';
                        scope.kScope.element.kData = data.template;
                        scope.kScope.template.insertTemplate(target, element);
                    }
                }
            }
        });
    }

    /**
     * Function to fire module chain
     * @param {*} scope 
     */
    function fireChain(scope) {
        klevu.setSetting(scope.settings, "settings.search.fullPageLayoutEnabled", true);
        klevu.setSetting(scope.settings, "settings.search.minChars", 0);
        var tempElement = scope.element;
        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
        klevu.event.fireChain(tempElement.kScope, "chains.events.keyUp", tempElement, tempElement.kScope.data, null);
    }

    /**
     * Function to process product currency
     * @param {*} scope 
     */
    function currencyProcess(scope) {
        var scopeCurrency = scope.getScope().template.getTranslator().getCurrencyObject();
        scopeCurrency.setCurrencys({
            'GBP': {
                string: "£",
                format: "%s%s",
                atEnd: false,
                precision: 2,
                thousands: ",",
                decimal: ".",
                grouping: 3
            },
            'USD': {
                string: "USD",
                atEnd: true
            },
            'EUR': {
                string: "EUR",
                format: "%s %s",
                atEnd: true
            },
        });
        scopeCurrency.mergeToGlobal();
    }

    /**
     * Function to create and get scope 
     * @param {*} moduleName 
     */
    function createAndGetScope(moduleName) {
        klevu.search[moduleName] = klevu.searchObjectClone(klevu.search.base);
        currencyProcess(klevu.search[moduleName]);
        return klevu.search[moduleName];
    }

    /**
     * Function to get the product ids
     * @param {*} parameterProductIds 
     * @param {*} globalVariableProductIds 
     */
    function getProductIds(parameterProductIds, globalVariableProductIds) {
        var productIds = [];
        var tempProductIds = [];

        if (parameterProductIds && parameterProductIds.length) {
            tempProductIds = parameterProductIds;
        } else if (globalVariableProductIds && globalVariableProductIds.length) {
            tempProductIds = globalVariableProductIds;
        }

        if (tempProductIds.length) {
            tempProductIds.forEach(productId => {
                productIds.push({
                    "id": productId
                });
            });
        }

        return productIds;
    }

    var productsRecommendation = {
        addRecordQueryObject: addRecordQueryObject,
        renderResponse: renderResponse,
        fireChain: fireChain,
        createAndGetScope: createAndGetScope,
        getProductIds: getProductIds,
        currencyProcess: currencyProcess
    };

    klevu.extend(true, klevu.search.modules, {
        productsRecommendation: {
            base: productsRecommendation,
            build: true
        }
    });

})(klevu);

klevu.coreEvent.build({
    name: "productsRecommendationModule",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.productsRecommendation ||
            !klevu.search.modules.productsRecommendation.build ||
            !klevu.getSetting(klevu.settings, "settings.localSettings", false)) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});