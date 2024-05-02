import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyRoutingModule } from './party-routing.module';
import { PartyAllComponent } from './party-all/party-all.component';
import { PartyCreateComponent } from './party-create/party-create.component';
import { PartyUpdateComponent } from './party-update/party-update.component';


@NgModule({
  declarations: [
    PartyAllComponent,
    PartyCreateComponent,
    PartyUpdateComponent
  ],
  imports: [
    CommonModule,
    PartyRoutingModule
  ]
})
export class PartyModule { }
