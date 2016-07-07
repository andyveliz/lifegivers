import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import MapService from '../services/map.service';
import { MapView, Locate, SimpleMarkerSymbol, PictureMarkerSymbol, Point, Graphic, webMercatorUtils } from 'esri-mods';
import { GeolocationService } from '../services/geolocation.service'
import { CommService } from '../services/comm.service';
import { Donor }    from '../models/donor';

declare var dojo: any;

@Component({
    selector: 'esri-map',
    template: '<div id="viewDiv"><ng-content></ng-content></div>',
    providers: [MapService, GeolocationService]
})
export class MapComponent {

  @Output() viewCreated = new EventEmitter();
  
  view: MapView;
  locateBtn: Locate;
  donors: any = {};
  
  constructor(private _service: MapService, private _geo: GeolocationService, private _comm:CommService, private elRef:ElementRef) {
      _comm.newDonor$.subscribe(
          donor => {
              if(!this.donors.hasOwnProperty(donor._id))
                  this.addMarker(donor);
              this.donors[donor._id] = donor;
          }
      );

      _comm.removeDonor$.subscribe(
          id => {
              if(this.donors.hasOwnProperty(id)){
                    this.removeMarker(id);
                    delete this.donors[id];
              }
          }
      )
  }
  
  ngOnInit() {
    this.view = new MapView({
      container: this.elRef.nativeElement.firstChild,
      map: this._service.map,
      zoom: 4
    });
    
    this.locateBtn = new Locate({
	    view: this.view
	});
	
    this.locateBtn.startup();

	this.view.ui.add(this.locateBtn, {
	    position: "top-left",
		index: 0
	});

    var me = this;

    //Handler to watch map movements
    var handle = this.view.watch('extent', function(newValue, oldValue, property, object) {
        var from = webMercatorUtils.xyToLngLat(newValue.xmin, newValue.ymin);
        var to = webMercatorUtils.xyToLngLat(newValue.xmax, newValue.ymax);

        me._comm.getDonorsInArea(from, to, function(donorsList){
            //Add or Update current donors list
            donorsList.forEach(donor => {
                if(!me.donors.hasOwnProperty(donor._id))
                    me.addMarker(donor);
                me.donors[donor._id] = donor;
            });
            //Delete donors from current list
            for(var id in me.donors){
                var donor = me.donors[id];
                var toDelete = true;
                donorsList.forEach(newDonor => {
                    if(newDonor._id == donor._id) toDelete = false;
                });
                if(toDelete) {
                    me.removeMarker(donor._id);
                    delete me.donors[id];
                }
            }
        });
    });

    // Event handler that fires each time an show information action is clicked.
    this.view.popup.on("trigger-action", function(evt) {
        // Execute the showInfo function
        if (evt.action.id === "show-info") {
          me.showInfo();
        } else if(evt.action.id === "create-new"){
            document.getElementById("formModalOpener").click();
        }
      });

    var view = this.view;

    this.view.on("click", function(evt){
        
    });

    this._geo.getLocation({'highAccuracy': true}).subscribe(
        function(position) { 
            view.goTo({
                target: [position.coords.longitude,position.coords.latitude],
                scale: 10000
            });
            var mySymbol = new SimpleMarkerSymbol({
                size: 10,
                color: "#FF4000",
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 64, 0, 0.4], // autocasts as new Color()
                    width: 7
                }
            });
            
            var myPoint = new Point( {"x": position.coords.longitude, "y": position.coords.latitude," spatialReference": {" wkid": 4326 } });

            var myPopup = {
                title:"Current Location", 
                content:'<ul><li><strong>Longitude:</strong> {longitude}</li><li><strong>Latitude:</strong> {latitude}</li></ul>',
                actions:[{
                    title: "Register as a Donor from Here",
                    id:"create-new"
                }]
            };

            view.graphics.add(new Graphic({geometry:myPoint, symbol:mySymbol, attributes:position.coords, popupTemplate: myPopup}));
        }
    );

  }

  addMarker(donor: Donor){
    var mySymbol = new PictureMarkerSymbol({
        url: "https://www.blood.ca/sites/default/files/blood-drop-lg.png",
        width: "18px",
        height: "27px"
    });
    
    var myPoint = new Point( {"x": donor.lng, "y": donor.lat," spatialReference": {" wkid": 4326 } });

    var popup = {
        title:"{name}", 
        content:'<ul><li><strong>Name:</strong> {name}</li><li><strong>Blood Group:</strong> {bloodtype}</li><li><strong>Longitude:</strong> {lng}</li><li><strong>Latitude:</strong> {lat}</li></ul>',
        actions:[{
            title: "Show information",
            id:"show-info"
        }]
    };

    

    this.view.graphics.add(new Graphic({geometry:myPoint, symbol:mySymbol, attributes: donor, popupTemplate: popup }));
  }

  showInfo(){
      var attrs = this.view.popup.selectedFeature.attributes;
      console.log(attrs);
      this.view.popup.content = '<ul><li><strong>Name:</strong> '+attrs.name+'</li><li><strong>E-Mail:</strong> '+attrs.email+'</li><li><strong>Phone:</strong> '+attrs.phone+'</li><li><strong>Blood Group:</strong> '+attrs.bloodtype+'</li><li><strong>Longitude:</strong> '+attrs.lng+'</li><li><strong>Latitude:</strong> '+attrs.lat+'</li></ul>'
  }

  removeMarker(id: string){
      this.view.graphics.items.forEach(g => {
          if(g.attributes.hasOwnProperty("_id") && g.attributes._id == id )
            this.view.graphics.remove(g);
      });
  }
}