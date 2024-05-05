import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/security.model';
import { UserService } from 'src/app/core/services/security/user/user.service';

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.scss']
})
export class UserAllComponent implements OnInit {

  users: User[] = [];

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.userService.findAll().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/user/update/${id}`);
  }

  delete(id: number) {
    this.userService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

}
