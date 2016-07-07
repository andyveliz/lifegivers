var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core', '@angular/core', '../services/geolocation.service', '../services/comm.service', './response-modal.component', '../models/donor'], function (require, exports, core_1, core_2, geolocation_service_1, comm_service_1, response_modal_component_1, donor_1) {
    "use strict";
    let FormModalComponent = class FormModalComponent {
        constructor(_geo, _comm) {
            this._geo = _geo;
            this._comm = _comm;
            this.model = new donor_1.Donor('', '', '', '', '', 0, 0);
            var model = this.model;
            this._geo.getLocation({ 'highAccuracy': true }).subscribe(function (position) {
                model.lng = position.coords.longitude;
                model.lat = position.coords.latitude;
            });
        }
        onSubmit() {
            var me = this;
            this._comm.saveDonor(this.model, function (result) {
                document.getElementById("closeFormModal").click();
                if (result.status == "OK") {
                    //OK Message
                    me.responseModal.showDonor(result);
                }
                else {
                    //Error Message
                    me.responseModal.show("There was an error saving your data.<br>The error was: <br>" + result.err);
                }
                me.model = new donor_1.Donor('', '', '', '', '', me.model.lat, me.model.lng);
            });
        }
        showDonor(id) {
            var me = this;
            this._comm.getDonorById(id, function (result) {
                if (result.status == "OK") {
                    me.model = result;
                    document.getElementById("formModalOpener").click();
                }
                else {
                    //Error Message
                    me.responseModal.show("There was an error finding your data.<br>The error was: <br>" + result.err);
                }
            });
        }
        deleteDonor() {
            var me = this;
            this._comm.deleteDonor(this.model._id, function (result) {
                me.clearDonor();
                document.getElementById("closeFormModal").click();
            });
        }
        clearDonor() {
            this.model = new donor_1.Donor('', '', '', '', '', this.model.lat, this.model.lng);
        }
    };
    __decorate([
        core_1.ViewChild(response_modal_component_1.ResponseModalComponent), 
        __metadata('design:type', response_modal_component_1.ResponseModalComponent)
    ], FormModalComponent.prototype, "responseModal", void 0);
    FormModalComponent = __decorate([
        core_2.Component({
            selector: 'the-modal',
            template: `
    <div class="modal fade" tabindex="-1" role="dialog" id="the-modal">
      <div class="modal-dialog">
        <div class="modal-content">
        <form class="form-horizontal" (ngSubmit)="onSubmit()" #donorForm="ngForm">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Register as a Donor</h4>
          </div>
          <div class="modal-body">
            
              <fieldset>
                <!-- Text input-->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="name">Name</label>  
                  <div class="col-md-9">
                  <input id="name" name="name" [(ngModel)]="model.name" type="text" placeholder="Enter your Full Name" class="form-control input-md" required="">
                  </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="email">Email</label>  
                  <div class="col-md-9">
                  <input id="email" name="email" [(ngModel)]="model.email" type="email" placeholder="Enter your E-Mail (someone@somwhere.com)" class="form-control input-md" required="">
                  </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="phone">Phone <br/>(123-456-7890)</label>  
                  <div class="col-md-9">
                  <input id="phone" name="phone" [(ngModel)]="model.phone" type="tel" pattern="\\d{3}[\\-]\\d{3}[\\-]\\d{4}" placeholder="Enter your Phone Number" class="form-control input-md" required="">
                  </div>
                </div>

                <!-- Select Basic -->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="type">Blood Group</label>
                  <div class="col-md-9">
                    <select id="type" name="type" [(ngModel)]="model.bloodtype" class="form-control" required>
                      <option value="" selected>Select a Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <!-- Text input-->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="latitude">Lat.</label>  
                  <div class="col-md-9">
                  <input id="lat" name="lat" [(ngModel)]="model.lat" type="text" class="form-control input-md" readonly="">
                  </div>
                </div>
                <!-- Text input-->
                <div class="form-group">
                  <label class="col-md-3 control-label" for="lng">Lng.</label>  
                  <div class="col-md-9">
                  <input id="lng" name="lng" [(ngModel)]="model.lng" type="text" class="form-control input-md" readonly="">
                  </div>
                </div>
              </fieldset>
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" id="closeFormModal" (click)="clearDonor()">Close</button>
            <button type="button" class="btn btn-danger" *ngIf="model._id != ''" (click)="deleteDonor()">Delete</button>
            <button type="submit" class="btn btn-danger">Save Registration</button>
          </div>
          </form>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <the-modal2></the-modal2>
    `,
            providers: [geolocation_service_1.GeolocationService],
            directives: [response_modal_component_1.ResponseModalComponent]
        }), 
        __metadata('design:paramtypes', [geolocation_service_1.GeolocationService, comm_service_1.CommService])
    ], FormModalComponent);
    exports.FormModalComponent = FormModalComponent;
});
//# sourceMappingURL=form-modal.component.js.map