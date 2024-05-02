import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateUpdateComponent } from './candidate-update/candidate-update.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { CandidateAllComponent } from './candidate-all/candidate-all.component';


@NgModule({
  declarations: [
    CandidateUpdateComponent,
    CandidateCreateComponent,
    CandidateAllComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule
  ]
})
export class CandidateModule { }
