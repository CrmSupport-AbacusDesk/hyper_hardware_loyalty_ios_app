import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController, ToastController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AboutusModalPage } from '../aboutus-modal/aboutus-modal';
import { HomePage } from '../home/home';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { ProfilePage } from '../profile/profile';
import { ConstantProvider } from '../../providers/constant/constant';


/**
* Generated class for the UpdateprofilePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-updateprofile',
    templateUrl: 'updateprofile.html',
})
export class UpdateprofilePage {
    @ViewChild(Content) content: Content;
    
    data:any={};
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    selectedFile:any=[];
    file_name:any=[];
    karigar_id:any='';
    formData= new FormData();
    myphoto:any;
    profile_data:any='';
    loading:Loading;
    lang:any='en';
    today_date:any;
    whatsapp_mobile_no:any='';
    uploadUrl:any='';
    check:any;
    checkAddress:any={};
    isSame = false
    profile_img: any;
    // defaultSelectedRadio = "data.user_type=1";
    
    
    constructor(public navCtrl: NavController, public toastCtrl: ToastController,public navParams: NavParams, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,public modalCtrl: ModalController,private storage:Storage,public translate:TranslateService,public constant:ConstantProvider) {

        this.uploadUrl = this.constant.upload_url;

        this.getstatelist();

            console.log(navParams.data.data);
       
        if(navParams.data.data){
            this.data = navParams.data.data;
            this.data.karigar_edit_id = navParams.data.data.id;
            this.profile_img = navParams.data.data.id;
    
    
            console.log(this.data.karigar_edit_id);
        }
            
    
        

        console.log(this.data.karigar_edit_id);
      
        this.checkAddress = JSON.parse( localStorage.getItem('karigarInfo'));
        if(this.checkAddress != null) { this.isSame = this.checkAddress["isSameAddress"];}

        
        
        if(this.data.state){
            this.getDistrictList(this.data.state)
        }
        
        console.log( "mobile no",this.data.mobile_no);
        // this.data.gender="male";
        
        this.today_date = new Date().toISOString().slice(0,10);
        this.getcountery()
        
        
    }
    country
    getcountery(){
        
        this.service.get_rqst('app_karigar/get_country')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.country=r.country
            console.log(this.country)
            if(this.country == "Nepal"){
                this.data.country='Nepal';
            }else if(this.country == "India"){
                this.data.country='India';
                console.log(this.data.country);
            }
        }
        
        );
    }
    
    
    // alertmy(id){
    //     console.log('click nepal',id);
    
    //     if(id == 'Nepal'){
    //         this.lang = 'en';
    //         console.log(this.lang );
    
    //     }
    // }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    mode:string='';
    karigar_status:any;
    ionViewDidLoad() {
        
        console.log(this.data.check);
        
        console.log("check ======>",this.data.check)
        console.log('ionViewDidLoad RegistrationPage');
        // this.data.mobile_no = this.navParams.get('mobile_no');
        this.lang = this.navParams.get('lang');
        this.mode = this.navParams.get('mode')
        console.log(this.data.country)
        this.data.profile = this.navParams.get('profile');
        console.log( this.uploadUrl+this.data.profile);

        console.log(this.data.mobile_no);
        this.data.profile='';
        // this.data.document_image='';
        console.log(this.data.profile);
        
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        
        this.translate.get("Camera")
        .subscribe(resp=>{
            this.cam = resp
        });
        
        this.translate.get("Gallery")
        .subscribe(resp=>{
            this.gal = resp
        });
        
        this.translate.get("Cancel")
        .subscribe(resp=>{
            this.cancl = resp
        });
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        });
        
        this.translate.get("Upload File")
        .subscribe(resp=>{
            this.upl_file = resp
        });
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
    }
    set_lang()
    {
        this.translate.use(this.lang);
    }
    getstatelist(){
        this.service.get_rqst('app_master/getStates').subscribe( r =>
            {
                console.log(r);
                this.state_list=r['states'];
                this.karigar_id=r['id'];
                console.log(this.state_list);
            });
        }
        getDistrictList(state_name)
        {
            console.log(state_name);
            this.service.post_rqst({'state_name':state_name},'app_master/getDistrict')
            .subscribe( (r) =>
            {
                console.log(r);
                this.district_list=r['districts'];
                console.log(this.state_list);
            });
        }
        
        getCityList(district_name)
        {
            console.log(district_name);
            this.service.post_rqst({'district_name':district_name},'app_master/getCity')
            .subscribe( (r) =>
            {
                console.log(r);
                this.city_list=r['cities'];
                this.pincode_list=r['pins'];
                console.log(this.pincode_list);
            });
        }
        
        getaddress(pincode)
        {
            if(this.data.pincode.length=='6' || this.data.permanent_pincode.length=='6')
            {
                this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
                .subscribe( (result) =>
                {
                    console.log(result);
                    var address = result.address;
                    if(address!= null)
                    {
                        this.data.state = result.address.state_name;
                        this.getDistrictList(this.data.state)
                        this.data.district = result.address.district_name;
                        this.data.city = result.address.city;
                        console.log(this.data);
                    }
                });
            }
            
        }

        getPermanentAddress(pincode)
        {
            if(this.data.permanent_pincode.length=='6')
            {
                this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
                .subscribe( (result) =>
                {
                    console.log(result);
                    var address = result.address;
                    if(address!= null)
                    {

                        this.data.permanent_state = result.address.state_name;
                        this.getDistrictList(this.data.permanent_state)
                        this.data.permanent_district = result.address.district_name;
                        this.data.permanent_city = result.address.city;
                    }
                });
            }
            
        }
        
        onCheckShippingAddressSameAsAddressHandler(event) {
            
            console.log(event);
            localStorage.setItem("karigarInfo",JSON.stringify({"isSameAddress":event.checked}));
            if (event.checked) {
                
                this.data.permanent_state = this.data.state;
                this.data.permanent_pincode = this.data.pincode;
                this.data.permanent_city = this.data.city;
                this.data.permanent_address = this.data.address;
                this.getDistrictList(this.data.permanent_state);
                this.data.permanent_district = this.data.district;
                
            }
            else if(event.checked){
                this.data.permanent_state = this.data.state;
                this.data.permanent_pincode = this.data.pincode;
                this.data.permanent_city = this.data.city;
                this.data.permanent_address = this.data.address;
                this.getDistrictList(this.data.permanent_state);
                this.data.permanent_district = this.data.district;
            }            
            else {
                this.data.permanent_state = '';
                this.data.permanent_district = '';
                this.data.permanent_pincode = '';
                this.data.permanent_city = '';
                this.data.permanent_address = '';
            }
        }
        
        scrollUp()
        {
            this.content.scrollToTop();
        } 
        
        presentToast() {
            const toast = this.toastCtrl.create({
                message: 'Document image required',
                duration: 3000
            });
            toast.present();
        }
        
        submit()
        {
            
            
            // if(!this.data.whatsapp_mobile_no){
            //     this.data.whatsapp_mobile_no="";
            // } 
            
            
            // if(!this.data.document_image){
            //     this.presentToast();
            //     return
            // }
            this.presentLoading();
            
            this.data.lang = this.lang;
            
            this.data.created_by='0';
            
            console.log(this.data);
            
            this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
            .subscribe( (r) =>
            {
                console.log(r);
                
                this.karigar_id=r['id'];
                this.karigar_status=r['status'];
                
                console.log(this.karigar_status);
                if(this.karigar_status ==  "SUCCESS"){
                    this.loading.dismiss();
                    this.navCtrl.push(ProfilePage)
                }
                
                
            });
        }
        namecheck(event: any) 
        {
            console.log("called");
            
            const pattern = /[A-Z\+\-\a-z ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) 
            {event.preventDefault(); }
        }
        
        
        
        
        MobileNumber(event: any) {
            const pattern = /[0-9]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
        
        caps_add(add:any)
        {
            this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
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
        openeditprofile()
        {
            let actionsheet = this.actionSheetController.create({
                title:"Profile photo",
                cssClass: 'cs-actionsheet',
                
                buttons:[{
                    cssClass: 'sheet-m',
                    text: this.cam,
                    icon:'camera',
                    handler: () => {
                        console.log("Camera Clicked");
                        this.takePhoto();
                    }
                },
                {
                    cssClass: 'sheet-m1',
                    text: this.gal,
                    icon:'image',
                    handler: () => {
                        console.log("Gallery Clicked");
                        this.getImage();
                    }
                },
                {
                    cssClass: 'cs-cancel',
                    text: this.cancl,
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionsheet.present();
    }
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400,
            cameraDirection: 1,
            correctOrientation: true
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.profile_img ='',
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    getImage() 
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.profile_img ='',
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    
    flag:boolean=true;  
    
    onUploadChange(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title:this.upl_file,
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: this.cam,
                icon:'camera',
                handler: () => {
                    console.log("Camera Clicked");
                    this.takeDocPhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getDocImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionsheet.present();
}
takeDocPhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
getDocImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
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
cancelation_Poilcy(Poilcy){
    console.log("fun call====>");
    
    let contactModal = this.modalCtrl.create(CancelationPolicyPage,{'mode':Poilcy});
    contactModal.present();
    console.log('otp');
}

}
