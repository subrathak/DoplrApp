import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Camera } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the Camera provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CameraService {
  constructor(public http: Http) {

  }
  takePicture(){
    let options ={
      quality:70,
      allowEdit:true,
      correctOrientation:true,
      saveToPhotoAlbum:true
    }
    Camera.getPicture(options).then((image)=>{
      alert('Drop Complete');
    }),(err)=>{
      alert(err);
    };
  }
}
