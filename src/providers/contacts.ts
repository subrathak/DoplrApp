import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Contacts, Contact, ContactField, ContactName,NativeStorage } from 'ionic-native';
import { Events } from 'ionic-angular'
import 'rxjs/add/operator/map';

declare var firebase;

/*
  Generated class for the Contacts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsService {
  constructor(public events:Events) {

  }
  sync(){

  }
  numParse(num:string){
    let plusIndex = num.indexOf('+');
    if(plusIndex!=-1){
      return num.substr(plusIndex+1);
    }
    if(num.indexOf('-')!=-1){
      return num.split('-').join("");
    }
    if(num.length === 10){
      return '91'+num;
    }
    else{
      return num;
    }
  }

  init(){
    let existingNums = [];
    let nonExisitingNums = [];
    let x = 0,y = 0;
    let id = 0;
    let ref:any=firebase.database().ref('/');
    let timeout = setTimeout(function(){
      ref.child('users').off();
      firebase.database().ref('tests/valid').set(existingNums).then(()=>{
        console.log('DOne');
      });
      firebase.database().ref('tests/invalid').set(nonExisitingNums).then(()=>{
        console.log('DOne');
      });
      NativeStorage.setItem('contacts',{
        existingNums:existingNums,
        nonExisitingNums:nonExisitingNums
      });
    },240000)
    Contacts.find(['*'],{}).then((contacts)=>{
      var length = contacts.length;
      for(let i = 0;i<length;i++){
        let phone = contacts[i].phoneNumbers;
        if(!phone){
          continue;
        }
        let phoneLength = phone.length
        for(let j = 0;j<phoneLength;j++){
          let flag = false;
          let query = this.numParse(phone[j].value.split(' ').join(""));
          let prev = '0';
          if(j){
            prev = this.numParse(phone[j-1].value.split(' ').join(""))
          }
          setTimeout(function(){
            if(query === prev){
              return;
            }
            y++;
            setTimeout(function(){
              console.log('Querying firebase '+query);
              ref.child('users').orderByChild('phone').equalTo(parseInt(query,10)).once('value',(snap)=>{
                x++;
                console.log(y-x);
                if(!snap.exists()){
                  nonExisitingNums.push(parseInt(query,10));
                }
                else{
                  existingNums.push({
                    id:++id,
                    name:contacts[i].displayName,
                    phone:parseInt(query,10)
                  });
                }
                if((y-x)===0){
                  clearTimeout(timeout);
                  firebase.database().ref('tests/valid').set(existingNums).then(()=>{
                    console.log('DOne');
                  });
                  firebase.database().ref('tests/invalid').set(nonExisitingNums).then(()=>{
                    console.log('DOne');
                  });
                  //console.log(existingNums);
                  //console.log(nonExisitingNums)
                  NativeStorage.setItem('contacts',{
                    existingNums:existingNums,
                    nonExisitingNums:nonExisitingNums
                  });
                }
              },(err)=>{
                alert(JSON.stringify(err));
              });
            },70)
          },50);
        }
      }
    }).catch((err)=>{
      alert(err);
    });
  }

  generateContacts(){
    NativeStorage.getItem("contacts").then((contacts)=>{
      console.log(contacts);
      this.events.publish('gotContacts',contacts);
    }).catch((err)=>{
      alert(JSON.stringify(err))
    })
  }
}
