import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/services/utils/session/session.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  email = '';
  role = '';

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.email = this.sessionService.getUsername();
    this.role = this.sessionService.getRole();
  }

  logout() {
    this.sessionService.logout();
  }

}
