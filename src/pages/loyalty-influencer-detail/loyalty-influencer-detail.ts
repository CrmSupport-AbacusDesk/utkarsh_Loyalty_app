import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyInfluencerPurchasePage } from '../loyalty-influencer-purchase/loyalty-influencer-purchase';



@IonicPage()
@Component({
  selector: 'page-loyalty-influencer-detail',
  templateUrl: 'loyalty-influencer-detail.html',
})
export class LoyaltyInfluencerDetailPage {

  id:any
  influencerDetail:any = {};
  loading:Loading;
  upload_url:any =''
  type:any;
  load_data: any = 0;
  userId:any;
  detail: string = "basic";
  filter:any={};
  tabCount:any;
  purchaseList:any=[];
  requestSend: any = false;
  constructor(public navCtrl: NavController,  public cons: ConstantProvider, public navParams: NavParams, public loadingCtrl:LoadingController,public serve: MyserviceProvider,public modalCtrl: ModalController,) {
  
    this.upload_url = cons.influencer_doc;
    this.type = this.navParams.get('type');
    this.userId=this.navParams.get('userId')
   
  }
  
  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.getinfluencerDetail();
  }
  
  
  getinfluencerDetail() {
   
    this.serve.presentLoading();
    this.serve.addData({'id':this.id}, 'AppInfluencer/influencer_detail').then((result) => {
      if(result['statusCode']==200){
        this.serve.dismissLoading();
        this.influencerDetail = result['detail'];
      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
      
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
   
  }

    getpurchaseDetail(){
      this.filter.limit=20;
      this.filter.start=0; 
      this.serve.presentLoading();
      if(this.type==2){
        this.filter.retailer_id=this.id;
      }
      else if(this.type==3){
        this.filter.distributor_id=this.id;
      }
     
      this.load_data = 0
      this.serve.addData({'filter':this.filter}, 'RetailerRequest/get_retailer_request').then((result) => {
        if(result['statusCode']==200){
          this.serve.dismissLoading();
          this.purchaseList = result['request_list'];
          this.tabCount = result['all_count'];
          this.requestSend = true
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

    go_to_Purchase_detail(id) {
      this.navCtrl.push(LoyaltyInfluencerPurchasePage, { 'id': id,'type':this.type,'userId':this.userId})
    }

    doRefresh(refresher) {
      
      this.getpurchaseDetail()
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }


    flag:any='';
    loadData(infiniteScroll)
    {
      this.filter.start=this.purchaseList.length;
      
      this.serve.addData({'filter':this.filter}, 'RetailerRequest/get_retailer_request').then( (r) =>
      {
        if(r['request_list']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.purchaseList=this.purchaseList.concat(r['request_list']);
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }

    
  }
  



