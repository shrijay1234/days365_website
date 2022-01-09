import { Routes } from '@angular/router';
import { MarketHistoryComponent } from './market-history/market-history.component';
import { InstantDepositComponent } from './instant-deposit/instant-deposit.component';
import { InstantWithdrawComponent } from './instant-withdraw/instant-withdraw.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';

export const MaterialRoutes: Routes = [
  {
    path: 'market-history',
    component: MarketHistoryComponent
  },
  {
    path: 'instant-deposit',
    component: InstantDepositComponent
  },
 
  {
    path: 'instant-withdraw',
    component: InstantWithdrawComponent
  }
];


