  import { Injectable } from '@angular/core';
  import 'rxjs/add/operator/map';
  import { GooglePlus, Facebook, NativeStorage } from 'ionic-native';
  import { Events } from 'ionic-angular';
  import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

    constructor(public events: Events,public http: Http) {
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

      // this.makePostRequest(phone);
      this.http.post("http://46.101.189.72/otp/sendOTP", {phone:phone})
      .subscribe(data => {
        console.log(data.status);
        if(data.status===200){
          this.events.publish('SuccesslogOtp');
        }
        alert(data.json().data);
      }, error => {
          console.log(error);
      });
    }


    verifyOTP(otp:String){
      this.http.post("http://46.101.189.72/otp/verifyOTP", {otp:otp}) // ...using post request
      .subscribe(data => {
        console.log(data.status);
        if(data.status===200){
          this.events.publish('SuccesslogOtp');
        }
        console.log('Verify OTP ALERT');
        try{
          console.log(data.toString());
          console.log('a');
          console.log(data.json().token);
          console.log(data.json().success);
        }catch(e){
          console.log('exceptoion');
        }
        this.firebaseCustomLogin(data.json().token);
        this.events.publish('otpVerified');
      }, error => {
          try{
            console.log('Verify OTP');
            console.log(JSON.stringify(error));
          }catch(e){
            console.log("exception")
          }
      });
  }

    sendUserDataServer(name:String,gender:String,phone:Number){
      let self = this;
      console.log('SENDUSERDATASERVER S S S ');
      console.log(typeof phone);
         firebase.auth().currentUser.getToken().then((idToken)=>{
           console.log(idToken);
           self.http.post("http://46.101.189.72/user/addUser", {name:name,
                                                            gender:gender,
                                                           phone:phone,
                                                           idToken:idToken})
           .subscribe((data) => {
             if(data.status===200){
               // this.firebaseCustomLogin(data.data.token);
               self.events.publish('accountCreated');
             }
           }, (error) => {
             console.log('SENDUSERDATA ERROR');
               try{
                 console.log(JSON.stringify(error));
               }catch(e){
                 console.log("exception senduserdata");
               }
           });
}).catch(function(error) {
  // Handle error
});
    }

    firebaseCustomLogin(token){
      firebase.auth().signInWithCustomToken(token).then(()=>{
        alert('Firebase success');
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
  }
