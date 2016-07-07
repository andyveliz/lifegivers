var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core', '../services/map.service', 'esri-mods', '../services/geolocation.service', '../services/comm.service'], function (require, exports, core_1, map_service_1, esri_mods_1, geolocation_service_1, comm_service_1) {
    "use strict";
    let MapComponent = class MapComponent {
        constructor(_service, _geo, _comm, elRef) {
            this._service = _service;
            this._geo = _geo;
            this._comm = _comm;
            this.elRef = elRef;
            this.viewCreated = new core_1.EventEmitter();
            this.donors = {};
            _comm.newDonor$.subscribe(donor => {
                if (!this.donors.hasOwnProperty(donor._id))
                    this.addMarker(donor);
                this.donors[donor._id] = donor;
            });
            _comm.removeDonor$.subscribe(id => {
                if (this.donors.hasOwnProperty(id)) {
                    this.removeMarker(id);
                    delete this.donors[id];
                }
            });
        }
        ngOnInit() {
            this.view = new esri_mods_1.MapView({
                container: this.elRef.nativeElement.firstChild,
                map: this._service.map,
                zoom: 4
            });
            this.locateBtn = new esri_mods_1.Locate({
                view: this.view
            });
            this.locateBtn.startup();
            this.view.ui.add(this.locateBtn, {
                position: "top-left",
                index: 0
            });
            var me = this;
            //Handler to watch map movements
            var handle = this.view.watch('extent', function (newValue, oldValue, property, object) {
                var from = esri_mods_1.webMercatorUtils.xyToLngLat(newValue.xmin, newValue.ymin);
                var to = esri_mods_1.webMercatorUtils.xyToLngLat(newValue.xmax, newValue.ymax);
                me._comm.getDonorsInArea(from, to, function (donorsList) {
                    //Add or Update current donors list
                    donorsList.forEach(donor => {
                        if (!me.donors.hasOwnProperty(donor._id))
                            me.addMarker(donor);
                        me.donors[donor._id] = donor;
                    });
                    //Delete donors from current list
                    for (var id in me.donors) {
                        var donor = me.donors[id];
                        var toDelete = true;
                        donorsList.forEach(newDonor => {
                            if (newDonor._id == donor._id)
                                toDelete = false;
                        });
                        if (toDelete) {
                            me.removeMarker(donor._id);
                            delete me.donors[id];
                        }
                    }
                });
            });
            // Event handler that fires each time an show information action is clicked.
            this.view.popup.on("trigger-action", function (evt) {
                // Execute the showInfo function
                if (evt.action.id === "show-info") {
                    me.showInfo();
                }
                else if (evt.action.id === "create-new") {
                    document.getElementById("formModalOpener").click();
                }
            });
            var view = this.view;
            this.view.on("click", function (evt) {
            });
            this._geo.getLocation({ 'highAccuracy': true }).subscribe(function (position) {
                view.goTo({
                    target: [position.coords.longitude, position.coords.latitude],
                    scale: 10000
                });
                var mySymbol = new esri_mods_1.SimpleMarkerSymbol({
                    size: 10,
                    color: "#FF4000",
                    outline: {
                        color: [255, 64, 0, 0.4],
                        width: 7
                    }
                });
                var myPoint = new esri_mods_1.Point({ "x": position.coords.longitude, "y": position.coords.latitude, " spatialReference": { " wkid": 4326 } });
                var myPopup = {
                    title: "Current Location",
                    content: '<ul><li><strong>Longitude:</strong> {longitude}</li><li><strong>Latitude:</strong> {latitude}</li></ul>',
                    actions: [{
                            title: "Register as a Donor from Here",
                            id: "create-new"
                        }]
                };
                view.graphics.add(new esri_mods_1.Graphic({ geometry: myPoint, symbol: mySymbol, attributes: position.coords, popupTemplate: myPopup }));
            });
        }
        addMarker(donor) {
            var mySymbol = new esri_mods_1.PictureMarkerSymbol({
                url: "https://www.blood.ca/sites/default/files/blood-drop-lg.png",
                width: "18px",
                height: "27px"
            });
            var myPoint = new esri_mods_1.Point({ "x": donor.lng, "y": donor.lat, " spatialReference": { " wkid": 4326 } });
            var popup = {
                title: "{name}",
                content: '<ul><li><strong>Name:</strong> {name}</li><li><strong>Blood Group:</strong> {bloodtype}</li><li><strong>Longitude:</strong> {lng}</li><li><strong>Latitude:</strong> {lat}</li></ul>',
                actions: [{
                        title: "Show information",
                        id: "show-info"
                    }]
            };
            this.view.graphics.add(new esri_mods_1.Graphic({ geometry: myPoint, symbol: mySymbol, attributes: donor, popupTemplate: popup }));
        }
        showInfo() {
            var attrs = this.view.popup.selectedFeature.attributes;
            console.log(attrs);
            this.view.popup.content = '<ul><li><strong>Name:</strong> ' + attrs.name + '</li><li><strong>E-Mail:</strong> ' + attrs.email + '</li><li><strong>Phone:</strong> ' + attrs.phone + '</li><li><strong>Blood Group:</strong> ' + attrs.bloodtype + '</li><li><strong>Longitude:</strong> ' + attrs.lng + '</li><li><strong>Latitude:</strong> ' + attrs.lat + '</li></ul>';
        }
        removeMarker(id) {
            this.view.graphics.items.forEach(g => {
                if (g.attributes.hasOwnProperty("_id") && g.attributes._id == id)
                    this.view.graphics.remove(g);
            });
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "viewCreated", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'esri-map',
            template: '<div id="viewDiv"><ng-content></ng-content></div>',
            providers: [map_service_1.default, geolocation_service_1.GeolocationService]
        }), 
        __metadata('design:paramtypes', [map_service_1.default, geolocation_service_1.GeolocationService, comm_service_1.CommService, core_1.ElementRef])
    ], MapComponent);
    exports.MapComponent = MapComponent;
});
//# sourceMappingURL=map.component.js.map