/**
* config()
* @description - step2 section config file
*/

(function() {
    'use strict';

    angular
        .module('mainApp.pages.createTeacherPage')
        .config(config);


    function config($stateProvider: angular.ui.IStateProvider) {

        $stateProvider
            .state('page.createTeacherPage.step2', {
                url: '/step2',
                views: {
                    'step': {
                        templateUrl: 'app/pages/createTeacherPage/step2Section/step2Section.html'
                    }
                }
            });
    }
})();
