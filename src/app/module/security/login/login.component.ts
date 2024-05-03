import { Component } from '@angular/core';
import { LoginRequest } from 'src/app/core/models/authentication.model';
import { AuthenticationService } from 'src/app/core/services/security/authentication/authentication.service';
import { SessionService } from 'src/app/core/services/security/session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = '';
  password = '';

  request: LoginRequest = new LoginRequest();

  constructor(private authenticationService: AuthenticationService, private sessionService: SessionService) { }

  login() {
    this.request = {
      username: this.username,
      password: this.password
    }

    this.authenticationService.login(this.request).subscribe({
      next: (response) => {
        this.sessionService.saveSession(this.request, response.data.token);
        console.log("response: ", response);
      },
      error: (error) => {
        console.log("error: ", error);
      }
    })
  }

}
