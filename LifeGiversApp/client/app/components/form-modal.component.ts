import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NgForm }    from '@angular/forms';
import { GeolocationService } from '../services/geolocation.service';
import { CommService } from '../services/comm.service';
import { ResponseModalComponent } from './response-modal.component';

import { Donor }    from '../models/donor';

@Component({
    selector: 'the-modal',
    template:
    `
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
    providers: [GeolocationService],
    directives: [ResponseModalComponent]
})

export class FormModalComponent{ 
    model: Donor;
    @ViewChild(ResponseModalComponent)
    private responseModal: ResponseModalComponent;

    constructor(private _geo: GeolocationService, private _comm: CommService){
      this.model = new Donor('','','','','',0,0);
      var model = this.model;
      this._geo.getLocation({'highAccuracy': true}).subscribe(
        function(position) { 
            model.lng = position.coords.longitude;
            model.lat = position.coords.latitude;
        }
      );
    }

    onSubmit() {
      var me = this;
      this._comm.saveDonor(this.model, function(result){
          document.getElementById("closeFormModal").click();
          if(result.status == "OK"){
              //OK Message
              me.responseModal.showDonor(result);
          } else {
              //Error Message
              me.responseModal.show("There was an error saving your data.<br>The error was: <br>"+result.err);
          }

          me.model = new Donor('','','','','',me.model.lat,me.model.lng);
      });
    }

    showDonor(id:string){
      var me = this;
      this._comm.getDonorById(id, function(result){
        if(result.status == "OK"){
          me.model = result;
          document.getElementById("formModalOpener").click();
        } else {
          //Error Message
            me.responseModal.show("There was an error finding your data.<br>The error was: <br>"+result.err);
        }
      })
    }

    deleteDonor(){
      var me = this;
      this._comm.deleteDonor(this.model._id, function(result){
        me.clearDonor();
        document.getElementById("closeFormModal").click();
      })
    }

    clearDonor(){
      this.model = new Donor('','','','','',this.model.lat,this.model.lng);
    }
}
    