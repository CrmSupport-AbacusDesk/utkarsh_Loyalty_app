import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyPurchaseDetailPage } from './loyalty-purchase-detail';

@NgModule({
  declarations: [
    LoyaltyPurchaseDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyPurchaseDetailPage),
  ],
})
export class LoyaltyPurchaseDetailPageModule {}
