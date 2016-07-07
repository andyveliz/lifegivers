var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core', '@angular/core', './map.component', './form-modal.component', '../services/comm.service'], function (require, exports, core_1, core_2, map_component_1, form_modal_component_1, comm_service_1) {
    "use strict";
    let AppComponent = class AppComponent {
        constructor(_comm) {
            this._comm = _comm;
            this._comm.setSocket(io('http://localhost:8000'));
        }
        ngOnInit() {
            var url = window.location.search;
            if (url != "") {
                var id = url.substring(1, url.length);
                this.formModal.showDonor(id);
            }
        }
    };
    __decorate([
        core_1.ViewChild(form_modal_component_1.FormModalComponent), 
        __metadata('design:type', form_modal_component_1.FormModalComponent)
    ], AppComponent.prototype, "formModal", void 0);
    AppComponent = __decorate([
        core_2.Component({
            directives: [map_component_1.MapComponent, form_modal_component_1.FormModalComponent],
            providers: [comm_service_1.CommService],
            selector: 'lifegivers-app',
            template: `
    <div>
    <esri-map #mapView >
    </esri-map>
    </div>
    <the-modal #formModal></the-modal>
    `
        }), 
        __metadata('design:paramtypes', [comm_service_1.CommService])
    ], AppComponent);
    exports.AppComponent = AppComponent;
});
//# sourceMappingURL=app.component.js.map