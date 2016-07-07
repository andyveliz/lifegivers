var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core'], function (require, exports, core_1) {
    "use strict";
    let ResponseModalComponent = class ResponseModalComponent {
        constructor() {
            this.content = "...";
        }
        show(_content) {
            this.content = _content;
            document.getElementById("openModalButton").click();
        }
        showDonor(_donor) {
            var url = window.location.protocol + "//" + window.location.host + "/?" + _donor._id;
            this.content = '<div class="alert alert-success" role="alert">The Donor has been saved correctly.<br>' +
                'You can use the following link to update your data.<br>' +
                '<a href="' + url + '">' + url + '</a><br>' +
                'This link has been emailed to you (' + _donor.email + ').</div>';
            document.getElementById("openModalButton").click();
        }
    };
    ResponseModalComponent = __decorate([
        core_1.Component({
            selector: 'the-modal2',
            template: `
    <button id="openModalButton" [hidden]="true" data-toggle="modal" data-target="#the-modal2">Open Modal</button>
    <div class="modal fade" tabindex="-1" role="dialog" id="the-modal2">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Register as a Donor</h4>
          </div>
          <div class="modal-body" [innerHTML]="content">
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">OK</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    `
        }), 
        __metadata('design:paramtypes', [])
    ], ResponseModalComponent);
    exports.ResponseModalComponent = ResponseModalComponent;
});
//# sourceMappingURL=response-modal.component.js.map