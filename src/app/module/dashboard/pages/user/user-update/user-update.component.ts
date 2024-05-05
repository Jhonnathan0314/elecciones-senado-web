import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/security.model';
import { UserService } from 'src/app/core/services/security/user/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("lastNameInput") lastNameInput: ElementRef;
  @ViewChild("usernameInput") usernameInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  user: User = new User();

  documentTypes: DocumentType[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.findPersonById();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.email]]
    });
  }

  findPersonById() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.userService.findById(this.id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.fillForm();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  fillForm() {
    this.updateForm.patchValue({
      documentType: this.user.documentType.name,
      documentNumber: this.user.documentNumber,
      name: this.user.name,
      lastName: this.user.lastName,
      username: this.user.username
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.user.name = this.updateForm.value.name;
    this.user.lastName = this.updateForm.value.lastName;
    this.user.username = this.updateForm.value.username;

    this.update();
  }

  maskErrors() {
    let controlErrors;
    Object.keys(this.updateForm.controls).forEach(key => {
      controlErrors = this.updateForm.get(key)?.errors;
      if(controlErrors) this.addError(key);
    })
  }

  addError(key: string) {
    if(key == 'name') this.nameInput.nativeElement.classList.add("error-field");
    if(key == 'lastName') this.lastNameInput.nativeElement.classList.add("error-field");
    if(key == 'username') this.usernameInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.nameInput.nativeElement.classList.remove("error-field");
    this.lastNameInput.nativeElement.classList.remove("error-field");
    this.usernameInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.noChangesError.nativeElement.setAttribute('hidden', '');
  }

  update() {
    this.userService.update(this.user).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/user');
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
