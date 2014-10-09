var CNY_PER_USD = 6.1298;

angular.module('price', [])
    .controller('Calculator', function ($scope) {
        function toCNY(unit, value) {
            if (unit === 'USD') {
                return value * CNY_PER_USD;
            } else if (unit === 'CNY') {
                return value;
            } else {
                console.log('Unsupported unit: "' + unit + '"');
                return NaN;
            }
        }

        function formatResult(value) {
            return parseFloat(Math.round(value * 100000) / 100000).toFixed(5);
        }

        function Service(name, price, unit) {
            return {
                name: name,
                unit: unit,
                price: price,
                calcPrice: function (pricingItem, asCNY) {
                    var value = price[pricingItem] * $scope.amounts[pricingItem];
                    var result = !!asCNY ? toCNY(unit, value) : value;
                    return formatResult(result)
                },
                calcSummary: function (asCNY) {
                    var that = this;
                    var sum = _.reduce(that.price, function (result, value, key) {
                        result += value * $scope.amounts[key];
                        return result;
                    }, 0);

                    var result = !!asCNY ? toCNY(unit, sum) : sum;
                    return formatResult(result)
                }
            }
        }

        $scope.services = [
            Service('AWS S3', {
                outboundTransferPer1GB: 0.201,
                transactionDelPer10K: 0,
                transactionPutPer10K: 0.047,
                transactionGetPer10K: 0.047,
                blobLessThan1TB: 0.033,
                blobLessThan50TB: 0.0324
            }, 'USD'),
            Service('Azure Storage', {
                outboundTransferPer1GB: 0.138,
                transactionDelPer10K: 0.00036,
                transactionPutPer10K: 0.00036,
                transactionGetPer10K: 0.00036,
                blobLessThan1TB: 0.024,
                blobLessThan50TB: 0.0236
            }, 'USD'),
            Service('QiNiu Storage', {
                outboundTransferPer1GB: 0.5,
                transactionDelPer10K: 0.1,
                transactionPutPer10K: 0.1,
                transactionGetPer10K: 0.01,
                blobLessThan1TB: 0.165,
                blobLessThan50TB: 0.165
            }, 'CNY')
        ];

        $scope.amounts = {
            outboundTransferPer1GB: 10,
            transactionDelPer10K: 1,
            transactionPutPer10K: 1,
            transactionGetPer10K: 100,
            blobLessThan1TB: 0,
            blobLessThan50TB: 1024
        };
    });
