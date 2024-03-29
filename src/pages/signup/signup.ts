import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: FormGroup;
  main_page: { component: any };

  constructor(public nav: NavController, public modal: ModalController) {
    this.main_page = { component: TabsNavigationPage };

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required),
      confirm_password: new FormControl('test', Validators.required)
    });
  }

  doSignup(){
    this.nav.setRoot(this.main_page.component);
  }

  doFacebookSignup() {
    this.nav.setRoot(this.main_page.component);
  }

  doGoogleSignup() {
    this.nav.setRoot(this.main_page.component);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

}
