import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DescriptionModelPage } from '../description-model/description-model';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

// import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer';
// import { ViewProfilePage } from '../view-profile/view-profile';
import { ConstantProvider } from '../../providers/constant/constant';
import { FilterProductPage } from '../filter-product/filter-product';

declare var DocumentViewer: any;

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    prod_cat_list:any=[];
    filter :any = {};
    flag:any='';
    loading:Loading;
    cat_images:any=[];
    lang:any='';
    tokenInfo:any={};
    uploadUrl:any="";
    pdf_name:any;
    constructor(
        public navCtrl: NavController,
       
        public navParams: NavParams,
        public service:DbserviceProvider,
        public con:ConstantProvider,
        public loadingCtrl:LoadingController,
        private app:App, 
        public modalCtrl: ModalController,
        public translate:TranslateService,
        public storage:Storage,
        public InApp:InAppBrowser,
     
       
        ) {
        
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductsPage');
        this.get_user_lang();
        this.uploadUrl = this.con.upload_url;
    console.log("pdf print",  this.uploadUrl)
        this.getpdf();
    }
    ionViewWillEnter()
    {
        this.getProductCategoryList();
        this.presentLoading();
        
    }
    get_user_lang()
    {
        this.storage.get("token")
        .then(resp=>{
            this.tokenInfo = this.getDecodedAccessToken(resp );
            this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
            .subscribe(resp=>{
                console.log(resp);
                this.lang = resp['language'];
                if(this.lang == "")
                {
                    this.lang = "en";
                }
                this.translate.use(this.lang);
            })
        })
    }
    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
    goOnProductDetailPage(id){
        this.navCtrl.push(ProductDetailPage,{'id':id})
    }
    getProductCategoryList()
    {
        console.log('catagorylist');
        this.filter.limit = 0;
        this.service.post_rqst({'filter' : this.filter},'app_master/categoryList')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            this.prod_cat_list=r['categories'];
        });
    }
    
    loadData(infiniteScroll)
    {
        console.log('loading');
        this.filter.limit=this.prod_cat_list.length;
        this.service.post_rqst({'filter' : this.filter},'app_master/categoryList')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r['categories']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
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
    ionViewDidLeave()
    {
        let nav = this.app.getActiveNav();
        if(nav && nav.getActive()) 
        {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if(nav.getPrevious() && nav.getPrevious().name)
            {
                previuosView = nav.getPrevious().name;
            }  
            console.log(previuosView); 
            console.log(activeView);  
            console.log('its leaving');
            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
            {
                
                console.log(previuosView);
                this.navCtrl.popToRoot();
            }
        }
    }
    
    view_description(value,id) 
    {
        console.log(value);
        
        let contactModal = this.modalCtrl.create(DescriptionModelPage,{'description':value,'id':id});
        contactModal.present();
        console.log('otp');
    }
    getProductList(search)
    {
        console.log(search);
        this.filter.search=search;
        // this.filter.limit = 0;
        // this.filter.id=id;
        this.service.post_rqst({'filter':this.filter},'app_master/categoryList')
        .subscribe( (r) =>
        {
            console.log(r);
            this.prod_cat_list=r['categories'];
            // this.new_arrival_prod_list=r['category_name'];
        });
    }
    gotoProductFilterPage(search){
        console.log("clicked View Products");
        console.log(search);
        this.navCtrl.push(FilterProductPage,{'search':search});
        // this.filter.type=2;
        // this.service.post_rqst({'filter':search},'app_master/productList').subscribe(r=>{
        //     console.log(r);
        // })
    }
    getpdf()
    {   console.log('service',this.service);
    
        this.service.get_rqst('app_karigar/get_app_pdf')
        .subscribe( (r) =>
        {
            console.log(r);
            this.pdf_name = r.pdf
        });
    }

    pdf(name){
        this.presentLoading();
        // console.log("name of pdf",name);
        console.log(upload_url);
        var upload_url=  this.con.upload_url  +  name;
        console.log("194",upload_url);
        DocumentViewer.previewFileFromUrlOrPath(
          function () {
            console.log('success');
          }, 
          function (error) 
          {
            if (error == 53) 
            {
              console.log('No app that handles this file type.');
            }else if (error == 2)
            {``
              console.log('Invalid link');
            }
          },

          upload_url ,'', 'application/pdf');
          setTimeout(() => {
             
          }, 10000);
          
        }

        openurl(name){
            console.log("image")
            var upload_url=  this.con.upload_url  +  name;
            console.log("present",upload_url)
            // window.open(upload_url,"","location=yes")
            // window.location.assign('https://docs.google.com/gview?embedded=true&url=' + upload_url)
            window.open(encodeURI('https://docs.google.com/gview?embedded=true&url='+upload_url), '_system', 'location=yes,EnableViewPortScale=yes');
            // window.open(('https://docs.google.com/gview?embedded=true&url='+upload_url), '_system', 'location=yes, EnableViewPortScale=yes,hidden=no');
        }
      

        
      
}
