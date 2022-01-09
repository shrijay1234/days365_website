import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialRoutes } from './material.routing';
import { MarketHistoryComponent } from './market-history/market-history.component';
import { InstantDepositComponent } from './instant-deposit/instant-deposit.component';
import { InstantWithdrawComponent } from './instant-withdraw/instant-withdraw.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  entryComponents: [],
  declarations: [MarketHistoryComponent,InstantDepositComponent, InstantWithdrawComponent,MyWalletComponent]
})

export class AdminComponentsModule {}
