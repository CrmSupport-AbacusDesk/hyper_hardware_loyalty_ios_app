import { DigitalcatalogPage } from './../digitalcatalog/digitalcatalog';
import { Component} from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ModalController, NavParams,} from 'ionic-angular';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';
import { ProfilePage } from '../profile/profile';
import { TermsPage } from '../terms/terms';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
// import { AboutPage } from '../about/about';
import { FurnitureIdeasPage } from '../furniture-ideas/furniture-ideas';
import { ProductsPage } from '../products/products';
import { WorkingSitePage } from '../working-site/working-site';
import { FeedbackPage } from '../feedback/feedback';
import { NewsPage } from '../news/news';
import { VideoPage } from '../video/video';
import { ContactPage } from '../contact/contact';
import { FaqPage } from '../faq/faq';
import { TransactionPage } from '../transaction/transaction';
import { AdvanceTextPage } from '../advance-text/advance-text';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NotificationPage } from '../notification/notification';
// import { LanguagePage } from '../language/language';
import { ArrivalProductPage } from '../arrival-product/arrival-product';
import { OfferProductPage } from '../offer-product/offer-product';
import { Geolocation } from '@ionic-native/geolocation';
// import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult,NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ContractorListPage } from '../contractor/contractor-list/contractor-list';
// import { OfferProductDetailPage } from '../offer-product-detail/offer-product-detail';
import { ChangelanguagePage } from '../changelanguage/changelanguage';
import { AboutusModalPage } from '../aboutus-modal/aboutus-modal';
import { ScanPage } from '../scane-pages/scan/scan';
import { OfferProductDetailPage } from '../offer-product-detail/offer-product-detail';
import { CompanypolicyPage } from '../companypolicy/companypolicy';






@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    offer_list:any=[];
    loading:Loading;
    karigar_detail:any={};
    last_point:any='';
    today_point:any='';
    appbanner:any={};
    qr_code:any='';
    coupon_value:any='';
    upload_url:any='';
    tokenInfo:any = {};
    lang:any="";
    active:boolean = false;
    offer_detail:any={};
    language:any=[];
    id:any;
    config:any;
    lat:any;
    long:any;
    success_gif:any;
    // gif_url="https://apps.abacusdesk.com/PlusPointLock/dd_api/app/uploads/"
    type_gif:any;
    coupon_value1:any;
    user_type:any;
    idlogin:any;
    registration:any;
    goofferPage:any;
    str:any;
    
    constructor(public navCtrl: NavController,
        public service:DbserviceProvider,
        public loadingCtrl:LoadingController,
        public storage:Storage, 
        private barcodeScanner: BarcodeScanner,
        public alertCtrl:AlertController,
        public modalCtrl: ModalController,
        private push: Push,
        public translate:TranslateService,
        public constant:ConstantProvider,
        public socialSharing:SocialSharing,
        private geolocation: Geolocation,
        public locationaccuracy: LocationAccuracy,
        public navParams: NavParams,
         
        ) {
            
            this.presentLoading();
            // this.notification();
            // this.check_location();
            this.location();
            this.profiile();
            this.initPushNotification()
            
        }
        
        
    // notification()
    // {
    //   console.log("notification");
      
    //   this.push.hasPermission()
    //   .then((res: any) => {
        
    //     if (res.isEnabled) {
    //       console.log('We have permission to send push notifications');
    //     } else {
    //       console.log('We do not have permission to send push notifications');
    //     }
    //   });
      
      
    //   const options: PushOptions = {
    //     android: {
    //       senderID:'659136432620'
          
    //     },
    //     ios: {
          
    //       alert: 'true',
    //       badge: true,
    //       sound: true
    //     },
    //     windows: {},
    //     browser: {
    //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    //     }
    //   };
      
    //   const pushObject: PushObject = this.push.init(options);
    //   pushObject.on('notification').subscribe((notification: any) => {
    //     console.log('Received a notification', notification)
    //     console.log("error1",notification.additionalData.type );
    //     console.log("error1",notification.additionalData );
        

    //     if(notification.additionalData.type == 'message'){
    //         this.navCtrl.push(FeedbackPage);
    //     }else if(notification.additionalData.type == 'offer'){
    //         this.navCtrl.push(OfferListPage);
    //     }
    //     else if(notification.additionalData.type == 'redeem'){
    //         this.navCtrl.push(TransactionPage);
    //     }else if(notification.additionalData.type == 'gift'){
    //         this.navCtrl.push(GiftListPage);
    //     }else if(notification.additionalData.type == 'catalogue'){
    //         this.navCtrl.push(ProductsPage);
    //     }else if(notification.additionalData.type == 'product'){
    //         this.navCtrl.push(ProductsPage);
    //     }else if(notification.additionalData.type == 'video'){
    //         this.navCtrl.push(VideoPage);
    //     }else if(notification.additionalData.type == 'profile'){
    //         this.navCtrl.push(ProfilePage);
    //     }
    //   });

    //   pushObject.on('registration').subscribe((registration: any) => {
    //     console.log('Device registered', registration) 
    //     this.service.post_rqst({'registration_id':registration.registrationId,'karigar_id':this.service.karigar_id},'app_karigar/add_registration_id').subscribe(r=>
    //       {
    //         console.log(r);
    //       });
    //     }
    //     );
        
    //     pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    //   }
        
        ionViewWillEnter()
        {
            this.upload_url = this.constant.upload_url;
            console.log('ionViewDidLoad HomePage');
            this.translate.setDefaultLang(this.lang);
            this.lang = this.navParams.get("lang");
            
            console.log("language get Home page ====>",this.lang)
            
            this.translate.use(this.lang);
            this.getData();
            if( this.language == "Hindi"){
                console.log("hindi print");
                
            }else{
                // this.get_user_lang();
            }
            this.getofferBannerList();
            
        }
        
        profiile(){
            this.service.post_rqst({'karigar_id':this.tokenInfo.sub },'app_karigar/profile')
            .subscribe((r)=>
            {
                
                
                // if( this.service.karigar_info.status != 'Verified' && (this.service.karigar_info.status != 'Verified' && r['karigar'].user_type!=3))
                //         {
                //             let contactModal = this.modalCtrl.create(AboutusModalPage);
                //             contactModal.present();
                //             return;
                //         }
            });
        }
        
        doRefresh(refresher) 
        {
            console.log('Begin async operation', refresher);
            this.getData(); 
            refresher.complete();
        }
        
        location(){
            console.log('cocations functions call');
            
        }
        total_balance_point:any;
        sharepoint:any=0;
        notify_cn=0;
        offerbanner:any;
        
        scan_tips()
        {
            this.locationaccuracy.request(this.locationaccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then(() => {
                let options = {
                    maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
                };
                this.geolocation.getCurrentPosition(options)
                .then((resp) => {
                    this.lat = resp.coords.latitude
                    this.long = resp.coords.longitude
                    console.log(this.lat);
                    //  this.getgeocode();
                    
                    if(this.lat == null && this.long == null){
                        console.log("null lat",this.lat);
                        
                    }else{
                        this.scan();
                        //  let options: NativeGeocoderOptions = {
                        //     useLocale: true,
                        //     maxResults: 10
                        //     };
                        
                        // this.nativeGeocoder.reverseGeocode(this.lat, this.long,options)
                        // .then((result: NativeGeocoderReverseResult[]) => 
                        // console.log(JSON.stringify(result[0]),
                        // this.address = this.generateAddress(result[0]),
                        // console.log('subLocality',result[0]),
                        // console.log('subAdministrativeArea',result[0].subAdministrativeArea)
                        
                        // ))
                        
                        // .catch((error: any) => console.log(error));
                        // console.log( "address print",this.address)
                        
                    }
                    
                    
                },
                error => {
                    console.log('Error requesting location permissions', error);
                    if(error){
                        let alert = this.alertCtrl.create({
                            title:'Alert!',
                            cssClass:'action-close',
                            subTitle:"Enable to get your location so, can't scan",
                            buttons: ['OK']
                        });
                        alert.present();  
                    }
                    
                });
            });
        }
        
        
        getData()
        {
            console.log("Check");
            this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/karigarHome')
            .subscribe((r:any)=>
            {
                console.log(r);
                this.loading.dismiss();
                // this.language=r['language'];
                this.karigar_detail=r['karigar'];
                localStorage.setItem('karigar_data', JSON.stringify( r['karigar']) );
                this.appbanner=r['appbanner'];
                console.log(this.appbanner);
                
                console.log(this.karigar_detail.status);
                
                if(this.karigar_detail.user_type!=3){
                    
                    this.offer_detail=r['offer'];
                    this.last_point=r['last_point'];
                    this.notify_cn=r['notifications'];
                    this.today_point=r['today_point'];
                    this.total_balance_point = parseInt( this.karigar_detail.balance_point) + parseInt(this.karigar_detail.referal_point_balance );
                    this.sharepoint=r['points']['owner_ref_point'];
                    
                }
            });
        }
        
        EnterCouponCode(){
            this.navCtrl.push(CoupanCodePage)
        }
        
        getofferBannerList()
        {
            console.log(this.service.karigar_id);
            console.log('offerbanner');
            this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/offerList')
            .subscribe((r)=>
            {
                console.log(r);
                this.offer_list=r['offer'];
                console.log(this.offer_list);
            });
        } 
        
        
        
        
        
        qr_count:any=0;
        qr_limit:any=0;
        scan()
        {
            
            // this.navCtrl.push(CoupanCodePage);
            
            if( this.karigar_detail.manual_permission==1)
            {
                this.navCtrl.push(CoupanCodePage)
            }
            else
            {
                this.service.post_rqst({'karigar_id':this.service.karigar_id},"app_karigar/get_qr_permission")
                .subscribe(resp=>{
                    console.log(resp);
                    this.qr_count = resp['karigar_daily_count'];
                    this.qr_limit = resp['qr_limit'];
                    console.log(this.qr_count);
                    console.log(this.qr_limit);
                    
                    if(parseInt(this.qr_count) <= parseInt(this.qr_limit) )
                    {
                        const options:BarcodeScannerOptions =  { 
                            // prompt : "लैमिनेट शीट के स्टीकर को स्कैन करते समय, लाल रंग की लाइन को बारकोड स्टीकर की सभी लाइनों पर डालें स्कैन न होने पर संपर्क करें। कॉल करें- +91-9773897370"
                            prompt : ""
                        };
                        this.barcodeScanner.scan(options).then(resp => {
                            console.log(resp);
                            this.qr_code=resp.text;
                            console.log( this.qr_code);
                            this.presentLoading();

                            if(resp.text != '')
                            {
                                this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code,'coupon_lat':this.lat,'coupon_long':this.long},'app_karigar/karigarCoupon')
                                .subscribe((r:any)=>
                                {
                                    
                                    console.log(r);
                                    this.success_gif = r.success_gif
                                    console.log("succes image",this.success_gif);
                                    this.coupon_value1= r['coupon_value']
                                    this.type_gif = r.type
                                    if(r['status'] == 'VALID'){
                                        this.loading.dismiss();
                                        this.showSuccessPoint(this.coupon_value1  + "points has been added into your wallet");
                                        this.getData();
                                        return;
                                    }
                                    
                                    if(r['status'] == 'INVALID'){
                                        this.loading.dismiss();
                                        this.translate.get("Invalid Coupon Code")
                                        .subscribe(resp=>{
                                            this.showAlert('' , 'INVALID', `<img src="assets/imgs/cancel.gif"  alt="cancel"> <p>Oops! You have scanned an incorrect product code. This may not be a valid QR code for reward points. If you have any query, feel free to chat with us!</p>`);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'USED'){
                                        this.loading.dismiss()                                        
                                        this.translate.get("Coupon Already Used")
                                        .subscribe(resp=>{
                                            console.log('====================================');
                                            console.log(resp);
                                            console.log('====================================');
                                            this.showAlert(resp, 'USED', `<img src="assets/imgs/alert.gif"  alt="alert"> <p>This coupon has already been scanned. If you have any issue, feel free to chat with us! </p>`);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'UNASSIGNED OFFER'){
                                        this.loading.dismiss();
                                        this.translate.get("Your Account Under Verification")
                                        .subscribe(resp=>{
                                            this.showAlert(resp, 'UNASSIGNED', `<img src="assets/imgs/alert.gif"  alt="alert">`);
                                            
                                        })
                                        return;
                                    }
                                    this.loading.dismiss();
                                    this.showSuccessPoint(this.coupon_value1  + "points has been added into your wallet");
                                    this.getData();
                                });
                            }
                            else{
                                this.loading.dismiss();
                                console.log('not scanned anything');
                            }
                        });
                    }
                    else
                    {
                        this.translate.get("You have exceed the daily QR scan limit")
                        .subscribe(resp=>{
                            this.showAlert(resp, '','');
                        })
                    }
                })
            }
        }
        
        
        viewProfiePic()
        {
            this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile,type:"base_64"}).present();
        }
        
        helpChat(){
            this.qr_code;
            this.navCtrl.push(FeedbackPage, {'code': "I am facing issues with scanning this Coupon Code- " + this.qr_code})
            console.log('====================================');
            console.log( this.qr_code, '359 line');
            console.log('====================================');
        }
        
        viewProfie()
        {
            console.log(this.lang);
            
            this.navCtrl.push(ProfilePage,{'lang':this.lang})
        }
        
        goOnScanePage(){
            this.navCtrl.push(ScanPage);
        }
        
        goOnOffersListPage(){
            this.navCtrl.push(OfferListPage);
            
        }
        goOnOffersPage(id)
        {
            this.navCtrl.push(OffersPage,{'id':id});
        }
        
        goOnPointeListPage(){
            this.navCtrl.push(PointListPage);
            
        }
        goOnWorkingSitePage()
        {
            this.navCtrl.push(WorkingSitePage);
        }
        
        
        goOntermsPage(id){
            this.navCtrl.push(TermsPage, {'id':id});
        }
        
        goOnFeedbackPage()
        {
            this.navCtrl.push(FeedbackPage);
        }
        presentLoading() 
        {
            this.loading = this.loadingCtrl.create({
                content: "Please wait...",
                dismissOnPageChange: true
            });
            this.loading.present();
        }
        goOnGiftListPage()
        {
            this.navCtrl.push(GiftListPage,{'mode':'home'});
        }
        
        goOnFurniturePage()
        {
            this.navCtrl.push(FurnitureIdeasPage);
        }
        goOnProductsPagegoOnProductsPage()
        {
            this.navCtrl.push(ProductsPage);
        }
        goOnProductsPage(){
            
            this.navCtrl.push(ProductsPage);
        }
        goOnArrivalProductsPage(){
            this.navCtrl.push(ArrivalProductPage);
        }
        goOnOfferProductsPage(){
            this.navCtrl.push(OfferProductPage);
        }
        goOnContractorPage(){
            this.navCtrl.push(ContractorListPage);
        }
        viewDetail()
        {
            this.modalCtrl.create(ViewProfilePage, {"Image": this.lang !='en' ? this.offer_detail.hin_term_image : this.offer_detail.term_image}).present();
        }
        gotoHistory()
        {
            this.navCtrl.push(TransactionPage)
        }

        goOnDigitalPage(){
            this.navCtrl.push(DigitalcatalogPage)

        }

        goOnGiftGallary()
        {
            this.navCtrl.push(GiftListPage)
        }
        goOnNewsPage()
        {
            this.navCtrl.push(NewsPage);
        }
        goOnVideoPage()
        {
            this.navCtrl.push(VideoPage);
        }
        goOnContactPage()
        {
            this.navCtrl.push(ContactPage);
        }
        goOnfaqPage()
        {
            this.navCtrl.push(FaqPage);
        }
        goOnAdvanceTextPage()
        {
            this.navCtrl.push(AdvanceTextPage);
        }
        gotoNotification()
        {
            this.navCtrl.push(NotificationPage);
        }
        gotoChangeLang()
        {
            this.navCtrl.push(ChangelanguagePage,{"login_id":this.service.karigar_id,"lang":this.language});
        }
        // share()
        // {
        //     console.log("share and earn");
        //     // let image = "https://play-lh.googleusercontent.com/FEDtMP_dyMgM8rJtp4MFdp60g0fLuBYNbu3pBNsNH52knTsG1yDuNs56CFYu_X3XqYk=s180-rw";
            
        //     let image = "";
        //     let app_url = "https://play.google.com/store/apps/details?id=com.hyperhardware.app";
            
        //     this.socialSharing.share("Hey! Join me (" + this.karigar_detail.full_name + " " + this.karigar_detail.mobile_no + " "  +  this.karigar_detail.country_code + ") on HYPER Shubh-Labh Club- Carpenter Rewards Application. Enter the code-" + this.karigar_detail.referral_code + "* to earn Extra points in your wallet.", image, app_url)
        //     .then(resp=>{
        //         console.log(resp);
                
        //     }).catch(err=>{
        //         console.log(err);
        //     }) 
        // }




        share()
        {
            console.log("share and earn");
            // let image = "https://play-lh.googleusercontent.com/FEDtMP_dyMgM8rJtp4MFdp60g0fLuBYNbu3pBNsNH52knTsG1yDuNs56CFYu_X3XqYk=s180-rw";
            // let image = "";
            // let app_url = "https://play.google.com/store/apps/details?id= com.hyperhardware.app";
            
            // this.socialSharing.share("Hey! Join me (" + this.karigar_detail.full_name + " " + this.karigar_detail.mobile_no + " "  +  this.karigar_detail.country_code + ") on Plus Point- Carpenter Rewards Application. Enter the code-" + this.karigar_detail.referral_code + "* to earn Extra points in your wallet.", image, app_url)
            // .then(resp => {
            //     console.log(resp);
                
            // }).catch(err => {
            //     console.log(err);
            // })
    
            let image = "";
            let app_url = "https://apps.apple.com/us/app/hyper-shubh-labh-club/id6447604896";
            
            this.socialSharing.share("Hey! Join me  (" + this.karigar_detail.full_name + " " + this.karigar_detail.country_code + " "  + this.karigar_detail.mobile_no + ") on HYPER Shubh-Labh Club- Carpenter Rewards Application. Enter the code-*" + this.karigar_detail.referral_code + "* to earn"+ " " +this.karigar_detail.refer_own_point+ " " + "Points in your wallet","Karigar Reffral", image, app_url)
            .then(resp => {
                console.log(resp);
                
            }).catch(err => {
                console.log(err);
            })
        }


        showAlert(text, alertTilte, img )
        {
            let alert = this.alertCtrl.create({
                title:alertTilte,
                cssClass:'alert-alert',
                message: img,
                subTitle: text,
                buttons: [
                    {
                      text: 'Chat With Us',
                    //   role: 'cancel',
                      handler: () => {
                        this.helpChat();
                      }
                    },
                    {
                      text: 'Okay',
                      handler: () => {
                       
                      }
                    }
                  ]
                // buttons: ['OK']
            });
            alert.present();
        }
        
        // showSuccess(text)
        // {
        //     let alert = this.alertCtrl.create({
        //         cssClass:'baloon-alert',
        //         subTitle: text,
        
        //     });
        //     alert.present();
        
        //     setTimeout(() => {
        
        //         alert.dismiss();
        //         this.showSuccessPoint(this.coupon_value1  + " points has been added into your wallet" );
        
        //     }, 1000);
        // }

        goCompanypolicyPage(){
            this.navCtrl.push(CompanypolicyPage)
        }
        
        showSuccessPoint(text)
        {
            let alert = this.alertCtrl.create({
                title:'Success!',
                cssClass:'sucess-alert',
                message: `<img src="assets/imgs/sucess.gif"  alt="sucess">`,
                subTitle: text,
                buttons: [ {
                    text: 'Scan More',
                  //   role: 'cancel',
                    handler: () => {
                      this.scan_tips();
                    }
                  },
                  {
                    text: 'Okay',
                    handler: () => {
                     
                    }
                  }
                ]
                
                
            });
            alert.present();
        }
        
        // notification()
        // {
        //     console.log("notification called");
            
        //     this.push.hasPermission()
        //     .then((res: any) => {
                
        //         if (res.isEnabled) {
        //             console.log('We have permission to send push notifications');
        //         } else {
        //             console.log('We do not have permission to send push notifications');
        //         }
        //     });
            
            
        //     const options: PushOptions = {
        //         android: {
        //             senderID:'659136432620',                },
        //         ios: {
        //             alert: 'true',
        //             badge: true,
        //             sound: 'true'
        //         },
        //         windows: {
                    
        //         },
        //     };
            
        //     const pushObject: PushObject = this.push.init(options);
            
        //     pushObject.on('notification').subscribe((notification) => {
        //         console.log("notification");
                
        //         console.log('message -> ' + notification);
        //         //if user using app and push notification comes
        //         if (notification.additionalData.foreground) {
        //           // if application open, show popup
        //           let confirmAlert = this.alertCtrl.create({
        //             title: 'New Notification',
        //             message: notification.message,
        //             buttons: [{
        //               text: 'Ignore',
        //               role: 'cancel'
        //             }, {
        //               text: 'View',
        //               handler: () => {
        //                 //TODO: Your logic here
        //                 this.navCtrl.push(OfferProductDetailPage);
        //               }
        //             }]
        //           });
        //           confirmAlert.present();
        //         } else {
        //           //if user NOT using app and push notification comes
        //           //TODO: Your logic on click of push notification directly
        //           this.navCtrl.push(OfferProductDetailPage);
        //           console.log('Push notification clicked');
        //         }
        //       });
            
        //     pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
        // }
        
        get_user_lang()
        {
            this.storage.get("token")
            .then(resp=>{
                this.tokenInfo = this.getDecodedAccessToken(resp );
                
                this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
                .subscribe(resp=>{
                    console.log(resp);
                    this.lang = resp['language'];
                    console.log(this.lang);
                    
                    if(this.lang == "")
                    {
                        this.lang = "en";
                    }
                    console.log(this.lang);
                    this.translate.use(this.lang);
                })
            })
        }
        getDecodedAccessToken(token: string): any 
        {
            try{
                return jwt_decode(token);
            }
            catch(Error){
                return null;
            }
        } 
        
        goofferdetailpage(id){
            console.log(id);
            
            this.navCtrl.push(OffersPage,{'id':id,'user_id':this.service.karigar_id});
            console.log(this.service.karigar_id);
            
            // this.navCtrl.push(OfferProductDetailPage);
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
                
                if(notification.additionalData.type == "message"){
                    this.navCtrl.push(FeedbackPage);
                }else if(notification.additionalData.type == 'offer'){
                    this.navCtrl.push(OfferListPage);
                }
                else if(notification.additionalData.type == 'redeem'){
                    this.navCtrl.push(TransactionPage);
                }else if(notification.additionalData.type == 'catalogue'){
                    this.navCtrl.push(ProductsPage);
                }else if(notification.additionalData.type == 'product'){
                    this.navCtrl.push(ProductsPage);
                }else if(notification.additionalData.type == 'video'){
                    this.navCtrl.push(VideoPage);
                }else if(notification.additionalData.type == 'profile'){
                    this.navCtrl.push(ProfilePage);
                }else if(notification.additionalData.type == 'gift'){
                    this.navCtrl.push(GiftListPage);
                }
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
    }

 
    