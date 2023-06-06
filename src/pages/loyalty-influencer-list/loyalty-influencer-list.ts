import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { LoyaltyInfluencerDetailPage } from '../loyalty-influencer-detail/loyalty-influencer-detail';




@IonicPage()
@Component({
  selector: 'page-loyalty-influencer-list',
  templateUrl: 'loyalty-influencer-list.html',
})
export class LoyaltyInfluencerListPage {
  today_date = new Date().toISOString().slice(0, 10);
  today = new Date().toISOString().slice(0, 10);
  influencerList: any = [];
  tomorrow_data : any
  // loading: Loading;
  userId: any;
  user_data: any = {};
  see_more_button: any = 0;
  filter: any = {};
  complete_count: any;
  pending_count: any;
  load_data: any = 0;
  activeTab:string;
  upcoming_count: any;
  spinner: boolean = false;
  statusData:any={};
  type:any;
  tabCount:any={};

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public constant: ConstantProvider,
    ) {
     
      this.type=this.navParams.get("type");
      this.userId=this.navParams.get("login_id");
    this.getinfluencerList();

    }
  // ionViewWillEnter() {
  //   if(this.type==2){
  //   this.activeTab = 'Approved';
  //   }
  //   if(this.type==3){
  //   this.activeTab = 'Active';
  //   }
  //   this.getinfluencerList();
  // }

  
  getinfluencerList() {
    this.filter.start=0; 
    this.filter.limit=20;
   this.filter.status= this.activeTab
   this.serve.presentLoading();
   if(this.type==4){
    this.filter.type='Retailer';
   }
    if(this.type==3){
    this.filter.type='Dealer';
   }
    this.filter.influencer_id=this.constant.UserLoggedInData.id;
    this.load_data = 0
    this.serve.addData({'filter':this.filter}, 'AppInfluencerSignup/assignInflencerList').then((result) => {

      if(result['statusCode']==200){
        this.serve.dismissLoading();
        this.influencerList = result['result'];
        this.tabCount = result['count'];
        this.load_data = 1;

      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
  }

  goToDetail(id){
    
    this.navCtrl.push(LoyaltyInfluencerDetailPage, { 'id': id,'type':this.type,'userId':this.userId})
  }
  

      
  flag:any='';
  loadData(infiniteScroll)
  {
    this.filter.start=this.influencerList.length;
    
    this.serve.addData({'filter':this.filter}, 'AppInfluencerSignup/assignInflencerList').then( (r) =>
    {
      if(r['result']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.influencerList=this.influencerList.concat(r['result']);
          infiniteScroll.complete();
        },1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  doRefresh(refresher) {

  this.getinfluencerList()
    setTimeout(() => {
        refresher.complete();
    }, 1000);
}
  
  
}
