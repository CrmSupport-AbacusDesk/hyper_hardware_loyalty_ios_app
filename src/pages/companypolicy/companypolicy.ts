import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the CompanypolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-companypolicy',
  templateUrl: 'companypolicy.html',
})
export class CompanypolicyPage {
  term_condtions:any;
  loading:any;
  getCancellation:any;

  constructor(public translate:TranslateService,public service:DbserviceProvider,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanypolicyPage');
    this.getTermConditions();
    this.getCancellationPolicy();
  }
  presentLoading() 
  {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
          this.loading = this.loadingCtrl.create({
              content: resp,
              dismissOnPageChange: false
          });
          this.loading.present();
      })
  }


  getTermConditions()
  {
      this.presentLoading()
      this.service.post_rqst({},"app_karigar/get_terms_conditions")
      .subscribe(resp=>{
          console.log("policy ===>",resp);
          this.term_condtions = resp.getData.tnc;
          this.loading.dismiss();
      })
  }
  getCancellationPolicy()
  {
 
      this.service.post_rqst({},"app_karigar/get_cancellation_policy")
      .subscribe(resp=>{
          console.log("policy ===>",resp);
          this.getCancellation = resp.getData.tnc;
         
      })
  }

}
