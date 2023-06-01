import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController, Loading, LoadingController } from 'ionic-angular';
import { RegistrationPage } from '../registration/registration';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import * as jwt_decode from "jwt-decode";
// import { TabsPage } from './../../../pages/tabs/tabs';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MobileLoginPage } from '../mobile-login/mobile-login';
import { HomePage } from '../../home/home';
import { LanguagePage } from '../../language/language';
import { Push, PushObject, PushOptions } from '@ionic-native/push';



@IonicPage()
@Component({
    selector: 'page-otp',
    templateUrl: 'otp.html',
})
export class OtpPage {
    karigar_detail:any={};
    otp:any='';
    lang:any='';
    otp_value:any='';
    data:any={};
    mobile_no:any='';
    tokan_value:any='';
    tokenInfo:any='';
    loading:Loading;
    country:any;
    user_type:any;
    idlogin:any;
    registration:any;
    goofferPage:any;
    str:any;
    
    constructor(public push:Push,public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public modalCtrl: ModalController, private storage:Storage,public loadingCtrl:LoadingController,public translate:TranslateService) {
        this.initPushNotification()
    }
    
    ok:any;
    ionViewDidLoad() {
        // this.getcountery();
        console.log('ionViewDidLoad OtpPage');
        this.mobile_no = this.navParams.get('mobile_no');
        this.otp = this.navParams.get('otp');
        this.lang = this.navParams.get('lang');
        this.country = this.navParams.get('country');

        
        console.log("language get otp page ====>",this.lang)
        
        // this.translate.setDefaultLang(this.lang);
        if(this.country == 'India'){
            this.translate.use(this.lang);
        }
   
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp;
        })
    }
    
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
    
    otpvalidation() 
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
        console.log(this.otp);
        console.log(this.otp_value);
        
    }

    submit()
    {
        this.presentLoading();
        console.log('data');
        console.log(this.data);
        this.service.post_rqst({'mobile_no': this.mobile_no ,'mode' :'App',"lang":this.lang},'auth/login')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            if(r['status'] == 'NOT FOUND'){
                
                this.navCtrl.push(RegistrationPage,{'mobile_no':this.mobile_no,"lang":this.lang})
                return;
            }
            else if(r['status'] == 'ACCOUNT SUSPENDED')
            {
                this.translate.get("Your account has been suspended")
                .subscribe(resp=>{
                    this.showAlert(resp);
                });
                this.navCtrl.push(MobileLoginPage);
                return;
            } 
            else if(r['status'] == 'SUCCESS')
            {
                this.storage.set('token',r['token']); 
                this.service.karigar_id=r['user'].id;
                this.storage.set('userId',r['user'].id); 
                this.service.karigar_status=r['user'].status;
                console.log(this.service.karigar_id);
                
                if( r['user'].status !='Verified' && r['user'].user_type!=3)
                {
                    let contactModal = this.modalCtrl.create(AboutusModalPage);
                    contactModal.present();
                    // this.navCtrl.setRoot(HomePage, {"lang":this.lang});
                    return;
                }
            }
            this.storage.set('token',r['token']); 
            this.storage.set('userId',r['user'].id); 

            this.service.karigar_id=r['user'].id;
            console.log(this.service.karigar_id);
            // this.navCtrl.push(HomePage);
            this.navCtrl.setRoot(HomePage,{"lang":this.lang});

            // this.navCtrl.push(TabsPage);
        });
    }
    resendOtp()
    {
        this.service.post_rqst({'mobile_no': this.mobile_no },'app_karigar/karigarLoginOtp').subscribe(r=>
            {
                if(r['status'] == "SUCCESS")
                {
                    this.translate.get("OTP has been send")
                    .subscribe(resp=>{
                        this.showSuccess(resp);
                        this.otp=r['otp'];
                    })
                }
            });
        }
        getDecodedAccessToken(token: string): any {
            try{
                return jwt_decode(token);
            }
            catch(Error){
                return null;
            }
        }
        
        showAlert(text)
        {
            
            this.translate.get("Alert")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        
        showSuccess(text)
        {
            this.translate.get("Success")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        
        presentLoading() 
        {
            this.translate.get("Please wait...")
            .subscribe(resp=>{
                this.loading = this.loadingCtrl.create({
                    content: "",
                    dismissOnPageChange: false
                });
                this.loading.present();
            })
        }
        
        
        back(){
            this.navCtrl.push(MobileLoginPage)
        }
        
        
        languageBack()
        {
            console.log(this.lang);
            this.navCtrl.push(LanguagePage);
        }
        initPushNotification()
    {
        // this.push.init({
        //     android: {
        //         forceShow: "true",
        //         titleKey: "hello",
        //         sound: "true",
        //         vibrate:"true"
        //     }
        // });

        this.push.hasPermission().then((res: any) => {
            if (res.isEnabled)
            {
                console.log('We have permission to send push notifications');
            }
            else
            {
                console.log('We don\'t have permission to send push notifications');
            }
        });

        const options: PushOptions = {
            android: {
                senderID: '659136432620',
                icon: './assets/imgs/logo_small',
                forceShow:true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
            console.log('Received a notification', notification)
            console.log("error1",notification.additionalData.type );
            console.log("error1",notification.additionalData );
            
            // if(notification.additionalData.type == "message"){
            //     this.nav.push(FeedbackPage);
            // }else if(notification.additionalData.type == 'offer'){
            //     this.nav.push(OfferListPage);
            // }
            // else if(notification.additionalData.type == 'redeem'){
            //     this.nav.push(TransactionPage);
            // }else if(notification.additionalData.type == 'gift'){
            //     this.nav.push(GiftListPage);
            // }else if(notification.additionalData.type == 'catalogue'){
            //     this.nav.push(ProductsPage);
            // }else if(notification.additionalData.type == 'product'){
            //     this.nav.push(ProductsPage);
            // }else if(notification.additionalData.type == 'video'){
            //     this.nav.push(VideoPage);
            // }else if(notification.additionalData.type == 'profile'){
            //     this.nav.push(ProfilePage);
            // }
          });


        pushObject.on('registration')
        .subscribe((registration) =>{
            console.log('Device registered', registration);
            console.log('Device Token', registration.registrationId);
            this.storage.set('fcmId', registration);
            // console.log( this.tokenInfo);
            console.log(this.storage);
            this.storage.get('user_type').then((user_type) => {
                this.user_type = user_type;
                console.log(this.user_type);
                console.log(user_type);
            });
            this.storage.get('userId').then((userId) => {
                this.idlogin = userId;
                console.log(this.idlogin);
                console.log(userId);
            });
            this.registration=registration.registrationId;
            this.registrationid(registration.registrationId);
        });

        pushObject.on('error')
        .subscribe((error) =>
        console.error('Error with Push plugin', error));
    }
    registrationid(registrationId){
        console.log(" enter registration");
        console.log(registrationId);


        this.storage.get('user_type').then((user_type) => {
            this.user_type = user_type;
            console.log(this.user_type);
            console.log(user_type);
            console.log("user_type");

        });
        this.storage.get('userId').then((userId) => {
            this.idlogin = userId;
            console.log(this.idlogin,  this.idlogin);
            console.log("userId");
            console.log(userId);
        });

        setTimeout(() =>{
            this.service.post_rqst({'registration_id':registrationId,'karigar_id':this.idlogin},'app_karigar/add_registration_id')
            .subscribe((r)=>
            {
                console.log("success");
                console.log(r);

            });
        }, 5000);
    }

    onBackButtonClickHanlder = () =>{
        this.navCtrl.push(LanguagePage)
    }

    }
    