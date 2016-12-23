import { Injectable, NgZone } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName,NativeStorage,HTTP } from 'ionic-native';
import { Events } from 'ionic-angular'
import 'rxjs/add/operator/map';
import { UUID } from 'angular2-uuid';

declare var firebase;

/*
  Generated class for the Contacts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsService {
  storage = firebase.storage();
  storageRef = this.storage.ref();
  constructor(public events:Events,private zone: NgZone) {

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
    this.zone.runOutsideAngular(()=>{
      let existingNums = new Set();
      let nonExisitingNums = new Set();
      let x = 0,y = 0;
      let id = 0;
      let id1 = 0;
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
                    nonExisitingNums.add({
                      name:contacts[i].displayName,
                      phone:parseInt(query,10)
                    });
                  }
                  else{
                    existingNums.add({
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
                      existingNums:Array.from(existingNums),
                      nonExisitingNums:Array.from(nonExisitingNums)
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
    })

  }
  drop(latitude,longitude,image,friends){

    let uuid = UUID.UUID();
    let ref = this.storageRef.child('drops/'+uuid);
    console.log('drop auth.ts ' + latitude + ' ' + longitude);
    firebase.auth().currentUser.getToken(true).then((token)=>{
      HTTP.post('http://46.101.189.72/location/addDrop',{
        coords:{
          latitude:latitude,
          longitude:longitude,
        },
        idToken:token,
        friends:friends
      },{}).then((res)=>{
        try{
          res.data = JSON.parse(res.data);
        }catch(e){
          console.log(e.stackTrace);
          console.log(e);
        }
        if(res.status===200){
          setTimeout(function(){
            console.log(res.data);
          },150)
          ref.putString(image,'base64').then((snap)=>{
            alert('File Uploaded');
          }).catch((err)=>{
            alert("Error in file upload");
          });
        }else{
          console.log(res.status);
          alert(res.status);
          setTimeout(function(){
            console.log(res.data.error);
          },150)
        }
      }).catch((err)=>{
        try{
          console.log("Try Block Started");
          console.log(err.status);
          console.log(err.error);
          let error = JSON.parse(err.error);
          console.log('Parsing Done');
          console.log(error.error);
        }catch(e){
          console.log('err');
        }
      })
    }).catch((err)=>{
      console.log(JSON.stringify(err));
    })

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
