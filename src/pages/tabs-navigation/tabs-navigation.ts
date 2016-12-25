import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { NotificationsPage } from '../notifications/notifications';
import { MapPage } from '../map/map';
import { AuthService } from '../../providers/auth';
import { DataService } from '../../providers/data';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;
  feedArray:any;
  loaded:number=0;
  constructor(public nav: NavController,public events: Events,public auth:AuthService,public data:DataService) {
    this.tab1Root = ListingPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = NotificationsPage;
    this.tab4Root = MapPage;
  }
  ngOnInit(){
    this.auth.sendFcmToken();
  }
  getDrops(amount){
    let length = this.data.sockets.length;
    for(let i=length-1-this.loaded,j=this.loaded;i>=(length-amount-this.loaded);i--,j++){
      this.data.sockets[i].on('takeDrop',(drop)=>{
        this.feedArray[j] = {
          index:i,
          pic:drop.pic,
          comments:drop.comments,
          likes:drop.likes
        };
        if(i===length-amount-this.loaded){
          this.loaded = this.loaded+amount
        }
      });
      this.data.sockets[i].on('likedDrop',function(){
        this.feedArray[j].likes++;
      });
      this.data.sockets[i].on('dropcomment',function(comment){
        this.feedArray[j].comments.push(comment);
      });
      this.data.sockets[i].on('unlikedDrop',function(){
        this.feedArray[j].likes--;
      });
    }
  }

  like(index){
    //other parameters to be added for identification
    this.data.sockets[index].emit('like');
  }
  unlike(index){
    //other parameters to be added for identification
    this.data.sockets[index].emit('unlike');
  }
  comment(text,index){
    //other parameters to be added for identification
    this.data.sockets[index].emit('comment',text);
  }
}
