import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyPage } from './loyalty';

@NgModule({
  declarations: [
    LoyaltyPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyPage),
  ],
})
export class LoyaltyPageModule {}
