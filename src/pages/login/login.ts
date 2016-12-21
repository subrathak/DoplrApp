import { Component } from '@angular/core';
import { NavController,LoadingController,Events,NavParams } from 'ionic-angular';
import { FormBuilder,FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ContactsService } from '../../providers/contacts'
import { NativeStorage } from 'ionic-native';
import { AuthService } from '../../providers/auth'


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  verifyOTP: FormGroup;
  main_page: { component: any };
  loading: any;
  gender: "Female";
  name:String;

  constructor(public nav: NavController,
    public loadingController: LoadingController,
    public events: Events,
    public contact: ContactsService,
    public navParams:NavParams,
    public authService: AuthService) {
    this.main_page = { component: TabsNavigationPage };
    this.verifyOTP = new FormGroup({
      name: new FormControl('', Validators.required),
      otp: new FormControl('test', Validators.required)
    });

    events.subscribe('err',(err)=>{
      this.loading.dismiss();
      alert(err+' Login Failed');
    });
    events.subscribe('otpVerified',()=>{
      authService.sendUserDataServer(this.name,this.gender,this.navParams.get('phone'));
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
    // this.nav.setRoot(this.main_page.component);
  }

gotoMainActivity(){
  this.contact.init();
  this.nav.setRoot(this.main_page.component);

}


}
