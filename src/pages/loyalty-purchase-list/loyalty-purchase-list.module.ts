import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyPurchaseListPage } from './loyalty-purchase-list';

@NgModule({
  declarations: [
    LoyaltyPurchaseListPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyPurchaseListPage),
  ],
})
export class LoyaltyPurchaseListPageModule {}
