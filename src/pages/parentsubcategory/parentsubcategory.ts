import { ProductSubdetailPage } from './../product-subdetail/product-subdetail';
import { ConstantProvider } from './../../providers/constant/constant';
import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
* Generated class for the ParentsubcategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-parentsubcategory',
  templateUrl: 'parentsubcategory.html',
})
export class ParentsubcategoryPage {
  prod_list:any =[];
  priviousName:any ={};
  upload_url:any =''
  filter :any = {};
  flag:any='';
  loading:Loading;
  constructor(public navCtrl: NavController,public con:ConstantProvider, public service:DbserviceProvider, public navParams: NavParams, public translate:TranslateService, public loadingCtrl:LoadingController) {
    console.log(navParams);
    this.upload_url = this.con.upload_url;
    
    this.priviousName=this.navParams.data.name;
    console.log(this.priviousName);
    
    
  }
  
  ionViewWillEnter()
  {
    this.getProductList();
    this.presentLoading();
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentsubcategoryPage');
  }
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
  }
  
  getProductList()
  {
    this.filter.limit = 0;
    console.log(this.priviousName);
    this.service.post_rqst({'filter' : this.filter, 'product_name':this.priviousName},'app_master/product_listing')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      this.prod_list=r['product_detail'];
      // this.prod_cat=r['category_name'];
    });
  }
  
  
  loadData(infiniteScroll)
  {
    console.log('loading');
    this.filter.limit=this.prod_list.length;
    this.service.post_rqst({'filter' : this.filter, 'product_name':this.priviousName},'app_master/product_listing')
    .subscribe( (r) =>
    {
      console.log(r);
      if(r['product_detail']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.prod_list=this.prod_list.concat(r['product_detail']);
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
}
