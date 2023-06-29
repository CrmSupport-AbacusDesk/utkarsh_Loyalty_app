import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ExpenseStatusModalPage } from '../../expense-status-modal/expense-status-modal';


@IonicPage()
@Component({
  selector: 'page-loyalty-point-history',
  templateUrl: 'loyalty-point-history.html',
})

export class LoyaltyPointHistoryPage {
  filter:any={};
  coupon_list:any=[];
  otherPoints:any=[];
  ledger_list:any =[];
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  history: string = "Ledger";
  influencer_point:any = {};
  type:any;
  pointTransferlist:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public modalCtrl: ModalController) {
    this.type=this.navParams.get('type')
    this.service.presentLoading();
    this.getLedger('');
  }
  
  ionViewDidLoad() {
  }
  
  
  
  doRefresh(refresher) 
  {
    this.getPointList(); 
    refresher.complete();
  }
  
  
  getLedger(bonus)
  {
    this.filter.limit=10;
    this.filter.start=0;
    this.filter.ledger = bonus;
    this.service.addData({'filter' : this.filter},'AppScanHistory/influencerLedger').then(result =>
      {
        
        if(result['statusCode'] == 200){
          this.ledger_list = result['influencer_ledger'];
          this.service.dismissLoading();
        }
        else{
          this.service.errorToast(result['statusMsg']);
          this.service.dismissLoading();
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      });
    }

    gettransferpoint(bonus)
  {
    this.filter.limit=10;
    this.filter.start=0;
    this.filter.ledger = bonus;
    this.service.presentLoading();
    this.service.addData({'filter' : this.filter},'AppScanHistory/networkLedger').then(result =>
      {
        
        if(result['statusCode'] == 200){
          this.pointTransferlist = result['network_ledger'];
          this.service.dismissLoading();
        }
        else{
          this.service.errorToast(result['statusMsg']);
          this.service.dismissLoading();
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      });
    }
    
    
    getPointList()
    {
      this.filter.limit=10;
      this.filter.start=0;
      this.service.presentLoading();
      this.service.addData({'filter' : this.filter},'AppScanHistory/couponScanList').then(result =>
        {
          if(result['statusCode'] == 200){
            this.influencer_point=result['detail'];
            this.coupon_list = result['coupon_scan_list'];
            this.service.dismissLoading();
          }
          else{
            this.service.errorToast(result['statusMsg']);
            this.service.dismissLoading();
          }
          
        }, error => {
          this.service.Error_msg(error);
          this.service.dismiss();
        });
      }
      
      flag:any='';
      
      loadData(infiniteScroll, type)
      {
        if(type == 'scanned'){
          this.filter.start=this.coupon_list.length;
          this.service.addData( {'filter':this.filter},'AppScanHistory/couponScanList').then( r =>
            {
              if(r['coupon_scan_list'] == '')
              { this.flag=1;}
              else
              {
                setTimeout(()=>{
                  this.coupon_list=this.coupon_list.concat(r['coupon_scan_list']);
                  infiniteScroll.complete();
                },1000);
              }
            }, error => {
              this.service.Error_msg(error);
              this.service.dismiss();
            });
          }
          
          else{
            this.filter.start=this.ledger_list.length;
            this.filter.ledger
            this.service.addData( {'filter':this.filter},'AppScanHistory/influencerLedger').then( r =>
              {
                if(r['influencer_ledger'] == '')
                { this.flag=1;}
                else
                {
                  setTimeout(()=>{
                    this.ledger_list=this.ledger_list.concat(r['influencer_ledger']);
                    infiniteScroll.complete();
                  },1000);
                }
              }, error => {
                this.service.Error_msg(error);
                this.service.dismiss();
              });
            }
            
          }


          statusModal(id) {
            let modal = this.modalCtrl.create(ExpenseStatusModalPage, {'from': 'PointHistory' });
        
            modal.onDidDismiss(data => {
              console.log(data)
              this.filter.date_to=data.date_to
              this.filter.date_from=data.date_from
                this.getLedger('');

              // this.getPointList(); 
            });
        
            modal.present();
          }
        
        }
        