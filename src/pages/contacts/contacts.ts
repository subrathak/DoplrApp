import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular'
import { ContactsService } from '../../providers/contacts'

/*
  Generated class for the Contacts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  contacts = [];
  selectedContacts = [];
  constructor(public navCtrl: NavController,public events: Events,public contact:ContactsService,public navParams: NavParams) {
    events.subscribe('gotContacts',(contacts)=>{
      events.unsubscribe('gotContacts');
      this.contacts = contacts[0].existingNums;
    });
  }
  ngOnInit(){
    this.contact.generateContacts();
  }

  ionViewDidLoad() {

  }
  add(contact){
    let index = this.selectedContacts.indexOf(contact)
    if(index===-1){
      this.selectedContacts.push(contact);
    }
    else{
      delete this.selectedContacts[index];
    }
  }

  doDrop(){
    this.contact.drop(this.navParams.get('latitude'),this.navParams.get('longitude'),this.navParams.get('imageData'),this.selectedContacts);
    this.navCtrl.pop();
  }
}
