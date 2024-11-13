import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/core/models/authentication.model';
import { AuthenticationService } from 'src/app/core/services/security/authentication/authentication.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild("usernameInput") usernameInput: ElementRef;
  @ViewChild("passwordInput") passwordInput: ElementRef;
  @ViewChild("credentialsError") credentialsError: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;

  @Output() spinnerEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  loginForm: FormGroup;

  request: LoginRequest = new LoginRequest();

  constructor(
    private authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.loginForm.invalid) {
      this.maskErrors();
      return;
    }

    this.request = this.loginForm.value;
    this.login();
  }

  maskErrors() {
    let controlErrors;
    Object.keys(this.loginForm.controls).forEach(key => {
      controlErrors = this.loginForm.get(key)?.errors;
      if(controlErrors) this.addError(key);
    })
  }

  addError(key: string) {
    if(key == 'username') this.usernameInput.nativeElement.classList.add("error-field");
    if(key == 'password') this.passwordInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.usernameInput.nativeElement.classList.remove("error-field");
    this.passwordInput.nativeElement.classList.remove("error-field");
  }

  login() {
    this.spinnerService.changeState(true);
    this.authenticationService.login(this.request).subscribe({
      next: (response) => {
        this.sessionService.saveSession(this.request, response.data.token);
        this.spinnerService.changeState(false);
      },
      error: (error) => {
        if(error.error.error.code == 403) this.credentialsError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
        this.spinnerService.changeState(false);
      }
    })
  }

}
