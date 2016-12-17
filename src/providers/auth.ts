import { Injectable,ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GooglePlus } from 'ionic-native';
import { LoginPage } from '../pages/login/login'
declare var firebase;

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  public nav: NavController;

  constructor(public http: Http) {
  }
  //LogIn
  login(method:String,email:String,password:String,callback){
    switch(method)
    {
      case 'Email':{
        firebase.auth().signInWithEmailAndPassword(email,password).then((user)=>{
          callback(user);
        }).catch((err)=>{
          if(err)alert(err.message);
        });
        break;
      }
      case 'Google':{
        GooglePlus.trySilentLogin({
          scope:'',
          webClientId:'446843274237-18gjo8peimndukpnns566jqrbh19lk3r.apps.googleusercontent.com',
          offline:true
        }).then((creds)=>{
          alert(creds.idToken);
          let provider = firebase.auth.GoogleAuthProvider.credential(creds.idToken,creds.accessToken);
          firebase.auth().signInWithCredential(provider).then((success) =>
                {
                    alert('Google Login Success');
                    callback(success);
                    alert('callbak was cald');
                }, (error) =>
                {
                    alert("Google Login Error");
          });
        }).catch((err)=>{
          GooglePlus.login({
            scope:'',
            webClientId:'446843274237-18gjo8peimndukpnns566jqrbh19lk3r.apps.googleusercontent.com',
            offline:true
          }).then((creds)=>{
            let provider = firebase.auth.GoogleAuthProvider.credential(creds.idToken,creds.accessToken);
            firebase.auth().signInWithCredential(provider).then((success) =>
                  {
                      alert('Google Login Success');
                      callback(success);
                  }, (error) =>
                  {
                      alert("Google Login Error");
            });
          }).catch((err)=>{
            alert('Login Error' + err.message);
          })
        })
        break;
      }
    }
  }

  //SignUp
  signUp(email:String,password:String,callback){
    firebase.auth().createUserWithEmailAndPassword(email,password).then((success)=>{
      alert('Sign Up Successful');
      callback(success);
    }).catch((err)=>{
      alert(err.message);
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
