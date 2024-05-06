import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateUpdateComponent } from './candidate-update/candidate-update.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { CandidateAllComponent } from './candidate-all/candidate-all.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CandidateUpdateComponent,
    CandidateCreateComponent,
    CandidateAllComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    ReactiveFormsModule
  ]
})
export class CandidateModule { }
