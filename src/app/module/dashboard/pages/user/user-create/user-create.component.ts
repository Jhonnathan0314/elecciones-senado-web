import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { RegisterRequest } from 'src/app/core/models/authentication.model';
import { DocumentType, Role, User } from 'src/app/core/models/security.model';
import { DocumentTypeService } from 'src/app/core/services/security/document-type/document-type.service';
import { UserService } from 'src/app/core/services/security/user/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

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

  createForm: FormGroup;
  user: RegisterRequest = new RegisterRequest();

  documentTypes: DocumentType[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private documentTypeService: DocumentTypeService
  ) {}

  ngOnInit(): void {
    this.findAllDocTypes();
    this.initializeForm();
  }

  findAllDocTypes() {
    this.documentTypeService.findAll().subscribe({
      next: (response) => {
        this.documentTypes = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.createForm.invalid) {
      this.maskErrors();
      return;
    }

    if(this.createForm.value.password != this.createForm.value.confirmPassword) {
      this.passwordError.nativeElement.removeAttribute('hidden');
      return;
    }

    this.user = {
      documentType: this.documentTypes.find(docType => docType.prefix == this.createForm.value.documentType)!,
      documentNumber: this.createForm.value.documentNumber,
      name: this.createForm.value.name,
      lastName: this.createForm.value.lastName,
      username: this.createForm.value.username,
      password: this.createForm.value.password
    };
    this.create();
  }

  maskErrors() {
    let controlErrors;
    Object.keys(this.createForm.controls).forEach(key => {
      controlErrors = this.createForm.get(key)?.errors;
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

  create() {
    this.userService.create(this.user).subscribe({
      next: () => this.router.navigateByUrl('/dashboard/user'),
      error: (error) => {
        if(error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
      }
    });
  }

}
