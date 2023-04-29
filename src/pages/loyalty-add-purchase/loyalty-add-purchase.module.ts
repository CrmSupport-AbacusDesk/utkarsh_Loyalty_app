import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { LoyaltyAddPurchasePage } from './loyalty-add-purchase';

@NgModule({
  declarations: [
    LoyaltyAddPurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyAddPurchasePage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class LoyaltyAddPurchasePageModule {}
