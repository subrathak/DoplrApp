import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Contacts, Contact, ContactField, ContactName } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the Contacts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsService {

  constructor(public http: Http) {

  }
  sync(){

  }
  
  init(){
    Contacts.find(['phoneNumbers','displayNames'],{}).then((contacts)=>{

    }).catch((err)=>{

    });
  }
}
