import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateAllComponent } from './candidate-all/candidate-all.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { CandidateUpdateComponent } from './candidate-update/candidate-update.component';

const routes: Routes = [
  { path: '', component: CandidateAllComponent },
  { path: 'create', component: CandidateCreateComponent },
  { path: 'update/:id', component: CandidateUpdateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
