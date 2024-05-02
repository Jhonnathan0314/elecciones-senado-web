import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultAllComponent } from './result-all/result-all.component';
import { ResultCreateComponent } from './result-create/result-create.component';


@NgModule({
  declarations: [
    ResultAllComponent,
    ResultCreateComponent
  ],
  imports: [
    CommonModule,
    ResultRoutingModule
  ]
})
export class ResultModule { }
