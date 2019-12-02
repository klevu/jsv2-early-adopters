/**
 * Color swatch base extension
 */

(function (klevu) {

    /**
     * Function to prepare keyValue pair object
     * @param {*} keyValuePair 
     */
    function parseKeyValuePairs(keyValuePair) {
        var dataList = [];
        keyValuePair.forEach(function (obj, index) {
            var dataIndex = index + 1;
            var matchedData = {};
            keyValuePair.forEach(function (swatch, i) {
                var objName = swatch.name;
                if (objName.indexOf(dataIndex) > -1) {
                    objName = objName.replace(dataIndex, "");
                    matchedData[objName] = swatch.value;
                    matchedData.isMatched = true;
                }
            });
            if (matchedData.isMatched) {
                delete matchedData.isMatched;
                dataList.push(matchedData);
            }
        });
        return dataList;
    }

    /**
     * Function to parse swatches info data string
     * @param {*} str 
     */
    function getColorSwatchesInfoFromString(str) {
        if (str && str[0] && str[0].variantId) {
            return str;
        }
        var dataArray = str.split(";;;;");
        var keyValuePair = [];
        dataArray.forEach(function (str) {
            if (str.length) {
                var obj = {};
                var trimmedStr = str.trim();
                var splitedStr = trimmedStr.split(":");
                if (splitedStr.length === 2) {
                    obj = {
                        name: splitedStr[0],
                        value: splitedStr[1]
                    };
                } else if (splitedStr.length > 2) {
                    var shiftedArray = splitedStr.shift();
                    obj = {
                        name: shiftedArray,
                        value: splitedStr.join(":")
                    };
                }
                keyValuePair.push(obj);
            }
        });
        return this.parseKeyValuePairs(keyValuePair);
    }

    /**
     * Function to update data in existing product object
     * @param {*} scope 
     * @param {*} listName 
     */
    function parseProductColorSwatch(scope, listName) {
        var self = this;
        var items = klevu.getObjectPath(scope.data.template.query, listName);
        if (items && items.result) {
            klevu.each(items.result, function (key, value) {
                if (value.swatchesInfo && value.swatchesInfo.length) {
                    value.swatchesInfo = self.getColorSwatchesInfoFromString(value.swatchesInfo);
                }
            })
        }
    }

    var colorSwatches = {
        parseProductColorSwatch: parseProductColorSwatch,
        getColorSwatchesInfoFromString: getColorSwatchesInfoFromString,
        parseKeyValuePairs: parseKeyValuePairs
    };

    klevu.extend(true, klevu.search.modules, {
        colorSwatches: {
            base: colorSwatches,
            build: true
        }
    });

})(klevu);


/**
 * colorSwatches module build event
 */
klevu.coreEvent.build({
    name: "colorSwatchesModuleBuild",
    fire: function () {
        if (!klevu.search.modules ||
            !klevu.search.modules.colorSwatches ||
            !klevu.search.modules.colorSwatches.build) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});