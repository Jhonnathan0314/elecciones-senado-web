import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyRoutingModule } from './party-routing.module';
import { PartyAllComponent } from './party-all/party-all.component';
import { PartyCreateComponent } from './party-create/party-create.component';
import { PartyUpdateComponent } from './party-update/party-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PartyAllComponent,
    PartyCreateComponent,
    PartyUpdateComponent
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PartyModule { }
