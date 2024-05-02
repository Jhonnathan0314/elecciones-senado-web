import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectionTableAllComponent } from './election-table-all/election-table-all.component';
import { ElectionTableCreateComponent } from './election-table-create/election-table-create.component';
import { ElectionTableUpdateComponent } from './election-table-update/election-table-update.component';

const routes: Routes = [
  { path: '', component: ElectionTableAllComponent },
  { path: 'create', component: ElectionTableCreateComponent },
  { path: 'update', component: ElectionTableUpdateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionTableRoutingModule { }
