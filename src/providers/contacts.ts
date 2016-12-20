import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Contacts, Contact, ContactField, ContactName,NativeStorage } from 'ionic-native';
import 'rxjs/add/operator/map';

declare var firebase;

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
    let flag = 0;
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
    /*Contacts.pickContact().then((contact)=>{
      var phoneNumbers = contact.phoneNumbers;
      var length = phoneNumbers.length;
      for(let i=0;i<length;i++){
        let x = this.numParse(phoneNumbers[i].value.split(' ').join(""));
        setTimeout(function(){
          ref.child('users').orderByChild('phone').equalTo(parseInt(x,10)).once('value',(snap)=>{
            if(!snap.exists()){
              alert('Doesnt exist');
            }else{
              alert('Does Exist');
            }
          })
        },50)
      }
    })*/
    /*ref.child('users').orderByChild('phone').equalTo(917387920029).once('value',(snap)=>{
      try{
        if(snap.exists()){
          alert('This is it 7387');
        }else{
          alert("Not It 7387");
        }
      }catch(e){
        alert("Some Error");
      }
    },(err)=>{
      alert(JSON.stringify(err));
    });
    ref.child('users').orderByChild('phone').equalTo(1234567890).on('value',(snap)=>{
      try{
        if(snap.exists()){
          alert('This is it 1234');
        }else{
          alert("Not It " + 1234);
        }
      }catch(e){
        alert("Some Error");
      }
    },(err)=>{
      alert(JSON.stringify(err));
    });*/
    Contacts.find(['*'],{}).then((contacts)=>{
      var length = contacts.length;
      for(let i = 0;i<length;i++){
        let phone = contacts[i].phoneNumbers;
        if(!phone){
          continue;
        }
        let phoneLength = phone.length
        for(let j = 0;j<phoneLength;j++){
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
              ref.orderByChild('phone').equalTo(parseInt(query,10)).once('value',(snap)=>{
                x++;
                console.log(y-x);
                if(query === '917387920029'){
                  alert('Something is wrong');
                }
                if(!snap.exists()){
                  //console.log('Query ' + query + ' not found');
                  nonExisitingNums.push(parseInt(query,10));
                  if((y-x)===0){
                    clearTimeout(timeout);
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
                  }
                }
                else{
                  //console.log('Query ' + query + ' found');
                  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                  existingNums.push(parseInt(query,10));
                  if((y-x)===0){
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
}
