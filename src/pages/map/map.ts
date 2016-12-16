import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 Geolocation
} from 'ionic-native';
import { CameraService } from '../../providers/camera'

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  public map: GoogleMap;
  constructor(public navCtrl: NavController,public camera:CameraService) {}

  ngAfterViewInit() {
    this.loadMap();
  }
  loadMap(){
    GoogleMap.isAvailable().then((bool)=>{
      Geolocation.getCurrentPosition().then((pos)=>{
        var position = new GoogleMapsLatLng(pos.coords.latitude,pos.coords.longitude);
        this.map = new GoogleMap('map', {
              'backgroundColor': 'white',
              'controls': {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': false
              },
              'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
              },
              'camera': {
                'latLng': position,
                'tilt': 30,
                'zoom': 15,
                'bearing': 50
              }
        });
        this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
          alert('Map Ready');
        }).catch((err)=>{
          alert(err);
        });
      })
    }).catch((err)=>{
      alert(err);
    });
  }

  addMarker(){
    this.camera.takePicture();
  }
}
