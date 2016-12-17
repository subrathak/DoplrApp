import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public nav: NavController,public auth: AuthService) {
    this.main_page = { component: TabsNavigationPage };

    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
  }

  doLogin(){
    console.log(this.login.value);
    this.auth.login('Email',this.login.value.email,this.login.value.password,function(user){
      this.nav.setRoot(this.main_page.component);
    });

  }

  doFacebookLogin() {
    this.nav.setRoot(this.main_page.component);
  }

  doGoogleLogin() {
    this.nav.setRoot(this.main_page.component);
    this.auth.login('Google','','',function(user){
      this.nav.setRoot(this.main_page.component);
    });
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
