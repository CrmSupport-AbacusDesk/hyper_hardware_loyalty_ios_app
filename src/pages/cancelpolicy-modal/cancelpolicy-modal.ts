import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav, ModalController } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TransactionPage } from '../transaction/transaction';
// import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import { FeedbackPage } from '../feedback/feedback';
import { CancelpolicymodalPage } from '../cancelpolicymodal/cancelpolicymodal';



@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html',
})
export class CancelpolicyModalPage {
    @ViewChild(Nav) nav: Nav;
    data:any={};
    otp_value:any='';
    karigar_id:any=''
    otp:any='';
    karigar_detail:any={};
    gift_id:any='';
    gift_detail:any='';
    loading:Loading;
    mode:any;
    needPoint:any;
    term:any;
    karigar_info:any;
    redeemBal:any;
    currentPointBalcance:any;
    gift_images:any =[];
    uploadUrl:any='';
    currentPointBalcance_round:any;
    redeemBal_round

    
    constructor(public modalCtrl:ModalController,public navCtrl: NavController, public navParams: NavParams, public constant:ConstantProvider, public viewCtrl: ViewController,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController, public translate:TranslateService) {
        this.uploadUrl = this.constant.upload_url;
        this.redeemBal = this.navParams.data.offer_balance;
        this.redeemBal_round = Math.round(this.redeemBal);
        this.needPoint = this.navParams.get('needPoint');
        this.karigar_info = JSON.parse(localStorage.getItem('karigar_data'));
    }
    
    ionViewDidLoad() {
        
        console.log('ionViewDidLoad CancelpolicyModalPage');
        this.karigar_id = this.navParams.get('karigar_id');
        console.log(this.karigar_id);
        this.gift_id = this.navParams.get('gift_id');
        this.mode = this.navParams.get('mode');
        console.log(this.gift_id);
        if( this.mode == 'reedeemPoint'){
            this.getOtpDetail();
        }else if(this.mode == 'NotreedeemPoint'){
            this.loading.dismiss();
        }else if(this.mode == 'Poilcy'){
            this.getTerms()
            // this.loading.dismiss();
            
        }
   
      
        this.presentLoading();
    }
    
    
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    
    goOnCancelationPolicy(){
        this.navCtrl.push(CancelationPolicyPage)
    }

    
    
    getOtpDetail()
    {
        console.log('otp');
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.otp=r['otp'];
            console.log(this.otp);
            this.karigar_detail=this.karigar_info;
            console.log(this.karigar_detail);
            
            this.gift_detail=r['gift'];
            this.gift_images=r['gift']['gift_images'];
            console.log('====================================');
            console.log(this.gift_images);
            console.log('====================================');
            this.currentPointBalcance = this.redeemBal - this.gift_detail.coupon_points;
            this.currentPointBalcance_round = Math.round(this.currentPointBalcance)
          
        });
    }
    resendOtp()
    {
        
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            
            console.log(r);
            this.otp=r['otp'];
            console.log(this.otp);
        });
    }
    otpvalidation() 
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
    }
    
    submit()
    {
        this.presentLoading();

        console.log("function click ====>")
        console.log('data');
        console.log(this.data);
        this.data.karigar_id = this.service.karigar_id,
        this.data.gift_id = this.gift_id,
        this.data.offer_id = this.gift_detail.offer_id,
        console.log('data');
        this.service.post_rqst( {'data':this.data},'app_karigar/redeemRequest')
        .subscribe( (r) =>
        {
            this.loading.dismiss();
            console.log(r);
            if(r['status']=="SUCCESS")
            {
                // this.navCtrl.setRoot(TabsPage,{index:'3'});
                this.navCtrl.push(HomePage);
                this.showSuccess('',`<img src="assets/imgs/sucess.gif"  alt="cancel"> <p>Thank you for your gift request! We will process your gift redeem request within 48 business hours. Meanwhile, we will keep you posted regarding your gift status through SMS</p> <p>In case of any query, please contact us on <strong>+91-9501501149</strong>or you can chat with us</a></p>`);
                // this.showSuccess("Thank you for your gift request! We will process your gift redeem request within 48 business hours. Meanwhile, we will keep you posted regarding your gift status through SMS");
            }
            else if(r['status']=="EXIST")
            {
                this.showAlert(" Already Redeemed!");
            }
        });
    }
    address()
    {
        console.log(this.data);
        if(this.data.check1==true)
        {
            this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
        }
        else{
            this.data.shipping_address='';
        }
        
        
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
                text:'OK',
                cssClass: 'close-action-sheet',
                handler:()=>{
                    this.navCtrl.push(TransactionPage);
                }
            }]
        });
        alert.present();
    }
    showSuccess(text, img)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'alert-alert',
            message: img,
            subTitle: text,
            buttons: [
                {
                  text: 'Chat With Us',
                //   role: 'cancel',
                  handler: () => {
                    this.navCtrl.push(FeedbackPage);
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


    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    ionViewDidLeave()
    {
        console.log('leave');
        this.dismiss()
    }
    
    // myNumber()
    // {
    //     console.log(this.data);
    //     if(this.data.check1==true)
    //     {
    //         this.data.payment_number=this.karigar_detail.mobile_no;
    //     }
    //     else{
    //         this.data.payment_number='';
    //     }
     
        
        
    // }

    getTerms()
    {
        // this.presentLoading();
        console.log("call terms api");
        
        
        this.service.post_rqst({},'app_karigar/get_terms_conditions')
        .subscribe( (response)=>
        {
            console.log(response);
            this.loading.dismiss();
            this.term =response.getData.tnc;
        })
    }

  
    MobileNumber(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }



    chatUs(){
        this.navCtrl.push(FeedbackPage)
    }

    openModal(){
        let contactModal = this.modalCtrl.create(CancelationPolicyPage);
        contactModal.present();
        // this.navCtrl.push(CancelpolicymodalPage)
    }

    bankCheck()
    {
        if(this.data.check1==true)
        {
            this.data.payment_number = this.karigar_detail.mobile_no;
            // this.data.account_no = this.karigar_detail.account_no; 
            // this.data.ifsc_code =this.karigar_detail.ifsc_code; 
        }
        else{
            this.data.payment_number = '';
            // this.data.account_no = '';
            // this.data.ifsc_code = ''; 
        }
        
        
    }

    // $scope.validateMobile = function() {
    //     console.log("mobile validation");
    //     var input = document.getElementById('mobile_only');
    //     var pattern = /^[6-9][0-9]{0,9}$/;
    //     var value = input.value;
    //     !pattern.test(value) && (input.value = value = '');
    //     input.addEventListener('input', function() {
    //       var currentValue = this.value;
    //       if(currentValue && !pattern.test(currentValue)) this.value = value;
    //       else value = currentValue;
    //     });
    //   };
}
