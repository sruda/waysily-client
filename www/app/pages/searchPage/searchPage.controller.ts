/**
 * SearchPageController
 * @description - Search Page Controller
 */

module app.pages.searchPage {

    /**********************************/
    /*           INTERFACES           */
    /**********************************/
    interface ISearchPageController {
        error: ISearchPageError;
        activate: () => void;
    }

    interface ISearchPageError {
        message: string;
    }

    /********************************/
    /*    STATEPARAMS INTERFACES    */
    /********************************/
    export interface ISearchPageParams extends ng.ui.IStateParamsService {
        country: string;
        target: string;
    }


    /****************************************/
    /*           CLASS DEFINITION           */
    /****************************************/
    export class SearchPageController implements ISearchPageController {

        static controllerId = 'mainApp.pages.searchPage.SearchPageController';

        /**********************************/
        /*           PROPERTIES           */
        /**********************************/
        error: ISearchPageError;
        mapConfig: components.map.IMapConfig;
        data: Array<app.models.student.Student>;
        type: string;
        marker: string;
        VALIDATED: string;
        rightLoading: boolean;
        leftLoading: boolean;
        shadowsLoading: boolean;
        private _teacherChecked: boolean;
        private _schoolChecked: boolean;
        // --------------------------------


        /*-- INJECT DEPENDENCIES --*/
        public static $inject = [
            'mainApp.models.student.StudentService',
            'mainApp.models.teacher.TeacherService',
            'mainApp.models.school.SchoolService',
            'mainApp.core.util.FunctionsUtilService',
            '$state',
            '$stateParams',
            '$filter',
            '$scope',
            '$rootScope',
            '$timeout'];

        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(
            private StudentService: app.models.student.IStudentService,
            private TeacherService: app.models.teacher.ITeacherService,
            private SchoolService: app.models.school.ISchoolService,
            private FunctionsUtilService: app.core.util.functionsUtil.IFunctionsUtilService,
            private $state: ng.ui.IStateService,
            private $stateParams: ISearchPageParams,
            private $filter: angular.IFilterService,
            private $scope: angular.IScope,
            private $rootScope: angular.IRootScopeService,
            private $timeout: angular.ITimeoutService) {

            this._init();

        }

        /*-- INITIALIZE METHOD --*/
        private _init() {
            //TODO: Buscar una forma de crear un Enum global, donde no tenga que
            // hacer esto cada vez que quiera usar un filtro
            //GLOBAL CONSTANTS
            this.VALIDATED = 'VA';

            //Init users list
            this.data = [];

            //Type of results (student, teacher, school)
            this.type = this.$stateParams.target || 'school';
            this.marker = null;

            //Init left loading
            this.leftLoading = false;

            //Init right loading
            this.rightLoading = true;

            //Init shadows loading
            this.shadowsLoading = true;

            //Init small device filter button
            this._teacherChecked = this.$stateParams.target === 'teacher';
            this._schoolChecked = this.$stateParams.target === 'school';

            if(!this._teacherChecked && !this._schoolChecked) {
                this._teacherChecked = this.type === 'teacher';
                this._schoolChecked = this.type === 'school';
            }

            this.error = {
                message: ''
            };

            this.activate();
        }

        /*-- ACTIVATE METHOD --*/
        activate(): void {
            //CONSTANTS
            const ENTER_MIXPANEL = 'Enter: Search Page';
            //VARIABLES
            let self = this;
            //LOG
            DEBUG && console.log('searchPage controller actived');
            //MIXPANEL
            mixpanel.track(ENTER_MIXPANEL);

            //SUBSCRIBE TO EVENTS
            this._subscribeToEvents();

            this._firstFetchData(this.$stateParams.target);

        }

        /**********************************/
        /*            METHODS             */
        /**********************************/


        /**
        * _getResultLoading
        * @description - this method return specific loading template
        * based on type result (students, teachers, schools, etc)
        * @use - this._getResultTemplate('student');
        * @function
        * @params {string} type - type of results list (students, teachers, schools, etc)
        * @return {string} result template path
        */
        //TODO: Esta funciona esta repetida en countryProfilePage, deberia
        //crearse un servicio global, donde se encargue de crear este tipo de shadows
        private _getResultLoading(type: string): string {
            //CONSTANTS
            const STUDENT_TYPE = 'student';
            const TEACHER_TYPE = 'teacher';
            const SCHOOL_TYPE = 'school';
            /*********************************/

            switch (type) {
                case STUDENT_TYPE:
                return 'app/pages/searchPage/studentResult/studentResult.html';
                case TEACHER_TYPE:
                return 'app/pages/searchPage/teacherLoading/teacherLoading.html';
                case SCHOOL_TYPE:
                return 'app/pages/searchPage/schoolLoading/schoolLoading.html';
            }
        }


        /**
        * _firstFetchData
        * @description - TODO: Este metodo es temporal, en realidad no deberia
        * buscar por un pais en particular, sino con la direccion que el user
        * especifique en el buscador. Dejar este metodo hasta cuando sea necesarios
        * implementar el buscador completo
        * @use - this._subscribeToEvents();
        * @function
        * @return {void}
        */

        private _firstFetchData(target): void {
            //CONSTANTS
            const TARGET_TEACHER = 'teacher';
            const TARGET_SCHOOL = 'school';
            //VARIABLES
            let self = this;
            //If target is null, assign school as a default
            target = target || TARGET_SCHOOL;

            if(target === TARGET_TEACHER) {
                //Get All Teacher of this zone
                this.TeacherService.getAllTeachersByStatus(this.VALIDATED).then(
                    function(response: app.models.teacher.ITeacherQueryObject) {

                        self.type = 'teacher';
                        self.marker = 'round';
                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(
                            response.results,
                            'search-map',
                            null,
                            6
                        );

                        /*
                        * Send event to child (MapController) in order to It draws
                        * each Marker on the Map
                        */
                        self.$scope.$broadcast('BuildMarkers', {mapConfig: self.mapConfig, typeOfMarker: self.marker});

                        self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);

                        //Center Map on Country selected
                        if(self.$stateParams.country) {
                            self.$timeout(function(){
                                self._searchByCountry(self.$stateParams.country);
                            });
                        }

                        self.$timeout(function(){
                            self.rightLoading = false;
                            self.shadowsLoading = false;
                        });
                    }
                );
            } else if(target === TARGET_SCHOOL) {

                //Get All Schools of this zone
                this.SchoolService.getAllSchoolsByStatus(this.VALIDATED).then(
                    function(response: app.models.school.ISchoolQueryObject) {

                        self.type = 'school';
                        self.marker = 'long';
                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(
                            response.results,
                            'search-map',
                            null,
                            6
                        );

                        /*
                        * Send event to child (MapController) in order to It draws
                        * each Marker on the Map
                        */
                        self.$scope.$broadcast('BuildMarkers', {mapConfig: self.mapConfig, typeOfMarker: self.marker});

                        self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);

                        //Center Map on Country selected
                        if(self.$stateParams.country) {
                            self.$timeout(function(){
                                self._searchByCountry(self.$stateParams.country);
                            });
                        }

                        self.$timeout(function(){
                            self.rightLoading = false;
                            self.shadowsLoading = false;
                        });
                    }
                );
            }
        }



        /**
        * goToSearch
        * @description - go to search page
        * @function
        * @param {string} target - Section user clicked
        * @return {void}
        */
        goToSearch(target: string): void {
            //CONSTANTS
            const SEARCH_PAGE_STATE = 'page.searchPage';
            const CLICK_MIXPANEL = 'SearchPage: Click on ' + target + 'btn';
            /************************/

            //MIXPANEL
            mixpanel.track(CLICK_MIXPANEL);

            this.$state.go(SEARCH_PAGE_STATE, {target: target}, {reload: true});
        }



        /**
        * _searchByCountry
        * @description - TODO: Este metodo es temporal, en realidad no deberia
        * buscar por un pais en particular, sino con la direccion que el user
        * especifique en el buscador. Dejar este metodo hasta cuando sea necesarios
        * implementar el buscador completo
        * @use - this._subscribeToEvents();
        * @function
        * @return {void}
        */

        private _searchByCountry(country): void {
            //VARIABLES
            let self = this;

            if(country == 'Colombia') {
                let location = {
                    country: country,
                    city: 'Medellin',
                    address: 'Transversal 31Sur #32B-64'
                };
                /************************************/

                this.$timeout(function(){
                    self.$rootScope.$broadcast('PositionCountry', location);
                });
            }
        }



        /**
        * _subscribeToEvents
        * @description - this method subscribes Search Page to Child's Events
        * @use - this._subscribeToEvents();
        * @function
        * @return {void}
        */

        private _subscribeToEvents(): void {
            // VARIABLES
            let self = this;

            /**
            * Students event
            * @child - MapController
            * @description - Parent (SearchPageController) receive Child's
                             event (MapController) in order to get
                             students list from server
            * @event
            */

            this.$scope.$on('Students', function(event, args) {
                //Get All Users of this zone
                self.StudentService.getAllStudents().then(
                    function(response: Array<app.models.student.Student>) {

                        self.type = 'student';
                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(
                            response,
                            'search-map',
                            {lat: 6.175434,lng: -75.583329},
                            6
                        );

                        /*
                        * Send event to child (MapController) in order to It draws
                        * each Marker on the Map
                        */
                        self.$scope.$broadcast('BuildMarkers', {mapConfig: self.mapConfig, typeOfMarker: 'round'});

                        self.data = self.FunctionsUtilService.splitToColumns(response, 2);
                    }
                );
            });


            /**
            * Teachers event
            * @child - MapController
            * @description - Parent (SearchPageController) receive Child's
                             event (MapController) in order to get
                             teachers list from server
            * @event
            */

            this.$scope.$on('Teachers', function(event, args) {

                //Init left loading
                self.shadowsLoading = true;

                self.type = 'teacher';

                //Get All Teachers of this zone
                self.TeacherService.getAllTeachersByStatus(self.VALIDATED).then(
                    function(response: app.models.teacher.ITeacherQueryObject) {

                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(
                            response.results,
                            'search-map',
                            null,
                            6
                        );

                        self.shadowsLoading = false;

                        /*
                        * Send event to child (MapController) in order to It draws
                        * each Marker on the Map
                        */
                        self.$scope.$broadcast('BuildMarkers', {mapConfig: self.mapConfig, typeOfMarker: 'round'});

                        self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);
                    }
                );
            });


            /**
            * Schools event
            * @child - MapController
            * @description - Parent (SearchPageController) receive Child's
                             event (MapController) in order to get
                             schools list from server
            * @event
            */

            this.$scope.$on('Schools', function(event, args) {

                //Init left loading
                self.shadowsLoading = true;

                self.type = 'school';

                //Get All Schools of this zone
                self.SchoolService.getAllSchoolsByStatus(self.VALIDATED).then(
                    function(response: app.models.school.ISchoolQueryObject) {

                        self.mapConfig = self.FunctionsUtilService.buildMapConfig(
                            response.results,
                            'search-map',
                            {lat: 6.175434,lng: -75.583329},
                            6
                        );

                        self.shadowsLoading = false;

                        /*
                        * Send event to child (MapController) in order to It draws
                        * each Marker on the Map
                        */
                        self.$scope.$broadcast('BuildMarkers', {mapConfig: self.mapConfig, typeOfMarker: 'long'});

                        self.data = self.FunctionsUtilService.splitToColumns(response.results, 2);
                    }
                );
            });


            /**
            * SelectContainer event
            * @child - MapController
            * @description - Parent (SearchPageController) receive Child's
                             event (MapController) in order to selected
                             specific result container
            * @event
            */

            this.$scope.$on('SelectContainer', function(event, args) {
                //CONSTANTS
                const hoverClass = 'ma-box--border-hover';
                //VARIABLES
                let containerId = '#container-' + args;

                let containers = document.getElementsByClassName(hoverClass);

                for (let i = 0; i < containers.length; i++) {
                    containers[i].classList.remove(hoverClass);
                }

                let containerClasses = document.querySelector(containerId).classList;
                containerClasses.add(hoverClass);
                document.querySelector(containerId).scrollIntoView({ behavior: 'smooth' });
            });


            /**
            * SearchCountry event
            * @parent - HeaderController
            * @description - Parent (HeaderController) send event
                             (SearchPageController) in order to change map
                             center position
            * @event
            */

            this.$scope.$on('SearchCountry', function(event, args) {
                self._searchByCountry(args);
            });
        }


    }

    /*-- MODULE DEFINITION --*/
    angular
        .module('mainApp.pages.searchPage')
        .controller(SearchPageController.controllerId, SearchPageController);

}
