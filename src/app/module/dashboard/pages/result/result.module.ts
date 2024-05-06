import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultAllComponent } from './result-all/result-all.component';
import { ResultCreateComponent } from './result-create/result-create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResultAllComponent,
    ResultCreateComponent
  ],
  imports: [
    CommonModule,
    ResultRoutingModule,
    ReactiveFormsModule
  ]
})
export class ResultModule { }
