/**
 * ModalWelcomeController
 * @description - modal welcome after the user signed up in Waysily
 * @constructor
 */

module components.modal.modalWelcome {

    /**********************************/
    /*           INTERFACES           */
    /**********************************/
    interface IModalWelcomeController {
        activate: () => void;
    }

    class ModalWelcomeController implements IModalWelcomeController {

        static controllerId = 'mainApp.components.modal.ModalWelcomeController';

        /**********************************/
        /*           PROPERTIES           */
        /**********************************/

        // --------------------------------

        /*-- INJECT DEPENDENCIES --*/
        static $inject = [
            '$uibModalInstance',
            'dataConfig',
            '$uibModal'
        ];


        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private dataConfig: IDataConfig,
            private $uibModal: ng.ui.bootstrap.IModalService) {

            this._init();

        }

        /*-- INITIALIZE METHOD --*/
        private _init() {
            //VARIABLES
            let self = this;

            this.activate();
        }

        /*-- ACTIVATE METHOD --*/
        activate(): void {
            //LOG
            DEBUG && console.log('modalWelcome controller actived');
        }

        /**********************************/
        /*            METHODS             */
        /**********************************/


        /**
        * _openPhotoModal
        * @description - open Modal in order to upload a user avatar image
        * @use - this._openPhotoModal();
        * @function
        * @return {void}
        */
        private _openPhotoModal(): void {
            //VARIABLES
            let self = this;
            // modal default options
            let options: ng.ui.bootstrap.IModalSettings = {
                animation: false,
                backdrop: 'static',
                size: 'sm',
                keyboard: false,
                templateUrl: this.dataConfig.modalPhotoTmpl,
                controller: 'mainApp.components.modal.ModalPhotoController as vm'
            };

            var modalInstance = this.$uibModal.open(options);

            this.$uibModalInstance.close();
        }

    }

    angular.module('mainApp.components.modal')
        .controller(ModalWelcomeController.controllerId,
                    ModalWelcomeController);

}
