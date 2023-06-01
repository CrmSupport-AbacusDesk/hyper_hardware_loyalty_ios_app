import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";

import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
    selector: 'page-language',
    templateUrl: 'language.html',
})
export class LanguagePage {
    
    loading:Loading;
    come_from:any="";
    karigar_id:any="";
    data:any={};
    language:any;
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public storage : Storage,public translate:TranslateService,public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
        this.data.country='India';
        
        // if(this.data.country='India'){
        //     this.selectlanguage()
        // }else if( this.data.country='Nepal'){
        //     this.selectlanguage()
        // }
        
        
    }
    lang:any='en';
    user_id:any;
    ionViewDidLoad() {
        // commented
        // this.presentLoading();
        // this.change_language();
        this.user_id = this.navParams.get("login_id");
        console.log("id",this.user_id )
        this.storage.get('token')
        .then(resp=>{
            console.log(jwt_decode(resp));
            let tokendata = jwt_decode(resp);
            console.log(tokendata);
            this.karigar_id = tokendata;
            this.get_user_lang();
        })
        
        this.come_from = this.navParams.get("come_from");
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        console.log('ionViewDidLoad LanguagePage');
        
        
        
    }
    
    selectlanguage(){
        
        
        this.db.post_rqst({'country':this.data.country,'lang':this.lang},'app_karigar/add_country')
        .subscribe((r:any)=>
        {
            console.log(r);
        }
        );
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
    
    inputs:any=[];
    tokenInfo:any={};
    change_language()
    {
        this.inputs = [];
        this.db.get_rqst("app_karigar/get_languages")
        .subscribe(resp=>{
            console.log(resp);
            this.inputs = resp
            this.loading.dismiss();
            console.log(this.inputs);
        })
    }
    
    continue()
    {
        if(!this.data.country){
            const alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please Select Country!',
                buttons: ['OK']
            });
            alert.present();
            return;
        }
        this.navCtrl.push(MobileLoginPage,{"lang":this.lang,'country':this.data.country});
    }
    
   
    set_lang(lang)
    {
       
        
        console.log("countery", this.data.country );
        
        if( this.data.country == "Nepal"){
            console.log("select nepal");
            console.log("lan",lang  );
            this.translate.use(lang)
        }else if( (lang == "hin") &&(this.data.country == "India" )){

        this.translate.use(this.lang);
        }
    }
    
    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
    
    karigar_detail:any={};
    chs_lng:any=""
    no:any=""
    yes:any=""
    sure:any=""
    update_lang()
    {
        this.translate.get("Change Language")
        .subscribe(resp=>{
            this.chs_lng = resp;
        })
        
        this.translate.get("No")
        .subscribe(resp=>{
            this.no = resp;
        })
        this.translate.get("Yes")
        .subscribe(resp=>{
            this.yes = resp;
        })
        this.translate.get("Are you sure you want to change language")
        .subscribe(resp=>{
            this.chs_lng = resp;
        })
        let updateAlert = this.alertCtrl.create({
            title: this.chs_lng,
            message: this.sure,
            buttons: [
                {
                    text: this.no, 
                },
                {
                    text: this.yes,
                    handler: () => {
                        this.karigar_detail.language = this.lang;
                        this.karigar_detail.id = this.karigar_id;
                        console.log('id',this.karigar_detail)
                        console.log('id',this.karigar_detail.id)
                        this.db.post_rqst({"user_id": this.user_id,"lang":this.lang},"app_karigar/update_language")
                        .subscribe(resp=>{
                            console.log(resp);
                            this.navCtrl.push(HomePage);
                        })
                    } 
                }
            ]
        });
        updateAlert.present();
    }
    
    get_user_lang()
    {
        this.storage.get("token")
        .then(resp=>{
            this.tokenInfo = this.getDecodedAccessToken(resp );
            
            this.db.post_rqst({"login_id":this.karigar_id},"app_karigar/get_user_lang")
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
}
