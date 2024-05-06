import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/models/security.model';
import { RoleService } from 'src/app/core/services/security/role/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  roles: Role[] = [];

  constructor(
    private router: Router,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.roleService.findAll().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/role/update/${id}`);
  }

  delete(id: number) {
    this.roleService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

}
