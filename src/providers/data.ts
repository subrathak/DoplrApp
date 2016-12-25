import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';

declare var io;

declare var firebase;

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {
  socket:any;
  namespaces:any;
  sockets:any;
  events:any;
  got:number;
  URL:String="http://localhost:3000/";
  constructor(public http: Http) {

  }
  init(id,phone){
    this.socket = io(this.URL);
    this.socket.emit('getTaggedDrops',{
      id:id,
      phone:phone
    });
    this.socket.on('gotDrops',function(data){
      data.forEach((namespace,i)=>{
        this.namespaces.push(namespace);
      });
    })
  }

  addListeners(){
    this.namespaces.forEach((namespace,i)=>{
      this.sockets[i] = io(URL+namespace);
    })
  }
  getDrops(amount){

  }
}
