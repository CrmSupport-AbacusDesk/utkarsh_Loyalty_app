import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { LoyaltyAddPurchasePage } from '../loyalty-add-purchase/loyalty-add-purchase';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { LoyaltyPurchaseDetailPage } from '../loyalty-purchase-detail/loyalty-purchase-detail';
import { ConstantProvider } from '../../providers/constant/constant';


/**
* Generated class for the LoyaltyPurchaseListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-purchase-list',
  templateUrl: 'loyalty-purchase-list.html',
})
export class LoyaltyPurchaseListPage {
  today_date = new Date().toISOString().slice(0, 10);
  today = new Date().toISOString().slice(0, 10);
  requestList: any = [];
  tomorrow_data : any
  userId: any;
  teamCount: any;
  requestSend: any = false;
  user_data: any = {};
  see_more_button: any = 0;
  filter: any = {};
  complete_count: any;
  pending_count: any;
  load_data: any = 0;
  activeTab:string;
  upcoming_count: any;
  spinner: boolean = false;
  saveFlag: boolean = false;
  statusData:any={};
  type:any;
  purchaseType:any;
  tabCount:any={};
  influencerPurchase:any='My'
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public attendence_serv: AttendenceserviceProvider,
    public modalCtrl : ModalController,
    public constant: ConstantProvider,
    ) {
      this.type=this.navParams.get("type");
      this.purchaseType=this.navParams.get("purchaseType");

      this.today = moment(this.today).add(1, 'days').format('YYYY-MM-DD');
    }
    
    ionViewWillEnter() {
      this.userId=this.navParams.get("login_id");
      this.activeTab = 'Pending';
      if(this.type!=3){
      this.influencerPurchase='My';
      }

      if(this.type==3){
      this.influencerPurchase='Dealer';
      }
      this.getrequest();
    }
    
    goOnAddpurchase() {
      this.navCtrl.push(LoyaltyAddPurchasePage, {'type':this.type})
    }
    id: any;
    getrequest() {
      this.filter.limit=20;
      this.filter.start=0; 
      this.filter.status= this.activeTab
      this.serve.presentLoading();
      if(this.influencerPurchase == 'My'){
        this.filter.influencer_id=this.constant.UserLoggedInData.id;
      }
      if(this.influencerPurchase != 'My'){
        this.filter.against_influencer_id=this.constant.UserLoggedInData.id;
      }

      this.filter.influencer_type=this.influencerPurchase;
      this.load_data = 0
      this.serve.addData({ 'Date': this.filter.date,'filter':this.filter}, 'RetailerRequest/get_retailer_request').then((result) => {
        if(result['statusCode']==200){
          this.serve.dismissLoading();
          this.requestList = result['request_list'];
          this.tabCount = result['count'];
          this.requestSend = true
          this.load_data = 1;
           this.filter={};
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
          this.filter={};

        }
        
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
        this.filter={};

      })
    }
    
    go_to_Purchase_detail(id) {
      this.navCtrl.push(LoyaltyPurchaseDetailPage, { 'id': id,'type':this.type,'userId':this.userId,'tabType':this.influencerPurchase})
    }

 
    
    updateStatus(id, status, reason,points){
      if (status == 'Reject' && !reason){
        this.serve.errorToast('Reason field is required');
        return;
      }
      
      else if(status == 'Approved' && !points){
        this.serve.errorToast('Points field is required');
        return;
      }
      else{
        const confirm = this.alertCtrl.create({
          title: 'Are you sure?',
          message: 'You want to change status!',
          buttons: [
            {
              text: 'No',
              handler: () => {
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.statusData.status_updated_by = this.constant.UserLoggedInData.id;;
                this.statusData.id = id;
                this.statusData.point_value = points;
                this.statusData.status = status;
                this.statusData.status_reason = reason;
                this.saveFlag = true;
                this.spinner=true;
                this.serve.addData({ 'data': this.statusData}, 'RetailerRequest/updateRequestStatus').then((result) => {
                  if(result['statusCode']==200){
                    if(result['statusMsg']=='Success'){
                      this.serve.successToast(result['statusMsg']);
                      this.getrequest();
                      this.serve.dismissLoading();
                      this.saveFlag = false;
                       this.spinner=false;
                    }
                    else{
                      this.serve.errorToast(result['statusMsg'])
                      this.saveFlag = false;
                      this.spinner=false;
                    }
                    
                  }else{
                    this.serve.dismissLoading();
                    this.serve.errorToast(result['statusMsg'])
                    this.saveFlag = false;
                    this.spinner=false;
                  }
                  
                }, error => {
                  this.serve.Error_msg(error);
                  this.serve.dismissLoading();
                  this.spinner=false;

                })
                
              }
            }
          ]
        });
        confirm.present();
      }
      
    }
    
    flag:any='';
    loadData(infiniteScroll)
    {
      this.filter.start=this.requestList.length;
      this.filter.limit=20;
      if(this.influencerPurchase == 'My'){
        this.filter.influencer_id=this.constant.UserLoggedInData.id;
      }
      if(this.influencerPurchase != 'My'){
        this.filter.against_influencer_id=this.constant.UserLoggedInData.id;
      }
      this.filter.status= this.activeTab
      this.filter.influencer_type=this.influencerPurchase;
      this.serve.addData({ 'Date': this.filter.date, 'filter':this.filter}, 'RetailerRequest/get_retailer_request').then( (r) =>
      {
        if(r['request_list']=='')
        {
          this.flag=1;
          this.filter={};
        }
        else
        {
          setTimeout(()=>{
            this.requestList=this.requestList.concat(r['request_list']);
            this.filter={};
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
        this.filter={};

      });
    }
    doRefresh(refresher) {
      
      this.getrequest()
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
    
    
  }
  