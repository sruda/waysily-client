(function () {
    'use strict';
    angular
        .module('mainApp', [
        'mainApp.core',
        'mainApp.core.util',
        'mainApp.localStorage',
        'mainApp.core.restApi',
        'mainApp.core.s3Upload',
        'mainApp.auth',
        'mainApp.register',
        'mainApp.account',
        'mainApp.models.feedback',
        'mainApp.models.user',
        'mainApp.models.student',
        'mainApp.models.teacher',
        'mainApp.models.school',
        'mainApp.pages.main',
        'mainApp.pages.studentLandingPage',
        'mainApp.pages.teacherLandingPage',
        'mainApp.pages.landingPage',
        'mainApp.pages.resetPasswordPage',
        'mainApp.pages.searchPage',
        'mainApp.pages.createTeacherPage',
        'mainApp.pages.teacherProfilePage',
        'mainApp.pages.userProfilePage',
        'mainApp.pages.userEditProfilePage',
        'mainApp.pages.userEditAgendaPage',
        'mainApp.pages.userEditMediaPage',
        'mainApp.pages.userInboxPage',
        'mainApp.pages.userInboxDetailsPage',
        'mainApp.pages.meetingConfirmationPage',
        'mainApp.components.header',
        'mainApp.components.rating',
        'mainApp.components.map',
        'mainApp.components.modal',
        'mainApp.components.footer',
        'mainApp.components.floatMessageBar'
    ])
        .config(['OAuthProvider', 'dataConfig',
        function (OAuthProvider, dataConfig) {
            OAuthProvider.configure({
                baseUrl: dataConfig.baseUrl,
                clientId: dataConfig.localOAuth2Key,
                grantPath: '/oauth2/token/',
                revokePath: '/oauth2/revoke_token/'
            });
        }
    ])
        .config(['OAuthTokenProvider', 'dataConfig',
        function (OAuthTokenProvider, dataConfig) {
            OAuthTokenProvider.configure({
                name: dataConfig.cookieName,
                options: {
                    secure: dataConfig.https,
                }
            });
        }
    ])
        .config(config);
    function config($locationProvider, $urlRouterProvider, $translateProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/page/main');
        var prefix = 'assets/i18n/';
        var suffix = '.json';
        $translateProvider.useStaticFilesLoader({
            prefix: prefix,
            suffix: suffix
        });
        $translateProvider.preferredLanguage('es');
        $translateProvider.useCookieStorage();
    }
})();
//# sourceMappingURL=app.module.js.map
(function () {
    'use strict';
    angular.module('mainApp.core', [
        'ngResource',
        'ngCookies',
        'ui.router',
        'angular-oauth2',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.calendar',
        'ui.bootstrap.datetimepicker',
        'ngFileUpload',
        'ngImgCrop'
    ]);
})();
//# sourceMappingURL=app.core.module.js.map
DEBUG = true;
(function () {
    'use strict';
    var BASE_URL = 'https://waysily-server.herokuapp.com/api/v1/';
    var BUCKETS3 = 'waysily-img/teachers-avatar-prd';
    if (DEBUG) {
        BASE_URL = 'http://127.0.0.1:8000/api/v1/';
        BUCKETS3 = 'waysily-img/teachers-avatar-dev';
    }
    var dataConfig = {
        currentYear: '2017',
        baseUrl: BASE_URL,
        domain: 'www.waysily.com',
        https: false,
        autoRefreshTokenIntervalSeconds: 300,
        usernameMinLength: 6,
        usernameMaxLength: 80,
        passwordMinLength: 6,
        passwordMaxLength: 80,
        localOAuth2Key: 'fCY4EWQIPuixOGhA9xRIxzVLNgKJVmG1CVnwXssq',
        googleMapKey: 'AIzaSyD-vO1--MMK-XmQurzNQrxW4zauddCJh5Y',
        mixpanelTokenPRD: '86a48c88274599c662ad64edb74b12da',
        mixpanelTokenDEV: 'eda475bf46e7f01e417a4ed1d9cc3e58',
        modalMeetingPointTmpl: 'components/modal/modalMeetingPoint/modalMeetingPoint.html',
        modalLanguagesTmpl: 'components/modal/modalLanguages/modalLanguages.html',
        modalExperienceTmpl: 'components/modal/modalExperience/modalExperience.html',
        modalEducationTmpl: 'components/modal/modalEducation/modalEducation.html',
        modalCertificateTmpl: 'components/modal/modalCertificate/modalCertificate.html',
        modalSignUpTmpl: 'components/modal/modalSignUp/modalSignUp.html',
        modalLogInTmpl: 'components/modal/modalLogIn/modalLogIn.html',
        modalForgotPasswordTmpl: 'components/modal/modalForgotPassword/modalForgotPassword.html',
        modalRecommendTeacherTmpl: 'components/modal/modalRecommendTeacher/modalRecommendTeacher.html',
        bucketS3: BUCKETS3,
        regionS3: 'us-east-1',
        accessKeyIdS3: 'AKIAIHKBYIUQD4KBIRLQ',
        secretAccessKeyS3: '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',
        userId: '',
        userDataLocalStorage: 'waysily.userData',
        teacherDataLocalStorage: 'waysily.teacherData',
        earlyIdLocalStorage: 'waysily.early_id',
        cookieName: 'token'
    };
    angular
        .module('mainApp')
        .constant('dataConfig', dataConfig);
})();
//# sourceMappingURL=app.values.js.map
(function () {
    'use strict';
    angular
        .module('mainApp')
        .run(run);
    run.$inject = [
        '$rootScope',
        '$state',
        'dataConfig',
        'mainApp.auth.AuthService',
        'mainApp.localStorageService'
    ];
    function run($rootScope, $state, dataConfig, AuthService, localStorage) {
        var productionHost = dataConfig.domain;
        var mixpanelTokenDEV = dataConfig.mixpanelTokenDEV;
        var mixpanelTokenPRD = dataConfig.mixpanelTokenPRD;
        if (window.location.hostname.toLowerCase().search(productionHost) < 0) {
            mixpanel.init(mixpanelTokenDEV);
        }
        else {
            mixpanel.init(mixpanelTokenPRD, {
                loaded: function (mixpanel) {
                    var first_visit = mixpanel.get_property("First visit");
                    var current_date = moment().format('MMMM Do YYYY, h:mm:ss a');
                    if (first_visit == null) {
                        mixpanel.register_once({ "First visit": current_date });
                        mixpanel.track("Visit");
                    }
                }
            });
        }
        if (AuthService.isAuthenticated()) {
            var userAccountInfo = JSON.parse(localStorage.getItem(dataConfig.userDataLocalStorage));
            $rootScope.userData = userAccountInfo;
        }
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data.requireLogin && !AuthService.isAuthenticated()) {
                event.preventDefault();
                $state.go('page.landingPage');
            }
        });
    }
})();
(function (angular) {
    function localStorageServiceFactory($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }
    localStorageServiceFactory.$inject = ['$window'];
    angular
        .module('mainApp.localStorage', [])
        .factory('mainApp.localStorageService', localStorageServiceFactory);
})(angular);
//# sourceMappingURL=app.run.js.map
var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var AuthService = (function () {
            function AuthService($q, $timeout, $cookies, OAuth, restApi, dataConfig, localStorage) {
                this.$q = $q;
                this.$timeout = $timeout;
                this.$cookies = $cookies;
                this.OAuth = OAuth;
                this.restApi = restApi;
                this.dataConfig = dataConfig;
                this.localStorage = localStorage;
                DEBUG && console.log('auth service called');
                this.AUTH_RESET_PASSWORD_URI = 'rest-auth/password/reset/';
                this.AUTH_CONFIRM_RESET_PASSWORD_URI = 'rest-auth/password/reset/confirm/';
                this.autoRefreshTokenInterval = dataConfig.autoRefreshTokenIntervalSeconds * 1000;
                this.refreshNeeded = true;
            }
            AuthService.prototype.isAuthenticated = function () {
                return this.OAuth.isAuthenticated();
            };
            AuthService.prototype.forceLogout = function () {
                DEBUG && console.log("Forcing logout");
                this.$cookies.remove(this.dataConfig.cookieName);
                this.localStorage.removeItem(this.dataConfig.userDataLocalStorage);
                this.localStorage.removeItem(this.dataConfig.teacherDataLocalStorage);
            };
            AuthService.prototype.resetPassword = function (email) {
                var url = this.AUTH_RESET_PASSWORD_URI;
                var deferred = this.$q.defer();
                var data = {
                    email: email
                };
                this.restApi.create({ url: url }, data).$promise
                    .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    DEBUG && console.error(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            AuthService.prototype.confirmResetPassword = function (uid, token, newPassword1, newPassword2) {
                var url = this.AUTH_CONFIRM_RESET_PASSWORD_URI;
                var deferred = this.$q.defer();
                var data = {
                    uid: uid,
                    token: token,
                    new_password1: newPassword1,
                    new_password2: newPassword2
                };
                this.restApi.create({ url: url }, data).$promise
                    .then(function (response) {
                    deferred.resolve(response.detail);
                }, function (error) {
                    DEBUG && console.error(error);
                    if (error.data) {
                        deferred.reject(error.data.token[0]);
                    }
                    else {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            };
            AuthService.prototype.login = function (user) {
                var self = this;
                var deferred = this.$q.defer();
                this.OAuth.getAccessToken(user, {}).then(function (response) {
                    DEBUG && console.info("Logged in successfuly!");
                    deferred.resolve(response);
                }, function (error) {
                    DEBUG && console.error("Error while logging in!");
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            AuthService.prototype.logout = function () {
                var self = this;
                var deferred = this.$q.defer();
                this.OAuth.revokeToken().then(function (response) {
                    DEBUG && console.info("Logged out successfuly!");
                    self.localStorage.removeItem(self.dataConfig.userDataLocalStorage);
                    self.localStorage.removeItem(self.dataConfig.teacherDataLocalStorage);
                    deferred.resolve(response);
                }, function (response) {
                    DEBUG && console.error("Error while logging you out!");
                    self.forceLogout();
                    deferred.reject(response);
                });
                return deferred.promise;
            };
            AuthService.prototype.refreshToken = function () {
                var self = this;
                var deferred = this.$q.defer();
                if (!this.isAuthenticated()) {
                    DEBUG && console.error('Cannot refresh token if Unauthenticated');
                    deferred.reject();
                    return deferred.promise;
                }
                this.OAuth.getRefreshToken().then(function (response) {
                    DEBUG && console.info("Access token refreshed");
                    deferred.resolve(response);
                }, function (response) {
                    DEBUG && console.error("Error refreshing token ");
                    DEBUG && console.error(response);
                    deferred.reject(response);
                });
                return deferred.promise;
            };
            AuthService.prototype.autoRefreshToken = function () {
                var self = this;
                var deferred = this.$q.defer();
                if (!this.refreshNeeded) {
                    deferred.resolve();
                    return deferred.promise;
                }
                this.refreshToken().then(function (response) {
                    self.refreshNeeded = false;
                    deferred.resolve(response);
                }, function (response) {
                    deferred.reject(response);
                });
                this.$timeout(function () {
                    if (self.isAuthenticated()) {
                        self.refreshNeeded = true;
                        self.autoRefreshToken();
                    }
                }, self.autoRefreshTokenInterval);
                return deferred.promise;
            };
            return AuthService;
        }());
        AuthService.serviceId = 'mainApp.auth.AuthService';
        AuthService.$inject = ['$q',
            '$timeout',
            '$cookies',
            'OAuth',
            'mainApp.core.restApi.restApiService',
            'dataConfig',
            'mainApp.localStorageService'];
        auth.AuthService = AuthService;
        angular
            .module('mainApp.auth', [])
            .service(AuthService.serviceId, AuthService);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=auth.service.js.map
var app;
(function (app) {
    var account;
    (function (account) {
        'use strict';
        var AccountService = (function () {
            function AccountService($q, restApi) {
                this.$q = $q;
                this.restApi = restApi;
                DEBUG && console.log('account service instanced');
                this.ACCOUNT_URI = 'account';
                this.ACCOUNT_GET_USERNAME_URI = 'account/username';
            }
            AccountService.prototype.getAccount = function () {
                var url = this.ACCOUNT_URI;
                return this.restApi.show({ url: url }).$promise
                    .then(function (response) {
                    return response;
                }, function (error) {
                    DEBUG && console.error(error);
                    return error;
                });
            };
            AccountService.prototype.getUsername = function (email) {
                var url = this.ACCOUNT_GET_USERNAME_URI;
                var deferred = this.$q.defer();
                var data = {
                    email: email
                };
                this.restApi.create({ url: url }, data).$promise
                    .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    DEBUG && console.error(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            return AccountService;
        }());
        AccountService.serviceId = 'mainApp.account.AccountService';
        AccountService.$inject = [
            '$q',
            'mainApp.core.restApi.restApiService'
        ];
        account.AccountService = AccountService;
        angular
            .module('mainApp.account', [])
            .service(AccountService.serviceId, AccountService);
    })(account = app.account || (app.account = {}));
})(app || (app = {}));
//# sourceMappingURL=account.service.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var functionsUtil;
            (function (functionsUtil) {
                'use strict';
                var Validation;
                (function (Validation) {
                    Validation[Validation["Email"] = 0] = "Email";
                    Validation[Validation["String"] = 1] = "String";
                    Validation[Validation["Null"] = 2] = "Null";
                    Validation[Validation["Empty"] = 3] = "Empty";
                    Validation[Validation["Number"] = 4] = "Number";
                    Validation[Validation["IsNotZero"] = 5] = "IsNotZero";
                    Validation[Validation["Defined"] = 6] = "Defined";
                    Validation[Validation["IsTrue"] = 7] = "IsTrue";
                    Validation[Validation["IsNotNaN"] = 8] = "IsNotNaN";
                })(Validation = functionsUtil.Validation || (functionsUtil.Validation = {}));
                var FunctionsUtilService = (function () {
                    function FunctionsUtilService($filter, dataConfig, $translate) {
                        this.$filter = $filter;
                        this.dataConfig = dataConfig;
                        this.$translate = $translate;
                        console.log('functionsUtil service called');
                    }
                    FunctionsUtilService.prototype.normalizeString = function (str) {
                        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
                        var to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
                        var mapping = {};
                        for (var i = 0; i < from.length; i++)
                            mapping[from.charAt(i)] = to.charAt(i);
                        var ret = [];
                        for (var i = 0; i < str.length; i++) {
                            var c = str.charAt(i);
                            if (mapping.hasOwnProperty(str.charAt(i)))
                                ret.push(mapping[c]);
                            else
                                ret.push(c);
                        }
                        return ret.join('');
                    };
                    FunctionsUtilService.generateGuid = function () {
                        var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                        var guid = fmt.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        return guid;
                    };
                    FunctionsUtilService.prototype.dateFormat = function (date) {
                        var DEFAULT_DJANGO_DATE_FORMAT = 'YYYY-MM-DD';
                        var TEMPORAL_FORMAT = 'MM/DD/YYYY';
                        var dateTemporalFormatted = moment(date).format(TEMPORAL_FORMAT);
                        var dateFormattedSplit = this.splitDate(dateTemporalFormatted);
                        var dateFormatted = this.joinDate(dateFormattedSplit.day, dateFormattedSplit.month, dateFormattedSplit.year);
                        return dateFormatted;
                    };
                    FunctionsUtilService.prototype.ageFormat = function (year) {
                        var currentYear = parseInt(this.dataConfig.currentYear);
                        var birthYear = parseInt(year);
                        var age = currentYear - birthYear;
                        return age.toString();
                    };
                    FunctionsUtilService.prototype.getCurrentLanguage = function () {
                        var currentLanguage = this.$translate.use();
                        return currentLanguage;
                    };
                    FunctionsUtilService.prototype.generateUsername = function (firstName, lastName) {
                        var alias = '';
                        var username = '';
                        var randomCode = '';
                        var minLength = this.dataConfig.usernameMinLength;
                        var maxLength = this.dataConfig.usernameMaxLength;
                        var ALPHABET = '0123456789';
                        var ID_LENGTH = 7;
                        var REMAINDER = maxLength - ID_LENGTH;
                        var EXTRAS = 2;
                        firstName = this.normalizeString(firstName);
                        firstName = firstName.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
                        lastName = this.normalizeString(lastName);
                        lastName = lastName.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
                        if (firstName.length > REMAINDER - EXTRAS) {
                            firstName = firstName.substring(0, REMAINDER - EXTRAS);
                        }
                        alias = (firstName + lastName.substring(0, 1)).toLowerCase();
                        for (var i = 0; i < ID_LENGTH; i++) {
                            randomCode += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
                        }
                        username = alias + '-' + randomCode;
                        return username;
                    };
                    FunctionsUtilService.prototype.changeLanguage = function (language) {
                        this.$translate.use(language);
                    };
                    FunctionsUtilService.prototype.joinDate = function (day, month, year) {
                        var newDate = year + '-' + month + '-' + day;
                        return newDate;
                    };
                    FunctionsUtilService.prototype.splitDate = function (date) {
                        var TEMPORAL_FORMAT = 'MM/DD/YYYY';
                        var dateString = moment(date).format(TEMPORAL_FORMAT).split('/');
                        var dateFormatted = {
                            day: dateString[1],
                            month: dateString[0],
                            year: dateString[2]
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
                    FunctionsUtilService.prototype.buildMapConfig = function (dataSet, mapType, position, zoom) {
                        var mapConfig = {
                            type: mapType,
                            data: {
                                position: position || { lat: 6.175434, lng: -75.583329 },
                                markers: [],
                                zoom: zoom
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
                        var DEFINED_MESSAGE = this.$filter('translate')('%global.validation.null.message.text');
                        var IS_NOT_ZERO_MESSAGE = this.$filter('translate')('%global.validation.is_not_zero.message.text');
                        var STRING_MESSAGE = this.$filter('translate')('%global.validation.string.message.text');
                        var NUMBER_MESSAGE = this.$filter('translate')('%global.validation.number.message.text');
                        var EMAIL_MESSAGE = this.$filter('translate')('%global.validation.email.message.text');
                        var TRUE_MESSAGE = this.$filter('translate')('%global.validation.true.message.text');
                        var NAN_MESSAGE = this.$filter('translate')('%global.validation.number.message.text');
                        var obj = { valid: true, message: 'ok' };
                        for (var i = 0; i < validations.length; i++) {
                            switch (validations[i]) {
                                case 0:
                                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    obj.valid = pattern.test(value);
                                    if (obj.valid == false) {
                                        obj.message = EMAIL_MESSAGE;
                                    }
                                    break;
                                case 1:
                                    if (typeof value !== 'string') {
                                        obj.message = STRING_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 2:
                                    if (value == null) {
                                        obj.message = NULL_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 3:
                                    if (value == '') {
                                        obj.message = EMPTY_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 4:
                                    if (typeof value !== 'number') {
                                        obj.message = NUMBER_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 5:
                                    if (parseInt(value) == 0) {
                                        obj.message = IS_NOT_ZERO_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 6:
                                    if (value === undefined) {
                                        obj.message = DEFINED_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 7:
                                    if (value !== true) {
                                        obj.message = TRUE_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
                                case 8:
                                    if (isNaN(value)) {
                                        obj.message = NAN_MESSAGE;
                                        obj.valid = false;
                                    }
                                    break;
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
                    FunctionsUtilService.prototype.averageNumbersArray = function (values) {
                        var total = 0;
                        var average = 0;
                        var amountValues = values.length;
                        for (var i = 0; i < values.length; i++) {
                            total = values[i] + total;
                        }
                        average = Math.round(total / amountValues);
                        return average;
                    };
                    FunctionsUtilService.prototype.teacherRatingAverage = function (ratingsArr) {
                        var average = 0;
                        var averageArr = [];
                        var ratings = [];
                        for (var i = 0; i < ratingsArr.length; i++) {
                            ratings.push(new app.models.teacher.Rating(ratingsArr[i]));
                            var newArr = [
                                ratings[i].MethodologyValue,
                                ratings[i].TeachingValue,
                                ratings[i].CommunicationValue
                            ];
                            averageArr.push(this.averageNumbersArray(newArr));
                        }
                        average = this.averageNumbersArray(averageArr);
                        return average;
                    };
                    return FunctionsUtilService;
                }());
                FunctionsUtilService.serviceId = 'mainApp.core.util.FunctionsUtilService';
                FunctionsUtilService.$inject = ['$filter',
                    'dataConfig',
                    '$translate'];
                functionsUtil.FunctionsUtilService = FunctionsUtilService;
                angular
                    .module('mainApp.core.util', [])
                    .service(FunctionsUtilService.serviceId, FunctionsUtilService);
            })(functionsUtil = util.functionsUtil || (util.functionsUtil = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=functionsUtil.service.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var getDataStaticJson;
            (function (getDataStaticJson) {
                'use strict';
                var GetDataStaticJsonService = (function () {
                    function GetDataStaticJsonService($translate) {
                        this.$translate = $translate;
                        console.log('getDataStaticJsonService service called');
                    }
                    GetDataStaticJsonService.prototype.returnValuei18n = function (type, code) {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var key = '';
                        for (var element in jsonDoc) {
                            if (element.indexOf(type) >= 0) {
                                var regex = new RegExp('%' + type + '.', 'g');
                                var codeFromJson = element.replace(regex, '');
                                if (codeFromJson === code) {
                                    key = element;
                                }
                            }
                        }
                        return key;
                    };
                    GetDataStaticJsonService.prototype.getMonthi18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("month") >= 0) {
                                var code = element.replace(/%month./g, '');
                                array.push({ value: element, code: code });
                            }
                        }
                        return array;
                    };
                    GetDataStaticJsonService.prototype.getSexi18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("sex") >= 0) {
                                var code = element.replace(/%sex./g, '');
                                array.push({ value: element, code: code });
                            }
                        }
                        return array;
                    };
                    GetDataStaticJsonService.prototype.getCountryi18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("country") >= 0) {
                                var code = element.replace(/%country./g, '');
                                array.push({ value: element, code: code });
                            }
                        }
                        return array;
                    };
                    GetDataStaticJsonService.prototype.getLanguagei18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("language") >= 0) {
                                var code = element.replace(/%language./g, '');
                                var value = jsonDoc[element];
                                array.push({ value: value, code: code });
                            }
                        }
                        return array;
                    };
                    GetDataStaticJsonService.prototype.getDegreei18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("degree") >= 0) {
                                var code = element.replace(/%degree./g, '');
                                array.push({ value: element, code: code });
                            }
                        }
                        return array;
                    };
                    GetDataStaticJsonService.prototype.getTypeOfImmersioni18n = function () {
                        var jsonDoc = this.$translate.getTranslationTable();
                        var array = [];
                        for (var element in jsonDoc) {
                            if (element.indexOf("immersion") >= 0) {
                                var code = element.replace(/%immersion./g, '');
                                array.push({ value: element, code: code });
                            }
                        }
                        return array;
                    };
                    return GetDataStaticJsonService;
                }());
                GetDataStaticJsonService.serviceId = 'mainApp.core.util.GetDataStaticJsonService';
                GetDataStaticJsonService.$inject = ['$translate'];
                getDataStaticJson.GetDataStaticJsonService = GetDataStaticJsonService;
                angular
                    .module('mainApp.core.util')
                    .service(GetDataStaticJsonService.serviceId, GetDataStaticJsonService);
            })(getDataStaticJson = util.getDataStaticJson || (util.getDataStaticJson = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=getDataStaticJson.service.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var messageUtil;
            (function (messageUtil) {
                'use strict';
                var messageUtilService = (function () {
                    function messageUtilService($filter) {
                        this.$filter = $filter;
                        toastr.options.positionClass = "toast-top-right";
                        toastr.options.showDuration = 300;
                        toastr.options.hideDuration = 300;
                        toastr.options.timeOut = 2000;
                    }
                    messageUtilService.prototype.success = function (message) {
                        toastr.success(message);
                    };
                    messageUtilService.prototype.error = function (message) {
                        var ERROR_SERVER_MESSAGE = this.$filter('translate')('%notification.error.server.text');
                        toastr.options.closeButton = true;
                        toastr.options.timeOut = 10000;
                        if (!message) {
                            message = ERROR_SERVER_MESSAGE;
                        }
                        toastr.error(message);
                    };
                    messageUtilService.prototype.info = function (message) {
                        toastr.options.closeButton = true;
                        toastr.options.timeOut = 10000;
                        toastr.info(message);
                    };
                    messageUtilService.instance = function ($filter) {
                        return new messageUtilService($filter);
                    };
                    return messageUtilService;
                }());
                messageUtilService.serviceId = 'mainApp.core.util.messageUtilService';
                messageUtilService.$inject = ['$filter'];
                angular
                    .module('mainApp.core.util')
                    .factory(messageUtilService.serviceId, messageUtilService.instance);
            })(messageUtil = util.messageUtil || (util.messageUtil = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=messageUtil.service.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var util;
        (function (util) {
            var filters;
            (function (filters) {
                GetI18nFilter.$inject = ['$filter', 'mainApp.core.util.GetDataStaticJsonService'];
                function GetI18nFilter($filter, getDataFromJson) {
                    return function (value, type) {
                        var valueI18n = getDataFromJson.returnValuei18n(type, value);
                        var translated = $filter('translate')(valueI18n);
                        return translated;
                    };
                }
                filters.GetI18nFilter = GetI18nFilter;
                GetTypeOfTeacherFilter.$inject = ['$filter'];
                function GetTypeOfTeacherFilter($filter) {
                    return function (value) {
                        var translated = '';
                        if (value === 'H') {
                            translated = $filter('translate')('%global.teacher.type.hobby.text');
                        }
                        else if (value === 'P') {
                            translated = $filter('translate')('%global.teacher.type.professional.text');
                        }
                        return translated;
                    };
                }
                filters.GetTypeOfTeacherFilter = GetTypeOfTeacherFilter;
                AgeFilter.$inject = ['$filter', 'mainApp.core.util.FunctionsUtilService'];
                function AgeFilter($filter, functionsUtil) {
                    return function (value) {
                        var age = functionsUtil.ageFormat(value);
                        var translated = $filter('translate')('%global.age.text');
                        return age + ' ' + translated;
                    };
                }
                filters.AgeFilter = AgeFilter;
                YearMonthFormatFilter.$inject = ['$filter', 'mainApp.core.util.GetDataStaticJsonService'];
                function YearMonthFormatFilter($filter, getDataFromJson) {
                    return function (value) {
                        var dateString = moment(value).format('YYYY/MM/DD').split('/');
                        var valueI18n = getDataFromJson.returnValuei18n('month', dateString[1]);
                        var translated = $filter('translate')(valueI18n);
                        var dateFormatted = {
                            month: translated,
                            year: dateString[0]
                        };
                        return dateFormatted.month + ' ' + dateFormatted.year;
                    };
                }
                filters.YearMonthFormatFilter = YearMonthFormatFilter;
                angular
                    .module('mainApp.core.util')
                    .filter('getI18nFilter', GetI18nFilter)
                    .filter('getTypeOfTeacherFilter', GetTypeOfTeacherFilter)
                    .filter('ageFilter', AgeFilter)
                    .filter('yearMonthFormatFilter', YearMonthFormatFilter);
            })(filters = util.filters || (util.filters = {}));
        })(util = core.util || (core.util = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=app.filter.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.core.restApi', [])
        .config(config);
    function config() {
    }
})();
//# sourceMappingURL=restApi.config.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var restApi;
        (function (restApi) {
            'use strict';
            var RestApiService = (function () {
                function RestApiService($resource, dataConfig) {
                    this.$resource = $resource;
                }
                RestApiService.Api = function ($resource, dataConfig) {
                    var resource = $resource(dataConfig.baseUrl + ':url/:id', { url: '@url' }, {
                        show: { method: 'GET', params: { id: '@id' } },
                        query: { method: 'GET', isArray: true },
                        queryObject: { method: 'GET', isArray: false },
                        create: { method: 'POST' },
                        update: { method: 'PUT', params: { id: '@id' } },
                        remove: { method: 'DELETE', params: { id: '@id' } }
                    });
                    return resource;
                };
                return RestApiService;
            }());
            RestApiService.serviceId = 'mainApp.core.restApi.restApiService';
            RestApiService.$inject = [
                '$resource',
                'dataConfig'
            ];
            restApi.RestApiService = RestApiService;
            angular
                .module('mainApp.core.restApi')
                .factory(RestApiService.serviceId, RestApiService.Api)
                .factory('customHttpInterceptor', customHttpInterceptor)
                .config(configApi);
            configApi.$inject = ['$httpProvider'];
            customHttpInterceptor.$inject = ['$q', 'mainApp.core.util.messageUtilService'];
            function configApi($httpProvider) {
                $httpProvider.interceptors.push('customHttpInterceptor');
            }
            function customHttpInterceptor($q, messageUtil) {
                return {
                    request: function (req) {
                        req.url = decodeURIComponent(req.url);
                        return req;
                    },
                    requestError: function (rejection) {
                        return rejection;
                    },
                    response: function (res) {
                        return res;
                    }
                };
            }
        })(restApi = core.restApi || (core.restApi = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=restApi.service.js.map
var app;
(function (app) {
    var core;
    (function (core) {
        var s3Upload;
        (function (s3Upload) {
            'use strict';
            var S3UploadService = (function () {
                function S3UploadService($q, dataConfig) {
                    this.$q = $q;
                    this.dataConfig = dataConfig;
                    console.log('S3Upload service instanced');
                    this.REGION = this.dataConfig.regionS3;
                    this.ACCESS_KEY_ID = this.dataConfig.accessKeyIdS3;
                    this.SECRET_ACCESS_KEY = this.dataConfig.secretAccessKeyS3;
                    this.BUCKET = this.dataConfig.bucketS3;
                    AWS.config.region = this.REGION;
                    AWS.config.update({
                        accessKeyId: this.ACCESS_KEY_ID,
                        secretAccessKey: this.SECRET_ACCESS_KEY
                    });
                    this.bucket = new AWS.S3({
                        params: { Bucket: this.BUCKET, maxRetries: 10 },
                        httpOptions: { timeout: 360000 }
                    });
                }
                S3UploadService.prototype.upload = function (file) {
                    var deferred = this.$q.defer();
                    var params = {
                        Bucket: this.BUCKET,
                        Key: file.name,
                        ContentType: file.type,
                        Body: file
                    };
                    var options = {
                        partSize: 10 * 1024 * 1024,
                        queueSize: 1,
                        ACL: 'bucket-owner-full-control'
                    };
                    var uploader = this.bucket.upload(params, options, function (err, data) {
                        if (err) {
                            deferred.reject(err);
                        }
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                };
                return S3UploadService;
            }());
            S3UploadService.serviceId = 'mainApp.core.s3Upload.S3UploadService';
            S3UploadService.$inject = ['$q', 'dataConfig'];
            s3Upload.S3UploadService = S3UploadService;
            angular
                .module('mainApp.core.s3Upload', [])
                .service(S3UploadService.serviceId, S3UploadService);
        })(s3Upload = core.s3Upload || (core.s3Upload = {}));
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=s3Upload.service.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var feedback;
        (function (feedback) {
            var Feedback = (function () {
                function Feedback(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Feedback Model instanced');
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.nextCountry = obj.nextCountry || '';
                }
                Object.defineProperty(Feedback.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feedback.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply next country uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feedback.prototype, "NextCountry", {
                    get: function () {
                        return this.nextCountry;
                    },
                    set: function (nextCountry) {
                        if (nextCountry === undefined) {
                            throw 'Please supply next country';
                        }
                        this.nextCountry = nextCountry;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Feedback;
            }());
            feedback.Feedback = Feedback;
        })(feedback = models.feedback || (models.feedback = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=feedback.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var feedback;
        (function (feedback_1) {
            'use strict';
            var FeedbackService = (function () {
                function FeedbackService(restApi) {
                    this.restApi = restApi;
                    console.log('feedback service instanced');
                }
                FeedbackService.prototype.createFeedback = function (feedback) {
                    var promise;
                    var url = 'feedbacks';
                    promise = this.restApi.create({ url: url }, feedback)
                        .$promise.then(function (response) {
                        return response;
                    }, function (error) {
                        return error;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                    return promise;
                };
                FeedbackService.prototype.getEarlyById = function (id) {
                    var url = 'early/';
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return FeedbackService;
            }());
            FeedbackService.serviceId = 'mainApp.models.feedback.FeedbackService';
            FeedbackService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            feedback_1.FeedbackService = FeedbackService;
            angular
                .module('mainApp.models.feedback', [])
                .service(FeedbackService.serviceId, FeedbackService);
        })(feedback = models.feedback || (models.feedback = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=feedback.service.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var user;
        (function (user) {
            var Status;
            (function (Status) {
                Status[Status["new"] = 0] = "new";
                Status[Status["validated"] = 1] = "validated";
                Status[Status["verified"] = 2] = "verified";
            })(Status = user.Status || (user.Status = {}));
            var Profile = (function () {
                function Profile(obj) {
                    if (obj === void 0) { obj = {}; }
                    DEBUG && console.log('Profile Model instanced');
                    if (obj === null)
                        obj = {};
                    this.userId = obj.userId || '';
                    this.avatar = obj.avatar || '';
                    this.username = obj.username || '';
                    this.email = obj.email || '';
                    this.phoneNumber = obj.phoneNumber || '';
                    this.firstName = obj.firstName || '';
                    this.lastName = obj.lastName || '';
                    this.gender = obj.gender || '';
                    this.birthDate = obj.birthDate || '';
                    this.born = obj.born || '';
                    this.about = obj.about || '';
                    this.status = obj.status || 'NW';
                    this.createdAt = obj.createdAt || '';
                }
                Object.defineProperty(Profile.prototype, "UserId", {
                    get: function () {
                        return this.userId;
                    },
                    set: function (userId) {
                        if (userId === undefined) {
                            throw 'Please supply profile userId';
                        }
                        this.userId = userId;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Avatar", {
                    get: function () {
                        return this.avatar;
                    },
                    set: function (avatar) {
                        if (avatar === undefined) {
                            throw 'Please supply profile avatar';
                        }
                        this.avatar = avatar;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Username", {
                    get: function () {
                        return this.username;
                    },
                    set: function (username) {
                        if (username === undefined) {
                            throw 'Please supply profile username';
                        }
                        this.username = username;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Email", {
                    get: function () {
                        return this.email;
                    },
                    set: function (email) {
                        if (email === undefined) {
                            throw 'Please supply profile email';
                        }
                        this.email = email;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "PhoneNumber", {
                    get: function () {
                        return this.phoneNumber;
                    },
                    set: function (phoneNumber) {
                        if (phoneNumber === undefined) {
                            throw 'Please supply profile phone number';
                        }
                        this.phoneNumber = phoneNumber;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "FirstName", {
                    get: function () {
                        return this.firstName;
                    },
                    set: function (firstName) {
                        if (firstName === undefined) {
                            throw 'Please supply profile first name';
                        }
                        this.firstName = firstName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "LastName", {
                    get: function () {
                        return this.lastName;
                    },
                    set: function (lastName) {
                        if (lastName === undefined) {
                            throw 'Please supply profile last name';
                        }
                        this.lastName = lastName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Gender", {
                    get: function () {
                        return this.gender;
                    },
                    set: function (gender) {
                        if (gender === undefined) {
                            throw 'Please supply profile gender';
                        }
                        this.gender = gender;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "BirthDate", {
                    get: function () {
                        return this.birthDate;
                    },
                    set: function (birthDate) {
                        if (birthDate === undefined) {
                            throw 'Please supply profile birth date';
                        }
                        this.birthDate = birthDate;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Born", {
                    get: function () {
                        return this.born;
                    },
                    set: function (born) {
                        if (born === undefined) {
                            throw 'Please supply profile born';
                        }
                        this.born = born;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "About", {
                    get: function () {
                        return this.about;
                    },
                    set: function (about) {
                        if (about === undefined) {
                            throw 'Please supply profile location';
                        }
                        this.about = about;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "Status", {
                    get: function () {
                        return this.status;
                    },
                    set: function (status) {
                        if (status === undefined) {
                            throw 'Please supply profile status value';
                        }
                        this.status = status;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Profile.prototype, "CreatedAt", {
                    get: function () {
                        return this.createdAt;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Profile;
            }());
            user.Profile = Profile;
            var Location = (function () {
                function Location(obj) {
                    if (obj === void 0) { obj = {}; }
                    DEBUG && console.log('Location Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id || '';
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.country = obj.country || '';
                    this.address = obj.address || '';
                    this.position = new Position(obj.position);
                    this.city = obj.city || '';
                    this.state = obj.state || '';
                    this.zipCode = obj.zipCode || '';
                }
                Object.defineProperty(Location.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply location uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "Country", {
                    get: function () {
                        return this.country;
                    },
                    set: function (country) {
                        if (country === undefined) {
                            throw 'Please supply country location';
                        }
                        this.country = country;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "Address", {
                    get: function () {
                        return this.address;
                    },
                    set: function (address) {
                        if (address === undefined) {
                            throw 'Please supply address location';
                        }
                        this.address = address;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "Position", {
                    get: function () {
                        return this.position;
                    },
                    set: function (position) {
                        if (position === undefined) {
                            throw 'Please supply address location';
                        }
                        this.position = position;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "City", {
                    get: function () {
                        return this.city;
                    },
                    set: function (city) {
                        if (city === undefined) {
                            throw 'Please supply city location';
                        }
                        this.city = city;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "State", {
                    get: function () {
                        return this.state;
                    },
                    set: function (state) {
                        if (state === undefined) {
                            throw 'Please supply state location';
                        }
                        this.state = state;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Location.prototype, "ZipCode", {
                    get: function () {
                        return this.zipCode;
                    },
                    set: function (zipCode) {
                        if (zipCode === undefined) {
                            throw 'Please supply zip code location';
                        }
                        this.zipCode = zipCode;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Location;
            }());
            user.Location = Location;
            var Position = (function () {
                function Position(obj) {
                    if (obj === void 0) { obj = {}; }
                    DEBUG && console.log('Position Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id || '';
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.lng = obj.lng || '';
                    this.lat = obj.lat || '';
                }
                Object.defineProperty(Position.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply position uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Lng", {
                    get: function () {
                        return this.lng;
                    },
                    set: function (lng) {
                        if (lng === undefined) {
                            throw 'Please supply lng position';
                        }
                        this.lng = lng;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Lat", {
                    get: function () {
                        return this.lat;
                    },
                    set: function (lat) {
                        if (lat === undefined) {
                            throw 'Please supply lat position';
                        }
                        this.lat = lat;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Position;
            }());
            user.Position = Position;
        })(user = models.user || (models.user = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=user.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var user;
        (function (user_1) {
            'use strict';
            var UserService = (function () {
                function UserService(restApi) {
                    this.restApi = restApi;
                    console.log('user service instanced');
                    this.USER_URI = 'users';
                }
                UserService.prototype.getUserProfileById = function (id) {
                    var url = this.USER_URI;
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (response) {
                        return response;
                    }, function (error) {
                        DEBUG && console.error(error);
                        return error;
                    });
                };
                UserService.prototype.getAllUsersProfile = function () {
                    var url = this.USER_URI;
                    return this.restApi.query({ url: url }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                UserService.prototype.updateUserProfile = function (profile) {
                    var url = this.USER_URI;
                    return this.restApi.update({ url: url, id: profile.userId }, profile).$promise
                        .then(function (response) {
                        return response;
                    }, function (error) {
                        DEBUG && console.error(error);
                        return error;
                    });
                };
                return UserService;
            }());
            UserService.serviceId = 'mainApp.models.user.UserService';
            UserService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            user_1.UserService = UserService;
            angular
                .module('mainApp.models.user', [])
                .service(UserService.serviceId, UserService);
        })(user = models.user || (models.user = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=user.service.js.map
var app;
(function (app) {
    var register;
    (function (register) {
        'use strict';
        var RegisterService = (function () {
            function RegisterService($q, restApi) {
                this.$q = $q;
                this.restApi = restApi;
                DEBUG && console.log('register service instanced');
                this.REGISTER_URI = 'register';
                this.REGISTER_CHECK_EMAIL_URI = 'register/check-email';
                this.REGISTER_CHECK_USERNAME_URI = 'register/check-username';
            }
            RegisterService.prototype.checkEmail = function (email) {
                var url = this.REGISTER_CHECK_EMAIL_URI;
                var deferred = this.$q.defer();
                var data = {
                    email: email
                };
                this.restApi.create({ url: url }, data).$promise
                    .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    DEBUG && console.error(error);
                    deferred.resolve(error);
                });
                return deferred.promise;
            };
            RegisterService.prototype.checkUsername = function (username) {
                var url = this.REGISTER_CHECK_USERNAME_URI;
                return this.restApi.create({ url: url }, username).$promise
                    .then(function (data) {
                    return data;
                }, function (error) {
                    DEBUG && console.log(error);
                    return error;
                });
            };
            RegisterService.prototype.register = function (userData) {
                var url = this.REGISTER_URI;
                var deferred = this.$q.defer();
                this.restApi.create({ url: url }, userData).$promise
                    .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    DEBUG && console.error(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            return RegisterService;
        }());
        RegisterService.serviceId = 'mainApp.register.RegisterService';
        RegisterService.$inject = [
            '$q',
            'mainApp.core.restApi.restApiService'
        ];
        register.RegisterService = RegisterService;
        angular
            .module('mainApp.register', [])
            .service(RegisterService.serviceId, RegisterService);
    })(register = app.register || (app.register = {}));
})(app || (app = {}));
//# sourceMappingURL=register.service.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var student;
        (function (student) {
            var Student = (function () {
                function Student(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Student Model instanced');
                    this.id = obj.id || '';
                    this.school = obj.school || '';
                    this.occupation = obj.occupation || '';
                    this.fluent_in = obj.fluent_in || '';
                    this.learning = obj.learning || '';
                    this.interests = obj.interests || '';
                }
                Object.defineProperty(Student.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Student.prototype, "School", {
                    get: function () {
                        return this.school;
                    },
                    set: function (school) {
                        if (school === undefined) {
                            throw 'Please supply school';
                        }
                        this.school = school;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Student.prototype, "Occupation", {
                    get: function () {
                        return this.occupation;
                    },
                    set: function (occupation) {
                        if (occupation === undefined) {
                            throw 'Please supply occupation';
                        }
                        this.occupation = occupation;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Student.prototype, "Fluent_in", {
                    get: function () {
                        return this.fluent_in;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addFluentIn = function (language) {
                    if (language === undefined) {
                        throw 'Please supply fluent in language element (Add)';
                    }
                    this.fluent_in.push(language);
                };
                Student.prototype.editFluentIn = function (language) {
                    if (language === undefined) {
                        throw 'Please supply fluent in language element (Edit)';
                    }
                    this.fluent_in.forEach(function (element, index, array) {
                        if (language === element) {
                            array[index] = language;
                        }
                    });
                };
                Object.defineProperty(Student.prototype, "Learning", {
                    get: function () {
                        return this.learning;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addLearning = function (language) {
                    if (language === undefined) {
                        throw 'Please supply learning language element (Add)';
                    }
                    this.fluent_in.push(language);
                };
                Student.prototype.editLearning = function (language) {
                    if (language === undefined) {
                        throw 'Please supply learning language element (Edit)';
                    }
                    this.learning.forEach(function (element, index, array) {
                        if (language === element) {
                            array[index] = language;
                        }
                    });
                };
                Object.defineProperty(Student.prototype, "Interests", {
                    get: function () {
                        return this.interests;
                    },
                    enumerable: true,
                    configurable: true
                });
                Student.prototype.addInterest = function (interest) {
                    if (interest === undefined) {
                        throw 'Please supply interest element (Add)';
                    }
                    this.interests.push(interest);
                };
                Student.prototype.editInterest = function (interest) {
                    if (interest === undefined) {
                        throw 'Please supply interest element (Edit)';
                    }
                    this.interests.forEach(function (element, index, array) {
                        if (interest === element) {
                            array[index] = interest;
                        }
                    });
                };
                return Student;
            }());
            student.Student = Student;
        })(student = models.student || (models.student = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=student.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var student;
        (function (student) {
            'use strict';
            var StudentService = (function () {
                function StudentService(restApi) {
                    this.restApi = restApi;
                    console.log('student service instanced');
                }
                StudentService.prototype.getStudentById = function (id) {
                    var url = 'students';
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                StudentService.prototype.getAllStudents = function () {
                    var url = 'students';
                    return this.restApi.query({ url: url }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                StudentService.prototype.getRatingByEarlyid = function (id) {
                    var url = 'ratings';
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return StudentService;
            }());
            StudentService.serviceId = 'mainApp.models.student.StudentService';
            StudentService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            student.StudentService = StudentService;
            angular
                .module('mainApp.models.student', [])
                .service(StudentService.serviceId, StudentService);
        })(student = models.student || (models.student = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=student.service.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var teacher;
        (function (teacher) {
            var Teacher = (function () {
                function Teacher(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Teacher Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id || '';
                    this.profileId = obj.profileId || '';
                    this.location = new app.models.user.Location(obj.location);
                    this.languages = new Language(obj.languages);
                    this.type = obj.type || '';
                    this.teacherSince = obj.teacherSince || '';
                    this.methodology = obj.methodology || '';
                    this.immersion = new Immersion(obj.immersion);
                    this.price = new Price(obj.price);
                    if (obj != {}) {
                        this.experiences = [];
                        for (var key in obj.experiences) {
                            var experienceInstance = new Experience(obj.experiences[key]);
                            this.addExperience(experienceInstance);
                        }
                        this.educations = [];
                        for (var key in obj.educations) {
                            var educationInstance = new Education(obj.educations[key]);
                            this.addEducation(educationInstance);
                        }
                        this.certificates = [];
                        for (var key in obj.certificates) {
                            var certificateInstance = new Certificate(obj.certificates[key]);
                            this.addCertificate(certificateInstance);
                        }
                        this.ratings = [];
                        for (var key in obj.ratings) {
                            var ratingInstance = new Rating(obj.ratings[key]);
                            this.addRating(ratingInstance);
                        }
                    }
                    else {
                        this.experiences = [];
                        this.educations = [];
                        this.certificates = [];
                        this.ratings = [];
                    }
                }
                Object.defineProperty(Teacher.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id of teacher';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "ProfileId", {
                    get: function () {
                        return this.profileId;
                    },
                    set: function (profileId) {
                        if (profileId === undefined) {
                            throw 'Please supply user profile id';
                        }
                        this.profileId = profileId;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Location", {
                    get: function () {
                        return this.location;
                    },
                    set: function (location) {
                        if (location === undefined) {
                            throw 'Please supply profile location';
                        }
                        this.location = location;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Languages", {
                    get: function () {
                        return this.languages;
                    },
                    set: function (languages) {
                        if (languages === undefined) {
                            throw 'Please supply languages';
                        }
                        this.languages = languages;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Type", {
                    get: function () {
                        return this.type;
                    },
                    set: function (type) {
                        if (type === undefined) {
                            throw 'Please supply type of teacher';
                        }
                        this.type = type;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "TeacherSince", {
                    get: function () {
                        return this.teacherSince;
                    },
                    set: function (teacherSince) {
                        if (teacherSince === undefined) {
                            throw 'Please supply teacher since';
                        }
                        this.teacherSince = teacherSince;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Experiences", {
                    get: function () {
                        return this.experiences;
                    },
                    enumerable: true,
                    configurable: true
                });
                Teacher.prototype.addExperience = function (experience) {
                    if (experience === undefined) {
                        throw 'Please supply experience value (Add)';
                    }
                    this.experiences.push(experience);
                };
                Teacher.prototype.editExperience = function (experience) {
                    if (experience === undefined) {
                        throw 'Please supply experience value (Edit)';
                    }
                    this.experiences.forEach(function (element, index, array) {
                        if (experience.Id === element.Id) {
                            array[index] = experience;
                        }
                    });
                };
                Object.defineProperty(Teacher.prototype, "Educations", {
                    get: function () {
                        return this.educations;
                    },
                    enumerable: true,
                    configurable: true
                });
                Teacher.prototype.addEducation = function (education) {
                    if (education === undefined) {
                        throw 'Please supply education value (Add)';
                    }
                    this.educations.push(education);
                };
                Teacher.prototype.editEducation = function (education) {
                    if (education === undefined) {
                        throw 'Please supply education value (Edit)';
                    }
                    this.educations.forEach(function (element, index, array) {
                        if (education.Id === element.Id) {
                            array[index] = education;
                        }
                    });
                };
                Object.defineProperty(Teacher.prototype, "Certificates", {
                    get: function () {
                        return this.certificates;
                    },
                    enumerable: true,
                    configurable: true
                });
                Teacher.prototype.addCertificate = function (certificate) {
                    if (certificate === undefined) {
                        throw 'Please supply certificate value (Add)';
                    }
                    this.certificates.push(certificate);
                };
                Teacher.prototype.editCertificate = function (certificate) {
                    if (certificate === undefined) {
                        throw 'Please supply certificate value (Edit)';
                    }
                    this.certificates.forEach(function (element, index, array) {
                        if (certificate.Id === element.Id) {
                            array[index] = certificate;
                        }
                    });
                };
                Object.defineProperty(Teacher.prototype, "Methodology", {
                    get: function () {
                        return this.methodology;
                    },
                    set: function (methodology) {
                        if (methodology === undefined) {
                            throw 'Please supply methodology';
                        }
                        this.methodology = methodology;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Immersion", {
                    get: function () {
                        return this.immersion;
                    },
                    set: function (immersion) {
                        if (immersion === undefined) {
                            throw 'Please supply immersion';
                        }
                        this.immersion = immersion;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Price", {
                    get: function () {
                        return this.price;
                    },
                    set: function (price) {
                        if (price === undefined) {
                            throw 'Please supply price';
                        }
                        this.price = price;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Teacher.prototype, "Ratings", {
                    get: function () {
                        return this.ratings;
                    },
                    enumerable: true,
                    configurable: true
                });
                Teacher.prototype.addRating = function (rating) {
                    if (rating === undefined) {
                        throw 'Please supply rating value (Add)';
                    }
                    this.ratings.push(rating);
                };
                Teacher.prototype.editRating = function (rating) {
                    if (rating === undefined) {
                        throw 'Please supply rating value (Edit)';
                    }
                    this.ratings.forEach(function (element, index, array) {
                        if (rating.Id === element.Id) {
                            array[index] = rating;
                        }
                    });
                };
                Object.defineProperty(Teacher.prototype, "Recommended", {
                    get: function () {
                        return this.recommended;
                    },
                    set: function (recommended) {
                        if (recommended === undefined) {
                            throw 'Please supply recommended early id';
                        }
                        this.recommended = recommended;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Teacher;
            }());
            teacher.Teacher = Teacher;
            var Language = (function () {
                function Language(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Languages Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.native = obj.native || [];
                    this.learn = obj.learn || [];
                    this.teach = obj.teach || [];
                }
                Object.defineProperty(Language.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Language.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply language uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Language.prototype, "Native", {
                    get: function () {
                        return this.native;
                    },
                    set: function (native) {
                        if (native === undefined) {
                            throw 'Please supply native languages';
                        }
                        this.native = native;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Language.prototype, "Learn", {
                    get: function () {
                        return this.learn;
                    },
                    set: function (learn) {
                        if (learn === undefined) {
                            throw 'Please supply learn languages';
                        }
                        this.learn = learn;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Language.prototype, "Teach", {
                    get: function () {
                        return this.teach;
                    },
                    set: function (teach) {
                        if (teach === undefined) {
                            throw 'Please supply teach languages';
                        }
                        this.teach = teach;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Language;
            }());
            teacher.Language = Language;
            var Experience = (function () {
                function Experience(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Experience Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.position = obj.position || '';
                    this.company = obj.company || '';
                    this.country = obj.country || '';
                    this.city = obj.city || '';
                    this.dateStart = obj.dateStart || '';
                    this.dateFinish = obj.dateFinish || '';
                    this.description = obj.description || '';
                }
                Object.defineProperty(Experience.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply experience uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "Position", {
                    get: function () {
                        return this.position;
                    },
                    set: function (position) {
                        if (position === undefined) {
                            throw 'Please supply position on company';
                        }
                        this.position = position;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "Company", {
                    get: function () {
                        return this.company;
                    },
                    set: function (company) {
                        if (company === undefined) {
                            throw 'Please supply company experience';
                        }
                        this.company = company;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "Country", {
                    get: function () {
                        return this.country;
                    },
                    set: function (country) {
                        if (country === undefined) {
                            throw 'Please supply country experience';
                        }
                        this.country = country;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "City", {
                    get: function () {
                        return this.city;
                    },
                    set: function (city) {
                        if (city === undefined) {
                            throw 'Please supply city experience';
                        }
                        this.city = city;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "DateStart", {
                    get: function () {
                        return this.dateStart;
                    },
                    set: function (dateStart) {
                        if (dateStart === undefined) {
                            throw 'Please supply dateStart experience';
                        }
                        this.dateStart = dateStart;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "DateFinish", {
                    get: function () {
                        return this.dateFinish;
                    },
                    set: function (dateFinish) {
                        if (dateFinish === undefined) {
                            throw 'Please supply dateFinish experience';
                        }
                        this.dateFinish = dateFinish;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Experience.prototype, "Description", {
                    get: function () {
                        return this.description;
                    },
                    set: function (description) {
                        if (description === undefined) {
                            throw 'Please supply description experience';
                        }
                        this.description = description;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Experience;
            }());
            teacher.Experience = Experience;
            var Education = (function () {
                function Education(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Education Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.school = obj.school || '';
                    this.degree = obj.degree || '';
                    this.fieldStudy = obj.fieldStudy || '';
                    this.dateStart = obj.dateStart || '';
                    this.dateFinish = obj.dateFinish || '';
                    this.description = obj.description || '';
                }
                Object.defineProperty(Education.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply position uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "School", {
                    get: function () {
                        return this.school;
                    },
                    set: function (school) {
                        if (school === undefined) {
                            throw 'Please supply school value (teacher education)';
                        }
                        this.school = school;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "Degree", {
                    get: function () {
                        return this.degree;
                    },
                    set: function (degree) {
                        if (degree === undefined) {
                            throw 'Please supply degree value (teacher education)';
                        }
                        this.degree = degree;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "FieldStudy", {
                    get: function () {
                        return this.fieldStudy;
                    },
                    set: function (fieldStudy) {
                        if (fieldStudy === undefined) {
                            throw 'Please supply field of study value (teacher education)';
                        }
                        this.fieldStudy = fieldStudy;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "DateStart", {
                    get: function () {
                        return this.dateStart;
                    },
                    set: function (dateStart) {
                        if (dateStart === undefined) {
                            throw 'Please supply dateStart experience';
                        }
                        this.dateStart = dateStart;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "DateFinish", {
                    get: function () {
                        return this.dateFinish;
                    },
                    set: function (dateFinish) {
                        if (dateFinish === undefined) {
                            throw 'Please supply dateFinish experience';
                        }
                        this.dateFinish = dateFinish;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Education.prototype, "Description", {
                    get: function () {
                        return this.description;
                    },
                    set: function (description) {
                        if (description === undefined) {
                            throw 'Please supply description experience';
                        }
                        this.description = description;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Education;
            }());
            teacher.Education = Education;
            var Certificate = (function () {
                function Certificate(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Certificate Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.name = obj.name || '';
                    this.institution = obj.institution || '';
                    this.dateReceived = obj.dateReceived || '';
                    this.description = obj.description || '';
                }
                Object.defineProperty(Certificate.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Certificate.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply position uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Certificate.prototype, "Name", {
                    get: function () {
                        return this.name;
                    },
                    set: function (name) {
                        if (name === undefined) {
                            throw 'Please supply name of certificate';
                        }
                        this.name = name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Certificate.prototype, "Institution", {
                    get: function () {
                        return this.institution;
                    },
                    set: function (institution) {
                        if (institution === undefined) {
                            throw 'Please supply institution of certificate';
                        }
                        this.institution = institution;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Certificate.prototype, "DateReceived", {
                    get: function () {
                        return this.dateReceived;
                    },
                    set: function (dateReceived) {
                        if (dateReceived === undefined) {
                            throw 'Please supply dateReceived of certificate';
                        }
                        this.dateReceived = dateReceived;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Certificate.prototype, "Description", {
                    get: function () {
                        return this.description;
                    },
                    set: function (description) {
                        if (description === undefined) {
                            throw 'Please supply description of certificate';
                        }
                        this.description = description;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Certificate;
            }());
            teacher.Certificate = Certificate;
            var Immersion = (function () {
                function Immersion(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Certificate Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.active = obj.active || false;
                    this.otherCategory = obj.otherCategory || '';
                    this.category = obj.category || [];
                }
                Object.defineProperty(Immersion.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Immersion.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply experience uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Immersion.prototype, "Active", {
                    get: function () {
                        return this.active;
                    },
                    set: function (active) {
                        if (active === undefined) {
                            throw 'Please supply active value of immersion';
                        }
                        this.active = active;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Immersion.prototype, "Category", {
                    get: function () {
                        return this.category;
                    },
                    set: function (category) {
                        if (category === undefined) {
                            throw 'Please supply category of immersion';
                        }
                        this.category = category;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Immersion.prototype, "OtherCategory", {
                    get: function () {
                        return this.otherCategory;
                    },
                    set: function (otherCategory) {
                        if (otherCategory === undefined) {
                            throw 'Please supply other immersion category';
                        }
                        this.otherCategory = otherCategory;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Immersion;
            }());
            teacher.Immersion = Immersion;
            var TypeOfImmersion = (function () {
                function TypeOfImmersion(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('TypeOfImmersion Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.category = obj.category || '';
                }
                Object.defineProperty(TypeOfImmersion.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply type of immersion id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypeOfImmersion.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply type of immersion uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypeOfImmersion.prototype, "Category", {
                    get: function () {
                        return this.category;
                    },
                    set: function (category) {
                        if (category === undefined) {
                            throw 'Please supply category of immersion';
                        }
                        this.category = category;
                    },
                    enumerable: true,
                    configurable: true
                });
                return TypeOfImmersion;
            }());
            teacher.TypeOfImmersion = TypeOfImmersion;
            var Price = (function () {
                function Price(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Price of Teacher Class Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.privateClass = new TypeOfPrice(obj.privateClass);
                    this.groupClass = new TypeOfPrice(obj.groupClass);
                }
                Object.defineProperty(Price.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Price.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply experience uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Price.prototype, "PrivateClass", {
                    get: function () {
                        return this.privateClass;
                    },
                    set: function (privateClass) {
                        if (privateClass === undefined) {
                            throw 'Please supply privateClass';
                        }
                        this.privateClass = privateClass;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Price.prototype, "GroupClass", {
                    get: function () {
                        return this.groupClass;
                    },
                    set: function (groupClass) {
                        if (groupClass === undefined) {
                            throw 'Please supply groupClass';
                        }
                        this.groupClass = groupClass;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Price;
            }());
            teacher.Price = Price;
            var TypeOfPrice = (function () {
                function TypeOfPrice(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('TypeOfPrice Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.active = obj.active || false;
                    this.hourPrice = obj.hourPrice || 0;
                }
                Object.defineProperty(TypeOfPrice.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply experience id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypeOfPrice.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply experience uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypeOfPrice.prototype, "Active", {
                    get: function () {
                        return this.active;
                    },
                    set: function (active) {
                        if (active === undefined) {
                            throw 'Please supply active value of price';
                        }
                        this.active = active;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TypeOfPrice.prototype, "HourPrice", {
                    get: function () {
                        return this.hourPrice;
                    },
                    set: function (hourPrice) {
                        if (hourPrice === undefined) {
                            throw 'Please supply hour price value';
                        }
                        this.hourPrice = hourPrice;
                    },
                    enumerable: true,
                    configurable: true
                });
                return TypeOfPrice;
            }());
            teacher.TypeOfPrice = TypeOfPrice;
            var Rating = (function () {
                function Rating(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Rating Model instanced');
                    if (obj === null)
                        obj = {};
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.author = new app.models.student.Student(obj.author);
                    this.methodologyValue = obj.methodologyValue || 0;
                    this.teachingValue = obj.teachingValue || 0;
                    this.communicationValue = obj.communicationValue || 0;
                    this.review = obj.review || '';
                    this.createdAt = obj.createdAt || '';
                }
                Object.defineProperty(Rating.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    set: function (id) {
                        if (id === undefined) {
                            throw 'Please supply rating id';
                        }
                        this.id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply rating uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "Author", {
                    get: function () {
                        return this.author;
                    },
                    set: function (author) {
                        if (author === undefined) {
                            throw 'Please supply author';
                        }
                        this.author = author;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "MethodologyValue", {
                    get: function () {
                        return this.methodologyValue;
                    },
                    set: function (methodologyValue) {
                        if (methodologyValue === undefined) {
                            throw 'Please supply methodology value';
                        }
                        this.methodologyValue = methodologyValue;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "TeachingValue", {
                    get: function () {
                        return this.teachingValue;
                    },
                    set: function (teachingValue) {
                        if (teachingValue === undefined) {
                            throw 'Please supply teaching value';
                        }
                        this.teachingValue = teachingValue;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "CommunicationValue", {
                    get: function () {
                        return this.communicationValue;
                    },
                    set: function (communicationValue) {
                        if (communicationValue === undefined) {
                            throw 'Please supply communication value';
                        }
                        this.communicationValue = communicationValue;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "Review", {
                    get: function () {
                        return this.review;
                    },
                    set: function (review) {
                        if (review === undefined) {
                            throw 'Please supply review value';
                        }
                        this.review = review;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rating.prototype, "CreatedAt", {
                    get: function () {
                        return this.createdAt;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Rating;
            }());
            teacher.Rating = Rating;
        })(teacher = models.teacher || (models.teacher = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=teacher.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var teacher;
        (function (teacher_1) {
            'use strict';
            var TeacherService = (function () {
                function TeacherService(restApi, $q) {
                    this.restApi = restApi;
                    this.$q = $q;
                    console.log('teacher service instanced');
                    this.TEACHER_URI = 'teachers';
                    this.PROFILE_TEACHER_URI = 'teachers?profileId=';
                    this.STATUS_TEACHER_URI = 'teachers?status=';
                    this.EXPERIENCES_URI = 'experiences';
                    this.EDUCATIONS_URI = 'educations';
                    this.CERTIFICATES_URI = 'certificates';
                }
                TeacherService.prototype.getTeacherById = function (id) {
                    var url = this.TEACHER_URI;
                    var deferred = this.$q.defer();
                    this.restApi.show({ url: url, id: id }).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.getTeacherByProfileId = function (profileId) {
                    var url = this.PROFILE_TEACHER_URI + profileId;
                    var deferred = this.$q.defer();
                    this.restApi.queryObject({ url: url }).$promise
                        .then(function (response) {
                        if (response.results) {
                            var res = response.results[0] ? response.results[0] : '';
                            deferred.resolve(res);
                        }
                        else {
                            DEBUG && console.error(response);
                            deferred.reject(response);
                        }
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.getAllTeachersByStatus = function (status) {
                    var url = this.STATUS_TEACHER_URI + status;
                    var deferred = this.$q.defer();
                    this.restApi.queryObject({ url: url }).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.getAllTeachers = function () {
                    var url = this.TEACHER_URI;
                    var deferred = this.$q.defer();
                    this.restApi.queryObject({ url: url }).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.createTeacher = function (teacher) {
                    var url = this.TEACHER_URI;
                    var deferred = this.$q.defer();
                    this.restApi.create({ url: url }, teacher).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.updateTeacher = function (teacher) {
                    var url = this.TEACHER_URI;
                    var deferred = this.$q.defer();
                    this.restApi.update({ url: url, id: teacher.Id }, teacher).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.createExperience = function (teacherId, experience) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.EXPERIENCES_URI;
                    var deferred = this.$q.defer();
                    this.restApi.create({ url: url }, experience).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.log(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.updateExperience = function (teacherId, experience) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.EXPERIENCES_URI;
                    var deferred = this.$q.defer();
                    this.restApi.update({ url: url, id: experience.Id }, experience).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.createEducation = function (teacherId, education) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.EDUCATIONS_URI;
                    var deferred = this.$q.defer();
                    this.restApi.create({ url: url }, education).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.updateEducation = function (teacherId, education) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.EDUCATIONS_URI;
                    var deferred = this.$q.defer();
                    this.restApi.update({ url: url, id: education.Id }, education).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.createCertificate = function (teacherId, certificate) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.CERTIFICATES_URI;
                    var deferred = this.$q.defer();
                    this.restApi.create({ url: url }, certificate).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                TeacherService.prototype.updateCertificate = function (teacherId, certificate) {
                    var url = this.TEACHER_URI + '/' + teacherId + '/' + this.CERTIFICATES_URI;
                    var deferred = this.$q.defer();
                    this.restApi.update({ url: url, id: certificate.Id }, certificate).$promise
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        DEBUG && console.error(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                return TeacherService;
            }());
            TeacherService.serviceId = 'mainApp.models.teacher.TeacherService';
            TeacherService.$inject = [
                'mainApp.core.restApi.restApiService',
                '$q'
            ];
            teacher_1.TeacherService = TeacherService;
            angular
                .module('mainApp.models.teacher', [])
                .service(TeacherService.serviceId, TeacherService);
        })(teacher = models.teacher || (models.teacher = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=teacher.service.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var school;
        (function (school) {
            var School = (function () {
                function School(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('School Model instanced');
                }
                return School;
            }());
            school.School = School;
        })(school = models.school || (models.school = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=school.model.js.map
var app;
(function (app) {
    var models;
    (function (models) {
        var school;
        (function (school) {
            'use strict';
            var SchoolService = (function () {
                function SchoolService(restApi) {
                    this.restApi = restApi;
                    console.log('school service instanced');
                }
                SchoolService.prototype.getSchoolById = function (id) {
                    var url = 'schools/';
                    return this.restApi.show({ url: url, id: id }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                SchoolService.prototype.getAllSchools = function () {
                    var url = 'schools/';
                    return this.restApi.query({ url: url }).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return SchoolService;
            }());
            SchoolService.serviceId = 'mainApp.models.school.SchoolService';
            SchoolService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            school.SchoolService = SchoolService;
            angular
                .module('mainApp.models.school', [])
                .service(SchoolService.serviceId, SchoolService);
        })(school = models.school || (models.school = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=school.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.header', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=header.config.js.map
var components;
(function (components) {
    var header;
    (function (header) {
        'use strict';
        var MaHeader = (function () {
            function MaHeader() {
                this.bindToController = true;
                this.controller = HeaderController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.scope = true;
                this.templateUrl = 'components/header/header.html';
                console.log('maHeader directive constructor');
            }
            MaHeader.prototype.link = function ($scope, elm, attr) {
                console.log('maHeader link function');
            };
            MaHeader.instance = function () {
                return new MaHeader();
            };
            return MaHeader;
        }());
        MaHeader.directiveId = 'maHeader';
        angular
            .module('mainApp.components.header')
            .directive(MaHeader.directiveId, MaHeader.instance);
        var HeaderController = (function () {
            function HeaderController(functionsUtil, AuthService, $uibModal, dataConfig, $filter, $scope, $rootScope, $state, localStorage) {
                this.functionsUtil = functionsUtil;
                this.AuthService = AuthService;
                this.$uibModal = $uibModal;
                this.dataConfig = dataConfig;
                this.$filter = $filter;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.localStorage = localStorage;
                this.init();
            }
            HeaderController.prototype.init = function () {
                this.isAuthenticated = this.AuthService.isAuthenticated();
                this.form = {
                    language: this.functionsUtil.getCurrentLanguage() || 'en',
                    whereTo: this.$filter('translate')('%header.search.placeholder.text')
                };
                this._slideout = false;
                this.activate();
            };
            HeaderController.prototype.activate = function () {
                console.log('header controller actived');
                this._subscribeToEvents();
            };
            HeaderController.prototype.slideNavMenu = function () {
                this._slideout = !this._slideout;
            };
            HeaderController.prototype.logout = function () {
                var self = this;
                this.AuthService.logout().then(function (response) {
                    window.location.reload();
                }, function (response) {
                    DEBUG && console.log('A problem occured while logging you out.');
                });
            };
            HeaderController.prototype.changeLanguage = function () {
                this.functionsUtil.changeLanguage(this.form.language);
                mixpanel.track("Change Language on header");
            };
            HeaderController.prototype.search = function (country) {
                var currentState = this.$state.current.name;
                this.form.whereTo = country;
                if (currentState !== 'page.searchPage') {
                    this.$state.go('page.searchPage', { country: country });
                }
                else {
                    this.$rootScope.$broadcast('SearchCountry', country);
                }
            };
            HeaderController.prototype._openSignUpModal = function () {
                var self = this;
                var options = {
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'sm',
                    templateUrl: this.dataConfig.modalSignUpTmpl,
                    controller: 'mainApp.components.modal.ModalSignUpController as vm',
                    resolve: {
                        dataSetModal: function () {
                            return {
                                hasNextStep: false
                            };
                        }
                    }
                };
                var modalInstance = this.$uibModal.open(options);
                mixpanel.track("Click on 'Sign Up' from header");
            };
            HeaderController.prototype._openLogInModal = function () {
                mixpanel.track("Click on 'Log In' from header");
                var self = this;
                var options = {
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'sm',
                    templateUrl: this.dataConfig.modalLogInTmpl,
                    controller: 'mainApp.components.modal.ModalLogInController as vm',
                    resolve: {
                        dataSetModal: function () {
                            return {
                                hasNextStep: false
                            };
                        }
                    }
                };
                var modalInstance = this.$uibModal.open(options);
                modalInstance.result.then(function () {
                    self.$rootScope.$broadcast('Is Authenticated');
                }, function () {
                    DEBUG && console.info('Modal dismissed at: ' + new Date());
                });
            };
            HeaderController.prototype._subscribeToEvents = function () {
                var self = this;
                this.$scope.$on('Is Authenticated', function (event, args) {
                    self.isAuthenticated = self.AuthService.isAuthenticated();
                });
            };
            return HeaderController;
        }());
        HeaderController.controllerId = 'mainApp.components.header.HeaderController';
        HeaderController.$inject = [
            'mainApp.core.util.FunctionsUtilService',
            'mainApp.auth.AuthService',
            '$uibModal',
            'dataConfig',
            '$filter',
            '$scope',
            '$rootScope',
            '$state',
            'mainApp.localStorageService'
        ];
        header.HeaderController = HeaderController;
        angular.module('mainApp.components.header')
            .controller(HeaderController.controllerId, HeaderController);
    })(header = components.header || (components.header = {}));
})(components || (components = {}));
//# sourceMappingURL=header.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.rating', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=rating.config.js.map
var components;
(function (components) {
    var rating;
    (function (rating) {
        'use strict';
        var MaRating = (function () {
            function MaRating() {
                this.bindToController = true;
                this.controller = RatingController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.scope = {
                    ratingValue: '=',
                    size: '@'
                };
                this.templateUrl = 'components/rating/rating.html';
                console.log('maRating directive constructor');
            }
            MaRating.prototype.link = function ($scope, elm, attr) {
                console.log('maRating link function');
            };
            MaRating.instance = function () {
                return new MaRating();
            };
            return MaRating;
        }());
        MaRating.directiveId = 'maRating';
        angular
            .module('mainApp.components.rating')
            .directive(MaRating.directiveId, MaRating.instance);
        var RatingController = (function () {
            function RatingController() {
                this.init();
            }
            RatingController.prototype.init = function () {
                this._ratingList = [];
                this.activate();
            };
            RatingController.prototype.activate = function () {
                console.log('rating controller actived');
                this._calcuteStars();
            };
            RatingController.prototype._calcuteStars = function () {
                var value = this.ratingValue;
                var halfValue = value / 2;
                for (var i = 0; i < 5; i++) {
                    if (halfValue >= 1) {
                        this._ratingList.push('star');
                    }
                    else if (halfValue == 0.5) {
                        this._ratingList.push('star_half');
                    }
                    else if (halfValue <= 0) {
                        this._ratingList.push('star_border');
                    }
                    halfValue = halfValue - 1;
                }
            };
            RatingController.prototype._assignClass = function () {
                return 'ma-stars__icon--' + this.size;
            };
            return RatingController;
        }());
        RatingController.controllerId = 'mainApp.components.rating.RatingController';
        rating.RatingController = RatingController;
        angular.module('mainApp.components.rating')
            .controller(RatingController.controllerId, RatingController);
    })(rating = components.rating || (components.rating = {}));
})(components || (components = {}));
//# sourceMappingURL=rating.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.footer', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=footer.config.js.map
var components;
(function (components) {
    var footer;
    (function (footer) {
        'use strict';
        var MaFooter = (function () {
            function MaFooter() {
                this.bindToController = true;
                this.controller = FooterController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.templateUrl = 'components/footer/footer.html';
                console.log('maFooter directive constructor');
            }
            MaFooter.prototype.link = function ($scope, elm, attr) {
                console.log('maFooter link function');
            };
            MaFooter.instance = function () {
                return new MaFooter();
            };
            return MaFooter;
        }());
        MaFooter.directiveId = 'maFooter';
        angular
            .module('mainApp.components.footer')
            .directive(MaFooter.directiveId, MaFooter.instance);
        var FooterController = (function () {
            function FooterController() {
                this.init();
            }
            FooterController.prototype.init = function () {
                this.activate();
            };
            FooterController.prototype.activate = function () {
                console.log('footer controller actived');
            };
            return FooterController;
        }());
        FooterController.controllerId = 'mainApp.components.footer.FooterController';
        footer.FooterController = FooterController;
        angular.module('mainApp.components.footer')
            .controller(FooterController.controllerId, FooterController);
    })(footer = components.footer || (components.footer = {}));
})(components || (components = {}));
//# sourceMappingURL=footer.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.floatMessageBar', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=floatMessageBar.config.js.map
var components;
(function (components) {
    var floatMessageBar;
    (function (floatMessageBar) {
        'use strict';
        var MaFloatMessageBar = (function () {
            function MaFloatMessageBar() {
                this.bindToController = true;
                this.controller = FloatMessageBarController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.scope = true;
                this.templateUrl = 'components/floatMessageBar/floatMessageBar.html';
                console.log('maFloatMessageBar directive constructor');
            }
            MaFloatMessageBar.prototype.link = function ($scope, elm, attr) {
                console.log('maFloatMessageBar link function');
            };
            MaFloatMessageBar.instance = function () {
                return new MaFloatMessageBar();
            };
            return MaFloatMessageBar;
        }());
        MaFloatMessageBar.directiveId = 'maFloatMessageBar';
        angular
            .module('mainApp.components.floatMessageBar')
            .directive(MaFloatMessageBar.directiveId, MaFloatMessageBar.instance);
        var FloatMessageBarController = (function () {
            function FloatMessageBarController(dataConfig, $filter, $scope, $rootScope, $state) {
                this.dataConfig = dataConfig;
                this.$filter = $filter;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.init();
            }
            FloatMessageBarController.prototype.init = function () {
                this.activate();
            };
            FloatMessageBarController.prototype.activate = function () {
                console.log('floatMessageBar controller actived');
            };
            FloatMessageBarController.prototype._join = function () {
                var CREATE_TEACHER = 'page.createTeacherPage.start';
                mixpanel.track("Click on join as a teacher from floatMessageBar");
                this.$state.go(CREATE_TEACHER, { reload: true });
            };
            return FloatMessageBarController;
        }());
        FloatMessageBarController.controllerId = 'mainApp.components.floatMessageBar.FloatMessageBarController';
        FloatMessageBarController.$inject = [
            'dataConfig',
            '$filter',
            '$scope',
            '$rootScope',
            '$state'
        ];
        floatMessageBar.FloatMessageBarController = FloatMessageBarController;
        angular.module('mainApp.components.floatMessageBar')
            .controller(FloatMessageBarController.controllerId, FloatMessageBarController);
    })(floatMessageBar = components.floatMessageBar || (components.floatMessageBar = {}));
})(components || (components = {}));
//# sourceMappingURL=floatMessageBar.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.map', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=map.config.js.map
var components;
(function (components) {
    var map;
    (function (map) {
        'use strict';
        var MaMap = (function () {
            function MaMap() {
                this.bindToController = true;
                this.controller = MapController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.scope = {
                    mapConfig: '='
                };
                this.templateUrl = 'components/map/map.html';
                console.log('maMap directive constructor');
            }
            MaMap.prototype.link = function ($scope, elm, attr) {
                console.log('maMap link function');
            };
            MaMap.instance = function () {
                return new MaMap();
            };
            return MaMap;
        }());
        MaMap.directiveId = 'maMap';
        angular
            .module('mainApp.components.map')
            .directive(MaMap.directiveId, MaMap.instance);
        var MapController = (function () {
            function MapController($scope, $rootScope, $timeout) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.init();
            }
            MapController.prototype.init = function () {
                this.RED_PIN = 'assets/images/red-pin.png';
                this.POSITION_PIN = 'assets/images/red-pin.png';
                this.GREEN_PIN = 'assets/images/green-pin.png';
                var self = this;
                this._map;
                this._draggable = false;
                this.mapId = 'ma-map-' + Math.floor((Math.random() * 100) + 1);
                this._infoWindow = null;
                this._markers = [];
                this.$scope.options = null;
                switch (this.mapConfig.type) {
                    case 'search-map':
                        this._searchMapBuilder();
                        break;
                    case 'drag-maker-map':
                        this._dragMarkerMapBuilder();
                        break;
                    case 'location-circle-map':
                        this._locationCircleMapBuilder();
                        break;
                }
                this.activate();
            };
            MapController.prototype.activate = function () {
                console.log('map controller actived');
                this._subscribeToEvents();
            };
            MapController.prototype._searchMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 16;
                var center = this.mapConfig.data.position;
                this._draggable = false;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self.GREEN_PIN);
                        }
                    });
                }
            };
            MapController.prototype._dragMarkerMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 17;
                var center = this.mapConfig.data.position;
                this._draggable = true;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self.POSITION_PIN);
                        }
                    });
                }
            };
            MapController.prototype._locationCircleMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 16;
                var center = this.mapConfig.data.position;
                var circle_strokeColor = '#ff5a5f';
                var circle_strokeOpacity = 0.8;
                var circle_strokeWeight = 2;
                var circle_fillColor = '#ff5a5f';
                var circle_fillOpacity = 0.35;
                var circle_center = {
                    lat: 6.1739743,
                    lng: -75.5822414
                };
                var circle_radius = 140;
                this._draggable = false;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        var circle = new google.maps.Circle({
                            strokeColor: circle_strokeColor,
                            strokeOpacity: circle_strokeOpacity,
                            strokeWeight: circle_strokeWeight,
                            fillColor: circle_fillColor,
                            fillOpacity: circle_fillOpacity,
                            map: self._map,
                            center: new google.maps.LatLng(center.lat, center.lng),
                            radius: circle_radius
                        });
                    });
                }
            };
            MapController.prototype._setMarker = function (id, position, icon) {
                var self = this;
                var marker;
                var markerOptions = {
                    id: id,
                    position: position,
                    map: this._map,
                    icon: icon,
                    draggable: this._draggable
                };
                marker = new google.maps.Marker(markerOptions);
                this._markers.push(marker);
                if (this._map) {
                    this._map.setCenter(position);
                }
                if (this._draggable) {
                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        var position = {
                            lng: this.getPosition().lng(),
                            lat: this.getPosition().lat()
                        };
                        self.$scope.$emit('Position', position);
                    });
                }
                if (this.mapConfig.type === 'search-map') {
                    google.maps.event.addListener(marker, 'click', function (event) {
                        for (var i = 0; i < self._markers.length; i++) {
                            if (self._markers[i].id === marker.id) {
                                self._markers[i].setIcon(self.GREEN_PIN);
                            }
                            else {
                                self._markers[i].setIcon(self.RED_PIN);
                            }
                        }
                        self.$scope.$emit('SelectContainer', marker.id);
                    });
                }
            };
            MapController.prototype._removeMarkers = function () {
                for (var i = 0; i < this._markers.length; i++) {
                    this._markers[i].setMap(null);
                }
            };
            MapController.prototype._createFilterButtons = function () {
                var buttons = ['Students', 'Teachers', 'Schools'];
                for (var i = 0; i < buttons.length; i++) {
                    var controlDiv = document.createElement('div');
                    var control = this._filterControl(controlDiv, buttons[i]);
                    this._map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
                }
            };
            MapController.prototype._filterControl = function (controlDiv, type) {
                var self = this;
                var defaultBtn = 'Students';
                var className = 'filterBtnMap';
                var background_color = 'rgb(255, 255, 255)';
                var background_color_active = '#00B592';
                var border_radius = '3px';
                var box_shadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
                var cursor = 'pointer';
                var margin_top = '10px';
                var margin_bottom = '22px';
                var margin_right = '10px';
                var text_align = 'center';
                var title = 'Click to search' + type;
                var color = '#4E4E4E';
                var color_active = '#FFF';
                var font_family = 'Roboto,Arial,sans-serif';
                var font_size = '15px';
                var line_height = '10px';
                var padding_top = '10px';
                var padding_bottom = '10px';
                var padding_left = '20px';
                var padding_right = '20px';
                var border_bottom = '0 hidden transparent';
                var border_bottom_active = '2px solid #018a6f';
                var controlUI = document.createElement('div');
                controlUI.className = className;
                controlUI.style.borderRadius = border_radius;
                controlUI.style.boxShadow = box_shadow;
                controlUI.style.cursor = cursor;
                controlUI.style.marginTop = margin_top;
                controlUI.style.marginBottom = margin_bottom;
                controlUI.style.marginRight = margin_right;
                controlUI.style.textAlign = text_align;
                controlUI.title = title;
                if (type === defaultBtn) {
                    controlUI.style.backgroundColor = background_color_active;
                    controlUI.style.borderBottom = border_bottom_active;
                }
                else {
                    controlUI.style.backgroundColor = background_color;
                }
                controlDiv.appendChild(controlUI);
                var controlText = document.createElement('div');
                controlText.style.fontFamily = font_family;
                controlText.style.fontSize = font_size;
                controlText.style.lineHeight = line_height;
                controlText.style.paddingTop = padding_top;
                controlText.style.paddingBottom = padding_bottom;
                controlText.style.paddingLeft = padding_left;
                controlText.style.paddingRight = padding_right;
                controlText.innerHTML = type;
                if (type === defaultBtn) {
                    controlText.style.color = color_active;
                }
                else {
                    controlText.style.color = color;
                }
                controlUI.appendChild(controlText);
                controlUI.addEventListener('click', function (e) {
                    var element = this;
                    var child = this.children[0];
                    var filterBtn = document.getElementsByClassName(className);
                    for (var i = 0; i < filterBtn.length; i++) {
                        filterBtn[i].style.backgroundColor = background_color;
                        filterBtn[i].style.borderBottom = border_bottom;
                        filterBtn[i].children[0].style.color = color;
                    }
                    element.style.backgroundColor = background_color_active;
                    element.style.borderBottom = border_bottom_active;
                    child.style.color = color_active;
                    self.$scope.$emit(type);
                });
            };
            MapController.prototype._codeAddress = function (geocoder, country, address, city) {
                var self = this;
                var location = country + ',' + city + ',' + address;
                geocoder.geocode({
                    address: location
                }, function (results, status) {
                    if (status == 'OK') {
                        self._removeMarkers();
                        self._setMarker('1', results[0].geometry.location, self.RED_PIN);
                        var position = {
                            lng: results[0].geometry.location.lng(),
                            lat: results[0].geometry.location.lat()
                        };
                        self.$scope.$emit('Position', position);
                    }
                    else {
                        console.log(status);
                    }
                });
            };
            MapController.prototype._positionCountry = function (geocoder, country, address, city) {
                var self = this;
                var location = country + ',' + city + ',' + address;
                geocoder.geocode({
                    address: location
                }, function (results, status) {
                    if (status == 'OK') {
                        self._map.setCenter(results[0].geometry.location);
                        if (self.mapConfig.data.zoom) {
                            self._map.setZoom(self.mapConfig.data.zoom);
                        }
                    }
                    else {
                        console.log(status);
                    }
                });
            };
            MapController.prototype._subscribeToEvents = function () {
                var self = this;
                this.$scope.$on('BuildMarkers', function (event, args) {
                    self.mapConfig = args;
                    self._removeMarkers();
                    for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                        var marker = self.mapConfig.data.markers[i];
                        self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self.RED_PIN);
                    }
                });
                this.$scope.$on('ChangeMarker', function (event, args) {
                    var markerId = args.id;
                    var status = args.status;
                    for (var i = 0; i < self._markers.length; i++) {
                        if (self._markers[i].id === markerId) {
                            if (status === true) {
                                self._markers[i].setIcon(self.GREEN_PIN);
                            }
                            else {
                                self._markers[i].setIcon(self.RED_PIN);
                            }
                        }
                        else {
                            self._markers[i].setIcon(self.RED_PIN);
                        }
                    }
                });
                this.$scope.$on('CodeAddress', function (event, args) {
                    var geocoder = new google.maps.Geocoder();
                    self._codeAddress(geocoder, args.country, args.address, args.city);
                });
                this.$scope.$on('PositionCountry', function (event, args) {
                    var geocoder = new google.maps.Geocoder();
                    self._positionCountry(geocoder, args.country, args.address, args.city);
                });
            };
            return MapController;
        }());
        MapController.controllerId = 'mainApp.components.map.MapController';
        MapController.$inject = ['$scope', '$rootScope', '$timeout'];
        map.MapController = MapController;
        angular.module('mainApp.components.map')
            .controller(MapController.controllerId, MapController);
    })(map = components.map || (components.map = {}));
})(components || (components = {}));
//# sourceMappingURL=map.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.components.modal', [])
        .config(config);
    function config() { }
})();
//# sourceMappingURL=modal.config.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalMeetingPoint;
        (function (modalMeetingPoint) {
            var ModalMeetingPointController = (function () {
                function ModalMeetingPointController($uibModalInstance, dataSetModal) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this._init();
                }
                ModalMeetingPointController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.mapConfigModal = {
                        type: 'modal-assign-marker-map',
                        data: null
                    };
                    this.activate();
                };
                ModalMeetingPointController.prototype.activate = function () {
                    console.log('modalMeetingPoint controller actived');
                };
                ModalMeetingPointController.prototype.close = function () {
                    this.$uibModalInstance.close();
                    event.preventDefault();
                };
                return ModalMeetingPointController;
            }());
            ModalMeetingPointController.controllerId = 'mainApp.components.modal.ModalMeetingPointController';
            ModalMeetingPointController.$inject = [
                '$uibModalInstance',
                'dataSetModal'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalMeetingPointController.controllerId, ModalMeetingPointController);
        })(modalMeetingPoint = modal.modalMeetingPoint || (modal.modalMeetingPoint = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalMeetingPoint.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalLanguages;
        (function (modalLanguages) {
            var ModalLanguagesController = (function () {
                function ModalLanguagesController($uibModalInstance, dataSetModal, $timeout) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this.$timeout = $timeout;
                    this._init();
                }
                ModalLanguagesController.prototype._init = function () {
                    var self = this;
                    console.log('Title');
                    this.form = {
                        options: this.dataSetModal.list || []
                    };
                    this.$timeout(function () {
                        self._buildLanguagesChecked();
                    });
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                ModalLanguagesController.prototype.activate = function () {
                    console.log('modalLanguages controller actived');
                };
                ModalLanguagesController.prototype.addLanguages = function (key) {
                    var check = document.getElementById('language-' + key);
                    var checkClasses = check.classList;
                    var checked = check.getAttribute('data-checked');
                    var value = check.innerText;
                    if (checked == 'true') {
                        this._removeLanguage(key);
                        checkClasses.remove('ma-label--box--check--active');
                        check.setAttribute('data-checked', 'false');
                    }
                    else {
                        var option = {
                            key: key,
                            value: value
                        };
                        this.form.options.push(option);
                        checkClasses.add('ma-label--box--check--active');
                        check.setAttribute('data-checked', 'true');
                    }
                };
                ModalLanguagesController.prototype._removeLanguage = function (key) {
                    this.form.options = this.form.options.filter(function (el) {
                        return el.key !== key;
                    });
                };
                ModalLanguagesController.prototype._buildLanguagesChecked = function () {
                    if (this.form.options.length > 0) {
                        for (var i = 0; i < this.form.options.length; i++) {
                            var language = this.form.options[i];
                            var check = document.getElementById('language-' + language.key);
                            var checkClasses = check.classList;
                            checkClasses.add('ma-label--box--check--active');
                            check.setAttribute('data-checked', 'true');
                        }
                    }
                };
                ModalLanguagesController.prototype._save = function () {
                    this.$uibModalInstance.close(this.form.options);
                };
                ModalLanguagesController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalLanguagesController;
            }());
            ModalLanguagesController.controllerId = 'mainApp.components.modal.ModalLanguageController';
            ModalLanguagesController.$inject = [
                '$uibModalInstance',
                'dataSetModal',
                '$timeout'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalLanguagesController.controllerId, ModalLanguagesController);
        })(modalLanguages = modal.modalLanguages || (modal.modalLanguages = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalLanguages.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalExperience;
        (function (modalExperience) {
            var ModalExperienceController = (function () {
                function ModalExperienceController($uibModalInstance, dataSetModal, getDataFromJson, functionsUtilService, teacherService, $timeout, $filter) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.teacherService = teacherService;
                    this.$timeout = $timeout;
                    this.$filter = $filter;
                    this._init();
                }
                ModalExperienceController.prototype._init = function () {
                    var self = this;
                    this.experience = this.dataSetModal.experience || new app.models.teacher.Experience();
                    this.countryObject = { code: this.experience.Country || '', value: '' };
                    this.startYearObject = { value: this.experience.DateStart || '' };
                    this.finishYearObject = { value: this.experience.DateFinish || '' };
                    this.form = {
                        position: this.experience.Position || '',
                        company: this.experience.Company || '',
                        country: this.experience.Country || '',
                        city: this.experience.City || '',
                        dateStart: this.experience.DateStart || '',
                        dateFinish: this.experience.DateFinish || '',
                        description: this.experience.Description || ''
                    };
                    this.listStartYears = this.functionsUtilService.buildNumberSelectList(1957, 2017);
                    this.listFinishYears = this.functionsUtilService.buildNumberSelectList(1957, 2017);
                    this.listCountries = this.getDataFromJson.getCountryi18n();
                    this.validate = {
                        position: { valid: true, message: '' },
                        company: { valid: true, message: '' },
                        country: { valid: true, message: '' },
                        city: { valid: true, message: '' },
                        dateStart: { valid: true, message: '' },
                        dateFinish: { valid: true, message: '' },
                        description: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalExperienceController.prototype.activate = function () {
                    console.log('modalExperience controller actived');
                };
                ModalExperienceController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var position_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.position = this.functionsUtilService.validator(this.form.position, position_rules);
                    if (!this.validate.position.valid) {
                        formValid = this.validate.position.valid;
                    }
                    var company_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.company = this.functionsUtilService.validator(this.form.company, company_rules);
                    if (!this.validate.company.valid) {
                        formValid = this.validate.company.valid;
                    }
                    var country_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.country = this.functionsUtilService.validator(this.countryObject.code, country_rules);
                    if (!this.validate.country.valid) {
                        formValid = this.validate.country.valid;
                    }
                    var city_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.city = this.functionsUtilService.validator(this.form.city, city_rules);
                    if (!this.validate.city.valid) {
                        formValid = this.validate.city.valid;
                    }
                    var start_year_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.dateStart = this.functionsUtilService.validator(this.startYearObject.value, start_year_rules);
                    if (!this.validate.dateStart.valid) {
                        formValid = this.validate.dateStart.valid;
                    }
                    var finish_year_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.dateFinish = this.functionsUtilService.validator(this.finishYearObject.value, finish_year_rules);
                    if (!this.validate.dateFinish.valid) {
                        formValid = this.validate.dateFinish.valid;
                    }
                    return formValid;
                };
                ModalExperienceController.prototype.save = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        var self_1 = this;
                        var countryCode = this.countryObject.code;
                        var startYear = this.startYearObject.value;
                        var finishYear = this.finishYearObject.value;
                        this.form.country = countryCode;
                        this.form.dateStart = startYear;
                        this.form.dateFinish = finishYear;
                        this.experience.Position = this.form.position;
                        this.experience.Country = this.form.country;
                        this.experience.City = this.form.city;
                        this.experience.Company = this.form.company;
                        this.experience.DateStart = this.form.dateStart;
                        this.experience.DateFinish = this.form.dateFinish;
                        this.experience.Description = this.form.description;
                        if (this.experience.Id) {
                            this.teacherService.updateExperience(this.dataSetModal.teacherId, this.experience)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.$uibModalInstance.close();
                                }
                                else {
                                }
                            });
                        }
                        else {
                            this.teacherService.createExperience(this.dataSetModal.teacherId, this.experience)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.experience.Id = response.id;
                                    self_1.$uibModalInstance.close(self_1.experience);
                                }
                                else {
                                }
                            });
                        }
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                ModalExperienceController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalExperienceController;
            }());
            ModalExperienceController.controllerId = 'mainApp.components.modal.ModalExperienceController';
            ModalExperienceController.$inject = [
                '$uibModalInstance',
                'dataSetModal',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.models.teacher.TeacherService',
                '$timeout',
                '$filter'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalExperienceController.controllerId, ModalExperienceController);
        })(modalExperience = modal.modalExperience || (modal.modalExperience = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalExperience.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalEducation;
        (function (modalEducation) {
            var ModalEducationController = (function () {
                function ModalEducationController($uibModalInstance, dataSetModal, getDataFromJson, functionsUtilService, teacherService, $timeout, $filter) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.teacherService = teacherService;
                    this.$timeout = $timeout;
                    this.$filter = $filter;
                    this._init();
                }
                ModalEducationController.prototype._init = function () {
                    var self = this;
                    this.education = this.dataSetModal.education || new app.models.teacher.Education();
                    this.degreeObject = { code: this.education.Degree || '', value: '' };
                    this.startYearObject = { value: this.education.DateStart || '' };
                    this.finishYearObject = { value: this.education.DateFinish || '' };
                    this.form = {
                        school: this.education.School || '',
                        degree: this.education.Degree || '',
                        fieldStudy: this.education.FieldStudy || '',
                        dateStart: this.education.DateStart || '',
                        dateFinish: this.education.DateFinish || '',
                        description: this.education.Description || ''
                    };
                    this.listStartYears = this.functionsUtilService.buildNumberSelectList(1957, 2017);
                    this.listFinishYears = this.functionsUtilService.buildNumberSelectList(1957, 2017);
                    this.listDegrees = this.getDataFromJson.getDegreei18n();
                    this.validate = {
                        school: { valid: true, message: '' },
                        degree: { valid: true, message: '' },
                        fieldStudy: { valid: true, message: '' },
                        dateStart: { valid: true, message: '' },
                        dateFinish: { valid: true, message: '' },
                        description: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalEducationController.prototype.activate = function () {
                    console.log('modalEducation controller actived');
                };
                ModalEducationController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var school_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.school = this.functionsUtilService.validator(this.form.school, school_rules);
                    if (!this.validate.school.valid) {
                        formValid = this.validate.school.valid;
                    }
                    var degree_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.degree = this.functionsUtilService.validator(this.degreeObject.code, degree_rules);
                    if (!this.validate.degree.valid) {
                        formValid = this.validate.degree.valid;
                    }
                    var field_study_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.fieldStudy = this.functionsUtilService.validator(this.form.fieldStudy, field_study_rules);
                    if (!this.validate.fieldStudy.valid) {
                        formValid = this.validate.fieldStudy.valid;
                    }
                    var start_year_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.dateStart = this.functionsUtilService.validator(this.startYearObject.value, start_year_rules);
                    if (!this.validate.dateStart.valid) {
                        formValid = this.validate.dateStart.valid;
                    }
                    var finish_year_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.dateFinish = this.functionsUtilService.validator(this.finishYearObject.value, finish_year_rules);
                    if (!this.validate.dateFinish.valid) {
                        formValid = this.validate.dateFinish.valid;
                    }
                    return formValid;
                };
                ModalEducationController.prototype.save = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        var self_1 = this;
                        var degreeCode = this.degreeObject.code;
                        var startYear = this.startYearObject.value;
                        var finishYear = this.finishYearObject.value;
                        this.form.degree = degreeCode;
                        this.form.dateStart = startYear;
                        this.form.dateFinish = finishYear;
                        this.education.School = this.form.school;
                        this.education.Degree = this.form.degree;
                        this.education.FieldStudy = this.form.fieldStudy;
                        this.education.DateStart = this.form.dateStart;
                        this.education.DateFinish = this.form.dateFinish;
                        this.education.Description = this.form.description;
                        if (this.education.Id) {
                            this.teacherService.updateEducation(this.dataSetModal.teacherId, this.education)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.$uibModalInstance.close();
                                }
                                else {
                                }
                            });
                        }
                        else {
                            this.teacherService.createEducation(this.dataSetModal.teacherId, this.education)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.education.Id = response.id;
                                    self_1.$uibModalInstance.close(self_1.education);
                                }
                                else {
                                }
                            });
                        }
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                ModalEducationController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalEducationController;
            }());
            ModalEducationController.controllerId = 'mainApp.components.modal.ModalEducationController';
            ModalEducationController.$inject = [
                '$uibModalInstance',
                'dataSetModal',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.models.teacher.TeacherService',
                '$timeout',
                '$filter'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalEducationController.controllerId, ModalEducationController);
        })(modalEducation = modal.modalEducation || (modal.modalEducation = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalEducation.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalCertificate;
        (function (modalCertificate) {
            var ModalCertificateController = (function () {
                function ModalCertificateController($uibModalInstance, dataSetModal, getDataFromJson, functionsUtilService, teacherService, $timeout, $filter) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.teacherService = teacherService;
                    this.$timeout = $timeout;
                    this.$filter = $filter;
                    this._init();
                }
                ModalCertificateController.prototype._init = function () {
                    var self = this;
                    this.certificate = this.dataSetModal.certificate || new app.models.teacher.Certificate();
                    this.receivedYearObject = { value: this.certificate.DateReceived || '' };
                    this.form = {
                        name: this.certificate.Name || '',
                        institution: this.certificate.Institution || '',
                        dateReceived: this.certificate.DateReceived || '',
                        description: this.certificate.Description || ''
                    };
                    this.listReceivedYears = this.functionsUtilService.buildNumberSelectList(1957, 2017);
                    this.validate = {
                        name: { valid: true, message: '' },
                        institution: { valid: true, message: '' },
                        dateReceived: { valid: true, message: '' },
                        description: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalCertificateController.prototype.activate = function () {
                    console.log('modalCertificate controller actived');
                };
                ModalCertificateController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var formValid = true;
                    var name_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.name = this.functionsUtilService.validator(this.form.name, name_rules);
                    if (!this.validate.name.valid) {
                        formValid = this.validate.name.valid;
                    }
                    var institution_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.institution = this.functionsUtilService.validator(this.form.institution, institution_rules);
                    if (!this.validate.institution.valid) {
                        formValid = this.validate.institution.valid;
                    }
                    var received_year_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.dateReceived = this.functionsUtilService.validator(this.receivedYearObject.value, received_year_rules);
                    if (!this.validate.dateReceived.valid) {
                        formValid = this.validate.dateReceived.valid;
                    }
                    return formValid;
                };
                ModalCertificateController.prototype.save = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        var self_1 = this;
                        var receivedYear = this.receivedYearObject.value;
                        this.form.dateReceived = receivedYear;
                        this.certificate.Name = this.form.name;
                        this.certificate.Institution = this.form.institution;
                        this.certificate.DateReceived = this.form.dateReceived;
                        this.certificate.Description = this.form.description;
                        if (this.certificate.Id) {
                            this.teacherService.updateCertificate(this.dataSetModal.teacherId, this.certificate)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.$uibModalInstance.close();
                                }
                                else {
                                }
                            });
                        }
                        else {
                            this.teacherService.createCertificate(this.dataSetModal.teacherId, this.certificate)
                                .then(function (response) {
                                if (response.id) {
                                    self_1.certificate.Id = response.id;
                                    self_1.$uibModalInstance.close(self_1.certificate);
                                }
                                else {
                                }
                            });
                        }
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                ModalCertificateController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalCertificateController;
            }());
            ModalCertificateController.controllerId = 'mainApp.components.modal.ModalCertificateController';
            ModalCertificateController.$inject = [
                '$uibModalInstance',
                'dataSetModal',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.models.teacher.TeacherService',
                '$timeout',
                '$filter'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalCertificateController.controllerId, ModalCertificateController);
        })(modalCertificate = modal.modalCertificate || (modal.modalCertificate = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalCertificate.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalSignUp;
        (function (modalSignUp) {
            var ModalSignUpController = (function () {
                function ModalSignUpController($rootScope, RegisterService, functionsUtil, messageUtil, dataSetModal, dataConfig, $uibModal, $uibModalInstance) {
                    this.$rootScope = $rootScope;
                    this.RegisterService = RegisterService;
                    this.functionsUtil = functionsUtil;
                    this.messageUtil = messageUtil;
                    this.dataSetModal = dataSetModal;
                    this.dataConfig = dataConfig;
                    this.$uibModal = $uibModal;
                    this.$uibModalInstance = $uibModalInstance;
                    this._init();
                }
                ModalSignUpController.prototype._init = function () {
                    var self = this;
                    this.form = {
                        username: '',
                        email: '',
                        first_name: '',
                        last_name: '',
                        password: ''
                    };
                    this.passwordMinLength = this.dataConfig.passwordMinLength;
                    this.passwordMaxLength = this.dataConfig.passwordMaxLength;
                    this.validate = {
                        username: { valid: true, message: '' },
                        email: { valid: true, message: '' },
                        first_name: { valid: true, message: '' },
                        last_name: { valid: true, message: '' },
                        password: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalSignUpController.prototype.activate = function () {
                    DEBUG && console.log('modalSignUp controller actived');
                };
                ModalSignUpController.prototype.registerUser = function () {
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.form.username = this.functionsUtil.generateUsername(this.form.first_name, this.form.last_name);
                        this.RegisterService.register(this.form).then(function (response) {
                            DEBUG && console.log('Welcome!, Your new account has been successfuly created.');
                            self.messageUtil.success('Welcome!, Your new account has been successfuly created.');
                            self._openLogInModal();
                        }, function (error) {
                            DEBUG && console.log(JSON.stringify(error));
                            var errortext = [];
                            for (var key in error.data) {
                                var line = key;
                                line += ': ';
                                line += error.data[key];
                                errortext.push(line);
                            }
                            DEBUG && console.error(errortext);
                            self.validate.globalValidate.valid = false;
                            self.validate.globalValidate.message = errortext[0];
                        });
                    }
                };
                ModalSignUpController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var formValid = true;
                    var firstName_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.first_name = this.functionsUtil.validator(this.form.first_name, firstName_rules);
                    if (!this.validate.first_name.valid) {
                        formValid = this.validate.first_name.valid;
                    }
                    var lastName_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.last_name = this.functionsUtil.validator(this.form.last_name, lastName_rules);
                    if (!this.validate.last_name.valid) {
                        formValid = this.validate.last_name.valid;
                    }
                    var email_rules = [NULL_ENUM, EMPTY_ENUM, EMAIL_ENUM];
                    this.validate.email = this.functionsUtil.validator(this.form.email, email_rules);
                    if (!this.validate.email.valid) {
                        formValid = this.validate.email.valid;
                    }
                    var password_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.password = this.functionsUtil.validator(this.form.password, password_rules);
                    if (!this.validate.password.valid) {
                        formValid = this.validate.password.valid;
                        this.validate.password.message = 'Your password must be at least 6 characters. Please try again.';
                    }
                    return formValid;
                };
                ModalSignUpController.prototype._checkIfEmailExist = function () {
                    var self = this;
                    if (this.form.email) {
                        this.RegisterService.checkEmail(this.form.email).then(function (response) {
                            if (response.data) {
                                if (!response.data.emailExist) {
                                    self.validate.email.valid = true;
                                }
                                else {
                                    self.validate.email.valid = false;
                                    self.validate.email.message = 'That email address is already in use. Please log in.';
                                }
                            }
                            else if (response.email) {
                                self.validate.email.valid = true;
                            }
                        });
                    }
                };
                ModalSignUpController.prototype._openLogInModal = function () {
                    mixpanel.track("Click on 'Log in' from signUp modal");
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalLogInTmpl,
                        controller: 'mainApp.components.modal.ModalLogInController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: self.dataSetModal.hasNextStep
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function () {
                        self.$rootScope.$broadcast('Is Authenticated', self.dataSetModal.hasNextStep);
                    }, function () {
                        DEBUG && console.info('Modal dismissed at: ' + new Date());
                    });
                    this.$uibModalInstance.close();
                };
                ModalSignUpController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalSignUpController;
            }());
            ModalSignUpController.controllerId = 'mainApp.components.modal.ModalSignUpController';
            ModalSignUpController.$inject = [
                '$rootScope',
                'mainApp.register.RegisterService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.util.messageUtilService',
                'dataSetModal',
                'dataConfig',
                '$uibModal',
                '$uibModalInstance'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalSignUpController.controllerId, ModalSignUpController);
        })(modalSignUp = modal.modalSignUp || (modal.modalSignUp = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalSignUp.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalLogIn;
        (function (modalLogIn) {
            var ModalLogInController = (function () {
                function ModalLogInController($rootScope, $state, AuthService, AccountService, functionsUtil, messageUtil, localStorage, dataSetModal, dataConfig, $uibModal, $uibModalInstance) {
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.AuthService = AuthService;
                    this.AccountService = AccountService;
                    this.functionsUtil = functionsUtil;
                    this.messageUtil = messageUtil;
                    this.localStorage = localStorage;
                    this.dataSetModal = dataSetModal;
                    this.dataConfig = dataConfig;
                    this.$uibModal = $uibModal;
                    this.$uibModalInstance = $uibModalInstance;
                    this._init();
                }
                ModalLogInController.prototype._init = function () {
                    var self = this;
                    this.form = {
                        username: '',
                        email: '',
                        password: ''
                    };
                    this.validate = {
                        username: { valid: true, message: '' },
                        email: { valid: true, message: '' },
                        password: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalLogInController.prototype.activate = function () {
                    DEBUG && console.log('modalLogIn controller actived');
                };
                ModalLogInController.prototype.login = function () {
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.AccountService.getUsername(this.form.email).then(function (response) {
                            if (response.userExist) {
                                self.form.username = response.username;
                            }
                            else {
                                self.form.username = self.form.email;
                            }
                            self.AuthService.login(self.form).then(function (response) {
                                self.AccountService.getAccount().then(function (response) {
                                    DEBUG && console.log('Data User: ', response);
                                    self.localStorage.setItem(self.dataConfig.userDataLocalStorage, JSON.stringify(response));
                                    self.$rootScope.userData = response;
                                    self.$rootScope.profileData = new app.models.user.Profile(response);
                                    self.$uibModalInstance.close();
                                });
                            }, function (response) {
                                if (response.status == 401) {
                                    DEBUG && console.log('Incorrect username or password.');
                                    self.validate.globalValidate.valid = false;
                                    self.validate.globalValidate.message = 'Incorrect username or password.';
                                }
                                else if (response.status == -1) {
                                    DEBUG && console.log('No response from server. Try again, please');
                                    self.messageUtil.error('No response from server. Try again, please');
                                }
                                else {
                                    DEBUG && console.log('There was a problem logging you in. Error code: ' + response.status + '.');
                                    self.messageUtil.error('There was a problem logging you in. Error code: ' + response.status + '.');
                                }
                            });
                        });
                    }
                };
                ModalLogInController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var formValid = true;
                    var email_rules = [NULL_ENUM, EMPTY_ENUM, EMAIL_ENUM];
                    this.validate.email = this.functionsUtil.validator(this.form.email, email_rules);
                    if (!this.validate.email.valid) {
                        formValid = this.validate.email.valid;
                    }
                    var password_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.password = this.functionsUtil.validator(this.form.password, password_rules);
                    if (!this.validate.password.valid) {
                        formValid = this.validate.password.valid;
                    }
                    return formValid;
                };
                ModalLogInController.prototype._openForgotPasswordModal = function () {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        size: 'sm',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalForgotPasswordTmpl,
                        controller: 'mainApp.components.modal.ModalForgotPasswordController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: self.dataSetModal.hasNextStep
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    this.$uibModalInstance.close();
                };
                ModalLogInController.prototype._openSignUpModal = function () {
                    mixpanel.track("Click on 'Sign up' from logIn modal");
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        size: 'sm',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalSignUpTmpl,
                        controller: 'mainApp.components.modal.ModalSignUpController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: self.dataSetModal.hasNextStep
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    this.$uibModalInstance.close();
                };
                ModalLogInController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalLogInController;
            }());
            ModalLogInController.controllerId = 'mainApp.components.modal.ModalLogInController';
            ModalLogInController.$inject = [
                '$rootScope',
                '$state',
                'mainApp.auth.AuthService',
                'mainApp.account.AccountService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.util.messageUtilService',
                'mainApp.localStorageService',
                'dataSetModal',
                'dataConfig',
                '$uibModal',
                '$uibModalInstance'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalLogInController.controllerId, ModalLogInController);
        })(modalLogIn = modal.modalLogIn || (modal.modalLogIn = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalLogIn.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalForgotPassword;
        (function (modalForgotPassword) {
            var ModalForgotPasswordController = (function () {
                function ModalForgotPasswordController($rootScope, AuthService, functionsUtil, messageUtil, RegisterService, $uibModal, $uibModalInstance, dataConfig) {
                    this.$rootScope = $rootScope;
                    this.AuthService = AuthService;
                    this.functionsUtil = functionsUtil;
                    this.messageUtil = messageUtil;
                    this.RegisterService = RegisterService;
                    this.$uibModal = $uibModal;
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataConfig = dataConfig;
                    this._init();
                }
                ModalForgotPasswordController.prototype._init = function () {
                    var self = this;
                    this.form = {
                        email: ''
                    };
                    this.validate = {
                        email: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ModalForgotPasswordController.prototype.activate = function () {
                    DEBUG && console.log('modalForgotPassword controller actived');
                };
                ModalForgotPasswordController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var formValid = true;
                    var email_rules = [NULL_ENUM, EMPTY_ENUM, EMAIL_ENUM];
                    this.validate.email = this.functionsUtil.validator(this.form.email, email_rules);
                    if (!this.validate.email.valid) {
                        formValid = this.validate.email.valid;
                    }
                    return formValid;
                };
                ModalForgotPasswordController.prototype._sendInstructions = function () {
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.RegisterService.checkEmail(this.form.email).then(function (response) {
                            var emailExist = true;
                            if (response.data) {
                                emailExist = response.data.emailExist || true;
                            }
                            else {
                                emailExist = false;
                            }
                            self.validate.globalValidate.valid = emailExist;
                            if (!emailExist) {
                                self.validate.globalValidate.message = 'No account exists for ' + self.form.email + '. Maybe you signed up using a different/incorrect e-mail address';
                            }
                            else {
                                self.AuthService.resetPassword(self.form.email).then(function (response) {
                                    self.messageUtil.info('A link to reset your password has been sent to ' + self.form.email);
                                    self._openLogInModal();
                                }, function (error) {
                                    DEBUG && console.error(error);
                                    self.messageUtil.error('');
                                });
                            }
                        });
                    }
                };
                ModalForgotPasswordController.prototype._openLogInModal = function () {
                    mixpanel.track("Click on 'Log in' from signUp modal");
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalLogInTmpl,
                        controller: 'mainApp.components.modal.ModalLogInController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: false
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function () {
                        self.$rootScope.$broadcast('Is Authenticated');
                    }, function () {
                        DEBUG && console.info('Modal dismissed at: ' + new Date());
                    });
                    this.$uibModalInstance.close();
                };
                ModalForgotPasswordController.prototype.close = function () {
                    this.$uibModalInstance.close();
                };
                return ModalForgotPasswordController;
            }());
            ModalForgotPasswordController.controllerId = 'mainApp.components.modal.ModalForgotPasswordController';
            ModalForgotPasswordController.$inject = [
                '$rootScope',
                'mainApp.auth.AuthService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.util.messageUtilService',
                'mainApp.register.RegisterService',
                '$uibModal',
                '$uibModalInstance',
                'dataConfig'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalForgotPasswordController.controllerId, ModalForgotPasswordController);
        })(modalForgotPassword = modal.modalForgotPassword || (modal.modalForgotPassword = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalForgotPassword.controller.js.map
var components;
(function (components) {
    var modal;
    (function (modal) {
        var modalRecommendTeacher;
        (function (modalRecommendTeacher) {
            var ModalRecommendTeacherController = (function () {
                function ModalRecommendTeacherController($uibModalInstance, dataSetModal, localStorage, StudentService, $state, dataConfig, $timeout, $filter, $rootScope) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.dataSetModal = dataSetModal;
                    this.localStorage = localStorage;
                    this.StudentService = StudentService;
                    this.$state = $state;
                    this.dataConfig = dataConfig;
                    this.$timeout = $timeout;
                    this.$filter = $filter;
                    this.$rootScope = $rootScope;
                    this._init();
                }
                ModalRecommendTeacherController.prototype._init = function () {
                    var self = this;
                    this.activate();
                };
                ModalRecommendTeacherController.prototype.activate = function () {
                    var self = this;
                    console.log('modalRecommendTeacher controller actived');
                    this.StudentService.getRatingByEarlyid(this.dataSetModal.earlyId).then(function (response) {
                        if (response.id) {
                            self.rating = new app.models.teacher.Rating(response);
                        }
                    });
                };
                ModalRecommendTeacherController.prototype._join = function () {
                    var CREATE_TEACHER = 'page.createTeacherPage.start';
                    mixpanel.track("Click on join as a teacher from recommendation modal");
                    this.localStorage.setItem(this.dataConfig.earlyIdLocalStorage, this.dataSetModal.earlyId);
                    this.$uibModalInstance.close();
                    this.$state.go(CREATE_TEACHER, { reload: true });
                };
                ModalRecommendTeacherController.prototype.close = function () {
                    mixpanel.track("Click on Close recommend teacher modal button");
                    this.localStorage.setItem(this.dataConfig.earlyIdLocalStorage, this.dataSetModal.earlyId);
                    this.$rootScope.activeMessageBar = true;
                    this.$uibModalInstance.close();
                };
                return ModalRecommendTeacherController;
            }());
            ModalRecommendTeacherController.controllerId = 'mainApp.components.modal.ModalRecommendTeacherController';
            ModalRecommendTeacherController.$inject = [
                '$uibModalInstance',
                'dataSetModal',
                'mainApp.localStorageService',
                'mainApp.models.student.StudentService',
                '$state',
                'dataConfig',
                '$timeout',
                '$filter',
                '$rootScope'
            ];
            angular.module('mainApp.components.modal')
                .controller(ModalRecommendTeacherController.controllerId, ModalRecommendTeacherController);
        })(modalRecommendTeacher = modal.modalRecommendTeacher || (modal.modalRecommendTeacher = {}));
    })(modal = components.modal || (components.modal = {}));
})(components || (components = {}));
//# sourceMappingURL=modalRecommendTeacher.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.main', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page', {
            url: '/page',
            abstract: true,
            templateUrl: 'app/pages/main/main.html',
            controller: 'mainApp.pages.main.MainController',
            controllerAs: 'vm'
        });
    }
})();
//# sourceMappingURL=main.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var main;
        (function (main) {
            var MainController = (function () {
                function MainController($state, $rootScope, localStorage, dataConfig) {
                    this.$state = $state;
                    this.$rootScope = $rootScope;
                    this.localStorage = localStorage;
                    this.dataConfig = dataConfig;
                    this.init();
                }
                MainController.prototype.init = function () {
                    this.activate();
                };
                MainController.prototype.activate = function () {
                    var self = this;
                    var earlyId = this.localStorage.getItem(this.dataConfig.earlyIdLocalStorage);
                    var currentState = this.$state.current.name;
                    if (currentState.indexOf('page.createTeacherPage') !== -1) {
                        this.$rootScope.activeMessageBar = false;
                    }
                    else {
                        this.$rootScope.activeMessageBar = earlyId ? true : false;
                    }
                    console.log('main controller actived');
                };
                return MainController;
            }());
            MainController.controllerId = 'mainApp.pages.main.MainController';
            MainController.$inject = [
                '$state',
                '$rootScope',
                'mainApp.localStorageService',
                'dataConfig'
            ];
            main.MainController = MainController;
            angular
                .module('mainApp.pages.main')
                .controller(MainController.controllerId, MainController);
        })(main = pages.main || (pages.main = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=main.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.studentLandingPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.studentLandingPage', {
            url: '/landing/student',
            views: {
                'container': {
                    templateUrl: 'app/pages/studentLandingPage/studentLandingPage.html',
                    controller: 'mainApp.pages.studentLandingPage.StudentLandingPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            data: {
                requireLogin: true
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = false;
                    $rootScope.activeFooter = true;
                }],
            params: {
                user: null,
                id: null
            }
        });
    }
})();
//# sourceMappingURL=studentLandingPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var studentLandingPage;
        (function (studentLandingPage) {
            var StudentLandingPageController = (function () {
                function StudentLandingPageController($state, functionsUtil, StudentLandingPageService) {
                    this.$state = $state;
                    this.functionsUtil = functionsUtil;
                    this.StudentLandingPageService = StudentLandingPageService;
                    this._init();
                }
                StudentLandingPageController.prototype._init = function () {
                    this.form = {
                        userData: {
                            name: '',
                            email: '',
                            comment: ''
                        },
                        language: this.functionsUtil.getCurrentLanguage() || 'en'
                    };
                    this.success = false;
                    this.sending = false;
                    this.error = {
                        message: ''
                    };
                    this.addComment = false;
                    this.activate();
                };
                StudentLandingPageController.prototype.activate = function () {
                    var self = this;
                    console.log('studentLandingPage controller actived');
                };
                StudentLandingPageController.prototype.changeLanguage = function () {
                    this.functionsUtil.changeLanguage(this.form.language);
                    mixpanel.track("Change Language");
                };
                StudentLandingPageController.prototype.goToEarlyAccessForm = function () {
                    document.querySelector('.studentLandingPage__early-access-block').scrollIntoView({ behavior: 'smooth' });
                    mixpanel.track("Go to early access form");
                };
                StudentLandingPageController.prototype.goDown = function () {
                    document.querySelector('.studentLandingPage__title-block').scrollIntoView({ behavior: 'smooth' });
                    mixpanel.track('Go down');
                };
                StudentLandingPageController.prototype.showCommentsTextarea = function () {
                    event.preventDefault();
                    this.addComment = true;
                };
                StudentLandingPageController.prototype.createEarlyAdopter = function () {
                    var self = this;
                    this.sending = true;
                    mixpanel.track("Click on Notify button", {
                        "name": this.form.userData.name || '*',
                        "email": this.form.userData.email,
                        "comment": this.form.userData.comment || '*'
                    });
                    var userData = {
                        name: this.form.userData.name || '*',
                        email: this.form.userData.email,
                        comment: this.form.userData.comment || '*'
                    };
                    this.StudentLandingPageService.createEarlyAdopter(userData).then(function (response) {
                        if (response.createdAt) {
                            self.success = true;
                        }
                        else {
                            self.sending = false;
                        }
                    });
                };
                return StudentLandingPageController;
            }());
            StudentLandingPageController.controllerId = 'mainApp.pages.studentLandingPage.StudentLandingPageController';
            StudentLandingPageController.$inject = ['$state',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.pages.studentLandingPage.StudentLandingPageService'];
            studentLandingPage.StudentLandingPageController = StudentLandingPageController;
            angular
                .module('mainApp.pages.studentLandingPage')
                .controller(StudentLandingPageController.controllerId, StudentLandingPageController);
        })(studentLandingPage = pages.studentLandingPage || (pages.studentLandingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=studentLandingPage.controller.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var studentLandingPage;
        (function (studentLandingPage) {
            'use strict';
            var StudentLandingPageService = (function () {
                function StudentLandingPageService(restApi) {
                    this.restApi = restApi;
                }
                StudentLandingPageService.prototype.createEarlyAdopter = function (userData) {
                    var url = 'early';
                    return this.restApi.create({ url: url }, userData).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return StudentLandingPageService;
            }());
            StudentLandingPageService.serviceId = 'mainApp.pages.studentLandingPage.StudentLandingPageService';
            StudentLandingPageService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            studentLandingPage.StudentLandingPageService = StudentLandingPageService;
            angular
                .module('mainApp.pages.studentLandingPage')
                .service(StudentLandingPageService.serviceId, StudentLandingPageService);
        })(studentLandingPage = pages.studentLandingPage || (pages.studentLandingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=studentLandingPage.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.teacherLandingPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.teacherLandingPage', {
            url: '/main/teacher',
            views: {
                'container': {
                    templateUrl: 'app/pages/teacherLandingPage/teacherLandingPage.html',
                    controller: 'mainApp.pages.teacherLandingPage.TeacherLandingPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            data: {
                requireLogin: false
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = false;
                    $rootScope.activeFooter = true;
                }]
        });
    }
})();
//# sourceMappingURL=teacherLandingPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var teacherLandingPage;
        (function (teacherLandingPage) {
            var TeacherLandingPageController = (function () {
                function TeacherLandingPageController($scope, functionsUtil, AuthService, $state, dataConfig, $uibModal, $rootScope, localStorage) {
                    this.$scope = $scope;
                    this.functionsUtil = functionsUtil;
                    this.AuthService = AuthService;
                    this.$state = $state;
                    this.dataConfig = dataConfig;
                    this.$uibModal = $uibModal;
                    this.$rootScope = $rootScope;
                    this.localStorage = localStorage;
                    this._init();
                }
                TeacherLandingPageController.prototype._init = function () {
                    this.isAuthenticated = this.AuthService.isAuthenticated();
                    this.form = {
                        language: this.functionsUtil.getCurrentLanguage() || 'en'
                    };
                    this._hoverDetail = [];
                    this._buildFakeTeacher();
                    this.activate();
                };
                TeacherLandingPageController.prototype.activate = function () {
                    this.TEACHER_FAKE_TMPL = 'app/pages/teacherLandingPage/teacherContainerExample/teacherContainerExample.html';
                    var self = this;
                    console.log('teacherLandingPage controller actived');
                    mixpanel.track("Enter: Teacher Landing Page");
                    this._subscribeToEvents();
                };
                TeacherLandingPageController.prototype.changeLanguage = function () {
                    this.functionsUtil.changeLanguage(this.form.language);
                    mixpanel.track("Change Language on teacherLandingPage");
                };
                TeacherLandingPageController.prototype._openSignUpModal = function (event) {
                    var self = this;
                    var hasNextStep = false;
                    if (this.isAuthenticated) {
                        this.goToCreate();
                        return;
                    }
                    if (event.target.id === 'hero-go-to-button') {
                        hasNextStep = true;
                    }
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalSignUpTmpl,
                        controller: 'mainApp.components.modal.ModalSignUpController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: hasNextStep
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    mixpanel.track("Click on 'Join as Student' teacher landing page header");
                };
                TeacherLandingPageController.prototype._openLogInModal = function () {
                    mixpanel.track("Click on 'Log in' from teacher landing page");
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalLogInTmpl,
                        controller: 'mainApp.components.modal.ModalLogInController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: false
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function () {
                        self.$rootScope.$broadcast('Is Authenticated', false);
                    }, function () {
                        DEBUG && console.info('Modal dismissed at: ' + new Date());
                    });
                };
                TeacherLandingPageController.prototype.logout = function () {
                    var self = this;
                    this.AuthService.logout().then(function (response) {
                        window.location.reload();
                    }, function (response) {
                        DEBUG && console.log('A problem occured while logging you out.');
                    });
                };
                TeacherLandingPageController.prototype._buildFakeTeacher = function () {
                    this.profileFake = new app.models.user.Profile();
                    this.teacherFake = new app.models.teacher.Teacher();
                    this.profileFake.UserId = '1';
                    this.profileFake.FirstName = 'Dianne';
                    this.profileFake.Born = 'New York, United States';
                    this.profileFake.Avatar = 'https://waysily-img.s3.amazonaws.com/b3605bad-0924-4bc1-98c8-676c664acd9d-example.jpeg';
                    this.teacherFake.Methodology = 'I can customize the lessons to fit your needs. I teach conversational English to intermediate and advanced students with a focus on grammar, pronunciation, vocabulary and clear fluency and Business English with a focus on formal English in a business setting (role-play), business journal articles, and technical, industry based vocabulary';
                    this.teacherFake.TeacherSince = '2013';
                    this.teacherFake.Type = 'H';
                    this.teacherFake.Languages.Native = ['6'];
                    this.teacherFake.Languages.Teach = ['6', '8'];
                    this.teacherFake.Languages.Learn = ['8', '7'];
                    this.teacherFake.Immersion.Active = true;
                    this.teacherFake.Price.PrivateClass.Active = true;
                    this.teacherFake.Price.PrivateClass.HourPrice = 20.00;
                    this.teacherFake.Price.GroupClass.Active = true;
                    this.teacherFake.Price.GroupClass.HourPrice = 15.00;
                };
                TeacherLandingPageController.prototype._hoverEvent = function (id, status) {
                    var args = { id: id, status: status };
                    this._hoverDetail[id] = status;
                };
                TeacherLandingPageController.prototype._assignNativeClass = function (languages) {
                    var native = languages.native;
                    var teach = languages.teach;
                    var isNative = false;
                    for (var i = 0; i < native.length; i++) {
                        for (var j = 0; j < teach.length; j++) {
                            if (teach[j] === native[i]) {
                                isNative = true;
                            }
                        }
                    }
                    return isNative;
                };
                TeacherLandingPageController.prototype.goToCreate = function () {
                    var params = {
                        type: 'new'
                    };
                    this.$state.go('page.createTeacherPage.start', params, { reload: true });
                };
                TeacherLandingPageController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Is Authenticated', function (event, args) {
                        self.isAuthenticated = self.AuthService.isAuthenticated();
                        if (self.isAuthenticated && args) {
                            self.goToCreate();
                        }
                    });
                };
                return TeacherLandingPageController;
            }());
            TeacherLandingPageController.controllerId = 'mainApp.pages.teacherLandingPage.TeacherLandingPageController';
            TeacherLandingPageController.$inject = ['$scope',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.auth.AuthService',
                '$state',
                'dataConfig',
                '$uibModal',
                '$rootScope',
                'mainApp.localStorageService'];
            teacherLandingPage.TeacherLandingPageController = TeacherLandingPageController;
            angular
                .module('mainApp.pages.teacherLandingPage')
                .controller(TeacherLandingPageController.controllerId, TeacherLandingPageController);
        })(teacherLandingPage = pages.teacherLandingPage || (pages.teacherLandingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherLandingPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.resetPasswordPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.resetPasswordPage', {
            url: '/users/password/edit/:uid/:token',
            views: {
                'container': {
                    templateUrl: 'app/pages/resetPasswordPage/resetPasswordPage.html',
                    controller: 'mainApp.pages.resetPasswordPage.ResetPasswordPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            data: {
                requireLogin: false
            },
            params: {
                uid: null,
                token: null
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = true;
                    $rootScope.activeFooter = true;
                    $rootScope.activeMessageBar = false;
                }]
        });
    }
})();
//# sourceMappingURL=resetPasswordPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var resetPasswordPage;
        (function (resetPasswordPage) {
            var ResetPasswordPageController = (function () {
                function ResetPasswordPageController($state, $stateParams, AuthService, functionsUtil, messageUtil) {
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.AuthService = AuthService;
                    this.functionsUtil = functionsUtil;
                    this.messageUtil = messageUtil;
                    this._init();
                }
                ResetPasswordPageController.prototype._init = function () {
                    var self = this;
                    this.uid = this.$stateParams.uid;
                    this.token = this.$stateParams.token;
                    this.form = {
                        newPassword1: '',
                        newPassword2: ''
                    };
                    this.validate = {
                        newPassword1: { valid: true, message: '' },
                        newPassword2: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                ResetPasswordPageController.prototype.activate = function () {
                    var self = this;
                    console.log('resetPasswordPage controller actived');
                };
                ResetPasswordPageController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var password_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.newPassword1 = this.functionsUtil.validator(this.form.newPassword1, password_rules);
                    if (!this.validate.newPassword1.valid) {
                        formValid = this.validate.newPassword1.valid;
                    }
                    this.validate.newPassword2 = this.functionsUtil.validator(this.form.newPassword2, password_rules);
                    if (!this.validate.newPassword2.valid) {
                        formValid = this.validate.newPassword2.valid;
                    }
                    if (this.form.newPassword1 !== this.form.newPassword2) {
                        formValid = false;
                        this.validate.globalValidate.valid = false;
                        this.validate.globalValidate.message = 'Your new passwords did not match. Please try again.';
                    }
                    return formValid;
                };
                ResetPasswordPageController.prototype._changePassword = function () {
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.AuthService.confirmResetPassword(self.uid, self.token, self.form.newPassword1, self.form.newPassword2).then(function (response) {
                            DEBUG && console.log(response);
                            self.messageUtil.success('Cambio exitoso!. Prueba iniciar sesión ahora.');
                            self.$state.go('page.landingPage', { showLogin: true }, { reload: true });
                        }, function (error) {
                            DEBUG && console.log(error);
                            if (error === 'Invalid value') {
                                self.validate.globalValidate.valid = false;
                                self.validate.globalValidate.message = 'El link que te enviamos al correo ya expiro, es necesario que solicites uno nuevo.';
                            }
                            else {
                                self.messageUtil.error('');
                            }
                        });
                    }
                };
                return ResetPasswordPageController;
            }());
            ResetPasswordPageController.controllerId = 'mainApp.pages.resetPasswordPage.ResetPasswordPageController';
            ResetPasswordPageController.$inject = [
                '$state',
                '$stateParams',
                'mainApp.auth.AuthService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.util.messageUtilService'
            ];
            resetPasswordPage.ResetPasswordPageController = ResetPasswordPageController;
            angular
                .module('mainApp.pages.resetPasswordPage')
                .controller(ResetPasswordPageController.controllerId, ResetPasswordPageController);
        })(resetPasswordPage = pages.resetPasswordPage || (pages.resetPasswordPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=resetPasswordPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.landingPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.landingPage', {
            url: '/main',
            views: {
                'container': {
                    templateUrl: 'app/pages/landingPage/landingPage.html',
                    controller: 'mainApp.pages.landingPage.LandingPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            data: {
                requireLogin: false
            },
            params: {
                showLogin: false,
            },
            cache: false,
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = false;
                    $rootScope.activeFooter = true;
                }]
        })
            .state('page.landingPage.recommendation', {
            url: '/main/recommendation/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/landingPage/landingPage.html',
                    controller: 'mainApp.pages.landingPage.LandingPageController',
                    controllerAs: 'vm'
                }
            },
            params: {
                id: null
            },
            parent: 'page',
            cache: false,
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = false;
                    $rootScope.activeFooter = true;
                }]
        });
    }
})();
//# sourceMappingURL=landingPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var landingPage;
        (function (landingPage) {
            var LandingPageController = (function () {
                function LandingPageController($scope, $state, $stateParams, dataConfig, $uibModal, AuthService, messageUtil, functionsUtil, LandingPageService, FeedbackService, getDataFromJson, $rootScope, localStorage) {
                    this.$scope = $scope;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.dataConfig = dataConfig;
                    this.$uibModal = $uibModal;
                    this.AuthService = AuthService;
                    this.messageUtil = messageUtil;
                    this.functionsUtil = functionsUtil;
                    this.LandingPageService = LandingPageService;
                    this.FeedbackService = FeedbackService;
                    this.getDataFromJson = getDataFromJson;
                    this.$rootScope = $rootScope;
                    this.localStorage = localStorage;
                    this._init();
                }
                LandingPageController.prototype._init = function () {
                    this.isAuthenticated = this.AuthService.isAuthenticated();
                    this.form = {
                        userData: {
                            name: '',
                            email: '',
                            comment: ''
                        },
                        language: this.functionsUtil.getCurrentLanguage() || 'en',
                        feedback: new app.models.feedback.Feedback()
                    };
                    this.listCountries = this.getDataFromJson.getCountryi18n();
                    this.countryObject = { code: '', value: '' };
                    this.infoCountry = {
                        success: false,
                        sending: false,
                        sent: true,
                        disabled: false
                    };
                    this.infoNewUser = {
                        success: false,
                        sending: false,
                        sent: true,
                        disabled: false
                    };
                    this.validate = {
                        country: { valid: true, message: '' },
                        email: { valid: true, message: '' }
                    };
                    this.activate();
                };
                LandingPageController.prototype.activate = function () {
                    var self = this;
                    console.log('landingPage controller actived');
                    mixpanel.track("Enter: Main Landing Page");
                    if (this.$stateParams.id) {
                        var options = {
                            animation: false,
                            backdrop: 'static',
                            keyboard: false,
                            templateUrl: this.dataConfig.modalRecommendTeacherTmpl,
                            controller: 'mainApp.components.modal.ModalRecommendTeacherController as vm',
                            resolve: {
                                dataSetModal: function () {
                                    return {
                                        earlyId: self.$stateParams.id
                                    };
                                }
                            }
                        };
                        var modalInstance = this.$uibModal.open(options);
                    }
                    if (this.$stateParams.showLogin) {
                        this._openLogInModal();
                    }
                    this._subscribeToEvents();
                };
                LandingPageController.prototype.changeLanguage = function () {
                    this.functionsUtil.changeLanguage(this.form.language);
                    mixpanel.track("Change Language on landingPage");
                };
                LandingPageController.prototype.logout = function () {
                    var self = this;
                    this.AuthService.logout().then(function (response) {
                        window.location.reload();
                    }, function (response) {
                        DEBUG && console.log('A problem occured while logging you out.');
                    });
                };
                LandingPageController.prototype._sendCountryFeedback = function () {
                    var FEEDBACK_SUCCESS_MESSAGE = '¡Gracias por tu recomendación!. La revisaremos y pondremos manos a la obra.';
                    var self = this;
                    this.form.feedback.NextCountry = this.countryObject.code;
                    if (this.form.feedback.NextCountry) {
                        this.infoCountry.sending = true;
                        this.infoCountry.sent = false;
                        this.infoCountry.disabled = true;
                        this.FeedbackService.createFeedback(this.form.feedback).then(function (response) {
                            if (response.createdAt) {
                                self.infoCountry.success = true;
                                self.messageUtil.success(FEEDBACK_SUCCESS_MESSAGE);
                                self.infoCountry.sent = true;
                                self.infoCountry.sending = false;
                                self.infoCountry.disabled = true;
                                self.validate.country.valid = true;
                                self.form.userData.email = '';
                            }
                            else {
                                self.infoCountry.sending = false;
                                self.infoCountry.disabled = false;
                                self.validate.country.valid = true;
                            }
                        });
                    }
                    else {
                        this.validate.country.valid = false;
                    }
                };
                LandingPageController.prototype._recommendTeacher = function () {
                    var url = 'https://waysily.typeform.com/to/iAWFeg';
                    mixpanel.track("Click on recommend teacher");
                    window.open(url, '_blank');
                };
                LandingPageController.prototype._recommendSchool = function () {
                    var url = 'https://waysily.typeform.com/to/q5uT0P';
                    mixpanel.track("Click on recommend school");
                    window.open(url, '_blank');
                };
                LandingPageController.prototype._createEarlyAdopter = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var self = this;
                    var email_rules = [NULL_ENUM, EMPTY_ENUM, EMAIL_ENUM];
                    this.validate.email = this.functionsUtil.validator(this.form.userData.email, email_rules);
                    if (this.validate.email.valid) {
                        this.infoNewUser.sending = true;
                        mixpanel.track("Click on Notify button", {
                            "name": this.form.userData.name || '*',
                            "email": this.form.userData.email,
                            "comment": this.form.userData.comment || '*'
                        });
                        var userData = {
                            name: this.form.userData.name || '*',
                            email: this.form.userData.email,
                            comment: this.form.userData.comment || '*'
                        };
                        this.LandingPageService.createEarlyAdopter(userData).then(function (response) {
                            if (response.createdAt) {
                                self.infoNewUser.sent = true;
                                self.infoNewUser.sending = false;
                                self.infoNewUser.disabled = true;
                                self.infoNewUser.success = true;
                                self.validate.country.valid = true;
                            }
                            else {
                                self.infoNewUser.sending = false;
                                self.infoNewUser.disabled = false;
                                self.infoNewUser.success = false;
                                self.validate.email.valid = true;
                            }
                        });
                    }
                    else {
                        this.validate.email.valid = false;
                    }
                };
                LandingPageController.prototype._openSignUpModal = function () {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalSignUpTmpl,
                        controller: 'mainApp.components.modal.ModalSignUpController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: false
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    mixpanel.track("Click on 'Join as Student' landing page header");
                };
                LandingPageController.prototype._openLogInModal = function () {
                    mixpanel.track("Click on 'Log in' from landingPage");
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'sm',
                        templateUrl: this.dataConfig.modalLogInTmpl,
                        controller: 'mainApp.components.modal.ModalLogInController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    hasNextStep: false
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function () {
                        self.$rootScope.$broadcast('Is Authenticated');
                    }, function () {
                        DEBUG && console.info('Modal dismissed at: ' + new Date());
                    });
                };
                LandingPageController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Is Authenticated', function (event, args) {
                        self.isAuthenticated = self.AuthService.isAuthenticated();
                    });
                };
                return LandingPageController;
            }());
            LandingPageController.controllerId = 'mainApp.pages.landingPage.LandingPageController';
            LandingPageController.$inject = ['$scope',
                '$state',
                '$stateParams',
                'dataConfig',
                '$uibModal',
                'mainApp.auth.AuthService',
                'mainApp.core.util.messageUtilService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.pages.landingPage.LandingPageService',
                'mainApp.models.feedback.FeedbackService',
                'mainApp.core.util.GetDataStaticJsonService',
                '$rootScope',
                'mainApp.localStorageService'];
            landingPage.LandingPageController = LandingPageController;
            angular
                .module('mainApp.pages.landingPage')
                .controller(LandingPageController.controllerId, LandingPageController);
        })(landingPage = pages.landingPage || (pages.landingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=landingPage.controller.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var landingPage;
        (function (landingPage) {
            'use strict';
            var LandingPageService = (function () {
                function LandingPageService(restApi) {
                    this.restApi = restApi;
                }
                LandingPageService.prototype.createEarlyAdopter = function (userData) {
                    var url = 'early';
                    return this.restApi.create({ url: url }, userData).$promise
                        .then(function (data) {
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                };
                return LandingPageService;
            }());
            LandingPageService.serviceId = 'mainApp.pages.landingPage.LandingPageService';
            LandingPageService.$inject = [
                'mainApp.core.restApi.restApiService'
            ];
            landingPage.LandingPageService = LandingPageService;
            angular
                .module('mainApp.pages.landingPage')
                .service(LandingPageService.serviceId, LandingPageService);
        })(landingPage = pages.landingPage || (pages.landingPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=landingPage.service.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.searchPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.searchPage', {
            url: '/search',
            views: {
                'container': {
                    templateUrl: 'app/pages/searchPage/searchPage.html',
                    controller: 'mainApp.pages.searchPage.SearchPageController',
                    controllerAs: 'vm'
                }
            },
            data: {
                requireLogin: false
            },
            parent: 'page',
            params: {
                country: null
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = true;
                    $rootScope.activeFooter = false;
                }]
        });
    }
})();
//# sourceMappingURL=searchPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var searchPage;
        (function (searchPage) {
            var SearchPageController = (function () {
                function SearchPageController(StudentService, TeacherService, SchoolService, FunctionsUtilService, $state, $stateParams, $filter, $scope, $rootScope, $timeout) {
                    this.StudentService = StudentService;
                    this.TeacherService = TeacherService;
                    this.SchoolService = SchoolService;
                    this.FunctionsUtilService = FunctionsUtilService;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$timeout = $timeout;
                    this._init();
                }
                SearchPageController.prototype._init = function () {
                    this.VALIDATED = 'VA';
                    this.data = [];
                    this.type = 'teacher';
                    this.loading = true;
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                SearchPageController.prototype.activate = function () {
                    var self = this;
                    console.log('searchPage controller actived');
                    mixpanel.track("Enter: Search Page");
                    this._subscribeToEvents();
                    this.TeacherService.getAllTeachersByStatus(this.VALIDATED).then(function (response) {
                        self.type = 'teacher';
                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(response.results, 'search-map', null, 6);
                        self.$scope.$broadcast('BuildMarkers', self.mapConfig);
                        self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);
                        self.$timeout(function () {
                            self.loading = false;
                        });
                        if (self.$stateParams.country) {
                            self.$timeout(function () {
                                self._searchByCountry(self.$stateParams.country);
                            });
                        }
                    });
                };
                SearchPageController.prototype._getResultLoading = function (type) {
                    var STUDENT_TYPE = 'student';
                    var TEACHER_TYPE = 'teacher';
                    var SCHOOL_TYPE = 'school';
                    switch (type) {
                        case STUDENT_TYPE:
                            return 'app/pages/searchPage/studentResult/studentResult.html';
                        case TEACHER_TYPE:
                            return 'app/pages/searchPage/teacherLoading/teacherLoading.html';
                        case SCHOOL_TYPE:
                            return 'app/pages/searchPage/schoolResult/schoolResult.html';
                    }
                };
                SearchPageController.prototype._searchByCountry = function (country) {
                    var self = this;
                    if (country == 'Colombia') {
                        var location_1 = {
                            country: country,
                            city: 'Medellin',
                            address: 'Transversal 31Sur #32B-64'
                        };
                        this.$timeout(function () {
                            self.$rootScope.$broadcast('PositionCountry', location_1);
                        });
                    }
                };
                SearchPageController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Students', function (event, args) {
                        self.StudentService.getAllStudents().then(function (response) {
                            self.type = 'student';
                            self.mapConfig = self.FunctionsUtilService.buildMapConfig(response, 'search-map', { lat: 6.175434, lng: -75.583329 }, 6);
                            self.$scope.$broadcast('BuildMarkers', self.mapConfig);
                            self.data = self.FunctionsUtilService.splitToColumns(response, 2);
                        });
                    });
                    this.$scope.$on('Teachers', function (event, args) {
                        self.TeacherService.getAllTeachersByStatus(self.VALIDATED).then(function (response) {
                            self.type = 'teacher';
                            self.mapConfig = self.FunctionsUtilService.buildMapConfig(response.results, 'search-map', null, 6);
                            self.$scope.$broadcast('BuildMarkers', self.mapConfig);
                            self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);
                        });
                    });
                    this.$scope.$on('Schools', function (event, args) {
                        self.SchoolService.getAllSchools().then(function (response) {
                            self.type = 'school';
                            self.mapConfig = self.FunctionsUtilService.buildMapConfig(response, 'search-map', { lat: 6.175434, lng: -75.583329 }, 6);
                            self.$scope.$broadcast('BuildMarkers', self.mapConfig);
                            self.data = self.FunctionsUtilService.splitToColumns(response, 2);
                        });
                    });
                    this.$scope.$on('SelectContainer', function (event, args) {
                        var containerId = '#container-' + args;
                        var containerClasses = document.querySelector(containerId).classList;
                        containerClasses.add('search-result__teacher__block--selected');
                        document.querySelector(containerId).scrollIntoView({ behavior: 'smooth' });
                    });
                    this.$scope.$on('SearchCountry', function (event, args) {
                        self._searchByCountry(args);
                    });
                };
                return SearchPageController;
            }());
            SearchPageController.controllerId = 'mainApp.pages.searchPage.SearchPageController';
            SearchPageController.$inject = [
                'mainApp.models.student.StudentService',
                'mainApp.models.teacher.TeacherService',
                'mainApp.models.school.SchoolService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$stateParams',
                '$filter',
                '$scope',
                '$rootScope',
                '$timeout'
            ];
            searchPage.SearchPageController = SearchPageController;
            angular
                .module('mainApp.pages.searchPage')
                .controller(SearchPageController.controllerId, SearchPageController);
        })(searchPage = pages.searchPage || (pages.searchPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=searchPage.controller.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var searchPage;
        (function (searchPage) {
            'use strict';
            var MaTeacherResult = (function () {
                function MaTeacherResult() {
                    this.bindToController = true;
                    this.controller = TeacherResultController.controllerId;
                    this.controllerAs = 'vm';
                    this.restrict = 'E';
                    this.templateUrl = 'app/pages/searchPage/teacherResult/teacherResult.html';
                    console.log('maTeacherResult directive constructor');
                }
                MaTeacherResult.prototype.link = function ($scope, elm, attr) {
                    console.log('maTeacherResult link function');
                };
                MaTeacherResult.instance = function () {
                    return new MaTeacherResult();
                };
                return MaTeacherResult;
            }());
            MaTeacherResult.directiveId = 'maTeacherResult';
            angular
                .module('mainApp.pages.searchPage')
                .directive(MaTeacherResult.directiveId, MaTeacherResult.instance);
            var TeacherResultController = (function () {
                function TeacherResultController(functionsUtil, $uibModal, dataConfig, $filter, $state, $rootScope) {
                    this.functionsUtil = functionsUtil;
                    this.$uibModal = $uibModal;
                    this.dataConfig = dataConfig;
                    this.$filter = $filter;
                    this.$state = $state;
                    this.$rootScope = $rootScope;
                    this.init();
                }
                TeacherResultController.prototype.init = function () {
                    this.form = {};
                    this._hoverDetail = [];
                    this.activate();
                };
                TeacherResultController.prototype.activate = function () {
                    console.log('teacherResult controller actived');
                };
                TeacherResultController.prototype.goToDetails = function (containerId) {
                    var url = this.$state.href('page.teacherProfilePage', { id: containerId });
                    window.open(url, '_blank');
                };
                TeacherResultController.prototype._assignNativeClass = function (languages) {
                    var native = languages.native;
                    var teach = languages.teach;
                    var isNative = false;
                    for (var i = 0; i < native.length; i++) {
                        for (var j = 0; j < teach.length; j++) {
                            if (teach[j] === native[i]) {
                                isNative = true;
                            }
                        }
                    }
                    return isNative;
                };
                TeacherResultController.prototype._ratingAverage = function (ratingsArr) {
                    return this.functionsUtil.teacherRatingAverage(ratingsArr);
                };
                TeacherResultController.prototype._hoverEvent = function (id, status) {
                    var args = { id: id, status: status };
                    this._hoverDetail[id] = status;
                    this.$rootScope.$broadcast('ChangeMarker', args);
                };
                return TeacherResultController;
            }());
            TeacherResultController.controllerId = 'mainApp.pages.searchPage.TeacherResultController';
            TeacherResultController.$inject = [
                'mainApp.core.util.FunctionsUtilService',
                '$uibModal',
                'dataConfig',
                '$filter',
                '$state',
                '$rootScope'
            ];
            searchPage.TeacherResultController = TeacherResultController;
            angular.module('mainApp.pages.searchPage')
                .controller(TeacherResultController.controllerId, TeacherResultController);
        })(searchPage = pages.searchPage || (pages.searchPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherResult.directive.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userProfilePage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userProfilePage', {
            url: '/users/show/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/userProfilePage/userProfilePage.html',
                    controller: 'mainApp.pages.userProfilePage.UserProfilePageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: null
            }
        });
    }
})();
//# sourceMappingURL=userProfilePage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userProfilePage;
        (function (userProfilePage) {
            var UserProfilePageController = (function () {
                function UserProfilePageController(UserService, $state, $stateParams, $filter, $scope) {
                    this.UserService = UserService;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserProfilePageController.prototype._init = function () {
                    this.data = null;
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.mapConfig = {
                        type: 'location-map',
                        data: null
                    };
                    this.$scope.date;
                    this.$scope.datetimepickerConfig = {
                        minView: 'hour',
                        dropdownSelector: '.my-toggle-select'
                    };
                    this.activate();
                };
                UserProfilePageController.prototype.activate = function () {
                    var self = this;
                    console.log('userProfilePage controller actived');
                    this.UserService.getUserProfileById(this.$stateParams.id).then(function (response) {
                        self.data = new app.models.user.Profile(response);
                    });
                };
                UserProfilePageController.prototype.onTimeSet = function (newDate, oldDate) {
                    console.log(newDate);
                    console.log(oldDate);
                };
                UserProfilePageController.prototype.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    var index = Math.floor(Math.random() * $dates.length);
                    $dates[index].selectable = false;
                };
                UserProfilePageController.prototype.goToConfirm = function () {
                    this.$state.go('page.meetingConfirmationPage');
                };
                return UserProfilePageController;
            }());
            UserProfilePageController.controllerId = 'mainApp.pages.userProfilePage.UserProfilePageController';
            UserProfilePageController.$inject = [
                'mainApp.models.user.UserService',
                '$state',
                '$stateParams',
                '$filter',
                '$scope'
            ];
            userProfilePage.UserProfilePageController = UserProfilePageController;
            angular
                .module('mainApp.pages.userProfilePage')
                .controller(UserProfilePageController.controllerId, UserProfilePageController);
        })(userProfilePage = pages.userProfilePage || (pages.userProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userProfilePage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditProfilePage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditProfilePage', {
            url: '/users/edit/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditProfilePage/userEditProfilePage.html',
                    controller: 'mainApp.pages.userEditProfilePage.UserEditProfilePageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditProfilePage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditProfilePage;
        (function (userEditProfilePage) {
            var UserEditProfilePageController = (function () {
                function UserEditProfilePageController($state, $filter, $scope) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserEditProfilePageController.prototype._init = function () {
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserEditProfilePageController.prototype.activate = function () {
                    console.log('userEditProfilePage controller actived');
                };
                UserEditProfilePageController.prototype.goToEditMedia = function () {
                    this.$state.go('page.userEditMediaPage');
                };
                UserEditProfilePageController.prototype.goToEditAgenda = function () {
                    this.$state.go('page.userEditAgendaPage');
                };
                return UserEditProfilePageController;
            }());
            UserEditProfilePageController.controllerId = 'mainApp.pages.userEditProfilePage.UserEditProfilePageController';
            UserEditProfilePageController.$inject = [
                '$state',
                '$filter',
                '$scope'
            ];
            userEditProfilePage.UserEditProfilePageController = UserEditProfilePageController;
            angular
                .module('mainApp.pages.userEditProfilePage')
                .controller(UserEditProfilePageController.controllerId, UserEditProfilePageController);
        })(userEditProfilePage = pages.userEditProfilePage || (pages.userEditProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditProfilePage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditMediaPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditMediaPage', {
            url: '/users/edit/:id/media',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditMediaPage/userEditMediaPage.html',
                    controller: 'mainApp.pages.userEditMediaPage.UserEditMediaPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditMediaPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditMediaPage;
        (function (userEditMediaPage) {
            var UserEditMediaPageController = (function () {
                function UserEditMediaPageController($state, $filter, $scope) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this._init();
                }
                UserEditMediaPageController.prototype._init = function () {
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserEditMediaPageController.prototype.activate = function () {
                    console.log('userEditMediaPage controller actived');
                };
                UserEditMediaPageController.prototype.goToEditProfile = function () {
                    this.$state.go('page.userEditProfilePage');
                };
                return UserEditMediaPageController;
            }());
            UserEditMediaPageController.controllerId = 'mainApp.pages.userEditMediaPage.UserEditMediaPageController';
            UserEditMediaPageController.$inject = [
                '$state',
                '$filter',
                '$scope'
            ];
            userEditMediaPage.UserEditMediaPageController = UserEditMediaPageController;
            angular
                .module('mainApp.pages.userEditMediaPage')
                .controller(UserEditMediaPageController.controllerId, UserEditMediaPageController);
        })(userEditMediaPage = pages.userEditMediaPage || (pages.userEditMediaPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditMediaPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userEditAgendaPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userEditAgendaPage', {
            url: '/users/edit/:id/agenda',
            views: {
                'container': {
                    templateUrl: 'app/pages/userEditAgendaPage/userEditAgendaPage.html',
                    controller: 'mainApp.pages.userEditAgendaPage.UserEditAgendaPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null,
                id: '1'
            }
        });
    }
})();
//# sourceMappingURL=userEditAgendaPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userEditAgendaPage;
        (function (userEditAgendaPage) {
            var UserEditAgendaPageController = (function () {
                function UserEditAgendaPageController($state, $filter, $scope, uiCalendarConfig) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.uiCalendarConfig = uiCalendarConfig;
                    this._init();
                }
                UserEditAgendaPageController.prototype._init = function () {
                    var self = this;
                    this.form = {
                        username: '',
                        email: ''
                    };
                    this.error = {
                        message: ''
                    };
                    this.$scope.calendarConfig = {
                        calendar: {
                            editable: true,
                            header: {
                                left: 'prev',
                                center: 'title',
                                right: 'month, agendaDay, next'
                            },
                            slotDuration: '01:00:00',
                            slotLabelFormat: 'h(:mm) a',
                            navLinks: true,
                            allDaySlot: false,
                            events: [
                                {
                                    title: 'Rosa',
                                    start: '2016-10-12T17:00:00',
                                    end: '2016-10-12T18:00:00',
                                    editable: false
                                },
                                {
                                    title: 'Carlos',
                                    start: '2016-10-20T20:00:00',
                                    end: '2016-10-20T21:00:00',
                                    editable: false
                                },
                                {
                                    title: 'Michaelson',
                                    start: '2016-10-23T07:00:00',
                                    end: '2016-10-23T08:00:00',
                                    editable: false
                                }
                            ],
                            timeFormat: 'h:mm a',
                            buttonText: {
                                month: 'view calendar'
                            }
                        }
                    };
                    this.$scope.changeView = function (view, calendar) {
                        self.uiCalendarConfig.calendars['userAgenda'].fullCalendar('changeView', 'agendaDay');
                    };
                    this.$scope.eventSources = [];
                    this.activate();
                };
                UserEditAgendaPageController.prototype.activate = function () {
                    console.log('userEditAgendaPage controller actived');
                };
                UserEditAgendaPageController.prototype.goToEditProfile = function () {
                    this.$state.go('page.userEditProfilePage');
                };
                UserEditAgendaPageController.prototype.goToEditMedia = function () {
                    this.$state.go('page.userEditMediaPage');
                };
                return UserEditAgendaPageController;
            }());
            UserEditAgendaPageController.controllerId = 'mainApp.pages.userEditAgendaPage.UserEditAgendaPageController';
            UserEditAgendaPageController.$inject = [
                '$state',
                '$filter',
                '$scope',
                'uiCalendarConfig'
            ];
            userEditAgendaPage.UserEditAgendaPageController = UserEditAgendaPageController;
            angular
                .module('mainApp.pages.userEditAgendaPage')
                .controller(UserEditAgendaPageController.controllerId, UserEditAgendaPageController);
        })(userEditAgendaPage = pages.userEditAgendaPage || (pages.userEditAgendaPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userEditAgendaPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.meetingConfirmationPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.meetingConfirmationPage', {
            url: '/meeting/confirmation',
            views: {
                'container': {
                    templateUrl: 'app/pages/meetingConfirmationPage/meetingConfirmationPage.html',
                    controller: 'mainApp.pages.meetingConfirmationPage.MeetingConfirmationPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                user: null
            }
        });
    }
})();
//# sourceMappingURL=meetingConfirmationPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var meetingConfirmationPage;
        (function (meetingConfirmationPage) {
            var MeetingConfirmationPageController = (function () {
                function MeetingConfirmationPageController(dataConfig, $state, $filter, $scope, $uibModal) {
                    this.dataConfig = dataConfig;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                MeetingConfirmationPageController.prototype._init = function () {
                    this.form = {
                        helloText: '',
                        meetingPoint: {
                            name: 'Escoge un punto de encuentro',
                            category: '',
                            address: '',
                            prices: { min: 0, max: 0 },
                            position: { lat: null, lng: null }
                        }
                    };
                    this.error = {
                        message: ''
                    };
                    this.mapConfig = {
                        type: 'location-map',
                        data: null
                    };
                    this.activate();
                };
                MeetingConfirmationPageController.prototype.activate = function () {
                    console.log('meetingConfirmationPage controller actived');
                };
                MeetingConfirmationPageController.prototype.addNewMeetingPoint = function () {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalMeetingPointTmpl,
                        controller: 'mainApp.components.modal.ModalMeetingPointController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    model: { test: 'data' }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newMeetingPoint) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    event.preventDefault();
                };
                MeetingConfirmationPageController.prototype.chooseMeetingPoint = function () {
                    var meetingPoint = {
                        name: 'Café Vervlet',
                        category: 'Café',
                        address: 'Trans 33 Sur',
                        prices: { min: 23000, max: 30000 },
                        position: { lat: 6.1739743, lng: -75.5822414 }
                    };
                    this.form.meetingPoint = meetingPoint;
                    if (this.form.helloText != '' &&
                        this.form.meetingPoint.position.lat != null &&
                        this.form.meetingPoint.position.lng != null) {
                        this.processCompleted = true;
                    }
                };
                MeetingConfirmationPageController.prototype.saveMessage = function () {
                    if (this.form.helloText != '' &&
                        this.form.meetingPoint.position.lat != null &&
                        this.form.meetingPoint.position.lng != null) {
                        this.processCompleted = true;
                    }
                };
                MeetingConfirmationPageController.prototype.edit = function () {
                    this.processCompleted = false;
                };
                return MeetingConfirmationPageController;
            }());
            MeetingConfirmationPageController.controllerId = 'mainApp.pages.meetingConfirmationPage.MeetingConfirmationPageController';
            MeetingConfirmationPageController.$inject = [
                'dataConfig',
                '$state',
                '$filter',
                '$scope',
                '$uibModal'
            ];
            meetingConfirmationPage.MeetingConfirmationPageController = MeetingConfirmationPageController;
            angular
                .module('mainApp.pages.meetingConfirmationPage')
                .controller(MeetingConfirmationPageController.controllerId, MeetingConfirmationPageController);
        })(meetingConfirmationPage = pages.meetingConfirmationPage || (pages.meetingConfirmationPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=meetingConfirmationPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userInboxPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userInboxPage', {
            url: '/users/:userId/inbox',
            views: {
                'container': {
                    templateUrl: 'app/pages/userInboxPage/userInboxPage.html',
                    controller: 'mainApp.pages.userInboxPage.UserInboxPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                userId: '123'
            }
        });
    }
})();
//# sourceMappingURL=userInboxPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userInboxPage;
        (function (userInboxPage) {
            var UserInboxPageController = (function () {
                function UserInboxPageController($state, $scope) {
                    this.$state = $state;
                    this.$scope = $scope;
                    this._init();
                }
                UserInboxPageController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserInboxPageController.prototype.activate = function () {
                    console.log('userInboxPage controller actived');
                };
                UserInboxPageController.prototype.goToDetail = function () {
                    this.$state.go('page.userInboxDetailsPage');
                };
                return UserInboxPageController;
            }());
            UserInboxPageController.controllerId = 'mainApp.pages.userInboxPage.UserInboxPageController';
            UserInboxPageController.$inject = [
                '$state',
                '$scope'
            ];
            userInboxPage.UserInboxPageController = UserInboxPageController;
            angular
                .module('mainApp.pages.userInboxPage')
                .controller(UserInboxPageController.controllerId, UserInboxPageController);
        })(userInboxPage = pages.userInboxPage || (pages.userInboxPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userInboxPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.userInboxDetailsPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.userInboxDetailsPage', {
            url: '/users/:userId/inbox/:messageId',
            views: {
                'container': {
                    templateUrl: 'app/pages/userInboxDetailsPage/userInboxDetailsPage.html',
                    controller: 'mainApp.pages.userInboxDetailsPage.UserInboxDetailsPageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            params: {
                userId: '123',
                messageId: '1234'
            }
        });
    }
})();
//# sourceMappingURL=userInboxDetailsPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var userInboxDetailsPage;
        (function (userInboxDetailsPage) {
            var UserInboxDetailsPageController = (function () {
                function UserInboxDetailsPageController($state, $scope) {
                    this.$state = $state;
                    this.$scope = $scope;
                    this._init();
                }
                UserInboxDetailsPageController.prototype._init = function () {
                    this.form = {};
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                UserInboxDetailsPageController.prototype.activate = function () {
                    console.log('userInboxDetailsPage controller actived');
                };
                return UserInboxDetailsPageController;
            }());
            UserInboxDetailsPageController.controllerId = 'mainApp.pages.userInboxDetailsPage.UserInboxDetailsPageController';
            UserInboxDetailsPageController.$inject = [
                '$state',
                '$scope'
            ];
            userInboxDetailsPage.UserInboxDetailsPageController = UserInboxDetailsPageController;
            angular
                .module('mainApp.pages.userInboxDetailsPage')
                .controller(UserInboxDetailsPageController.controllerId, UserInboxDetailsPageController);
        })(userInboxDetailsPage = pages.userInboxDetailsPage || (pages.userInboxDetailsPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=userInboxDetailsPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage', {
            url: '/create/teacher',
            views: {
                'container': {
                    templateUrl: 'app/pages/createTeacherPage/createTeacherPage.html',
                    controller: 'mainApp.pages.createTeacherPage.CreateTeacherPageController',
                    controllerAs: 'vm',
                    resolve: {
                        waitForAuth: ['mainApp.auth.AuthService', function (AuthService) {
                                return AuthService.autoRefreshToken();
                            }]
                    }
                }
            },
            cache: false,
            params: {
                type: '',
            },
            data: {
                requireLogin: true
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = false;
                    $rootScope.activeFooter = true;
                    $rootScope.activeMessageBar = false;
                }]
        });
    }
})();
//# sourceMappingURL=createTeacherPage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var CreateTeacherPageController = (function () {
                function CreateTeacherPageController(getDataFromJson, functionsUtilService, userService, teacherService, messageUtil, localStorage, dataConfig, $state, $stateParams, $filter, $scope, $window, $rootScope, $uibModal, waitForAuth) {
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.userService = userService;
                    this.teacherService = teacherService;
                    this.messageUtil = messageUtil;
                    this.localStorage = localStorage;
                    this.dataConfig = dataConfig;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$rootScope = $rootScope;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                CreateTeacherPageController.prototype._init = function () {
                    var self = this;
                    var loggedUserId = this.$rootScope.userData.id;
                    var currentState = this.$state.current.name;
                    this.$rootScope.teacherData = new app.models.teacher.Teacher();
                    this.$rootScope.teacherData.ProfileId = loggedUserId;
                    angular.element(this.$window).bind("scroll", function () {
                        var floatHeader = document.getElementById('header-float');
                        if (floatHeader) {
                            var floatHeaderClasses = floatHeader.classList;
                            if (this.pageYOffset >= 30) {
                                floatHeaderClasses.remove('hidden');
                            }
                            else {
                                floatHeaderClasses.add('hidden');
                            }
                        }
                    });
                    this.error = {
                        message: ''
                    };
                    this.activate();
                };
                CreateTeacherPageController.prototype.activate = function () {
                    var self = this;
                    console.log('createTeacherPage controller actived');
                    mixpanel.track("Enter: Create Teacher Page");
                    this._subscribeToEvents();
                    if (this.$stateParams.type === 'new') {
                        this.localStorage.removeItem(this.dataConfig.teacherDataLocalStorage);
                    }
                    this.fillFormWithProfileData();
                    this.fillFormWithTeacherData();
                };
                CreateTeacherPageController.prototype.fillFormWithProfileData = function () {
                    var self = this;
                    var userId = this.$rootScope.userData.id;
                    if (userId) {
                        this.userService.getUserProfileById(userId)
                            .then(function (response) {
                            if (response.userId) {
                                self.$rootScope.profileData = new app.models.user.Profile(response);
                                self.$scope.$broadcast('Fill User Profile Form', self.$rootScope.profileData);
                            }
                        });
                    }
                };
                CreateTeacherPageController.prototype.fillFormWithTeacherData = function () {
                    var self = this;
                    var userId = this.$rootScope.userData.id;
                    this.teacherService.getTeacherByProfileId(userId).then(function (response) {
                        if (response.id) {
                            self.localStorage.setItem(self.dataConfig.teacherDataLocalStorage, JSON.stringify(response));
                            self.$rootScope.teacherData = new app.models.teacher.Teacher(response);
                            self.$scope.$broadcast('Fill Form', self.$rootScope.teacherData);
                        }
                        else {
                            self.localStorage.removeItem(self.dataConfig.teacherDataLocalStorage);
                        }
                    });
                };
                CreateTeacherPageController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Save Profile Data', function (event, args) {
                        var SUCCESS_MESSAGE = self.$filter('translate')('%notification.success.text');
                        var userId = self.$rootScope.profileData.UserId;
                        if (userId) {
                            self.userService.updateUserProfile(self.$rootScope.profileData)
                                .then(function (response) {
                                if (response.userId) {
                                    window.scrollTo(0, 0);
                                    self.messageUtil.success(SUCCESS_MESSAGE);
                                    self.$rootScope.profileData = new app.models.user.Profile(response);
                                    self.$scope.$broadcast('Fill User Profile Form', self.$rootScope.profileData);
                                }
                            }, function (error) {
                                DEBUG && console.error(error);
                            });
                        }
                    });
                    this.$scope.$on('Save Data', function (event, args) {
                        var SUCCESS_MESSAGE = self.$filter('translate')('%notification.success.text');
                        var numStep = args;
                        if (self.$rootScope.teacherData.Id) {
                            self.teacherService.updateTeacher(self.$rootScope.teacherData)
                                .then(function (response) {
                                if (response.id) {
                                    window.scrollTo(0, 0);
                                    self.messageUtil.success(SUCCESS_MESSAGE);
                                    self.localStorage.setItem(self.dataConfig.teacherDataLocalStorage, JSON.stringify(response));
                                    self.$rootScope.teacherData = new app.models.teacher.Teacher(response);
                                    self.$scope.$broadcast('Fill Form', self.$rootScope.teacherData);
                                }
                            });
                        }
                        else {
                            self.teacherService.createTeacher(self.$rootScope.teacherData)
                                .then(function (response) {
                                if (response.id) {
                                    window.scrollTo(0, 0);
                                    self.messageUtil.success(SUCCESS_MESSAGE);
                                    self.localStorage.setItem(self.dataConfig.teacherDataLocalStorage, JSON.stringify(response));
                                    self.$rootScope.teacherData = new app.models.teacher.Teacher(response);
                                    self.$scope.$broadcast('Fill Form', self.$rootScope.teacherData);
                                }
                            });
                        }
                    });
                };
                return CreateTeacherPageController;
            }());
            CreateTeacherPageController.controllerId = 'mainApp.pages.createTeacherPage.CreateTeacherPageController';
            CreateTeacherPageController.$inject = [
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.models.user.UserService',
                'mainApp.models.teacher.TeacherService',
                'mainApp.core.util.messageUtilService',
                'mainApp.localStorageService',
                'dataConfig',
                '$state',
                '$stateParams',
                '$filter',
                '$scope',
                '$window',
                '$rootScope',
                '$uibModal',
                'waitForAuth'
            ];
            createTeacherPage.CreateTeacherPageController = CreateTeacherPageController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(CreateTeacherPageController.controllerId, CreateTeacherPageController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=createTeacherPage.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.start', {
            url: '/start',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherWelcomeSection/teacherWelcomeSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherWelcomeSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherWelcomeSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherWelcomeSectionController = (function () {
                function TeacherWelcomeSectionController($state, $scope, functionsUtilService) {
                    this.$state = $state;
                    this.$scope = $scope;
                    this.functionsUtilService = functionsUtilService;
                    this._init();
                }
                TeacherWelcomeSectionController.prototype._init = function () {
                    this.STEP1_STATE = 'page.createTeacherPage.basicInfo';
                    this.INITIAL_PROGRESS_WIDTH = '2%';
                    this.$scope.$parent.vm.progressWidth = this.INITIAL_PROGRESS_WIDTH;
                    this.activate();
                };
                TeacherWelcomeSectionController.prototype.activate = function () {
                    console.log('TeacherWelcomeSectionController controller actived');
                    mixpanel.track("Enter: Start Create Teacher Process");
                };
                TeacherWelcomeSectionController.prototype.goToStart = function () {
                    this.$state.go(this.STEP1_STATE, { reload: true });
                };
                return TeacherWelcomeSectionController;
            }());
            TeacherWelcomeSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherWelcomeSectionController';
            TeacherWelcomeSectionController.$inject = [
                '$state',
                '$scope',
                'mainApp.core.util.FunctionsUtilService'
            ];
            createTeacherPage.TeacherWelcomeSectionController = TeacherWelcomeSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherWelcomeSectionController.controllerId, TeacherWelcomeSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherWelcomeSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.basicInfo', {
            url: '/basicInfo',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherInfoSection/teacherInfoSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherInfoSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherInfoSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherInfoSectionController = (function () {
                function TeacherInfoSectionController(getDataFromJson, functionsUtilService, localStorage, dataConfig, $state, $filter, $scope, $rootScope) {
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.localStorage = localStorage;
                    this.dataConfig = dataConfig;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this._init();
                }
                TeacherInfoSectionController.prototype._init = function () {
                    this.STEP2_STATE = 'page.createTeacherPage.location';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(1, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.sexObject = { sex: { code: '', value: '' } };
                    this.dateObject = { day: { value: '' }, month: { code: '', value: '' }, year: { value: '' } };
                    this.form = {
                        phoneNumber: '',
                        sex: '',
                        birthDate: '',
                        born: '',
                        about: ''
                    };
                    this.listMonths = this.getDataFromJson.getMonthi18n();
                    this.listSexs = this.getDataFromJson.getSexi18n();
                    this.listDays = this.functionsUtilService.buildNumberSelectList(1, 31);
                    this.listYears = this.functionsUtilService.buildNumberSelectList(1916, 1998);
                    this.validate = {
                        phoneNumber: { valid: true, message: '' },
                        sex: { valid: true, message: '' },
                        birthDate: {
                            day: { valid: true, message: '' },
                            month: { valid: true, message: '' },
                            year: { valid: true, message: '' },
                            valid: true,
                            message: ''
                        },
                        born: { valid: true, message: '' },
                        about: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherInfoSectionController.prototype.activate = function () {
                    DEBUG && console.log('TeacherInfoSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.profileData) {
                        this._fillForm(this.$rootScope.profileData);
                    }
                };
                TeacherInfoSectionController.prototype.goToNext = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Profile Data');
                        this.$state.go(this.STEP2_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherInfoSectionController.prototype._fillForm = function (data) {
                    this.form.phoneNumber = data.PhoneNumber;
                    this.sexObject.sex.code = data.Gender;
                    var date = this.functionsUtilService.splitDate(data.BirthDate);
                    this.dateObject.day.value = date.day ? parseInt(date.day) : '';
                    this.dateObject.month.code = date.month !== 'Invalid date' ? date.month : '';
                    this.dateObject.year.value = date.year ? parseInt(date.year) : '';
                    this.form.born = data.Born;
                    this.form.about = data.About;
                };
                TeacherInfoSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var NAN_ENUM = 8;
                    var EMPTY_ENUM = 3;
                    var EMAIL_ENUM = 0;
                    var NUMBER_ENUM = 4;
                    var BIRTHDATE_MESSAGE = this.$filter('translate')('%create.teacher.basic_info.form.birthdate.validation.message.text');
                    var formValid = true;
                    var phoneNumber_rules = [NULL_ENUM, EMPTY_ENUM, NUMBER_ENUM];
                    var onlyNum = this.form.phoneNumber.replace(/\D+/g, "");
                    onlyNum = parseInt(onlyNum) || '';
                    this.validate.phoneNumber = this.functionsUtilService.validator(onlyNum, phoneNumber_rules);
                    if (!this.validate.phoneNumber.valid) {
                        formValid = this.validate.phoneNumber.valid;
                    }
                    var sex_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.sex = this.functionsUtilService.validator(this.sexObject.sex.code, sex_rules);
                    if (!this.validate.sex.valid) {
                        formValid = this.validate.sex.valid;
                    }
                    var day_birthdate_rules = [NULL_ENUM, EMPTY_ENUM, NAN_ENUM];
                    this.validate.birthDate.day = this.functionsUtilService.validator(this.dateObject.day.value, day_birthdate_rules);
                    if (!this.validate.birthDate.day.valid) {
                        formValid = this.validate.birthDate.day.valid;
                        this.validate.birthDate.valid = this.validate.birthDate.day.valid;
                        this.validate.birthDate.message = BIRTHDATE_MESSAGE;
                    }
                    var month_birthdate_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.birthDate.month = this.functionsUtilService.validator(this.dateObject.month.code, month_birthdate_rules);
                    if (!this.validate.birthDate.month.valid) {
                        formValid = this.validate.birthDate.month.valid;
                        this.validate.birthDate.valid = this.validate.birthDate.month.valid;
                        this.validate.birthDate.message = BIRTHDATE_MESSAGE;
                    }
                    var year_birthdate_rules = [NULL_ENUM, EMPTY_ENUM, NAN_ENUM];
                    this.validate.birthDate.year = this.functionsUtilService.validator(this.dateObject.year.value, year_birthdate_rules);
                    if (!this.validate.birthDate.year.valid) {
                        formValid = this.validate.birthDate.year.valid;
                        this.validate.birthDate.valid = this.validate.birthDate.year.valid;
                        this.validate.birthDate.message = BIRTHDATE_MESSAGE;
                    }
                    if (this.validate.birthDate.day.valid &&
                        this.validate.birthDate.month.valid &&
                        this.validate.birthDate.year.valid) {
                        this.validate.birthDate.valid = true;
                        this.validate.birthDate.message = '';
                    }
                    var born_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.born = this.functionsUtilService.validator(this.form.born, born_rules);
                    if (!this.validate.born.valid) {
                        formValid = this.validate.born.valid;
                    }
                    return formValid;
                };
                TeacherInfoSectionController.prototype.changeHelpText = function (type) {
                    var NAME_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.name.title.text');
                    var NAME_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.name.description.text');
                    var EMAIL_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.email.title.text');
                    var EMAIL_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.email.description.text');
                    var PHONE_NUMBER_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.phone_number.title.text');
                    var PHONE_NUMBER_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.phone_number.description.text');
                    var SEX_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.gender.title.text');
                    var SEX_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.gender.description.text');
                    var BIRTHDATE_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.birthdate.title.text');
                    var BIRTHDATE_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.birthdate.description.text');
                    var BORN_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.born.title.text');
                    var BORN_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.born.description.text');
                    var ABOUT_TITLE = this.$filter('translate')('%create.teacher.basic_info.help_text.about.title.text');
                    var ABOUT_DESCRIPTION = this.$filter('translate')('%create.teacher.basic_info.help_text.about.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'firstName':
                        case 'lastName':
                            this.helpText.title = NAME_TITLE;
                            this.helpText.description = NAME_DESCRIPTION;
                            break;
                        case 'email':
                            this.helpText.title = EMAIL_TITLE;
                            this.helpText.description = EMAIL_DESCRIPTION;
                            break;
                        case 'phoneNumber':
                            this.helpText.title = PHONE_NUMBER_TITLE;
                            this.helpText.description = PHONE_NUMBER_DESCRIPTION;
                            break;
                        case 'sex':
                            this.helpText.title = SEX_TITLE;
                            this.helpText.description = SEX_DESCRIPTION;
                            break;
                        case 'birthDate':
                            this.helpText.title = BIRTHDATE_TITLE;
                            this.helpText.description = BIRTHDATE_DESCRIPTION;
                            break;
                        case 'born':
                            this.helpText.title = BORN_TITLE;
                            this.helpText.description = BORN_DESCRIPTION;
                            break;
                        case 'about':
                            this.helpText.title = ABOUT_TITLE;
                            this.helpText.description = ABOUT_DESCRIPTION;
                            break;
                    }
                };
                TeacherInfoSectionController.prototype._setDataModelFromForm = function () {
                    var dateFormatted = this.functionsUtilService.joinDate(this.dateObject.day.value, this.dateObject.month.code, this.dateObject.year.value);
                    var genderCode = this.sexObject.sex.code;
                    var recommended = this.localStorage.getItem(this.dataConfig.earlyIdLocalStorage);
                    this.$rootScope.profileData.PhoneNumber = this.form.phoneNumber;
                    this.$rootScope.profileData.Gender = genderCode;
                    this.$rootScope.profileData.BirthDate = dateFormatted;
                    this.$rootScope.profileData.Born = this.form.born;
                    this.$rootScope.profileData.About = this.form.about;
                    this.$rootScope.teacherData.Recommended = recommended ? recommended : null;
                    mixpanel.track("Enter: Basic Info on Create Teacher", {
                        "name": this.$rootScope.profileData.FirstName + ' ' + this.$rootScope.profileData.LastName,
                        "email": this.$rootScope.profileData.Email,
                        "phone": this.$rootScope.profileData.PhoneNumber
                    });
                };
                TeacherInfoSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill User Profile Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherInfoSectionController;
            }());
            TeacherInfoSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherInfoSectionController';
            TeacherInfoSectionController.$inject = [
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.localStorageService',
                'dataConfig',
                '$state',
                '$filter',
                '$scope',
                '$rootScope'
            ];
            createTeacherPage.TeacherInfoSectionController = TeacherInfoSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherInfoSectionController.controllerId, TeacherInfoSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherInfoSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.location', {
            url: '/location',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherLocationSection/teacherLocationSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherLocationSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherLocationSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherLocationSectionController = (function () {
                function TeacherLocationSectionController(getDataFromJson, functionsUtilService, $state, $filter, $scope, $rootScope, $timeout) {
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$timeout = $timeout;
                    this._init();
                }
                TeacherLocationSectionController.prototype._init = function () {
                    var self = this;
                    this.STEP1_STATE = 'page.createTeacherPage.basicInfo';
                    this.STEP3_STATE = 'page.createTeacherPage.language';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.location.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(2, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.countryObject = { code: '', value: '' };
                    this.form = {
                        countryLocation: '',
                        cityLocation: '',
                        stateLocation: '',
                        addressLocation: '',
                        zipCodeLocation: '',
                        positionLocation: new app.models.user.Position()
                    };
                    this.listCountries = this.getDataFromJson.getCountryi18n();
                    this.mapConfig = self.functionsUtilService.buildMapConfig(null, 'drag-maker-map', null, null);
                    this.validate = {
                        countryLocation: { valid: true, message: '' },
                        cityLocation: { valid: true, message: '' },
                        stateLocation: { valid: true, message: '' },
                        addressLocation: { valid: true, message: '' },
                        zipCodeLocation: { valid: true, message: '' },
                        positionLocation: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherLocationSectionController.prototype.activate = function () {
                    console.log('TeacherLocationSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherLocationSectionController.prototype.goToNext = function () {
                    var CURRENT_STEP = 2;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Data', CURRENT_STEP);
                        this.$state.go(this.STEP3_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherLocationSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP1_STATE, { reload: true });
                };
                TeacherLocationSectionController.prototype._fillForm = function (data) {
                    this.form.addressLocation = data.Location.Address;
                    this.form.cityLocation = data.Location.City;
                    this.form.stateLocation = data.Location.State;
                    this.form.zipCodeLocation = data.Location.ZipCode;
                    this.countryObject.code = data.Location.Country;
                    this.form.positionLocation = new app.models.user.Position(data.Location.Position);
                    this.mapConfig = this.functionsUtilService.buildMapConfig([
                        {
                            id: this.form.positionLocation.Id,
                            location: {
                                position: {
                                    lat: parseFloat(this.form.positionLocation.Lat),
                                    lng: parseFloat(this.form.positionLocation.Lng)
                                }
                            }
                        }
                    ], 'drag-maker-map', { lat: parseFloat(this.form.positionLocation.Lat), lng: parseFloat(this.form.positionLocation.Lng) }, null);
                    this.$scope.$broadcast('BuildMarkers', this.mapConfig);
                };
                TeacherLocationSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var NUMBER_ENUM = 4;
                    var formValid = true;
                    var country_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.countryLocation = this.functionsUtilService.validator(this.countryObject.code, country_rules);
                    if (!this.validate.countryLocation.valid) {
                        formValid = this.validate.countryLocation.valid;
                    }
                    var city_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.cityLocation = this.functionsUtilService.validator(this.form.cityLocation, city_rules);
                    if (!this.validate.cityLocation.valid) {
                        formValid = this.validate.cityLocation.valid;
                    }
                    var state_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.stateLocation = this.functionsUtilService.validator(this.form.stateLocation, state_rules);
                    if (!this.validate.stateLocation.valid) {
                        formValid = this.validate.stateLocation.valid;
                    }
                    var address_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.addressLocation = this.functionsUtilService.validator(this.form.addressLocation, address_rules);
                    if (!this.validate.addressLocation.valid) {
                        formValid = this.validate.addressLocation.valid;
                    }
                    var position_rules = [NULL_ENUM, EMPTY_ENUM];
                    var latValidate = this.functionsUtilService.validator(this.form.positionLocation.Lat, position_rules);
                    var lngValidate = this.functionsUtilService.validator(this.form.positionLocation.Lng, position_rules);
                    if (!latValidate.valid || !lngValidate.valid) {
                        if (!latValidate.valid) {
                            this.validate.positionLocation = latValidate;
                            formValid = this.validate.positionLocation.valid;
                        }
                        else if (!lngValidate.valid) {
                            this.validate.positionLocation = lngValidate;
                            formValid = this.validate.positionLocation.valid;
                        }
                    }
                    return formValid;
                };
                TeacherLocationSectionController.prototype.changeHelpText = function (type) {
                    var COUNTRY_TITLE = this.$filter('translate')('%create.teacher.location.help_text.cntry.title.text');
                    var COUNTRY_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.cntry.description.text');
                    var CITY_TITLE = this.$filter('translate')('%create.teacher.location.help_text.city.title.text');
                    var CITY_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.city.description.text');
                    var STATE_TITLE = this.$filter('translate')('%create.teacher.location.help_text.state.title.text');
                    var STATE_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.state.description.text');
                    var ADDRESS_TITLE = this.$filter('translate')('%create.teacher.location.help_text.address.title.text');
                    var ADDRESS_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.address.description.text');
                    var ZIP_CODE_TITLE = this.$filter('translate')('%create.teacher.location.help_text.zip_code.title.text');
                    var ZIP_CODE_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.zip_code.description.text');
                    var POSITION_TITLE = this.$filter('translate')('%create.teacher.location.help_text.position.title.text');
                    var POSITION_DESCRIPTION = this.$filter('translate')('%create.teacher.location.help_text.position.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'country':
                            this.helpText.title = COUNTRY_TITLE;
                            this.helpText.description = COUNTRY_DESCRIPTION;
                            break;
                        case 'city':
                            this.helpText.title = CITY_TITLE;
                            this.helpText.description = CITY_DESCRIPTION;
                            break;
                        case 'state':
                            this.helpText.title = STATE_TITLE;
                            this.helpText.description = STATE_DESCRIPTION;
                            break;
                        case 'address':
                            this.helpText.title = ADDRESS_TITLE;
                            this.helpText.description = ADDRESS_DESCRIPTION;
                            break;
                        case 'zipCode':
                            this.helpText.title = ZIP_CODE_TITLE;
                            this.helpText.description = ZIP_CODE_DESCRIPTION;
                            break;
                        case 'position':
                            this.helpText.title = POSITION_TITLE;
                            this.helpText.description = POSITION_DESCRIPTION;
                            break;
                    }
                };
                TeacherLocationSectionController.prototype.changeMapPosition = function () {
                    var self = this;
                    var countryCode = this.countryObject.code;
                    this.form.countryLocation = countryCode;
                    var location = {
                        country: this.form.countryLocation,
                        city: this.form.cityLocation,
                        address: this.form.addressLocation
                    };
                    this.$timeout(function () {
                        self.$scope.$broadcast('CodeAddress', location);
                    });
                };
                TeacherLocationSectionController.prototype._setDataModelFromForm = function () {
                    var countryCode = this.countryObject.code;
                    this.form.countryLocation = countryCode;
                    this.$rootScope.teacherData.Location.Country = this.form.countryLocation;
                    this.$rootScope.teacherData.Location.Address = this.form.addressLocation;
                    this.$rootScope.teacherData.Location.City = this.form.cityLocation;
                    this.$rootScope.teacherData.Location.State = this.form.stateLocation;
                    this.$rootScope.teacherData.Location.ZipCode = this.form.zipCodeLocation;
                    this.$rootScope.teacherData.Location.Position = this.form.positionLocation;
                    this.changeMapPosition();
                };
                TeacherLocationSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                    this.$scope.$on('Position', function (event, args) {
                        self.form.positionLocation.Lng = args.lng;
                        self.form.positionLocation.Lat = args.lat;
                    });
                };
                return TeacherLocationSectionController;
            }());
            TeacherLocationSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherLocationSectionController';
            TeacherLocationSectionController.$inject = [
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope',
                '$timeout'
            ];
            createTeacherPage.TeacherLocationSectionController = TeacherLocationSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherLocationSectionController.controllerId, TeacherLocationSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherLocationSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.language', {
            url: '/language',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherLanguageSection/teacherLanguageSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherLanguageSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherLanguageSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherLanguageSectionController = (function () {
                function TeacherLanguageSectionController(dataConfig, functionsUtil, getDataFromJson, $state, $filter, $scope, $rootScope, $timeout, $uibModal) {
                    this.dataConfig = dataConfig;
                    this.functionsUtil = functionsUtil;
                    this.getDataFromJson = getDataFromJson;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$timeout = $timeout;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                TeacherLanguageSectionController.prototype._init = function () {
                    var self = this;
                    this.STEP2_STATE = 'page.createTeacherPage.location';
                    this.STEP4_STATE = 'page.createTeacherPage.experience';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.lang.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.lang.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtil.progress(3, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        native: [],
                        learn: [],
                        teach: []
                    };
                    this.validate = {
                        native: { valid: true, message: '' },
                        teach: { valid: true, message: '' },
                        learn: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherLanguageSectionController.prototype.activate = function () {
                    console.log('TeacherLanguageSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherLanguageSectionController.prototype.goToNext = function () {
                    var CURRENT_STEP = 3;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Data', CURRENT_STEP);
                        this.$state.go(this.STEP4_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherLanguageSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP2_STATE, { reload: true });
                };
                TeacherLanguageSectionController.prototype._fillForm = function (data) {
                    if (this.form.native.length === 0) {
                        var languageArray = this.getDataFromJson.getLanguagei18n();
                        for (var i = 0; i < languageArray.length; i++) {
                            if (data.Languages.Native) {
                                for (var j = 0; j < data.Languages.Native.length; j++) {
                                    if (data.Languages.Native[j] == languageArray[i].code) {
                                        var obj = { key: null, value: '' };
                                        obj.key = parseInt(languageArray[i].code);
                                        obj.value = languageArray[i].value;
                                        if (this.form.native == null) {
                                            this.form.native = [];
                                            this.form.native.push(obj);
                                        }
                                        else {
                                            this.form.native.push(obj);
                                        }
                                    }
                                }
                            }
                            if (data.Languages.Learn) {
                                for (var j = 0; j < data.Languages.Learn.length; j++) {
                                    if (data.Languages.Learn[j] == languageArray[i].code) {
                                        var obj = { key: null, value: '' };
                                        obj.key = parseInt(languageArray[i].code);
                                        obj.value = languageArray[i].value;
                                        if (this.form.learn == null) {
                                            this.form.learn = [];
                                            this.form.learn.push(obj);
                                        }
                                        else {
                                            this.form.learn.push(obj);
                                        }
                                    }
                                }
                            }
                            if (data.Languages.Teach) {
                                for (var j = 0; j < data.Languages.Teach.length; j++) {
                                    if (data.Languages.Teach[j] == languageArray[i].code) {
                                        var obj = { key: null, value: '' };
                                        obj.key = parseInt(languageArray[i].code);
                                        obj.value = languageArray[i].value;
                                        if (this.form.teach == null) {
                                            this.form.teach = [];
                                            this.form.teach.push(obj);
                                        }
                                        else {
                                            this.form.teach.push(obj);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                TeacherLanguageSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var native_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.native = this.functionsUtil.validator(this.form.native, native_rules);
                    if (!this.validate.native.valid) {
                        formValid = this.validate.native.valid;
                    }
                    var learn_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.learn = this.functionsUtil.validator(this.form.learn, learn_rules);
                    if (!this.validate.learn.valid) {
                        formValid = this.validate.learn.valid;
                    }
                    var teach_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.teach = this.functionsUtil.validator(this.form.teach, teach_rules);
                    if (!this.validate.teach.valid) {
                        formValid = this.validate.teach.valid;
                    }
                    return formValid;
                };
                TeacherLanguageSectionController.prototype.changeHelpText = function (type) {
                    var NATIVE_TITLE = this.$filter('translate')('%create.teacher.lang.help_text.native.title.text');
                    var NATIVE_DESCRIPTION = this.$filter('translate')('%create.teacher.lang.help_text.native.description.text');
                    var LEARN_TITLE = this.$filter('translate')('%create.teacher.lang.help_text.learn.title.text');
                    var LEARN_DESCRIPTION = this.$filter('translate')('%create.teacher.lang.help_text.learn.description.text');
                    var TEACH_TITLE = this.$filter('translate')('%create.teacher.lang.help_text.teach.title.text');
                    var TEACH_DESCRIPTION = this.$filter('translate')('%create.teacher.lang.help_text.teach.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'native':
                            this.helpText.title = NATIVE_TITLE;
                            this.helpText.description = NATIVE_DESCRIPTION;
                            break;
                        case 'learn':
                            this.helpText.title = LEARN_TITLE;
                            this.helpText.description = LEARN_DESCRIPTION;
                            break;
                        case 'teach':
                            this.helpText.title = TEACH_TITLE;
                            this.helpText.description = TEACH_DESCRIPTION;
                            break;
                    }
                };
                TeacherLanguageSectionController.prototype._addNewLanguages = function (type, $event) {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalLanguagesTmpl,
                        controller: 'mainApp.components.modal.ModalLanguageController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    type: type,
                                    list: self.form[type]
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newLanguagesList) {
                        self.form[type] = newLanguagesList;
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    $event.preventDefault();
                };
                TeacherLanguageSectionController.prototype._removeLanguage = function (key, type) {
                    var newArray = this.form[type].filter(function (el) {
                        return el.key !== key;
                    });
                    this.form[type] = newArray;
                };
                TeacherLanguageSectionController.prototype._setDataModelFromForm = function () {
                    if (this.form.native) {
                        var native = [];
                        for (var i = 0; i < this.form.native.length; i++) {
                            native.push(this.form.native[i].key);
                        }
                        this.$rootScope.teacherData.Languages.Native = native;
                    }
                    if (this.form.learn) {
                        var learn = [];
                        for (var i = 0; i < this.form.learn.length; i++) {
                            learn.push(this.form.learn[i].key);
                        }
                        this.$rootScope.teacherData.Languages.Learn = learn;
                    }
                    if (this.form.teach) {
                        var teach = [];
                        for (var i = 0; i < this.form.teach.length; i++) {
                            teach.push(this.form.teach[i].key);
                        }
                        this.$rootScope.teacherData.Languages.Teach = teach;
                    }
                };
                TeacherLanguageSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherLanguageSectionController;
            }());
            TeacherLanguageSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherLanguageSectionController';
            TeacherLanguageSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.util.GetDataStaticJsonService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope',
                '$timeout',
                '$uibModal'
            ];
            createTeacherPage.TeacherLanguageSectionController = TeacherLanguageSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherLanguageSectionController.controllerId, TeacherLanguageSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherLanguageSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.experience', {
            url: '/experience',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherExperienceSection/teacherExperienceSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherExperienceSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherExperienceSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherExperienceSectionController = (function () {
                function TeacherExperienceSectionController(dataConfig, getDataFromJson, functionsUtilService, $state, $filter, $scope, $rootScope, $uibModal) {
                    this.dataConfig = dataConfig;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                TeacherExperienceSectionController.prototype._init = function () {
                    this.STEP3_STATE = 'page.createTeacherPage.language';
                    this.STEP5_STATE = 'page.createTeacherPage.method';
                    this.STEP_ALTER_STATE = 'page.createTeacherPage.education';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.experience.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.experience.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(4, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        type: 'H',
                        experiences: []
                    };
                    var currentYear = parseInt(this.dataConfig.currentYear);
                    this.listYears = this.functionsUtilService.buildNumberSelectList(1957, currentYear);
                    this.yearObject = { value: '' };
                    this._hobbyChecked = { type: 'H', checked: true };
                    this._professionalChecked = { type: 'P', checked: false };
                    this.validate = {
                        type: { valid: true, message: '' },
                        teacherSince: { valid: true, message: '' },
                        experiences: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherExperienceSectionController.prototype.activate = function () {
                    console.log('TeacherExperienceSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherExperienceSectionController.prototype.goToNext = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Data');
                        if (this.form.type === 'P') {
                            this.$state.go(this.STEP_ALTER_STATE, { reload: true });
                        }
                        else {
                            this.$state.go(this.STEP5_STATE, { reload: true });
                        }
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherExperienceSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP3_STATE, { reload: true });
                };
                TeacherExperienceSectionController.prototype._checkType = function (key) {
                    var type = key.type;
                    if (type === 'H') {
                        this._professionalChecked.checked = false;
                        this._hobbyChecked.checked = true;
                        this.form.type = this._hobbyChecked.type;
                    }
                    else {
                        this._professionalChecked.checked = true;
                        this._hobbyChecked.checked = false;
                        this.form.type = this._professionalChecked.type;
                    }
                };
                TeacherExperienceSectionController.prototype._fillForm = function (data) {
                    this.form.type = data.Type || 'H';
                    if (this.form.type === 'H') {
                        this._professionalChecked.checked = false;
                        this._hobbyChecked.checked = true;
                    }
                    else {
                        this._professionalChecked.checked = true;
                        this._hobbyChecked.checked = false;
                    }
                    this.yearObject.value = data.TeacherSince;
                    this.form.experiences = data.Experiences;
                };
                TeacherExperienceSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var teacher_since_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.teacherSince = this.functionsUtilService.validator(this.yearObject.value, teacher_since_rules);
                    if (!this.validate.teacherSince.valid) {
                        formValid = this.validate.teacherSince.valid;
                    }
                    return formValid;
                };
                TeacherExperienceSectionController.prototype.changeHelpText = function (type) {
                    var TYPE_HOBBY_TITLE = this.$filter('translate')('%global.teacher.type.hobby.text');
                    var TYPE_HOBBY_DESCRIPTION = this.$filter('translate')('%create.teacher.experience.help_text.type.hobby.description.text');
                    var TYPE_PROFESSIONAL_TITLE = this.$filter('translate')('%global.teacher.type.professional.text');
                    var TYPE_PROFESSIONAL_DESCRIPTION = this.$filter('translate')('%create.teacher.experience.help_text.type.professional.description.text');
                    var SINCE_TITLE = this.$filter('translate')('%create.teacher.experience.help_text.teacher_since.title.text');
                    var SINCE_DESCRIPTION = this.$filter('translate')('%create.teacher.experience.help_text.teacher_since.description.text');
                    var EXPERIENCES_TITLE = this.$filter('translate')('%create.teacher.experience.help_text.experiences.title.text');
                    var EXPERIENCES_DESCRIPTION = this.$filter('translate')('%create.teacher.experience.help_text.experiences.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'hobby':
                            this.helpText.title = TYPE_HOBBY_TITLE;
                            this.helpText.description = TYPE_HOBBY_DESCRIPTION;
                            break;
                        case 'professional':
                            this.helpText.title = TYPE_PROFESSIONAL_TITLE;
                            this.helpText.description = TYPE_PROFESSIONAL_DESCRIPTION;
                            break;
                        case 'teacherSince':
                            this.helpText.title = SINCE_TITLE;
                            this.helpText.description = SINCE_DESCRIPTION;
                            break;
                        case 'experiences':
                            this.helpText.title = EXPERIENCES_TITLE;
                            this.helpText.description = EXPERIENCES_DESCRIPTION;
                            break;
                    }
                };
                TeacherExperienceSectionController.prototype._addEditExperience = function (index, $event) {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalExperienceTmpl,
                        controller: 'mainApp.components.modal.ModalExperienceController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    experience: self.form.experiences[index],
                                    teacherId: self.$rootScope.teacherData.Id
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newExperience) {
                        if (newExperience) {
                            self.form.experiences.push(newExperience);
                        }
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    $event.preventDefault();
                };
                TeacherExperienceSectionController.prototype._setDataModelFromForm = function () {
                    this.$rootScope.teacherData.Type = this.form.type;
                    this.$rootScope.teacherData.TeacherSince = this.yearObject.value;
                };
                TeacherExperienceSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherExperienceSectionController;
            }());
            TeacherExperienceSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherExperienceSectionController';
            TeacherExperienceSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope',
                '$uibModal'
            ];
            createTeacherPage.TeacherExperienceSectionController = TeacherExperienceSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherExperienceSectionController.controllerId, TeacherExperienceSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherExperienceSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.education', {
            url: '/education',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherEducationSection/teacherEducationSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherEducationSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherEducationSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherEducationSectionController = (function () {
                function TeacherEducationSectionController(dataConfig, getDataFromJson, functionsUtilService, $state, $filter, $scope, $rootScope, $uibModal) {
                    this.dataConfig = dataConfig;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$uibModal = $uibModal;
                    this._init();
                }
                TeacherEducationSectionController.prototype._init = function () {
                    this.STEP4_STATE = 'page.createTeacherPage.experience';
                    this.STEP6_STATE = 'page.createTeacherPage.method';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.education.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.education.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(5, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        educations: [],
                        certificates: []
                    };
                    this.validate = {
                        educations: { valid: true, message: '' },
                        certificates: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherEducationSectionController.prototype.activate = function () {
                    console.log('TeacherEducationSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherEducationSectionController.prototype.goToNext = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.$scope.$emit('Save Data');
                        this.$state.go(this.STEP6_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherEducationSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP4_STATE, { reload: true });
                };
                TeacherEducationSectionController.prototype._fillForm = function (data) {
                    this.form.educations = data.Educations;
                    this.form.certificates = data.Certificates;
                };
                TeacherEducationSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var GLOBAL_MESSAGE = this.$filter('translate')('%create.teacher.education.validation.message.text');
                    var formValid = true;
                    var education_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.educations = this.functionsUtilService.validator(this.form.educations, education_rules);
                    var certificates_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.certificates = this.functionsUtilService.validator(this.form.certificates, certificates_rules);
                    if (this.validate.educations.valid) {
                        this.validate.globalValidate.valid = true;
                        this.validate.globalValidate.message = '';
                    }
                    else if (this.validate.certificates.valid) {
                        this.validate.globalValidate.valid = true;
                        this.validate.globalValidate.message = '';
                    }
                    else {
                        this.validate.globalValidate.valid = false;
                        this.validate.globalValidate.message = GLOBAL_MESSAGE;
                        formValid = this.validate.globalValidate.valid;
                    }
                    return formValid;
                };
                TeacherEducationSectionController.prototype.changeHelpText = function (type) {
                    var EDUCATIONS_TITLE = this.$filter('translate')('%create.teacher.education.help_text.educations.title.text');
                    var EDUCATIONS_DESCRIPTION = this.$filter('translate')('%create.teacher.education.help_text.educations.description.text');
                    var CERTIFICATES_TITLE = this.$filter('translate')('%create.teacher.education.help_text.certificates.title.text');
                    var CERTIFICATES_DESCRIPTION = this.$filter('translate')('%create.teacher.education.help_text.certificates.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'educations':
                            this.helpText.title = EDUCATIONS_TITLE;
                            this.helpText.description = EDUCATIONS_DESCRIPTION;
                            break;
                        case 'certificates':
                            this.helpText.title = CERTIFICATES_TITLE;
                            this.helpText.description = CERTIFICATES_DESCRIPTION;
                            break;
                    }
                };
                TeacherEducationSectionController.prototype._addEditEducation = function (index, $event) {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalEducationTmpl,
                        controller: 'mainApp.components.modal.ModalEducationController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    education: self.form.educations[index],
                                    teacherId: self.$rootScope.teacherData.Id
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newEducation) {
                        if (newEducation) {
                            self.form.educations.push(newEducation);
                        }
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    $event.preventDefault();
                };
                TeacherEducationSectionController.prototype._addEditCertificate = function (index, $event) {
                    var self = this;
                    var options = {
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: this.dataConfig.modalCertificateTmpl,
                        controller: 'mainApp.components.modal.ModalCertificateController as vm',
                        resolve: {
                            dataSetModal: function () {
                                return {
                                    certificate: self.form.certificates[index],
                                    teacherId: self.$rootScope.teacherData.Id
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(options);
                    modalInstance.result.then(function (newCertificate) {
                        if (newCertificate) {
                            self.form.certificates.push(newCertificate);
                        }
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                    $event.preventDefault();
                };
                TeacherEducationSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherEducationSectionController;
            }());
            TeacherEducationSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherEducationSectionController';
            TeacherEducationSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope',
                '$uibModal'
            ];
            createTeacherPage.TeacherEducationSectionController = TeacherEducationSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherEducationSectionController.controllerId, TeacherEducationSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherEducationSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.method', {
            url: '/method',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherMethodSection/teacherMethodSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherMethodSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherMethodSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherMethodSectionController = (function () {
                function TeacherMethodSectionController(dataConfig, getDataFromJson, functionsUtilService, $state, $filter, $scope, $rootScope) {
                    this.dataConfig = dataConfig;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this._init();
                }
                TeacherMethodSectionController.prototype._init = function () {
                    this.step5State = '';
                    this.STEP7_STATE = 'page.createTeacherPage.price';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.method.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.method.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(6, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        methodology: '',
                        immersion: new app.models.teacher.Immersion
                    };
                    this.typeOfImmersionList = this.getDataFromJson.getTypeOfImmersioni18n();
                    this.typeOfImmersionOptionBox = [];
                    this.validate = {
                        methodology: { valid: true, message: '' },
                        immersionActive: { valid: true, message: '' },
                        typeOfImmersionList: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherMethodSectionController.prototype.activate = function () {
                    console.log('TeacherMethodSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherMethodSectionController.prototype.changeStatus = function () {
                    this.form.immersion.Active = !this.form.immersion.Active;
                };
                TeacherMethodSectionController.prototype.goToNext = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Data');
                        this.$state.go(this.STEP7_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherMethodSectionController.prototype.goToBack = function () {
                    this.$state.go(this.step5State, { reload: true });
                };
                TeacherMethodSectionController.prototype._fillForm = function (data) {
                    if (data.Type === 'P') {
                        this.step5State = 'page.createTeacherPage.education';
                    }
                    else {
                        this.step5State = 'page.createTeacherPage.experience';
                    }
                    this.form.methodology = data.Methodology;
                    this.form.immersion = data.Immersion;
                    if (this.form.immersion.Active) {
                        if (this.typeOfImmersionOptionBox.length === 0) {
                            var immersionArray = this.getDataFromJson.getTypeOfImmersioni18n();
                            var newArray = [];
                            for (var i = 0; i < immersionArray.length; i++) {
                                for (var j = 0; j < this.form.immersion.Category.length; j++) {
                                    if (this.form.immersion.Category[j] === immersionArray[i].code) {
                                        var obj = { key: null, value: '' };
                                        obj.key = immersionArray[i].code;
                                        obj.value = immersionArray[i].value;
                                        this._disableEnableOption(true, obj.key);
                                        this.typeOfImmersionOptionBox.push(obj);
                                    }
                                }
                            }
                        }
                    }
                };
                TeacherMethodSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var formValid = true;
                    var methodology_rules = [NULL_ENUM, EMPTY_ENUM];
                    this.validate.methodology = this.functionsUtilService.validator(this.form.methodology, methodology_rules);
                    if (!this.validate.methodology.valid) {
                        formValid = this.validate.methodology.valid;
                    }
                    if (this.form.immersion.Active) {
                        var typeOfImmersion_rules = [NULL_ENUM, EMPTY_ENUM];
                        this.validate.typeOfImmersionList = this.functionsUtilService.validator(this.form.immersion.Category, typeOfImmersion_rules);
                        if (!this.validate.typeOfImmersionList.valid) {
                            formValid = this.validate.typeOfImmersionList.valid;
                        }
                    }
                    return formValid;
                };
                TeacherMethodSectionController.prototype.changeHelpText = function (type) {
                    var METHODOLOGY_TITLE = this.$filter('translate')('%create.teacher.method.help_text.methodology.title.text');
                    var METHODOLOGY_DESCRIPTION = this.$filter('translate')('%create.teacher.method.help_text.methodology.description.text');
                    var IMMERSION_TITLE = this.$filter('translate')('%create.teacher.method.help_text.imm.title.text');
                    var IMMERSION_DESCRIPTION = this.$filter('translate')('%create.teacher.method.help_text.imm.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'methodology':
                            this.helpText.title = METHODOLOGY_TITLE;
                            this.helpText.description = METHODOLOGY_DESCRIPTION;
                            break;
                        case 'immersion':
                            this.helpText.title = IMMERSION_TITLE;
                            this.helpText.description = IMMERSION_DESCRIPTION;
                            break;
                    }
                };
                TeacherMethodSectionController.prototype._addNewImmersion = function () {
                    var self = this;
                    this._disableEnableOption(true, this.typeObject.code);
                    this.typeOfImmersionOptionBox.push({ key: this.typeObject.code, value: this.typeObject.value });
                    this.form.immersion.Category = [];
                    for (var i = 0; i < this.typeOfImmersionOptionBox.length; i++) {
                        this.form.immersion.Category.push(this.typeOfImmersionOptionBox[i].key);
                    }
                    event.preventDefault();
                };
                TeacherMethodSectionController.prototype._removeImmersion = function (key) {
                    this._disableEnableOption(false, key);
                    var newArray = this.typeOfImmersionOptionBox.filter(function (el) {
                        return el.key !== key;
                    });
                    this.typeOfImmersionOptionBox = newArray;
                    this.form.immersion.Category = [];
                    for (var i = 0; i < this.typeOfImmersionOptionBox.length; i++) {
                        this.form.immersion.Category.push(this.typeOfImmersionOptionBox[i].key);
                    }
                };
                TeacherMethodSectionController.prototype._setDataModelFromForm = function () {
                    var immersionOptions = this.typeOfImmersionOptionBox;
                    this.$rootScope.teacherData.Methodology = this.form.methodology;
                    this.$rootScope.teacherData.Immersion = this.form.immersion;
                    this.$rootScope.teacherData.Immersion.Category = this.form.immersion.Category;
                };
                TeacherMethodSectionController.prototype._disableEnableOption = function (action, key) {
                    for (var i = 0; i < this.typeOfImmersionList.length; i++) {
                        if (this.typeOfImmersionList[i].code === key) {
                            this.typeOfImmersionList[i].disabled = action;
                        }
                    }
                };
                TeacherMethodSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherMethodSectionController;
            }());
            TeacherMethodSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherMethodSectionController';
            TeacherMethodSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope'
            ];
            createTeacherPage.TeacherMethodSectionController = TeacherMethodSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherMethodSectionController.controllerId, TeacherMethodSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherMethodSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.price', {
            url: '/price',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherPriceSection/teacherPriceSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherPriceSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherPriceSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherPriceSectionController = (function () {
                function TeacherPriceSectionController(dataConfig, getDataFromJson, functionsUtilService, $state, $filter, $scope, $rootScope) {
                    this.dataConfig = dataConfig;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this._init();
                }
                TeacherPriceSectionController.prototype._init = function () {
                    this.STEP6_STATE = 'page.createTeacherPage.method';
                    this.STEP8_STATE = 'page.createTeacherPage.photo';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.price.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.price.help_text.description.text');
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(7, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        privateClass: new app.models.teacher.TypeOfPrice,
                        groupClass: new app.models.teacher.TypeOfPrice
                    };
                    this.validate = {
                        privateClassPrice: { valid: true, message: '' },
                        privateClassActive: { valid: true, message: '' },
                        groupClassPrice: { valid: true, message: '' },
                        groupClassActive: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherPriceSectionController.prototype.activate = function () {
                    console.log('TeacherPriceSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.teacherData) {
                        this._fillForm(this.$rootScope.teacherData);
                    }
                };
                TeacherPriceSectionController.prototype.changeStatus = function (type) {
                    this.form[type].Active = !this.form[type].Active;
                };
                TeacherPriceSectionController.prototype.goToNext = function () {
                    var formValid = this._validateForm();
                    if (formValid) {
                        this._setDataModelFromForm();
                        this.$scope.$emit('Save Data');
                        this.$state.go(this.STEP8_STATE, { reload: true });
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherPriceSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP6_STATE, { reload: true });
                };
                TeacherPriceSectionController.prototype._fillForm = function (data) {
                    this.form.privateClass = data.Price.PrivateClass;
                    this.form.groupClass = data.Price.GroupClass;
                };
                TeacherPriceSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var IS_NOT_ZERO_ENUM = 5;
                    var EMPTY_ENUM = 3;
                    var TRUE_ENUM = 7;
                    var GLOBAL_MESSAGE = this.$filter('translate')('%create.teacher.price.validation.message.text');
                    var formValid = true;
                    if (this.form.privateClass.Active) {
                        var privateClassPrice_rules = [NULL_ENUM, EMPTY_ENUM, IS_NOT_ZERO_ENUM];
                        this.validate.privateClassPrice = this.functionsUtilService.validator(this.form.privateClass.HourPrice, privateClassPrice_rules);
                        if (!this.validate.privateClassPrice.valid) {
                            formValid = this.validate.privateClassPrice.valid;
                        }
                    }
                    if (this.form.groupClass.Active) {
                        var groupClassPrice_rules = [NULL_ENUM, EMPTY_ENUM, IS_NOT_ZERO_ENUM];
                        this.validate.groupClassPrice = this.functionsUtilService.validator(this.form.groupClass.HourPrice, groupClassPrice_rules);
                        if (!this.validate.groupClassPrice.valid) {
                            formValid = this.validate.groupClassPrice.valid;
                        }
                    }
                    var privateClassActive_rules = [TRUE_ENUM];
                    this.validate.privateClassActive = this.functionsUtilService.validator(this.form.privateClass.Active, privateClassActive_rules);
                    var groupClassActive_rules = [TRUE_ENUM];
                    this.validate.groupClassActive = this.functionsUtilService.validator(this.form.groupClass.Active, groupClassActive_rules);
                    if (!this.validate.privateClassActive.valid && !this.validate.groupClassActive.valid) {
                        this.validate.globalValidate.valid = false;
                        this.validate.globalValidate.message = GLOBAL_MESSAGE;
                        formValid = this.validate.globalValidate.valid;
                    }
                    else {
                        this.validate.globalValidate.valid = true;
                        this.validate.globalValidate.message = '';
                    }
                    return formValid;
                };
                TeacherPriceSectionController.prototype.changeHelpText = function (type) {
                    var PRIVATE_CLASS_TITLE = this.$filter('translate')('%create.teacher.price.help_text.private_class.title.text');
                    var PRIVATE_CLASS_DESCRIPTION = this.$filter('translate')('%create.teacher.price.help_text.private_class.description.text');
                    var GROUP_CLASS_TITLE = this.$filter('translate')('%create.teacher.price.help_text.group_class.title.text');
                    var GROUP_CLASS_DESCRIPTION = this.$filter('translate')('%create.teacher.price.help_text.group_class.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'privateClass':
                            this.helpText.title = PRIVATE_CLASS_TITLE;
                            this.helpText.description = PRIVATE_CLASS_DESCRIPTION;
                            break;
                        case 'groupClass':
                            this.helpText.title = GROUP_CLASS_TITLE;
                            this.helpText.description = GROUP_CLASS_DESCRIPTION;
                            break;
                    }
                };
                TeacherPriceSectionController.prototype._setDataModelFromForm = function () {
                    this.$rootScope.teacherData.Price.PrivateClass = this.form.privateClass;
                    this.$rootScope.teacherData.Price.GroupClass = this.form.groupClass;
                };
                TeacherPriceSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherPriceSectionController;
            }());
            TeacherPriceSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherPriceSectionController';
            TeacherPriceSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$filter',
                '$scope',
                '$rootScope'
            ];
            createTeacherPage.TeacherPriceSectionController = TeacherPriceSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherPriceSectionController.controllerId, TeacherPriceSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherPriceSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.photo', {
            url: '/photo',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherPhotoSection/teacherPhotoSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherPhotoSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherPhotoSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherPhotoSectionController = (function () {
                function TeacherPhotoSectionController(dataConfig, getDataFromJson, functionsUtilService, S3UploadService, messageUtil, Upload, $state, $filter, $scope, $rootScope) {
                    this.dataConfig = dataConfig;
                    this.getDataFromJson = getDataFromJson;
                    this.functionsUtilService = functionsUtilService;
                    this.S3UploadService = S3UploadService;
                    this.messageUtil = messageUtil;
                    this.Upload = Upload;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this._init();
                }
                TeacherPhotoSectionController.prototype._init = function () {
                    this.STEP7_STATE = 'page.createTeacherPage.price';
                    this.FINAL_STEP_STATE = 'page.createTeacherPage.finish';
                    this.HELP_TEXT_TITLE = this.$filter('translate')('%create.teacher.photo.help_text.title.text');
                    this.HELP_TEXT_DESCRIPTION = this.$filter('translate')('%create.teacher.photo.help_text.description.text');
                    this.uploading = false;
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(8, 9);
                    this.helpText = {
                        title: this.HELP_TEXT_TITLE,
                        description: this.HELP_TEXT_DESCRIPTION
                    };
                    this.form = {
                        avatar: null,
                        croppedDataUrl: '',
                        thumbnail: ''
                    };
                    this.validate = {
                        avatar: { valid: true, message: '' },
                        thumbnail: { valid: true, message: '' },
                        globalValidate: { valid: true, message: '' }
                    };
                    this.activate();
                };
                TeacherPhotoSectionController.prototype.activate = function () {
                    DEBUG && console.log('TeacherPhotoSectionController controller actived');
                    this._subscribeToEvents();
                    if (this.$rootScope.profileData) {
                        this._fillForm(this.$rootScope.profileData);
                    }
                };
                TeacherPhotoSectionController.prototype.goToNext = function () {
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.uploading = true;
                        if (this.form.avatar) {
                            this._resizeImage().then(function (result) {
                                self.uploading = false;
                                if (result.Location) {
                                    self._setDataModelFromForm(result.Location);
                                    self.$scope.$emit('Save Profile Data');
                                    self.$state.go(self.FINAL_STEP_STATE, { reload: true });
                                }
                                else {
                                    self.messageUtil.error('');
                                }
                            });
                        }
                        else {
                            this.$scope.$emit('Save Profile Data');
                            this.$state.go(this.FINAL_STEP_STATE, { reload: true });
                        }
                    }
                    else {
                        window.scrollTo(0, 0);
                    }
                };
                TeacherPhotoSectionController.prototype.goToBack = function () {
                    this.$state.go(this.STEP7_STATE, { reload: true });
                };
                TeacherPhotoSectionController.prototype._fillForm = function (data) {
                    this.form.thumbnail = data.Avatar;
                };
                TeacherPhotoSectionController.prototype._validateForm = function () {
                    var NULL_ENUM = 2;
                    var EMPTY_ENUM = 3;
                    var DEFINED_ENUM = 6;
                    var PHOTO_MESSAGE = this.$filter('translate')('%create.teacher.photo.validation.message.text');
                    var formValid = true;
                    var avatar_rules = [NULL_ENUM, EMPTY_ENUM, DEFINED_ENUM];
                    this.validate.avatar = this.functionsUtilService.validator(this.form.avatar, avatar_rules);
                    var thumbnail_rules = [NULL_ENUM, EMPTY_ENUM, DEFINED_ENUM];
                    this.validate.thumbnail = this.functionsUtilService.validator(this.form.thumbnail, thumbnail_rules);
                    if (!this.validate.avatar.valid) {
                        if (!this.validate.thumbnail.valid) {
                            this.validate.globalValidate.valid = false;
                            this.validate.globalValidate.message = PHOTO_MESSAGE;
                            formValid = this.validate.globalValidate.valid;
                        }
                        else {
                            this.validate.globalValidate.valid = true;
                            this.validate.globalValidate.message = '';
                        }
                    }
                    return formValid;
                };
                TeacherPhotoSectionController.prototype.changeHelpText = function (type) {
                    var AVATAR_TITLE = this.$filter('translate')('%create.teacher.photo.help_text.avatar.title.text');
                    var AVATAR_DESCRIPTION = this.$filter('translate')('%create.teacher.photo.help_text.avatar.description.text');
                    switch (type) {
                        case 'default':
                            this.helpText.title = this.HELP_TEXT_TITLE;
                            this.helpText.description = this.HELP_TEXT_DESCRIPTION;
                            break;
                        case 'avatar':
                            this.helpText.title = AVATAR_TITLE;
                            this.helpText.description = AVATAR_DESCRIPTION;
                            break;
                    }
                };
                TeacherPhotoSectionController.prototype._resizeImage = function () {
                    var self = this;
                    var newName = app.core.util.functionsUtil.FunctionsUtilService.generateGuid() + '.jpeg';
                    var options = {
                        width: 250,
                        height: 250,
                        quality: 1.0,
                        type: 'image/jpeg',
                        pattern: '.jpg',
                        restoreExif: false
                    };
                    var file = this.Upload.dataUrltoBlob(this.form.croppedDataUrl, newName);
                    return this.Upload.resize(file, options).then(function (resizedFile) {
                        return self._uploadImage(resizedFile).then(function (result) {
                            return result;
                        });
                    });
                };
                TeacherPhotoSectionController.prototype._uploadImage = function (resizedFile) {
                    var self = this;
                    return this.S3UploadService.upload(resizedFile).then(function (result) {
                        return result;
                    }, function (error) {
                        console.log('error', error);
                        return error;
                    });
                };
                TeacherPhotoSectionController.prototype._setDataModelFromForm = function (avatar) {
                    this.$rootScope.profileData.Avatar = avatar;
                };
                TeacherPhotoSectionController.prototype._subscribeToEvents = function () {
                    var self = this;
                    this.$scope.$on('Fill User Profile Form', function (event, args) {
                        self._fillForm(args);
                    });
                };
                return TeacherPhotoSectionController;
            }());
            TeacherPhotoSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherPhotoSectionController';
            TeacherPhotoSectionController.$inject = [
                'dataConfig',
                'mainApp.core.util.GetDataStaticJsonService',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.core.s3Upload.S3UploadService',
                'mainApp.core.util.messageUtilService',
                'Upload',
                '$state',
                '$filter',
                '$scope',
                '$rootScope'
            ];
            createTeacherPage.TeacherPhotoSectionController = TeacherPhotoSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherPhotoSectionController.controllerId, TeacherPhotoSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherPhotoSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.createTeacherPage.finish', {
            url: '/finish',
            views: {
                'step': {
                    templateUrl: 'app/pages/createTeacherPage/teacherFinishSection/teacherFinishSection.html',
                    controller: 'mainApp.pages.createTeacherPage.TeacherFinishSectionController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();
//# sourceMappingURL=teacherFinishSection.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var createTeacherPage;
        (function (createTeacherPage) {
            var TeacherFinishSectionController = (function () {
                function TeacherFinishSectionController($scope, $rootScope, $state, dataConfig, functionsUtilService, localStorage) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.dataConfig = dataConfig;
                    this.functionsUtilService = functionsUtilService;
                    this.localStorage = localStorage;
                    this._init();
                }
                TeacherFinishSectionController.prototype._init = function () {
                    this.$scope.$parent.vm.progressWidth = this.functionsUtilService.progress(9, 9);
                    this.activate();
                };
                TeacherFinishSectionController.prototype.activate = function () {
                    console.log('TeacherFinishSectionController controller actived');
                    mixpanel.track("Enter: Finish Create Teacher Process");
                };
                TeacherFinishSectionController.prototype._finishProcess = function () {
                    this.localStorage.removeItem(this.dataConfig.earlyIdLocalStorage);
                    this.localStorage.removeItem(this.dataConfig.teacherDataLocalStorage);
                    mixpanel.track("Finish Process: Create Teacher", {
                        "id": this.$rootScope.teacherData.Id,
                        "name": this.$rootScope.profileData.FirstName + ' ' + this.$rootScope.profileData.LastName,
                        "email": this.$rootScope.profileData.Email
                    });
                    this.$state.go('page.landingPage');
                };
                return TeacherFinishSectionController;
            }());
            TeacherFinishSectionController.controllerId = 'mainApp.pages.createTeacherPage.TeacherFinishSectionController';
            TeacherFinishSectionController.$inject = [
                '$scope',
                '$rootScope',
                '$state',
                'dataConfig',
                'mainApp.core.util.FunctionsUtilService',
                'mainApp.localStorageService'
            ];
            createTeacherPage.TeacherFinishSectionController = TeacherFinishSectionController;
            angular
                .module('mainApp.pages.createTeacherPage')
                .controller(TeacherFinishSectionController.controllerId, TeacherFinishSectionController);
        })(createTeacherPage = pages.createTeacherPage || (pages.createTeacherPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherFinishSection.controller.js.map
(function () {
    'use strict';
    angular
        .module('mainApp.pages.teacherProfilePage', [])
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.teacherProfilePage', {
            url: '/teachers/show/:id',
            views: {
                'container': {
                    templateUrl: 'app/pages/teacherProfilePage/teacherProfilePage.html',
                    controller: 'mainApp.pages.teacherProfilePage.TeacherProfilePageController',
                    controllerAs: 'vm'
                }
            },
            parent: 'page',
            data: {
                requireLogin: false
            },
            params: {
                id: null
            },
            onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.activeHeader = true;
                    $rootScope.activeFooter = true;
                }]
        });
    }
})();
//# sourceMappingURL=teacherProfilePage.config.js.map
var app;
(function (app) {
    var pages;
    (function (pages) {
        var teacherProfilePage;
        (function (teacherProfilePage) {
            var TeacherProfilePageController = (function () {
                function TeacherProfilePageController(TeacherService, functionsUtil, $state, $stateParams, $filter) {
                    this.TeacherService = TeacherService;
                    this.functionsUtil = functionsUtil;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this._init();
                }
                TeacherProfilePageController.prototype._init = function () {
                    this.data = null;
                    this.loading = true;
                    this._initNativeTooltip();
                    this.activate();
                };
                TeacherProfilePageController.prototype.activate = function () {
                    var self = this;
                    console.log('teacherProfilePage controller actived');
                    mixpanel.track("Enter: Teacher Profile Details");
                    this.TeacherService.getTeacherById(this.$stateParams.id).then(function (response) {
                        self.data = new app.models.teacher.Teacher(response);
                        self.mapConfig = self.functionsUtil.buildMapConfig([
                            {
                                id: self.data.Location.Position.Id,
                                location: {
                                    position: {
                                        lat: parseFloat(self.data.Location.Position.Lat),
                                        lng: parseFloat(self.data.Location.Position.Lng)
                                    }
                                }
                            }
                        ], 'location-circle-map', { lat: parseFloat(self.data.Location.Position.Lat), lng: parseFloat(self.data.Location.Position.Lng) }, null);
                        self.loading = false;
                    });
                };
                TeacherProfilePageController.prototype._initNativeTooltip = function () {
                    this.nativeTooltipOptions = {
                        placement: 'top',
                        animation: false,
                        class: 'ma-tooltip ma-tooltip--primary ma-tooltip--default'
                    };
                };
                TeacherProfilePageController.prototype.goToConfirm = function () {
                    mixpanel.track("Click on book a class", {
                        "teacher_id": this.data.Id,
                        "teacher_name": this.data.FirstName + ' ' + this.data.LastName
                    });
                    var url = 'https://waysily.typeform.com/to/NDPRAb';
                    window.open(url, '_blank');
                };
                TeacherProfilePageController.prototype._assignNative = function (language) {
                    var native = this.data.Languages.Native;
                    var isNativeOfThisLanguage = false;
                    for (var i = 0; i < native.length; i++) {
                        if (language === native[i]) {
                            isNativeOfThisLanguage = true;
                            break;
                        }
                    }
                    return isNativeOfThisLanguage;
                };
                TeacherProfilePageController.prototype._assignNativeTooltip = function (language) {
                    var TOOLTIP_TEXT = this.$filter('translate')('%profile.teacher.native.lang.tooltip.text');
                    var firstName = this.data.FirstName;
                    var tooltipText = null;
                    var isNative = this._assignNative(language);
                    if (isNative) {
                        tooltipText = firstName + ' ' + TOOLTIP_TEXT;
                    }
                    return tooltipText;
                };
                TeacherProfilePageController.prototype._ratingTotalAverage = function (ratingsArr) {
                    return this.functionsUtil.teacherRatingAverage(ratingsArr);
                };
                TeacherProfilePageController.prototype._ratingUnitAverage = function (ratingsArr, type) {
                    var average = 0;
                    var averageArr = [];
                    var ratings = [];
                    for (var i = 0; i < ratingsArr.length; i++) {
                        ratings.push(new app.models.teacher.Rating(ratingsArr[i]));
                        switch (type) {
                            case 'methodology':
                                averageArr.push(ratings[i].MethodologyValue);
                                break;
                            case 'communication':
                                averageArr.push(ratings[i].CommunicationValue);
                                break;
                            case 'teaching':
                                averageArr.push(ratings[i].TeachingValue);
                                break;
                        }
                    }
                    average = this.functionsUtil.averageNumbersArray(averageArr);
                    return average;
                };
                return TeacherProfilePageController;
            }());
            TeacherProfilePageController.controllerId = 'mainApp.pages.teacherProfilePage.TeacherProfilePageController';
            TeacherProfilePageController.$inject = [
                'mainApp.models.teacher.TeacherService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$stateParams',
                '$filter'
            ];
            teacherProfilePage.TeacherProfilePageController = TeacherProfilePageController;
            angular
                .module('mainApp.pages.teacherProfilePage')
                .controller(TeacherProfilePageController.controllerId, TeacherProfilePageController);
        })(teacherProfilePage = pages.teacherProfilePage || (pages.teacherProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=teacherProfilePage.controller.js.map