  import { Injectable } from '@angular/core';
  import 'rxjs/add/operator/map';
  import { GooglePlus, Facebook, NativeStorage } from 'ionic-native';
  import { Events } from 'ionic-angular'
  import { HTTP } from 'ionic-native';

  declare var firebase;


  /*
    Generated class for the Auth provider.

    See https://angular.io/docs/ts/latest/guide/dependency-injection.html
    for more info on providers and Angular 2 DI.
  */
  @Injectable()
  export class AuthService {
    usersRef: any = firebase.database().ref('users');

    constructor(public events: Events) {
    }
    //LogIn
    login(method:String,email:String,password:String,callback){
      return firebase.auth().signInWithEmailAndPassword(email,password);
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

    getOTP(phone:String){
      this.makePostRequest(phone);
    }

    verifyOTP(otp:String){
      HTTP.post("http://46.101.189.72/otp/verifyOTP", {otp:otp},{})
      .then((data) => {
        if(data.status===200){
          this.firebaseCustomLogin(data.data.token);
          this.events.publish('otpVerified');
          NativeStorage.setItem('serverTokens', {token: data.data.token, refreshToken: data.data.refreshToken})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
        }
      }, (error) => {
          console.log(JSON.stringify(error));
      });

    }

    sendUserDataServer(name:String,
       gender:String,phone:String){
         let token =" ";
         let refreshToken = " ";
         NativeStorage.getItem('serverTokens')
           .then(
             (data) => {   token = data.data.token;
                refreshToken = data.data.refreshToken;
                },
             (error) => console.error(error)
           );
      HTTP.post("http://46.101.189.72/otp/verifyOTP", {name:name,
                                                       gender:gender,
                                                      verifiedPhone:phone,
                                                      refreshToken:refreshToken},{})
      .then((data) => {
        if(data.status===200){
          // this.firebaseCustomLogin(data.data.token);
          this.events.publish('accountCreated');
        }
      }, (error) => {
          console.log(JSON.stringify(error));
      });
    }

    firebaseCustomLogin(token){
      firebase.auth().signInWithCustomToken(token).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
  // ...
    });
  }

    makePostRequest(phone) {
      this.events.publish('SuccesslogOtp');
        HTTP.post("http://46.101.189.72/otp/sendOTP", {phone:phone},{})
        .then((data) => {
          console.log(data.status);
          if(data.status===200){
            this.events.publish('SuccesslogOtp');
          }
        }, (error) => {
            console.log(JSON.stringify(error));
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
