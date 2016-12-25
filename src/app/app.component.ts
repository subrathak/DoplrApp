import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App,Events } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage } from 'ionic-native';
import { LoginPage } from '../pages/login/login'
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { FormsPage } from '../pages/forms/forms';
import { LayoutsPage } from '../pages/layouts/layouts';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { HTTP } from 'ionic-native';
import { Push } from 'ionic-native';
declare var firebase;

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;

  pages: Array<{title: string, icon: string, component: any}>;
  pushPages: Array<{title: string, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public events: Events
  ) {

    platform.ready().then(() => {
      NativeStorage.getItem('tokens').then((tokens)=>{
        if(!tokens.jwtToken){
          this.rootPage = WalkthroughPage;
        }else{
          this.rootPage = TabsNavigationPage;
        }
      });
      StatusBar.styleDefault();
      var push = Push.init({
        android: {
          senderID: "446843274237",
          topics:["MyHome"]
        }
      });
      push.on('registration', (data) => {
        console.log(data.registrationId);
        console.log(data.registrationId.toString());
      });
      push.on('notification', (data) => {
        console.log(data);
        console.log("Hi, Am a push notification from Doplr");
      });
      push.on('error', (e) => {
        console.log(e.message);

    });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();
    });

    this.pages = [
      { title: 'Home', icon: 'home', component: TabsNavigationPage },
      { title: 'Forms', icon: 'create', component: FormsPage }
    ];

    this.pushPages = [
      { title: 'Layouts', icon: 'grid', component: LayoutsPage },
      { title: 'Settings', icon: 'settings', component: SettingsPage }
    ];
  }
  ngOnInit(){

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
}
}
