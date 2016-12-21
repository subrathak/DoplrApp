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

    //
    // makeGetRequest() {
    //     HTTP.get("http://46.101.189.72/otp/sendOTP")
    //     .subscribe(data => {
    //         var alert = Alert.create({
    //             title: "Your IP Address",
    //             subTitle: data.json().origin,
    //             buttons: ["close"]
    //         });
    //         this.nav.present(alert);
    //     }, error => {
    //         console.log(JSON.stringify(error.json()));
    //     });
    // }

    makePostRequest(phone) {
        HTTP.post("http://46.101.189.72/otp/sendOTP", {phone:phone},{})
        .then((data) => {
          console.log(JSON.stringify(data));
            // var alert = Alert.create({
            //     title: "Data String",
            //     subTitle: data.json().data,
            //     buttons: ["close"]
            // });
            // this.nav.present(alert);
        }, (error) => {
            console.log(JSON.stringify(error));
        });
    }

    // addUser(username: string, phone: string, uid: string) {
    //     this.usersRef.child(uid).update({
    //         username: username,
    //         phone: phone
    //     });
    // }

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
