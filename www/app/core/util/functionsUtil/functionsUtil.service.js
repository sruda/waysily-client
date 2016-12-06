var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var functionsUtil;
            (function (functionsUtil) {
                'use strict';
                (function (Validation) {
                    Validation[Validation["Email"] = 0] = "Email";
                    Validation[Validation["String"] = 1] = "String";
                    Validation[Validation["Number"] = 2] = "Number";
                    Validation[Validation["Null"] = 3] = "Null";
                    Validation[Validation["Empty"] = 4] = "Empty";
                })(functionsUtil.Validation || (functionsUtil.Validation = {}));
                var Validation = functionsUtil.Validation;
                var FunctionsUtilService = (function () {
                    function FunctionsUtilService($filter) {
                        this.$filter = $filter;
                        console.log('functionsUtil service called');
                    }
                    FunctionsUtilService.prototype.dateFormat = function (date) {
                        var dateFormatted = moment(date).format('YYYY-MM-DD');
                        return dateFormatted;
                    };
                    FunctionsUtilService.prototype.joinDate = function (day, month, year) {
                        var newDate = year + '-' + month + '-' + day;
                        var dateFormatted = moment(newDate).format('YYYY-MM-DD');
                        return dateFormatted;
                    };
                    FunctionsUtilService.prototype.splitDate = function (date) {
                        var dateString = moment(date).format('YYYY-MM-DD').split('-');
                        var dateFormatted = {
                            day: dateString[2],
                            month: dateString[1],
                            year: dateString[0]
                        };
                        return dateFormatted;
                    };
                    FunctionsUtilService.prototype.splitToColumns = function (arr, size) {
                        var newArr = [];
                        for (var i = 0; i < arr.length; i += size) {
                            newArr.push(arr.slice(i, i + size));
                        }
                        return newArr;
                    };
                    FunctionsUtilService.prototype.buildMapConfig = function (dataSet, mapType, position) {
                        var mapConfig = {
                            type: mapType,
                            data: {
                                position: position || { lng: 36.75, lat: 54.93 },
                                markers: []
                            }
                        };
                        if (dataSet) {
                            for (var i = 0; i < dataSet.length; i++) {
                                mapConfig.data.markers.push({
                                    id: dataSet[i].id,
                                    position: dataSet[i].location.position
                                });
                            }
                        }
                        return mapConfig;
                    };
                    FunctionsUtilService.prototype.generateRangesOfNumbers = function (from, to) {
                        var array = [];
                        for (var i = from; i <= to; i++) {
                            array.push(i);
                        }
                        return array;
                    };
                    FunctionsUtilService.prototype.buildNumberSelectList = function (from, to) {
                        var dayRange = this.generateRangesOfNumbers(from, to);
                        var list = [];
                        for (var i = 0; i < dayRange.length; i++) {
                            list.push({ value: dayRange[i] });
                        }
                        return list;
                    };
                    FunctionsUtilService.prototype.progress = function (currentStep, totalSteps) {
                        var percent = (100 / totalSteps) * (currentStep);
                        return percent + '%';
                    };
                    FunctionsUtilService.prototype.validator = function (value, validations) {
                        if (validations === void 0) { validations = []; }
                        var NULL_MESSAGE = this.$filter('translate')('%global.validation.null.message.text');
                        var EMPTY_MESSAGE = this.$filter('translate')('%global.validation.empty.message.text');
                        var STRING_MESSAGE = this.$filter('translate')('%global.validation.string.message.text');
                        var NUMBER_MESSAGE = this.$filter('translate')('%global.validation.number.message.text');
                        var EMAIL_MESSAGE = this.$filter('translate')('%global.validation.email.message.text');
                        var obj = { valid: true, message: 'ok' };
                        for (var i = 0; i < validations.length; i++) {
                            switch (validations[i]) {
                                case 3: {
                                    if (value == null) {
                                        obj.message = NULL_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                }
                                case 4: {
                                    if (value == '') {
                                        obj.message = EMPTY_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                }
                                case 1: {
                                    if (typeof value !== 'string') {
                                        obj.message = STRING_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                }
                                case 2: {
                                    if (typeof value !== 'number') {
                                        obj.message = NUMBER_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                }
                                case 0: {
                                    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                                    obj.valid = pattern.test(value);
                                    if (obj.valid == false) {
                                        obj.message = EMAIL_MESSAGE;
                                    }
                                    break;
                                }
                            }
                        }
                        return obj;
                    };
                    FunctionsUtilService.extractCountriesFromHtml = function () {
                        var countries_json = {};
                        var language = 'EN';
                        var html = document.getElementById("countriesList." + language);
                        for (var i = 0; i < html.length; i++) {
                            var countryText = html[i].innerText;
                            var countryCode = html[i].attributes[0].nodeValue;
                            countries_json["%country." + countryCode] = countryText;
                        }
                        console.log(JSON.stringify(countries_json));
                    };
                    return FunctionsUtilService;
                }());
                FunctionsUtilService.serviceId = 'mainApp.core.util.FunctionsUtilService';
                FunctionsUtilService.$inject = ['$filter'];
                functionsUtil.FunctionsUtilService = FunctionsUtilService;
                angular
                    .module('mainApp.core.util', [])
                    .service(FunctionsUtilService.serviceId, FunctionsUtilService);
            })(functionsUtil = util.functionsUtil || (util.functionsUtil = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=functionsUtil.service.js.map