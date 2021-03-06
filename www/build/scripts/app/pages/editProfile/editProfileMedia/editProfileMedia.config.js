(function () {
    'use strict';
    angular
        .module('mainApp.pages.editProfile')
        .config(config);
    function config($stateProvider) {
        $stateProvider
            .state('page.editProfile.media', {
            url: '/media',
            views: {
                'section': {
                    templateUrl: 'app/pages/editProfile/editProfileMedia/editProfileMedia.html',
                    controller: 'mainApp.pages.editProfile.EditProfileMediaController',
                    controllerAs: 'vm'
                }
            },
            cache: false
        });
    }
})();

//# sourceMappingURL=../../../../../maps/app/pages/editProfile/editProfileMedia/editProfileMedia.config.js.map
