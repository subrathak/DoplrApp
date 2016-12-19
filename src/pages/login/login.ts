import { Component } from '@angular/core';
import { NavController,LoadingController,Events } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AuthService } from '../../providers/auth'


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;

  constructor(public nav: NavController,public auth: AuthService,public loadingController: LoadingController,public events: Events) {
    this.main_page = { component: TabsNavigationPage };
    this.auth.init();
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
    events.subscribe('done',(promise)=>{
        alert('Google Login Success');
        this.loading.dismiss();
        events.unsubscribe('done');
        events.unsubscribe('error');
        nav.setRoot(this.main_page.component);
    });

    events.subscribe('err',(err)=>{
      this.loading.dismiss();
      alert(err+' Login Failed');
    })
  }

  doLogin(){
    this.loading =  this.loadingController.create({
      content:''
    });
    this.auth.login('Email',this.login.value.email,this.login.value.password,'').then((user)=>{
      this.loading.dismiss();
      alert('Login Successful');
      this.nav.setRoot(this.main_page.component);
    }).catch((err)=>{
      this.loading.dismiss();
        alert('Invalid Email or Password');
      });

  }

  doFacebookLogin() {
    // this.nav.setRoot(this.main_page.component);
    // this.loading =  this.loadingController.create({
    //   content:''
    // });
    // this.loading.present();
    this.auth.login('Facebook','','','')
  }

  doGoogleLogin() {
    this.loading =  this.loadingController.create({
      content:''
    });
    this.loading.present();
    this.auth.login('Google','','','');

    /*.then((user)=>{
      this.loading.dismiss();
      alert("Login Successful");
      this.nav.setRoot(this.main_page.component);
    }).catch((err)=>{
      this.loading.dismiss();
      alert(err.message);
    });*/
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
