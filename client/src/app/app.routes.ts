import { Routes } from '@angular/router';
import { AdsListComponent } from './pages/ads-list/ads-list.component';

import { AdsEditComponent } from './pages/ads-edit/ads-edit.component';

export const routes: Routes = [
  { path: 'ads', component: AdsListComponent },
  { path: 'ads/edit', component: AdsEditComponent },
  { path: 'ads/edit/:id', component: AdsEditComponent },

  { path: '', redirectTo: 'ads', pathMatch: 'full' }
];
