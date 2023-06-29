import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Loading, ModalController, Nav, Events, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import moment from 'moment';
import { ConstantProvider } from '../../../providers/constant/constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoyaltyHomePage } from '../../loyalty/loyalty-home/loyalty-home';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import * as jwt_decode from 'jwt-decode';
import { LoginserviceProvider } from '../../../providers/loginservice/loginservice';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  @ViewChild(Nav) nav: Nav;
  data: any = {};
  form: any = {};
  salesData: any = {};
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  profile_data: any = '';
  loading: Loading;
  today_date: any;
  flag: boolean = true;
  bankImageFlag: boolean = false;
  documentImageFlag: boolean = false;
  documentBackImageFlag: boolean = false;
  panImageFlag: boolean = false;
  Influencer: any = []
  uploadurl: any
  cam: any = "Camera";
  gal: any = "Gallery";
  cancl: any = "Cancel";
  ok: any = "";
  upl_file: any = "";
  token_info: any = "";
  save_succ: any = "";
  appVersion:any
  doc: any = [];
  savingFlag: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: DbserviceProvider,
    public myservice: MyserviceProvider,
    public constant: ConstantProvider,
    public alertCtrl: AlertController,
    private device: Device,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public events: Events,
    public serv: LoginserviceProvider,
    public toastCtrl: ToastController,
  ) {
    console.log(this.navParams);
    this.appVersion = navParams.get('app_version');
    this.data['device_unique_id']  = this.device.uuid;
    this.data['app_version']  = this.appVersion;
    this.data['device_info'] = this.device.model + ',' + this.device.platform + ',' + this.device.version + ',' + this.device.manufacturer;
    this.uploadurl = constant.influencer_doc;
    this.getInfluencer();
    this.getstatelist();
    // this.getUser();
    this.data.document_image = '';
    this.data.pan_img = '';
    this.data.bank_img = '';
    this.data.document_image_back = '';
    if (this.navParams.data.data.registerType == 'Other') {
      this.data.mobile_no = this.navParams.data.data.phone;
    }
    else {
      if (navParams.data.data) {
        console.log(this.navParams)
        this.data = navParams.data.data;
        this.data.panBase64 = false;
        this.data.bankImgBase64 =false;
        this.data.docFrontBase64 = false;
        this.data.docBackBase64 = false;
        this.data.exist_id = this.data.id;
        this.data.profile_edit_id = this.data.id;
        this.data.doc_back_edit_id = this.data.id;
        this.data.doc_pan_id = this.data.id;
        this.data.bank_img_id = this.data.id;
        this.data.doc_edit_id = this.data.id;
        if(this.data.bank_img == "" ||this.data.bank_img == null ||this.data.bank_img == undefined){
          this.bankImageFlag = false
        }else{
          this.bankImageFlag = true
        }
        if(this.data.document_image == "" ||this.data.document_image == null ||this.data.document_image == undefined){
          this.documentImageFlag = false
        }else{
          this.documentImageFlag = true
        }
        if(this.data.document_image_back == "" ||this.data.document_image_back == null ||this.data.document_image_back == undefined){
          this.documentBackImageFlag = false
        }else{
          this.documentBackImageFlag = true
        }
        if(this.data.pan_img == "" ||this.data.pan_img == null ||this.data.pan_img == undefined){
          this.panImageFlag = false
        }else{
          this.panImageFlag = true
        }
       
        if (this.data.dob == '0000-00-00') {
          this.data.dob = '';
        }
        if (this.data.doa == '0000-00-00') {
          this.data.doa = '';
        }
        if (this.data.state) {
          this.getDistrictList(this.data.state);
        }
        this.getInfluencer();
        // setTimeout(() => {
        //   this.getRights(this.data.type);
        // }, 500);
      }
    }
    this.today_date = new Date().toISOString().slice(0, 10);
  }

  ionViewDidLoad() {
  }

  namecheck(event: any) {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  getInfluencer() {
    this.service.get_rqst('AppInfluencerSignup/influencerListSignUp').subscribe(result => {
      if (result['statusCode'] == 200) {
        this.Influencer = result.result;
      }
      else {
        this.myservice.errorToast(result['statusMsg'])
      }
    });
  }

  allUser: any = [];
  getUser() {

    this.myservice.addData({}, 'AppInfluencerSignup/signUpUserList').then(result => {
      if (result['statusCode'] == 200) {
        this.allUser = result['all_sales_user'];

        for (let i = 0; i < this.allUser.length; i++) {
          this.allUser[i].display_name = this.allUser[i].name + ' ' + '(' + this.allUser[i].mobile_no + ')'
        }
      }
      else {
        this.myservice.errorToast(result['statusMsg'])
      }
    });
  }


  checkRight: any
  getRights(type) {
    this.data.distributor_id='';
    this.data.dealer_id='';
    this.data.state='';
    this.data.district='';
    this.checks=[];

    let index = this.Influencer.findIndex(row => row.type == type)
    if (index != -1) {
      this.data.scanning_rights = this.Influencer[index].scanning_rights;
      this.data.point_transfer_right = this.Influencer[index].point_transfer_right;
      this.data.influencer_type = this.Influencer[index].module_name;
    }
  }

  getstatelist() {
    this.myservice.addData({}, 'AppInfluencerSignup/getStates').then(result => {
      if (result['statusCode'] == 200) {
        this.state_list = result['all_state'];
      }
      else {
        this.myservice.errorToast(result['statusMsg'])
      }
    });
  }

  getDistrictList(state_name) {
    this.myservice.addData({ 'state_name': state_name }, 'AppInfluencerSignup/getDistrict').then(result => {
      if (result['statusCode'] == 200) {
        this.district_list = result['all_district'];
      }
      else {
        this.myservice.errorToast(result['statusMsg'])
      }
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.getDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.data.doc_edit_id = this.data.id;
        }
      }
      ]
    });
    actionsheet.present();
  }
  takeDocPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_edit_id = '',
      this.data.docFrontBase64 = true
      this.documentImageFlag = true
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  getDocImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_edit_id = '';
      this.documentImageFlag = true
      this.data.docFrontBase64 = true
      this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }


  onUploadBackChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.backDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.backDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.data.doc_back_edit_id = this.data.id;
        }
      }
      ]
    });
    actionsheet.present();
  }
  backDocPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_back_edit_id = ''
      this.documentBackImageFlag = true
      this.data.docBackBase64 = true
      this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  backDocImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_back_edit_id = '';
      this.documentBackImageFlag = true
      this.data.docBackBase64 = true
      this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }


  onUploadPan(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.panPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.panImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.data.doc_pan_id = this.data.id;
        }
      }
      ]
    });
    actionsheet.present();
  }


  panPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_pan_id = ''
      this.panImageFlag = true
      this.data.panBase64 = true
      this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  panImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_pan_id = '';
      this.panImageFlag = true
      this.data.panBase64 = true
      this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  onUploadBankImg(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.bankPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.bankImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.data.bank_img_id = this.data.id;

        }
      }
      ]
    });
    actionsheet.present();
  }


  bankPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }

    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.bank_img_id = '';
      this.bankImageFlag = true
      this.data.bankImgBase64 = true
      this.data.bank_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  bankImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.bank_img_id = '';
      this.bankImageFlag = true
      this.data.bankImgBase64 = true
      this.data.bank_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }



  submit() {

    if(this.data.type==4 && !this.data.pan_img && !this.data.exist_id){
      this.myservice.errorToast('Upload PAN Image is Required!')
    return;

    }

    if(this.data.exist_id){
      if( (this.data.type==2 || this.data.type==4) && (!this.data.document_image || !this.data.document_image_back)){
        this.myservice.errorToast('Upload Aadhar Image is Required!')
      return;
  
      }
  
      if( (this.data.type==2 || this.data.type==4) && !this.data.pan_img){
        this.myservice.errorToast('Upload PAN Image is Required!')
      return;
  
      }

    }

    
    if (this.data.dob) {
      this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
    }
    if (this.data.doa) {
      this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
    }
     if(this.data.type==2){
      this.data.dealer_id=this.checks?this.checks:[];
      this.data.assign_type='Dealer'
     }
    else if(this.data.type==4){
      this.data.distributor_id=this.checks?this.checks:[];
      this.data.assign_type='Distributor';
     }
    this.savingFlag = true;
    this.myservice.addData({ 'data': this.data }, 'AppInfluencerSignup/addInfluencer').then(result => {
      this.form.phone = this.data.mobile_no;
      this.form.registerType = "Other";

      this.form.device_info = this.data.device_info;
      this.form.device_unique_id =this.data.device_unique_id;
      this.form.app_version = this.data.app_version;
     ;
      if (result['statusCode'] == 200) {
        this.serv.login_submit(this.form).then((result: any) => {
          if (result.loggedInUserType=='Other') {
            this.myservice.successToast(result['statusMsg']);
            this.savingFlag = false;
            this.constant.setData();
            this.navCtrl.setRoot(LoyaltyHomePage);
          }
        })

      }
      else {
        this.myservice.errorToast(result['statusMsg'])
        this.savingFlag = false;
      }
    });

  }

  alertToast(msg){
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  influcencersList:any=[];
  getnetworklist(state) {
    // this.against_type=type.influencer_type;
    this.myservice.addData({'state':state,'type':this.data.type},  'login/dealerList').then((result) => {
      
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

          this.influcencersList[i].id=this.influcencersList[i].id

        }

        
      }else{
        this.myservice.dismissLoading();
        this.myservice.errorToast(result['statusMsg'])
      }
    }, err => {
      this.myservice.dismissLoading();
      this.myservice.errorToast('Something went wrong')
    });
  }
  
  checked:any=[];
  checks:any=[];
  id_array(event){
    console.log(event);
    this.checked=event.value
    for(let i=0;i<=this.checked.length;i++){
      this.checks.push(this.checked[i].id);
    }

  }



}
