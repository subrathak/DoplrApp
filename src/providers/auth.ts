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

    return firebase.auth().signInWithEmailAndPassword(email,password)


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
