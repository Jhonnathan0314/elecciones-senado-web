import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role/role.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleUpdateComponent } from './role-update/role-update.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoleComponent,
    RoleCreateComponent,
    RoleUpdateComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ReactiveFormsModule
  ]
})
export class RoleModule { }
