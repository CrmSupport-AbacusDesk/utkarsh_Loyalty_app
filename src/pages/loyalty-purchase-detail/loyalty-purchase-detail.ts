import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ViewProfilePage } from '../view-profile/view-profile';
import { LoyaltyAddPurchasePage } from '../loyalty-add-purchase/loyalty-add-purchase';

/**
 * Generated class for the LoyaltyPurchaseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loyalty-purchase-detail',
  templateUrl: 'loyalty-purchase-detail.html',
})
export class LoyaltyPurchaseDetailPage {

  id:any
  conDetail:any = {};
  productData:any =[]
  productDataImg:any =[]

  loading:Loading;
  upload_url:any =''
  type:any;
  userId:any;
  from:any;
  tabType:any;
  filter:any={};
  constructor(public navCtrl: NavController,  public cons: ConstantProvider, public navParams: NavParams, public loadingCtrl:LoadingController,public serve: MyserviceProvider,public modalCtrl: ModalController,) {
  
    this.upload_url = cons.influencer_doc;
    this.type = this.navParams.get('type');
    this.tabType = this.navParams.get('tabType');
    this.userId=this.navParams.get('userId')
    this.from=this.navParams.get('from')
    console.log(this.tabType)

  }
  
  ionViewWillEnter() {
    this.id = this.navParams.get('id');
    this.contractorDetail();
  }
  
  
  contractorDetail(){
    this.serve.presentLoading();
    if(this.tabType=='My'){
      this.filter.influencer_id = this.cons.UserLoggedInData.id;
    }
    if(this.tabType!='My'){
      this.filter.against_influencer_id = this.cons.UserLoggedInData.id;
    }
    this.filter.id = this.id;
    this.serve.addData({'filter':this.filter},'RetailerRequest/get_retailer_request_detail').then((result) => {
      if(result['statusCode']==200){
        if(result['statusMsg']=='Success'){
        this.conDetail = result['request_detail'];
        this.serve.dismissLoading();
        this.filter={};
        }
        else{
        this.serve.errorToast(result['statusMsg'])
        this.serve.dismissLoading();

        }

      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
    }, err => {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')
    });
    }

    imageModal(src) {
      this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
    }

    EditPurchase() {
      this.navCtrl.push(LoyaltyAddPurchasePage, { "data": this.conDetail,'type':this.type,'userId':this.userId ,'mode':'ediPage'})
    }
  }
  
