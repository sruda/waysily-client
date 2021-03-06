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
                MaTeacherResult.directiveId = 'maTeacherResult';
                return MaTeacherResult;
            }());
            angular
                .module('mainApp.pages.searchPage')
                .directive(MaTeacherResult.directiveId, MaTeacherResult.instance);
            var TeacherResultController = (function () {
                function TeacherResultController(functionsUtil, $state, $rootScope) {
                    this.functionsUtil = functionsUtil;
                    this.$state = $state;
                    this.$rootScope = $rootScope;
                    this.init();
                }
                TeacherResultController.prototype.init = function () {
                    this._hoverDetail = [];
                    this.activate();
                };
                TeacherResultController.prototype.activate = function () {
                    DEBUG && console.log('teacherResult controller actived');
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
                    var hoverClass = 'ma-box--border-hover';
                    var args = { id: id, status: status, typeOfMarker: 'round' };
                    this._hoverDetail[id] = status;
                    var containers = document.getElementsByClassName(hoverClass);
                    for (var i = 0; i < containers.length; i++) {
                        var containerClasses = containers[i].classList;
                        containerClasses.remove(hoverClass);
                    }
                    this.$rootScope.$broadcast('ChangeMarker', args);
                };
                TeacherResultController.controllerId = 'mainApp.pages.searchPage.TeacherResultController';
                TeacherResultController.$inject = [
                    'mainApp.core.util.FunctionsUtilService',
                    '$state',
                    '$rootScope'
                ];
                return TeacherResultController;
            }());
            searchPage.TeacherResultController = TeacherResultController;
            angular.module('mainApp.pages.searchPage')
                .controller(TeacherResultController.controllerId, TeacherResultController);
        })(searchPage = pages.searchPage || (pages.searchPage = {}));
    })(pages = app.pages || (app.pages = {}));
})(app || (app = {}));

//# sourceMappingURL=../../../../../maps/app/pages/searchPage/teacherResult/teacherResult.directive.js.map
