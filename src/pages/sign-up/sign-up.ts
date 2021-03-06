// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    username: '',
    wpgdprc: 1,
    register: 'Register',
    nonce: "",
  };
  sellerPhone = ""
  image;
  errorMessage = '';
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,

  ) {
    this.shared.currentOpenedModel = this;
  }
  signUp() {
    this.loading.show();
    this.errorMessage = '';
    // this.config.Woocommerce.postAsync("customers", this.formData).then((data) => {
    //   this.loading.hide();
    //   let dat = JSON.parse(data.body);
    //   console.log(dat);
    //   if (dat.message == undefined) {
    //     //this.shared.login(dat);
    //     this.shared.toast("User Created");
    //     this.viewCtrl.dismiss();
    //   }
    //   if (dat.message != undefined)
    //     this.errorMessage = dat.message;

    // });

    this.http.get(this.config.url + '/api/appusers/register/?username=' + this.formData.username + '&password=' + this.formData.password + '&email=' + this.formData.email
      + '&nick_name=' + this.formData.first_name + ' ' + this.formData.last_name + '&nonce=' + this.formData.nonce
      + '&first_name=' + this.formData.first_name + '&last_name=' + this.formData.last_name + '&display_name=' + this.formData.first_name + ' '
      + this.formData.last_name + '&phone=' + this.sellerPhone).map(res => res.json()).subscribe(data => {
        this.loading.hide();
        if (data.status == "ok") {
          this.shared.toast("User Created. Login Using your Username & Password");
          this.viewCtrl.dismiss();
        }
        else {
          this.errorMessage = data.error;
        }
      }, err => {
        this.loading.hide();
        if (err.ok == false) {
          console.log(err)
          let result = JSON.parse(err._body);
          this.errorMessage = result.error;
        }
      });
  }
  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create(PrivacyPolicyPage);
    modal.present();
  }
  openTermServicesPage() {
    let modal = this.modalCtrl.create(TermServicesPage);
    modal.present();
  }
  openRefundPolicyPage() {
    let modal = this.modalCtrl.create(RefundPolicyPage);
    modal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(LoginPage, { hideGuestLogin: true });// <!-- 2.0 updates -->
    modal.present();
  }
  ionViewDidLoad() {
    //https://www.fashaish.com/Supply/api/get_nonce/?controller=AppUsers&method=register
    this.loading.show();
    this.http.get(this.config.url + '/api/get_nonce/?controller=AppUsers&method=register').map(res => res.json()).subscribe(data => {
      this.loading.hide();
      let res = data;
      this.formData.nonce = res.nonce;
      console.log(res);
    });
  }
}
