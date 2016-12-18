import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { GooglePlus } from 'ionic-native';
import { Events } from 'ionic-angular'
declare var firebase;

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  constructor(public events: Events) {
  }
  //LogIn
  login(method:String,email:String,password:String,callback){
    switch(method)
    {
      case 'Email':{
        return firebase.auth().signInWithEmailAndPassword(email,password)/*.then((user)=>{
          callback(user,null);
        }).catch((err)=>{
          callback(null,err);
        });*/
      }
      case 'Google':{
        let promise:any;
        GooglePlus.trySilentLogin({
          scope:'',
          webClientId:'446843274237-18gjo8peimndukpnns566jqrbh19lk3r.apps.googleusercontent.com',
          offline:true
        }).then((creds)=>{
          let provider = firebase.auth.GoogleAuthProvider.credential(creds.idToken,creds.accessToken);
          promise =  firebase.auth().signInWithCredential(provider).then((success) =>
                {
                    this.events.publish('done',success);
                }, (error) =>
                {
                    this.events.publish('err','Firebase');
          });
        }).catch((err)=>{
          alert(err);
          this.googleLogin();
        });
      }
    }
  }
  //GoogleLogin
  googleLogin(){
    let promise:any;
    GooglePlus.login({
      scope:'',
      webClientId:'446843274237-18gjo8peimndukpnns566jqrbh19lk3r.apps.googleusercontent.com',
      offline:true
    }).then((creds)=>{
      let provider = firebase.auth.GoogleAuthProvider.credential(creds.idToken,creds.accessToken);
      firebase.auth().signInWithCredential(provider).then((success) =>
            {
                this.events.publish('done',success);
            }, (error) =>
            {
                this.events.publish('err','Firebase');
      });
    }).catch((err)=>{
      this.events.publish('err','Google');
    });
  }
  //SignUp
  signUp(email:String,password:String,callback){
    firebase.auth().createUserWithEmailAndPassword(email,password).then((success)=>{
      callback(success,null);
    }).catch((err)=>{
      callback(null,err);
    });
  }

  //Get Current User
  getUser(){
    return firebase.auth().currentUser;
  }

  //SignOut
  signOut(){
    firebase.auth().signOut();
  }

  //Auth Observer
  authObserver(callback){
    return firebase.auth().onAuthStateChanged(function(user){
      if(user){
        if(user.emailVerified){
          callback(user);
        }
        else{
          user.sendEmailVerification().then((success)=>{
            alert("Verification Email Sent");
          }),(err)=>{
            alert("Error");
          }
        }
      }
      else{
        callback(user);
      }
    });
  }


}
