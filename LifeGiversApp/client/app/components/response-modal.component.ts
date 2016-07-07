import { Component } from '@angular/core';
import { Donor }    from '../models/donor';

@Component({
    selector: 'the-modal2',
    template:
    `
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
})

export class ResponseModalComponent { 
    content:string;

    constructor(){
        this.content = "...";
    }

    show(_content:string){
        this.content = _content;
        document.getElementById("openModalButton").click();
    }
    showDonor(_donor:Donor){
        var url = window.location.protocol + "//" + window.location.host + "/?"+_donor._id;
        this.content =  '<div class="alert alert-success" role="alert">The Donor has been saved correctly.<br>'+
                        'You can use the following link to update your data.<br>'+
                        '<a href="'+url+'">'+url+'</a><br>'+
                        'This link has been emailed to you ('+_donor.email+').</div>'
        document.getElementById("openModalButton").click();
    }
}
    