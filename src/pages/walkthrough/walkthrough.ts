import { Component, ViewChild } from '@angular/core';
import { NavController, Slides,Events,Alert } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth';
declare var firebase;
import {Http} from '@angular/http';

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
    public events: Events,
    public http: Http,
    public authService: AuthService,
    public fb: FormBuilder){
    this.http = http;
    this.otp = this.fb.group({
    'phone': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    this.phone = this.otp.controls['phone'];
    this.login = false;

    events.subscribe('SuccesslogOtp',()=>{
        nav.push(LoginPage,{
          phone:this.phone
        });
    });
  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  // makePostRequest(num) {
  //     this.http.post("http://46.101.189.72/otp/sendOTP", {phone:num})
  //     .subscribe(data => {
  //       alert({
  //           title: "Data String",
  //           subTitle: data.json().data,
  //           buttons: ["close"]
  //       });
  //     }, error => {
  //         console.log(JSON.stringify(error.json()));
  //     });
  // }
  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }



  goToSignup() {
    this.nav.push(SignupPage);
  }

  doLogin(signInForm: any){
    firebase.auth().signInWithEmailAndPassword("b@a.com","abcdef");
    // this.makePostRequest(signInForm.phone);
    this.authService.getOTP(signInForm.phone);


  }
}
