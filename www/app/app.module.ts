﻿/**
 * module() Here inject dependencies of App modules and components, such as controllers, service, directive, etc
 * config() Here define the main state, routes, http interceptor
 *
 * @param {angular.ui.IUrlRouterProvider} $urlRouterProvider
 * @return {void}
 */

(function (): void {
    'use strict';

    angular
        .module('mainApp', [
            'mainApp.auth',
            'mainApp.core',
            'mainApp.localStorage',
            'mainApp.core.restApi',
            'mainApp.models.user',
            'mainApp.pages.main',
            'mainApp.pages.studentLandingPage',
            'mainApp.pages.signUpPage',
            'mainApp.pages.searchPage',
            'mainApp.pages.userProfilePage',
            'mainApp.pages.userEditProfilePage',
            'mainApp.pages.userEditMediaPage',
            'mainApp.pages.userEditAgendaPage',
            'mainApp.pages.meetingConfirmationPage',
            'mainApp.pages.userInboxPage',
            'mainApp.pages.userInboxDetailsPage',
            'mainApp.components.header',
            'mainApp.components.footer',
            'mainApp.components.map',
            'mainApp.components.modal'
        ])
        .config(config);

    function config($locationProvider: angular.ILocationProvider,
                    $urlRouterProvider: angular.ui.IUrlRouterProvider,
                    $translateProvider: angular.translate.ITranslateProvider) {

        /*$locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');*/

        $urlRouterProvider.otherwise('/page');

        /* Translate Provider */
        let prefix = 'assets/i18n/';
        let suffix = '.json';

        $translateProvider.useStaticFilesLoader({
            prefix: prefix,
            suffix: suffix
        });

        $translateProvider.preferredLanguage('es');

    }

})();
