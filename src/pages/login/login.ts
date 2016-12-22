import { Component } from '@angular/core';
import { NavController,LoadingController,Events,NavParams } from 'ionic-angular';
import { FormBuilder,FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ContactsService } from '../../providers/contacts'
import { NativeStorage } from 'ionic-native';
import { AuthService } from '../../providers/auth'
declare var firebase;


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  name: AbstractControl;
  otp: AbstractControl;
  verifyOTP: FormGroup;
  main_page: { component: any };
  loading: any;
  gender: "Female";
  alernateName:String;

  constructor(public nav: NavController,
    public loadingController: LoadingController,
    public events: Events,
    public contact: ContactsService,
    public navParams:NavParams,
    public authService: AuthService,
    public fb: FormBuilder){
    this.main_page = { component: TabsNavigationPage };
    this.verifyOTP = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'otp': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
});
this.name = this.verifyOTP.controls['name'];
    events.subscribe('err',(err)=>{
      this.loading.dismiss();
      alert(err+' Login Failed');
    });
    events.subscribe('otpVerified',()=>{
      console.log("Calling sendUserDataServer");
      alert("sendUserDataServer");
      this.authService.sendUserDataServer(this.alernateName,this.gender,this.navParams.get('phone'));
    });
    events.subscribe('accountCreated',()=>{
        this.gotoMainActivity();
    });
  }

  selectGender(value){
    this.gender = value;
  }

  doLogin(verifyOTPform: any){
    this.authService.verifyOTP(verifyOTPform.otp);
    this.nav.setRoot(this.main_page.component);

  }

  // doGoogleLogin() {
  //   firebase.auth().signInWithEmailAndPassword("b@a.com","abcdef").then((a)=>{
  //     this.contact.init();
  //     this.nav.setRoot(this.main_page.component);
  //   });
  //
  // }


gotoMainActivity(){
  this.contact.init();
  this.nav.setRoot(this.main_page.component);
}
}
