import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyPurchaseListPage } from '../loyalty-purchase-list/loyalty-purchase-list';
import { RegistrationPage } from '../login-section/registration/registration';

/**
* Generated class for the LoyaltyAddPurchasePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-add-purchase',
  templateUrl: 'loyalty-add-purchase.html',
})
export class LoyaltyAddPurchasePage {
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  data: any = {};
  cityList: any = [];
  influcencersList: any = [];
  ItemList:any=[];
  add_list: any = [];
  planDate: any;
  spinner: boolean = false
  userId:any;
  pageName:any;
  filter:any={};
  image: any = '';
  image_data: any = [];
  date_from:any;
  part:any=[];
  catList:any=[];
  type:any;
  against_type:any;
  
  already_exsist : boolean = false;
  saveFlag : boolean = false;
  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;
  constructor(public navCtrl: NavController,private camera:Camera, public navParams: NavParams, public serve: MyserviceProvider,public actionSheetController: ActionSheetController,public constant: ConstantProvider
    ,public alertCtrl: AlertController,public toastCtrl: ToastController,) {
      this.userId=this.navParams.get('userId')
      this.type=this.navParams.get("type");
      console.log(this.type);
       if(this.type==4){
        this.data.against_influencer_type='Distributor'
        this.getnetworklist('') 
       }
       if(this.type==2){
        this.data.against_influencer_type='Dealer';
        this.getnetworklist('') 
       }
       if(this.type==1){
        this.data.against_influencer_type='Plumber';
        this.getnetworklist('') 
       }
      this.categoryList();

      
    }
    
    ionViewDidLoad() {
    }
    ionViewWillEnter(){
      this.influencerDetail();
    }
    
    
    getnetworklist(type) {
      this.against_type=type.influencer_type;
      this.serve.addData({'influencer_id':this.constant.UserLoggedInData.id,'type':this.data.against_influencer_type},  'AppInfluencerSignup/getInfluencerList').then((result) => {
        
        if(result['statusCode']==200){
          this.influcencersList = result['result'];

          for(let i = 0 ;i<this.influcencersList.length;i++){
            if(this.influcencersList[i].company_name==null){
              this.influcencersList[i].company_name=''
          }
          if(this.influcencersList[i].name==null){
              this.influcencersList[i].name=''
          }
          if(this.influcencersList[i].mobile_no==null){
              this.influcencersList[i].mobile_no=''
          }
        
            if(this.influcencersList[i].name!=""||this.influcencersList[i].mobile_no!=""){
              this.influcencersList[i].company_name=this.influcencersList[i].company_name+','+'('+this.influcencersList[i].name+'  '+this.influcencersList[i].mobile_no+')'
            }
            if(this.influcencersList[i].name==""&&this.influcencersList[i].mobile_no==""){
              this.influcencersList[i].company_name=this.influcencersList[i].company_name
            }
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
    
    categoryList() {
      this.serve.addData({},  'RetailerRequest/category_list').then((result) => {
        if(result['statusCode']==200){
          this.catList = result['category_list'];
          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }
    
    productItems(cat_id) {
      this.data.item_name='';
      this.serve.addData({'filter':{'category_id':cat_id}},  'RetailerRequest/product_list').then((result) => {
        if(result['statusCode']==200){
          this.ItemList = result['product_list'];

          for(let i = 0 ;i<this.ItemList.length;i++){
            if(this.ItemList[i].product_name!=""||this.ItemList[i].product_code!=""){
              this.ItemList[i].product_name=this.ItemList[i].product_name+'-'+'('+this.ItemList[i].product_code+')'
            }
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

    influencer_detail:any={};
    influencerDetail() {
      this.serve.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
        if (res['statusCode'] == 200) {
          this.influencer_detail = res['loginData']['login_data'];
        
        }
         else {
          this.serve.errorToast(res['statusMsg'])
        }
    
      }, err => {
        this.serve.Error_msg(err);
        this.serve.dismiss();
      })
    }
    
    
    addToList() {
      this.data.product_name=this.data.item_name.product_name;
      this.data.product_id=this.data.item_name.id;
      if(this.add_list.length <=0){
        this.add_list.push(JSON.parse(JSON.stringify(this.data)))
        this.data.qty=''
        this.data.item_name='';
        this.data.cat_id='';
      }
      else{
        let isExistIndex:any;
        isExistIndex=this.add_list.findIndex(row=>row.product_id==this.data.product_id);
        if(isExistIndex == -1){
          this.add_list.push(JSON.parse(JSON.stringify(this.data)))
          this.data.qty='';
          this.data.item_name='';
          this.data.cat_id='';
        }
        else{
            this.add_list[isExistIndex].qty= parseInt(this.add_list[isExistIndex].qty)+parseInt(this.data.qty)
          this.data.qty='';
          this.data.item_name='';
          this.data.cat_id='';
          this.already_exsist = true
        }
      }
    }
    listdelete(index) {
      this.add_list.splice(index, 1);
      this.serve.errorToast("Deleted");
      if(this.add_list.length==0){
        this.image_data=[];
      }
    }
    
    captureMedia() {
      let actionsheet = this.actionSheetController.create({
        title: "Upload Image",
        cssClass: 'cs-actionsheet',
        
        buttons: [{
          cssClass: 'sheet-m',
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            
            
            this.takePhoto();
          }
        },
        {
          cssClass: 'sheet-m1',
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            
            this.getImage();
          }
        },
        {
          cssClass: 'cs-cancel',
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionsheet.present();
  }
  
  takePhoto() {
    
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      
      if (this.image) {
        this.fileChange(this.image);
      }
    },
    (err) => {
    });
  }
  
  getImage() {
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      cameraDirection: 1,
      correctOrientation: true
    }
    
    
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      
      
      if (this.image) {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }


  
  fileChange(img) {
    // this.image_data=[];
    this.image_data.push(img);
    this.image = '';
  }
  
  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }
  
  numeric_Number(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  updateDetail() {
    this.influencer_detail.edit_profile = 'edit_profile';
    this.navCtrl.push(RegistrationPage, { 'data': this.influencer_detail, "mode": 'edit_page' })
  }


  showLimit() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 6 bill images",
      cssClass: 'alert-modal',
      
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          
        }
      }
    ]
  });
  alert.present();
}

alertToast(msg){
  const toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });
  toast.present();
}

submit(){
  
  if(!this.image_data.length){
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "Upload Bill Image Is Required!",
      cssClass: 'alert-modal',
      
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          
        }
      }
    ]
  });
  alert.present();
  return;
  
}

let alert = this.alertCtrl.create({
  title: 'Save Purchase',
  message: 'Do you want to Save this Purchase?',
  cssClass: 'alert-modal',
  buttons: [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
      }
    },
    {
      text: 'Yes',
      handler: () => {
        
        // if(this.add_list < 1){
        //   this.alertToast('Please add one item at least!')
        //   return
        // }
        this.spinner = true;
        this.saveFlag = true;
        // this.data.part = this.add_list;
        this.data.influencer_id = this.constant.UserLoggedInData.id;
        this.data.influencer_type = this.type;
        this.data.against_influencer_id = this.data.against_influencer_id.id;
        this.data.against_influencer_type=this.against_type;

        this.data.image = this.image_data?this.image_data:[];
        this.serve.addData({'data':this.data}, 'RetailerRequest/add_retailer_request').then((result) => {
          
          if(result['statusCode']==200){
            if(result['statusMsg'] == 'Success'){
              this.spinner = false
              this.serve.successToast(result['statusMsg']);
              this.navCtrl.popTo(LoyaltyPurchaseListPage);
            }
            
          }else{
            this.spinner = false
            this.serve.dismissLoading();
            this.serve.errorToast(result['statusMsg'])
          }
        }, err => {
          this.spinner = false
          this.serve.dismissLoading();
          this.serve.errorToast('Something went wrong')
        });
        
        
      }
    }
    
  ]
});
alert.present();

}



}
