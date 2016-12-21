import { Component } from '@angular/core';
import { NavController,LoadingController,Events } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ContactsService } from '../../providers/contacts'


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;

  constructor(public nav: NavController,public loadingController: LoadingController,public events: Events,public contact: ContactsService) {
    this.main_page = { component: TabsNavigationPage };
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
    events.subscribe('done',(promise)=>{
        alert(promise + ' Login success');
        try{
          this.loading.dismiss();
        }catch(e){
        }
        events.unsubscribe('done');
        events.unsubscribe('err');
        //contact.init();
        nav.setRoot(this.main_page.component);
    });

    events.subscribe('err',(err)=>{
      this.loading.dismiss();
      alert(err+' Login Failed');
    })
  }

  doLogin(){
    this.contact.init();
    this.nav.setRoot(this.main_page.component);
  }

  doFacebookLogin() {
    // this.nav.setRoot(this.main_page.component);
    // this.loading =  this.loadingController.create({
    //   content:''
    // });
    // this.loading.present();
    this.nav.setRoot(this.main_page.component);

  }

  doGoogleLogin() {
    this.contact.init();
    this.nav.setRoot(this.main_page.component);


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
