import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { securityGuard } from './core/guards/security/security.guard';
import { dashboardGuard } from './core/guards/dashboard/dashboard.guard';

const routes: Routes = [
  { path: 'security', loadChildren: () => import('./module/security/security.module').then(m => m.SecurityModule), canActivate: [securityGuard] },
  { path: 'dashboard', loadChildren: () => import('./module/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [dashboardGuard] },
  { path: '', redirectTo: 'security', pathMatch: 'full' },
  { path: '**', redirectTo: 'security', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
