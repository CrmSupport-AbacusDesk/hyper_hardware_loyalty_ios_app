import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CancelpolicymodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cancelpolicymodal',
  templateUrl: 'cancelpolicymodal.html',
})
export class CancelpolicymodalPage {

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelpolicymodalPage');
  }
  dismiss() {
    let data = { 'foo': 'bar' };
    
    this.viewCtrl.dismiss(data);
}

}
