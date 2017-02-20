var app;
(function (app) {
    var pages;
    (function (pages) {
        var resetPasswordPage;
        (function (resetPasswordPage) {
            var ResetPasswordPageController = (function () {
                function ResetPasswordPageController($state, $filter, $stateParams, AuthService, functionsUtil, messageUtil) {
                    this.$state = $state;
                    this.$filter = $filter;
                    this.$stateParams = $stateParams;
                    this.AuthService = AuthService;
                    this.functionsUtil = functionsUtil;
                    this.messageUtil = messageUtil;
                    this._init();
                }
                ResetPasswordPageController.prototype._init = function () {
                    var self = this;
                    this.saving = false;
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
                    var PASSWORD_MESSAGE = this.$filter('translate')('%recover.password.not_match.text');
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
                        this.validate.globalValidate.message = PASSWORD_MESSAGE;
                    }
                    return formValid;
                };
                ResetPasswordPageController.prototype._changePassword = function () {
                    var SUCCESS_CHANGE_PROCESS = this.$filter('translate')('%recover.password.success.text');
                    var LINK_EXPIRED = this.$filter('translate')('%recover.password.link_expired.text');
                    var self = this;
                    var formValid = this._validateForm();
                    if (formValid) {
                        this.saving = true;
                        this.AuthService.confirmResetPassword(self.uid, self.token, self.form.newPassword1, self.form.newPassword2).then(function (response) {
                            DEBUG && console.log(response);
                            self.saving = false;
                            self.messageUtil.success(SUCCESS_CHANGE_PROCESS);
                            self.$state.go('page.landingPage', { showLogin: true }, { reload: true });
                        }, function (error) {
                            DEBUG && console.log(error);
                            self.saving = false;
                            if (error === 'Invalid value') {
                                self.validate.globalValidate.valid = false;
                                self.validate.globalValidate.message = LINK_EXPIRED;
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
                '$filter',
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