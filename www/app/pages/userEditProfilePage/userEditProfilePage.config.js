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