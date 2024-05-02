import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectionTableRoutingModule } from './election-table-routing.module';
import { ElectionTableAllComponent } from './election-table-all/election-table-all.component';
import { ElectionTableCreateComponent } from './election-table-create/election-table-create.component';
import { ElectionTableUpdateComponent } from './election-table-update/election-table-update.component';


@NgModule({
  declarations: [
    ElectionTableAllComponent,
    ElectionTableCreateComponent,
    ElectionTableUpdateComponent
  ],
  imports: [
    CommonModule,
    ElectionTableRoutingModule
  ]
})
export class ElectionTableModule { }
