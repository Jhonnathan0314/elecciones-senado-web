import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/security.model';
import { UserService } from 'src/app/core/services/security/user/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, OnDestroy {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("lastNameInput") lastNameInput: ElementRef;
  @ViewChild("usernameInput") usernameInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  user: User = new User();

  documentTypes: DocumentType[] = [];

  userSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.openUserSubscription();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  openUserSubscription() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.userSubscription = this.userService.users$.subscribe({
      next: (users) => {
        if(users.length > 0){
          this.user = users.find(user => user.id == this.id)!;
          this.fillForm();
        }
      },
      error: (error) => this.hasServerError = true
    })
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
    this.duplicatedError.nativeElement.setAttribute('hidden', '');
  }

  update() {
    this.userService.update(this.user).subscribe({
      next: () => this.router.navigateByUrl('/dashboard/user'),
      error: (error) => {
        if(error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
      }
    });
  }

}
