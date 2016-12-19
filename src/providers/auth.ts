  import { Injectable } from '@angular/core';
  import 'rxjs/add/operator/map';
  import { GooglePlus, Facebook, NativeStorage } from 'ionic-native';
  import { Events } from 'ionic-angular'

  declare var firebase;

  /*
    Generated class for the Auth provider.

    See https://angular.io/docs/ts/latest/guide/dependency-injection.html
    for more info on providers and Angular 2 DI.
  */
  @Injectable()
  export class AuthService {
    FB_APP_ID: number = 1776633459256045;
    constructor(public events: Events) {

    }
    //LogIn
    login(method:String,email:String,password:String,callback){
      switch(method)
      {
        case 'Email':
          return firebase.auth().signInWithEmailAndPassword(email,password)/*.then((user)=>{
            callback(user,null);
          }).catch((err)=>{
            callback(null,err);
          });*/

        case 'Google':
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
          break;
        case 'Facebook':
          // let promise:any;
          // Facebook.getLoginStatus().then((creds)=>{
          //   alert("Middle");
          //   if(creds.status == "connected"){
          //     let facebookCredential = firebase.auth.FacebookAuthProvider.credential(creds.authResponse.accessToken);
          //     promise =  firebase.auth().signInWithCredential(facebookCredential).then((success) =>
          //           {
          //               this.events.publish('done',success);
          //           }, (error) =>
          //           {
          //               this.events.publish('err','Firebase');
          //     });
          //   } else{
          //     alert("First");
          //     this.fbLogin();
          //   }
          // });
          this.fbLogin();
          break;

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

    disconnect(){
      GooglePlus.disconnect();
    }
    //facebook login
    fbLogin(){
      let permissions = new Array<string>();
      permissions = ["public_profile"];
      Facebook.login(permissions)
        .then((creds)=>{
          let facebookCredential = firebase.auth.FacebookAuthProvider.credential(creds.authResponse.accessToken);
          this.createUserFromFacebook(creds.authResponse.userID);
          firebase.auth().signInWithCredential(facebookCredential).then((success) =>
                {
                    this.events.publish('done',success);
                }, (error) =>
                {
                    this.events.publish('err','Firebase');
          });
        }).catch((err)=>{
          alert("Second");
          this.events.publish('err','Facebook');
        });
      }

  init(){
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
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

    createUserFromFacebook(userId){
      // let userId = userID;
      let params = new Array<string>();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user',
        {
          userID: userId,
          name: user.name,
          gender: user.gender,
          picture: user.picture
        });
      });
      NativeStorage.getItem('user')
      .then(function(user){
        alert(user.name);
        firebase.database().ref('users/'+this.NativeStorage.getItem('user').userID.set(user));
      });
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
