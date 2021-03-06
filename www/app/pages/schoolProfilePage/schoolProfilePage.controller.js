var app;
(function (app) {
    var pages;
    (function (pages) {
        var schoolProfilePage;
        (function (schoolProfilePage) {
            var SchoolProfilePageController = (function () {
                function SchoolProfilePageController(SchoolService, functionsUtil, $state, $stateParams, $filter) {
                    this.SchoolService = SchoolService;
                    this.functionsUtil = functionsUtil;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$filter = $filter;
                    this._init();
                }
                SchoolProfilePageController.prototype._init = function () {
                    this.data = new app.models.school.School();
                    this.loading = true;
                    this.activate();
                };
                SchoolProfilePageController.prototype.activate = function () {
                    var ENTER_MIXPANEL = 'Enter: School Profile Page';
                    var self = this;
                    console.log('schoolProfilePage controller actived');
                    mixpanel.track(ENTER_MIXPANEL);
                    this.SchoolService.getSchoolById(this.$stateParams.id).then(function (response) {
                        self.data = new app.models.school.School(response);
                        self.loading = false;
                    });
                };
                SchoolProfilePageController.prototype.goToSite = function (url) {
                    var EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
                    if (EMAIL_REGEX.test(url)) {
                        url = 'mailto:' + url;
                        window.open(url);
                    }
                    if (url) {
                        window.open(url, '_blank');
                    }
                };
                return SchoolProfilePageController;
            }());
            SchoolProfilePageController.controllerId = 'mainApp.pages.schoolProfilePage.SchoolProfilePageController';
            SchoolProfilePageController.$inject = [
                'mainApp.models.school.SchoolService',
                'mainApp.core.util.FunctionsUtilService',
                '$state',
                '$stateParams',
                '$filter'
            ];
            schoolProfilePage.SchoolProfilePageController = SchoolProfilePageController;
            angular
                .module('mainApp.pages.schoolProfilePage')
                .controller(SchoolProfilePageController.controllerId, SchoolProfilePageController);
        })(schoolProfilePage = pages.schoolProfilePage || (pages.schoolProfilePage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));
//# sourceMappingURL=schoolProfilePage.controller.js.map