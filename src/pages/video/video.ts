import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DomSanitizer } from '@angular/platform-browser';
import { MyserviceProvider } from '../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  filter:any={};
  video_list:any=[];
  loading:Loading;
  SafeResourceUrl;
  category:any='';
  load_data:any=0
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve:MyserviceProvider, public service:DbserviceProvider,public loadingCtrl:LoadingController,public dom:DomSanitizer,private app:App) {
    this.category= this.navParams.get('cat')
    console.log(this.category);
    console.log('ionViewDidLoad VideoPage');
    
  }
  
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad VideoPage');
    this.getVideoList();
    this.presentLoading();
  }
  getVideoList()
  {
    
    this.filter.limit = 0;
    this.filter.category = this.category
    console.log(this.filter);

    this.service.presentLoading();
    this.service.post_rqst({'filter' : this.filter},'app_master/videoList').subscribe( r =>
      {
        if(r['statusCode']==200){
          this.video_list=r['video_list'];
          this.serve.dismissLoading();
          for (let i = 0; i < this.video_list.length; i++) {
            this.video_list[i].url = this.dom.bypassSecurityTrustResourceUrl( this.video_list[i].url);
          }
        }else{
          this.serve.errorToast(r['statusMsg']);
          this.serve.dismissLoading();
        }
        
        
      });
    }
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }
    flag:any='';
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      // this.filter.limit=this.video_list.length;
      // this.service.post_rqst({'filter' : this.filter},'app_master/videoList').subscribe( r =>
      //   {
      //     console.log(r);
      //     if(r['video'] == '')
      //     {
      //       this.flag=1;
      //     }
      //     else 
      //     {
      //       setTimeout(()=>{
      //         this.video_list=this.video_list.concat(r['video']);
      //         for (let i = 0; i < this.video_list.length; i++) {
      //           this.video_list[i].url = this.dom.bypassSecurityTrustResourceUrl( this.video_list[i].url);
      //         }
      //         console.log('Asyn operation has stop')
      //         infiniteScroll.complete();
      //       },1000);
      //     }
      //   });
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
    }
    