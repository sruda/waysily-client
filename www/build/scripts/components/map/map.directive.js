var components;
(function (components) {
    var map;
    (function (map) {
        'use strict';
        var MaMap = (function () {
            function MaMap() {
                this.bindToController = true;
                this.controller = MapController.controllerId;
                this.controllerAs = 'vm';
                this.restrict = 'E';
                this.transclude = true;
                this.scope = {
                    mapConfig: '=',
                    circle: '=',
                    draggable: '=',
                    typeOfMarker: '=',
                    btnFilter: '=',
                    btnFilterTarget: '=',
                };
                this.templateUrl = 'components/map/map.html';
                console.log('maMap directive constructor');
            }
            MaMap.prototype.link = function ($scope, elm, attr) {
                console.log('maMap link function');
            };
            MaMap.instance = function () {
                return new MaMap();
            };
            MaMap.directiveId = 'maMap';
            return MaMap;
        }());
        angular
            .module('mainApp.components.map')
            .directive(MaMap.directiveId, MaMap.instance);
        var MapController = (function () {
            function MapController($scope, $rootScope, $timeout, MapService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.MapService = MapService;
                this.init();
            }
            MapController.prototype.init = function () {
                var self = this;
                this._map;
                this._draggable = false;
                this.mapId = 'ma-map-' + Math.floor((Math.random() * 100) + 1);
                this._infoWindow = null;
                this._markers = [];
                this.$scope.options = null;
                if (this.typeOfMarker) {
                    this._markerStatus = this.MapService.selectMarker(this.typeOfMarker);
                }
                switch (this.mapConfig.type) {
                    case 'search-map':
                        this._searchMapBuilder();
                        break;
                    case 'drag-maker-map':
                        this._dragMarkerMapBuilder();
                        break;
                    case 'location-circle-map':
                        this._locationCircleMapBuilder();
                        break;
                    case 'location-marker-map':
                        this._locationMarkerMapBuilder();
                        break;
                }
                this.activate();
            };
            MapController.prototype.activate = function () {
                console.log('map controller actived');
                this._subscribeToEvents();
            };
            MapController.prototype._searchMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 16;
                var center = this.mapConfig.data.position;
                this._draggable = false;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        if (self.btnFilter) {
                            self._createFilterButtons(self.btnFilterTarget);
                        }
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self._markerStatus.normal);
                        }
                    });
                }
            };
            MapController.prototype._dragMarkerMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 17;
                var center = this.mapConfig.data.position;
                this._draggable = true;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self._markerStatus.normal);
                        }
                    });
                }
            };
            MapController.prototype._locationCircleMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 16;
                var center = this.mapConfig.data.position;
                this._draggable = false;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        var circle = self.MapService.buildCircle(self._map, center);
                    });
                }
            };
            MapController.prototype._locationMarkerMapBuilder = function () {
                var self = this;
                var zoom = this.mapConfig.data.zoom || 16;
                var center = this.mapConfig.data.position;
                this._draggable = false;
                this.$scope.options = {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    scrollwheel: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    }
                };
                if (this._map === void 0) {
                    this.$timeout(function () {
                        self._map = new google.maps.Map(document.getElementById(self.mapId), self.$scope.options);
                        for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                            var marker = self.mapConfig.data.markers[i];
                            self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self._markerStatus.normal);
                        }
                    });
                }
            };
            MapController.prototype._setMarker = function (id, position, icon) {
                var self = this;
                var marker;
                var markerOptions = {
                    id: id,
                    position: position,
                    map: this._map,
                    icon: icon,
                    draggable: this._draggable
                };
                marker = new google.maps.Marker(markerOptions);
                this._markers.push(marker);
                if (this._map) {
                    this._map.setCenter(position);
                }
                if (this._draggable) {
                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        var position = {
                            lng: this.getPosition().lng(),
                            lat: this.getPosition().lat()
                        };
                        self.$scope.$emit('Position', position);
                    });
                }
                if (this.mapConfig.type === 'search-map') {
                    google.maps.event.addListener(marker, 'click', function (event) {
                        for (var i = 0; i < self._markers.length; i++) {
                            if (self._markers[i].id === marker.id) {
                                self._markers[i].setIcon(self._markerStatus.hover);
                            }
                            else {
                                self._markers[i].setIcon(self._markerStatus.normal);
                            }
                        }
                        self.$scope.$emit('SelectContainer', marker.id);
                    });
                }
            };
            MapController.prototype._removeMarkers = function () {
                for (var i = 0; i < this._markers.length; i++) {
                    this._markers[i].setMap(null);
                }
            };
            MapController.prototype._createFilterButtons = function (btnFilterTarget) {
                var buttons = ['Teachers', 'Schools'];
                for (var i = 0; i < buttons.length; i++) {
                    var controlDiv = document.createElement('div');
                    var control = this._filterControl(controlDiv, buttons[i], btnFilterTarget);
                    this._map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
                }
            };
            MapController.prototype._filterControl = function (controlDiv, type, btnFilterTarget) {
                var self = this;
                var defaultBtn = btnFilterTarget === 'teacher' ? 'Teachers' : 'Schools';
                var className = 'filterBtnMap';
                var background_color = 'rgb(255, 255, 255)';
                var background_color_active = '#00B592';
                var border_radius = '3px';
                var box_shadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
                var cursor = 'pointer';
                var margin_top = '10px';
                var margin_bottom = '22px';
                var margin_right = '10px';
                var text_align = 'center';
                var title = 'Click to search' + type;
                var color = '#4E4E4E';
                var color_active = '#FFF';
                var font_family = 'Roboto,Arial,sans-serif';
                var font_size = '15px';
                var line_height = '10px';
                var padding_top = '10px';
                var padding_bottom = '10px';
                var padding_left = '20px';
                var padding_right = '20px';
                var border_bottom = '0 hidden transparent';
                var border_bottom_active = '2px solid #018a6f';
                var controlUI = document.createElement('div');
                controlUI.className = className;
                controlUI.style.borderRadius = border_radius;
                controlUI.style.boxShadow = box_shadow;
                controlUI.style.cursor = cursor;
                controlUI.style.marginTop = margin_top;
                controlUI.style.marginBottom = margin_bottom;
                controlUI.style.marginRight = margin_right;
                controlUI.style.textAlign = text_align;
                controlUI.title = title;
                if (type === defaultBtn) {
                    controlUI.style.backgroundColor = background_color_active;
                    controlUI.style.borderBottom = border_bottom_active;
                }
                else {
                    controlUI.style.backgroundColor = background_color;
                }
                controlDiv.appendChild(controlUI);
                var controlText = document.createElement('div');
                controlText.style.fontFamily = font_family;
                controlText.style.fontSize = font_size;
                controlText.style.lineHeight = line_height;
                controlText.style.paddingTop = padding_top;
                controlText.style.paddingBottom = padding_bottom;
                controlText.style.paddingLeft = padding_left;
                controlText.style.paddingRight = padding_right;
                controlText.innerHTML = type;
                if (type === defaultBtn) {
                    controlText.style.color = color_active;
                }
                else {
                    controlText.style.color = color;
                }
                controlUI.appendChild(controlText);
                controlUI.addEventListener('click', function (e) {
                    var SEARCH_MIXPANEL = "Click on map's filter button: " + e.currentTarget.innerText;
                    var element = this;
                    var child = this.children[0];
                    var filterBtn = document.getElementsByClassName(className);
                    mixpanel.track(SEARCH_MIXPANEL);
                    for (var i = 0; i < filterBtn.length; i++) {
                        filterBtn[i].style.backgroundColor = background_color;
                        filterBtn[i].style.borderBottom = border_bottom;
                        filterBtn[i].children[0].style.color = color;
                    }
                    element.style.backgroundColor = background_color_active;
                    element.style.borderBottom = border_bottom_active;
                    child.style.color = color_active;
                    self.$scope.$emit(type);
                });
            };
            MapController.prototype._codeAddress = function (geocoder, country, address, city) {
                var self = this;
                var location = country + ',' + city + ',' + address;
                geocoder.geocode({
                    address: location
                }, function (results, status) {
                    if (status == 'OK') {
                        self._removeMarkers();
                        self._setMarker('1', results[0].geometry.location, self._markerStatus.normal);
                        var position = {
                            lng: results[0].geometry.location.lng(),
                            lat: results[0].geometry.location.lat()
                        };
                        self.$scope.$emit('Position', position);
                    }
                    else {
                        console.log(status);
                    }
                });
            };
            MapController.prototype._positionCountry = function (geocoder, country, address, city) {
                var self = this;
                var location = country + ',' + city + ',' + address;
                geocoder.geocode({
                    address: location
                }, function (results, status) {
                    if (status == 'OK') {
                        self._map.setCenter(results[0].geometry.location);
                        if (self.mapConfig.data.zoom) {
                            self._map.setZoom(self.mapConfig.data.zoom);
                        }
                    }
                    else {
                        console.log(status);
                    }
                });
            };
            MapController.prototype._subscribeToEvents = function () {
                var self = this;
                this.$scope.$on('BuildMarkers', function (event, args) {
                    self.mapConfig = args.mapConfig;
                    self._markerStatus = self.MapService.selectMarker(args.typeOfMarker);
                    self._removeMarkers();
                    for (var i = 0; i < self.mapConfig.data.markers.length; i++) {
                        var marker = self.mapConfig.data.markers[i];
                        self._setMarker(marker.id, new google.maps.LatLng(marker.position.lat, marker.position.lng), self._markerStatus.normal);
                    }
                });
                this.$scope.$on('ChangeMarker', function (event, args) {
                    var markerId = args.id;
                    var status = args.status;
                    self._markerStatus = self.MapService.selectMarker(args.typeOfMarker);
                    for (var i = 0; i < self._markers.length; i++) {
                        if (self._markers[i].id === markerId) {
                            if (status === true) {
                                self._markers[i].setIcon(self._markerStatus.hover);
                            }
                            else {
                                self._markers[i].setIcon(self._markerStatus.normal);
                            }
                        }
                        else {
                            self._markers[i].setIcon(self._markerStatus.normal);
                        }
                    }
                });
                this.$scope.$on('CodeAddress', function (event, args) {
                    var geocoder = new google.maps.Geocoder();
                    self._codeAddress(geocoder, args.country, args.address, args.city);
                });
                this.$scope.$on('PositionCountry', function (event, args) {
                    var geocoder = new google.maps.Geocoder();
                    self._positionCountry(geocoder, args.country, args.address, args.city);
                });
            };
            MapController.controllerId = 'mainApp.components.map.MapController';
            MapController.$inject = ['$scope',
                '$rootScope',
                '$timeout',
                'mainApp.components.map.MapService'];
            return MapController;
        }());
        map.MapController = MapController;
        angular.module('mainApp.components.map')
            .controller(MapController.controllerId, MapController);
    })(map = components.map || (components.map = {}));
})(components || (components = {}));

//# sourceMappingURL=../../../maps/components/map/map.directive.js.map
