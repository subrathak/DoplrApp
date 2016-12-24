import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import 'rxjs/Rx';

import { ProfileModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { ImagePicker } from 'ionic-native';
import { ActionSheetController } from 'ionic-angular';
import { File, Camera, Transfer } from 'ionic-native';
import { UUID } from 'angular2-uuid';

declare var cordova: any;
declare var firebase;

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  storage = firebase.storage();
  storageRef = this.storage.ref();
  rootPage: any = WalkthroughPage;
  loading: any;
  profile: ProfileModel = new ProfileModel();

  postTitle: any;
desc: any;
imageChosen: any = 0;
imagePath: any;
imageNewPath: any;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public profileService: ProfileService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.loading = this.loadingCtrl.create();

    this.settingsForm = new FormGroup({
      name: new FormControl(),
      location: new FormControl(),
      description: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  }

  ionViewDidLoad() {
    this.loading.present();
    this.profileService
      .getData()
      .then(data => {
        this.profile.user = data.user;

        this.settingsForm.setValue({
          name: data.user.name,
          location: data.user.location,
          description: data.user.about,
          currency: 'dollar',
          weather: 'fahrenheit',
          notifications: true
        });

        this.loading.dismiss();
      });
  }

  // changePicture() {
  //   let options = {
  //   maximumImagesCount: 1,
  //   width: 500,
  //   height: 500,
  //   quality: 75
  // }
  //
  // ImagePicker.getPictures(options).then(
  //   file_uris => this.nav.push(GalleryPage, {images: file_uris}),
  //   err => console.log('uh oh')
  // );
  // }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Option',
      buttons: [
        {
          text: 'Gallery',
          role: 'destructive',
          handler: () => {
            this.actionHandler(1);
            console.log('Destructive clicked');
          }
        },{
          text: 'Camera',
          handler: () => {
            this.actionHandler(2);
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.actionHandler(3);
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  logout() {
    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  uploadPhoto() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    let filename = this.imagePath.split('/').pop();
    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      params: { 'title': this.postTitle, 'description': this.desc }
    };
    let uuid = UUID.UUID();
    let profilePictureRef = firebase.storage().ref('/profilePictures/');
    profilePictureRef.child(uuid).child('profilePicture.png')
.putString(this.imageNewPath, 'base64', {contentType: 'image/png'})
.then((savedPicture) => {
  console.log("uploadPhoto");
  // this.eventList.child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
  // .set(savedPicture.downloadURL);
});


//     const fileTransfer = new Transfer();
//
//     fileTransfer.upload(this.imageNewPath, 'https://photocloudapp.herokuapp.com/api/v1/post/upload',
//       options).then((entry) => {
//         this.imagePath = '';
//         this.imageChosen = 0;
//         loader.dismiss();
//         let uuid = UUID.UUID();
//         let ref = this.storageRef.child('profilePictures/'+uuid);
//         ref.putString(image,'base64').then((snap) {
//   console.log('Uploaded a blob or file!');
// });
//         this.nav.setRoot(HomePage);
//       }, (err) => {
//         alert(JSON.stringify(err));
//       });
  }


  actionHandler(selection: any) {
    var options: any;

    if (selection == 1) {
      options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
    }

    Camera.getPicture(options).then((imgData) => {
      let uuid = UUID.UUID();
      let ref = this.storageRef.child('dps/'+uuid);
      ref.putString(imgData,'base64').then((snap)=>{
        alert('File Uploaded')
      }).catch((err)=>{
        alert("Error in file upload");
      });
      // var sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
      // var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
      // sourceFileName = sourceFileName.split('?').shift();
      // File.copyFile(sourceDirectory, sourceFileName, cordova.file.externalApplicationStorageDirectory, sourceFileName).then((result: any) => {
      //   this.imagePath = imgUrl;
      //   this.imageChosen = 1;
      //   this.imageNewPath = result.nativeURL;
      // }, (err) => {
      //   alert(JSON.stringify(err));
      // })

    }, (err) => {
      alert(JSON.stringify(err))
    });

  }
}
