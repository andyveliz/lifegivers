import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MapComponent } from './map.component';
import { FormModalComponent } from './form-modal.component';
import { CommService } from '../services/comm.service';

declare var io: any;

@Component({
    directives: [MapComponent, FormModalComponent],
    providers: [CommService],
    selector: 'lifegivers-app',
    template:
    `
    <div>
    <esri-map #mapView >
    </esri-map>
    </div>
    <the-modal #formModal></the-modal>
    `
})
export class AppComponent implements OnInit{

    @ViewChild(FormModalComponent)
    private formModal: FormModalComponent;

    constructor(private _comm: CommService){
        this._comm.setSocket(io('http://localhost:8000'));
    }

    ngOnInit() {
        var url = window.location.search;
        if(url != ""){
            var id = url.substring(1,url.length);
            this.formModal.showDonor(id);

        }
    }
}