import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { Role } from 'src/app/core/models/security.model';
import { RoleService } from 'src/app/core/services/security/role/role.service';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.scss']
})
export class RoleUpdateComponent implements OnInit, OnDestroy {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  role: Role = new Role();

  roleSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.openRoleSubscription();
  }

  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
  }

  openRoleSubscription() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.roleSubscription = this.roleService.roles$.subscribe({
      next: (roles) => {
        if(roles.length > 0) {
          this.role = roles.find(role => role.id == this.id)!;
          this.fillForm();
        }
      },
      error: (error) => this.hasServerError = true
    })
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  fillForm() {
    this.updateForm.patchValue({
      id: this.role.id,
      name: this.role.name
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.role = {
      id: this.updateForm.value.id,
      name: this.updateForm.value.name
    };
    this.create();
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
  }

  cleanErrors() {
    this.nameInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.noChangesError.nativeElement.setAttribute('hidden', '');
  }

  create() {
    this.spinnerService.changeState(true);
    this.roleService.update(this.role).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/role');
        this.spinnerService.changeState(false);
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        this.spinnerService.changeState(false);
        console.log("error: ", error.statusText);
      }
    })
  }

}
