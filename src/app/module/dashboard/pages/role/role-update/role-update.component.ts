import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/core/models/security.model';
import { RoleService } from 'src/app/core/services/security/role/role.service';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.scss']
})
export class RoleUpdateComponent implements OnInit {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  role: Role = new Role();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.findPersonById();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  findPersonById() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.roleService.findById(this.id).subscribe({
      next: (response) => {
        this.role = response.data;
        this.fillForm();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
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
    this.roleService.update(this.role).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/role');
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
