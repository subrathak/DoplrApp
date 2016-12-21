import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {
  phone: AbstractControl;
  otp: FormGroup;
  public name: string = 'WalkthroughPage'
  slide_options = {
    pager: true
  };
  lastSlide = false;
  login:any;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController,
  public authService: AuthService,
  public fb: FormBuilder){
    this.otp = this.fb.group({
    'phone': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    this.phone = this.otp.controls['phone'];
    this.login = false;

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.push(LoginPage);
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  doLogin(signInForm: any){
    this.authService.getOTP(signInForm.phone);
    this.goToLogin();

  }
}
