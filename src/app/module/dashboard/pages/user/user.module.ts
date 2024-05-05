import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserAllComponent } from './user-all/user-all.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserCreateComponent,
    UserUpdateComponent,
    UserAllComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
