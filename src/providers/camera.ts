import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Camera } from 'ionic-native';
import { UUID } from 'angular2-uuid';
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
  constructor(public http: Http) {

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
      uploadTask = ref.putString(image,'base64').then((snap)=>{
        alert('File Uploaded');
      });
      uploadTask.on('state_changed',(snap)=>{
        let progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      });
    }),(err)=>{
      alert(err);
    };
  }
}
