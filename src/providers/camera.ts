import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Camera,Geolocation } from 'ionic-native';
import { UUID } from 'angular2-uuid';
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
  storage = firebase.storage();
  storageRef = this.storage.ref();
  constructor(public http: Http,public events:Events) {

  }
  takePicture(){
    let options ={
      destinationType:0,
      quality:70,
      allowEdit:true,
      correctOrientation:true,
      saveToPhotoAlbum:true
    }
    let uuid = UUID.UUID();
    let ref = this.storageRef.child('drops/'+uuid);
    let uploadTask;
    Camera.getPicture(options).then((image)=>{
      Geolocation.getCurrentPosition({
        maximumAge:0,
        timeout:3000,
        enableHighAccuracy:true
      }).then((location)=>{
        this.events.publish('picTaken',image,location);
      }).catch((err)=>{
        alert(JSON.stringify(err));
      })
      this.events.subscribe('dropComplete',(res,imag)=>{
        if(res.success){
          uploadTask = ref.putString(imag,'base64').then((snap)=>{
            alert('File Uploaded');
          });
        }else{
          alert(res.error);
        }
      })
    }),(err)=>{
      alert(err);
    };
  }
}
