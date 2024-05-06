import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyAllComponent } from './party-all/party-all.component';
import { PartyCreateComponent } from './party-create/party-create.component';
import { PartyUpdateComponent } from './party-update/party-update.component';

const routes: Routes = [
  { path: '', component: PartyAllComponent },
  { path: 'create', component: PartyCreateComponent },
  { path: 'update/:id', component: PartyUpdateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule { }
