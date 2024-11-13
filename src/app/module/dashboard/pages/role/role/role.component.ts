import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/core/models/security.model';
import { RoleService } from 'src/app/core/services/security/role/role.service';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {

  roles: Role[] = [];

  roleSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.openRoleSubscription();
  }

  ngOnDestroy(): void {
      this.roleSubscription.unsubscribe();
  }

  openRoleSubscription() {
    this.roleSubscription = this.roleService.roles$.subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => this.hasServerError = true
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/role/update/${id}`);
  }

  delete(id: number) {
    this.spinnerService.changeState(true);
    this.roleService.deleteById(id).subscribe({
      next: () => {
        this.spinnerService.changeState(false);
      },
      error: (error) => {
        this.hasServerError = true;
        this.spinnerService.changeState(false);
      }
    })
  }

}
