import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegisterRequest } from 'src/app/core/models/authentication.model';
import { DocumentType } from 'src/app/core/models/security.model';
import { AuthenticationService } from 'src/app/core/services/security/authentication/authentication.service';
import { DocumentTypeService } from 'src/app/core/services/security/document-type/document-type.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild("documentTypeInput") documentTypeInput: ElementRef;
  @ViewChild("documentNumberInput") documentNumberInput: ElementRef;
  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("lastNameInput") lastNameInput: ElementRef;
  @ViewChild("usernameInput") usernameInput: ElementRef;
  @ViewChild("passwordInput") passwordInput: ElementRef;
  @ViewChild("confirmPasswordInput") confirmPasswordInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("passwordError") passwordError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  docTypesSubscription: Subscription;

  documentTypes: DocumentType[] = [];

  hasServerError: boolean = false;

  registerForm: FormGroup;

  request: RegisterRequest = new RegisterRequest();

  constructor(
    private authenticationService: AuthenticationService, 
    private sessionService: SessionService,
    private documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.openDocTypesSubscription();
    this.initializeForm();
  }

  ngOnDestroy(): void {
      this.docTypesSubscription.unsubscribe();
  }

  openDocTypesSubscription() {
    this.docTypesSubscription = this.documentTypeService.docTypes$.subscribe({
      next: (docTypes) => this.documentTypes = docTypes,
      error: (error) => this.hasServerError = true
    })
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  validateForm() {
    this.cleanErrors();
    if(this.registerForm.invalid) {
      this.maskErrors();
      return;
    }

    if(this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.passwordError.nativeElement.removeAttribute('hidden');
      return;
    }

    this.request = {
      documentType: this.documentTypes.find(docType => docType.prefix == this.registerForm.value.documentType)!,
      documentNumber: this.registerForm.value.documentNumber,
      name: this.registerForm.value.name,
      lastName: this.registerForm.value.lastName,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };
    this.register();
  }

  maskErrors() {
    let controlErrors;
    Object.keys(this.registerForm.controls).forEach(key => {
      controlErrors = this.registerForm.get(key)?.errors;
      if(controlErrors) this.addError(key);
    })
  }

  addError(key: string) {
    if(key == 'documentType') this.documentTypeInput.nativeElement.classList.add("error-field");
    if(key == 'documentNumber') this.documentNumberInput.nativeElement.classList.add("error-field");
    if(key == 'name') this.nameInput.nativeElement.classList.add("error-field");
    if(key == 'lastName') this.lastNameInput.nativeElement.classList.add("error-field");
    if(key == 'username') this.usernameInput.nativeElement.classList.add("error-field");
    if(key == 'password') this.passwordInput.nativeElement.classList.add("error-field");
    if(key == 'confirmPassword') this.confirmPasswordInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.documentTypeInput.nativeElement.classList.remove("error-field");
    this.documentNumberInput.nativeElement.classList.remove("error-field");
    this.nameInput.nativeElement.classList.remove("error-field");
    this.lastNameInput.nativeElement.classList.remove("error-field");
    this.usernameInput.nativeElement.classList.remove("error-field");
    this.passwordInput.nativeElement.classList.remove("error-field");
    this.confirmPasswordInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.passwordError.nativeElement.setAttribute('hidden', '');
    this.duplicatedError.nativeElement.setAttribute('hidden', '');
  }

  register() {
    this.authenticationService.register(this.request).subscribe({
      next: (response) => {
        this.sessionService.saveSession(this.request, response.data.token);
      },
      error: (error) => {
        if(error.error.error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
