import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/security.model';
import { UserService } from 'src/app/core/services/security/user/user.service';

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.scss']
})
export class UserAllComponent implements OnInit, OnDestroy {

  users: User[] = [];

  userSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.openUserSubscription();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  openUserSubscription() {
    this.userSubscription = this.userService.users$.subscribe({
      next: (users) => this.users = users,
      error: (error) => this.hasServerError = true
    });
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/user/update/${id}`);
  }

  delete(id: number) {
    this.userService.deleteById(id).subscribe({
      error: (error) => this.hasServerError = true
    });
  }

}
