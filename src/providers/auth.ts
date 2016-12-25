import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { GooglePlus, Facebook, NativeStorage } from 'ionic-native';
import { Events } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HTTP } from 'ionic-native';

declare var firebase;
declare var FCMPlugin;


/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  usersRef: any = firebase.database().ref('users');

  constructor(public events: Events,public http: Http) {
  }
  //LogIn
  // login(method:String,email:String,password:String,callback){
  //   return firebase.auth().signInWithEmailAndPassword(email,password);
  // }
  //SignUp
  // signUp(email:String,password:String,callback){
  //   firebase.auth().createUserWithEmailAndPassword(email,password).then((success)=>{
  //     callback(success,null);
  //   }).catch((err)=>{
  //     callback(null,err);
  //   });
  // }
  //Get Current User
  getUser(){
    return firebase.auth().currentUser;
  }
  //SignOut
  signOut(){
    firebase.auth().signOut();
  }

  getOTP(phone:String){

    // this.makePostRequest(phone);
    this.http.post("http://46.101.189.72/otp/sendOTP", {phone:phone})
    .subscribe(data => {
      console.log(data.status);
      if(data.status===200){
        NativeStorage.setItem('tempToken',{
          tempToken:data.json().tempToken
        }).then((done)=>{
          alert('publishing now');
          this.events.publish('SuccesslogOtp');
        })
      }
    }, error => {
        console.log(error);
    });
  }


  verifyOTP(otp:String){
    let self = this;
    NativeStorage.getItem('tempToken').then((token)=>{
      console.log(token.tempToken);
      console.log('Verify Token');
      HTTP.post("http://46.101.189.72/otp/verifyOTP",{otp:otp,token:token.tempToken},{}).then((res)=>{
        let data = JSON.parse(res.data);
        this.firebaseCustomLogin(data.token);
        alert('Supposed to alert otpVerified');

        NativeStorage.setItem('tokens',{
            token:data.token,
            jwtToken:data.refreshToken
        });
      }).catch((err)=>{
        try{
              console.log(JSON.stringify(err));
            }catch(e){
              console.log(err);
            }
      })
    })

    // this.http.post("http://46.101.189.72/otp/verifyOTP", {otp:otp}) // ...using post request
    // .subscribe(data => {
    //   let res = data.json();
    //   this.firebaseCustomLogin(data.json().token);
    //   this.events.publish('otpVerified');
    //   NativeStorage.setItem('tokens',{
    //     token:res.token,
    //     jwtToken:res.refreshToken
    //   });
    // }, error => {
    //     try{
    //       console.log(JSON.stringify(error));
    //     }catch(e){
    //       console.log("exception")
    //     }
    // });
}

  sendUserDataServer(name:String,gender:String,phone:Number){
    let self = this;
    console.log('SENDUSERDATASERVER S S S ');
    console.log(typeof phone);
       firebase.auth().currentUser.getToken(true).then((idToken)=>{
         console.log(idToken);
      try{
        console.log('new req');
        HTTP.post("http://46.101.189.72/users/addUser", {name:name,gender:gender,phone:phone,idToken:idToken},{}).then((data) => {
           console.log("DATA WAS SENT");
           if(data.status===200){
             console.log("DATA WAS SUCCESSFUL");
             // this.firebaseCustomLogin(data.data.token);
             try{
               self.events.publish('accountCreated');
             }catch(e){
               console.log(e);
             }
           }
         }, (error) => {
           console.log('SENDUSERDATA ERROR');
             try{
               console.log(JSON.stringify(error));
               console.log(error);
             }catch(e){
               console.log("exception senduserdata");
             }
         });
      }catch(e){
        console.log(e);
        console.log('exception');
      }
}).catch((error)=>{
console.log('Empty Error Handler');
console.log(error);
console.log(JSON.stringify(error));
});
  }

  firebaseCustomLogin(token){
    firebase.auth().signInWithCustomToken(token).then(()=>{
      console.log("Firebase Success");
      this.events.publish('otpVerified');
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Firebase giving me errors');
      console.log(error.message);
      console.log(error.code);
  });
}

  // makePostRequest(phone) {
  //   // this.events.publish('SuccesslogOtp');
  //   let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  //   let options       = new RequestOptions({ headers: headers });
  //     this.http.post("http://46.101.189.72/otp/sendOTP", {phone:phone},options)
  //     .map((data) => {
  //       console.log(data.status);
  //       if(data.status===200){
  //         this.events.publish('SuccesslogOtp');
  //       }
  //     }, (error) => {
  //         console.log(JSON.stringify(error));
  //     });
  // }
  //Auth Observer
  authObserver(){
    return firebase.auth().onAuthStateChanged();
  }

  sendFcmToken(){
    FCMPlugin.getToken().then((token)=>{
      console.log(token);
      NativeStorage.getItem('tokens').then((tokens)=>{
        firebase.auth().currentUser.getToken(true).then((idToken)=>{
          HTTP.post("http://46.101.189.72/location/addFcmToken",{
            idToken:idToken,
            token:token,
            jwtToken:tokens.jwtToken
          },{}).then((res)=>{
            if(res.status===200){
              console.log('Successfully registered for fcm');
            }
          }).catch((err)=>{
            let error = JSON.parse(err.error);
            console.log(error.error);
          })
        })

      })
    }).catch((err)=>{

    })
  }
}
