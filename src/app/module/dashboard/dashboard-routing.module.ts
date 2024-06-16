import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: 
    [
      { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
      { path: 'role', loadChildren: () => import('./pages/role/role.module').then(m => m.RoleModule) },
      { path: 'party', loadChildren: () => import('./pages/party/party.module').then(m => m.PartyModule) },
      { path: 'candidate', loadChildren: () => import('./pages/candidate/candidate.module').then(m => m.CandidateModule) },
      { path: 'election-table', loadChildren: () => import('./pages/election-table/election-table.module').then(m => m.ElectionTableModule) },
      { path: 'result', loadChildren: () => import('./pages/result/result.module').then(m => m.ResultModule) },
      { path: 'report', loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule) },
      { path: '**', redirectTo: 'user', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
