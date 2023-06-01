import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController, Loading } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { RegistrationPage } from '../registration/registration';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePage } from '../../language/language';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
    data:any={};
    otp:any='';
    lang:any='en';
    loading:Loading;
    country:any;
    user_type:any;
    idlogin:any;
    registration:any;
    goofferPage:any;
    str:any;
 
    constructor(public push:Push,public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public db:DbserviceProvider,public translate:TranslateService,private loadingCtrl:LoadingController) {
        this.lang = this.navParams.get("lang");
        console.log('lan print',this.lang);
        this.country = this.navParams.get("country");
        console.log("   this.country ",   this.country );
        

        console.log("language get mobile page ====>",this.lang)

        if( this.country == 'Nepal'){
            this.getcountery();
        }
        
      
    }
    ionViewDidLoad() 

    {
        // if((this.country == "Nepal") && (this.lang == 'hin' )){
        //    console.log("not call any function");
           
        // }else{
        //     this.translate.setDefaultLang(this.lang);
        //     this.translate.use(this.lang);
        // }
       
        
    } 
    
    maxtime: any=30;
    maxTime:any =0;
    hidevalue:boolean = false;
    timer:any;

    getcountery(){
        this.service.get_rqst('app_karigar/get_country')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.country=r.country
            console.log(this.country)
           
        }
        
        );
    }

    StartTimer(){
        this.timer = setTimeout((x) => 
        {
            if(this.maxtime <= 0) { }
            this.maxTime -= 1;
            
            if(this.maxTime>0){
                this.hidevalue = true;
                this.StartTimer();
            }
            else{
                this.maxtime = 30;
                this.hidevalue = false;
            }
        }, 1000);
    }
    
    submit()
    {
        this.maxTime = 30;
        this.StartTimer();
        console.log(this.data);
        this.service.post_rqst({'mobile_no': this.data.mobile_no },'app_karigar/karigarLoginOtp')
        .subscribe((r)=>
        {
            console.log(r);
            if(r['status'] == "SUCCESS")
            {
                this.otp=r['otp'];
                this.navCtrl.push(OtpPage,{'otp':this.otp,'mobile_no':this.data.mobile_no,"lang":this.lang,'country': this.country});
            }
            
            if(r['status'] == 'REQUIRED MOBILE NO')
            {
                this.RequiredAlert("Please enter Mobile No to continue.");
                return false;
            }
        });
    }
    
    showAlert(text) {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text:'Register',
                cssClass: 'close-action-sheet',
                handler:()=>{
                    this.navCtrl.push(RegistrationPage,{'mobile_no':this.data.mobile_no})
                }
            }]
        });
        alert.present();
    }
    RequiredAlert(text)
    {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
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

    languageBack()
    {
        console.log(this.lang);
        this.navCtrl.push(LanguagePage);
    }
    onBackButtonClickHanlder(){
        this.navCtrl.push(LanguagePage);
    }

    
}
