import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultAllComponent } from './result-all/result-all.component';
import { ResultCreateComponent } from './result-create/result-create.component';

const routes: Routes = [
  { path: '', component: ResultAllComponent },
  { path: 'create', component: ResultCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultRoutingModule { }
