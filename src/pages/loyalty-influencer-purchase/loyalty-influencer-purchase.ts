import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ViewProfilePage } from '../view-profile/view-profile';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';



@IonicPage()
@Component({
  selector: 'page-loyalty-influencer-purchase',
  templateUrl: 'loyalty-influencer-purchase.html',
})
export class LoyaltyInfluencerPurchasePage {
  id:any
  conDetail:any = {};
  productData:any =[]
  productDataImg:any =[]

  loading:Loading;
  upload_url:any =''
  type:any;
  userId:any;
  from:any;
  constructor(public navCtrl: NavController,  public cons: ConstantProvider, public navParams: NavParams, public loadingCtrl:LoadingController,public serve: MyserviceProvider,public modalCtrl: ModalController,) {
  
    this.upload_url = cons.influencer_doc;
    this.type = this.navParams.get('type');
    this.userId=this.navParams.get('userId')
  }
  
  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.contractorDetail();
  }
  
  
  contractorDetail(){
    this.serve.presentLoading();
    this.serve.addData({'id':this.id},'RetailerRequest/get_retailer_request_detail').then((result) => {
      if(result['statusCode']==200){
        if(result['statusMsg']=='Success'){
        this.conDetail = result['request_detail'];
        this.serve.dismissLoading();

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
  }
  



