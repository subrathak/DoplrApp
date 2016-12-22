import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Camera,Geolocation } from 'ionic-native';
import { Events } from 'ionic-angular'
import 'rxjs/add/operator/map';
declare var firebase;

/*
  Generated class for the Camera provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class CameraService {
  constructor(public events: Events) {
  }
  takePicture(){
    let options ={
      destinationType:0,
      quality:70,
      allowEdit:true,
      correctOrientation:true,
      saveToPhotoAlbum:true
    }
    let uploadTask;
    Camera.getPicture(options).then((image)=>{
      Geolocation.getCurrentPosition({
        maximumAge:3000,
        timeout:6000,
        enableHighAccuracy:true
      }).then((location)=>{
        console.log('Location is ' + location.coords.latitude + ' ' + location.coords.longitude);
        let lat = location.coords.latitude;
        let long = location.coords.longitude;
        this.events.publish('picTaken',image,lat,long);
      }).catch((err)=>{
        console.log(err);
        console.log(err.code);
        console.log(err.message);
        alert('Turn on the GPS');
      })
    }),(err)=>{
      alert(err);
    };
  }
}
