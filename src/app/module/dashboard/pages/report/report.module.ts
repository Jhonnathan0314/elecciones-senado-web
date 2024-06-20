import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ViewReportComponent } from './view-report/view-report.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ViewReportComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
