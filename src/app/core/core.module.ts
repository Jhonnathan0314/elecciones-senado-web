import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './components/global/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/global/spinner/spinner.component';


@NgModule({
  declarations: [
    TopbarComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TopbarComponent,
    SpinnerComponent
  ]
})
export class CoreModule { }
