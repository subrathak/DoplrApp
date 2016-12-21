import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController,public events: Events,public contact:ContactsService) {
    events.subscribe('gotContacts',(contacts)=>{
      this.contacts = contacts;
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
    console.log(this.contacts);
    this.navCtrl.pop();
  }
}
