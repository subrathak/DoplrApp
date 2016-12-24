import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { NotificationsPage } from '../notifications/notifications';
import { MapPage } from '../map/map';
import { NativeStorage } from 'ionic-native';


@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;

  constructor(public nav: NavController,public events: Events) {
    this.tab1Root = ListingPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = NotificationsPage;
    this.tab4Root = MapPage;

  }
}
