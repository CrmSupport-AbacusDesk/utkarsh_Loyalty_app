import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';

/**
* Generated class for the TransferwalletpointPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-transferwalletpoint',
  templateUrl: 'transferwalletpoint.html',
})
export class TransferwalletpointPage {
  
  
  filter:any={};
  plumberDetail:any={};
  pointRight: any = {};
  plumberData:boolean=false;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public serve: MyserviceProvider,public constant: ConstantProvider,public modalCtrl : ModalController,) {
    this.influencerDetail();
    
  }
  
  ionViewDidLoad() {
  }
  
  
  influencerDetail() {
    this.serve.presentLoading();
    this.serve.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
      if (res['statusCode'] == 200) {
        this.pointRight = res['loginData'];
        this.serve.dismissLoading();
        
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(res['statusMsg'])
      }
      
    }, err => {
      this.serve.Error_msg(err);
      this.serve.dismiss();
    })
  }
  
  
  getData(){
    
    if(this.filter.search.length==0){
      this.plumberData=false;
    }
    else if(this.filter.search.length==10){
      this.serve.addData({'filter':{'search':this.filter.search,'retailer_id':this.constant.UserLoggedInData.id}},'AppInfluencerSignup/getPlumber').then((result) => {
        if(result['statusCode']==200){
          if(result['statusMsg']=='Success'){
            this.plumberDetail = result['result'][0];
            this.plumberData=true;
            this.serve.dismissLoading();
          }
          else{
            this.serve.errorToast(result['statusMsg'])
            this.plumberData=false;
            
            this.serve.dismissLoading();
            
          }
          
        }else{
          this.serve.dismissLoading();
          this.plumberData=false;
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
      
    }
    
    else if(this.filter.search.length>10){
      this.serve.errorToast('Please Enter 10 Digit Mobile No.')
    }
    
  }
  
  statusModal() {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'data':this.plumberDetail,'from': 'TransferPoint' });
    modal.onDidDismiss(data => {
      this.influencerDetail();
      this.filter.search='';
      this.plumberData=false;
    });
    
    modal.present();
  }
  
  getDatafalse(){
    this.plumberData=false;
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
}


