/**
 * module() Here inject dependencies of Angular Modules and 3rd Party
 *
 * @param {none}
 * @return {void}
 */

(function (): void {
    'use strict';

    angular.module('mainApp.core', [
        /*Angular Modules*/
        'ngResource',
        'ui.router',
        /*3rd Party*/
        'pascalprecht.translate',
        'ui.calendar',
        'ui.bootstrap.datetimepicker'
    ]);

})();
