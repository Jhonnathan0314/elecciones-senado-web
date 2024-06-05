import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Party } from 'src/app/core/models/results.model';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-party-create',
  templateUrl: './party-create.component.html',
  styleUrls: ['./party-create.component.scss']
})
export class PartyCreateComponent implements OnInit {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("mottoInput") mottoInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  createForm: FormGroup;
  party: Party = new Party();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      motto: ['', [Validators.required, Validators.minLength(2)]],
      logo: ['']
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.createForm.invalid) {
      this.maskErrors();
      return;
    }

    this.party = {
      id: 0,
      name: this.createForm.value.name,
      motto: this.createForm.value.motto,
      logo: this.createForm.value.logo
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
    if(key == 'name') this.nameInput.nativeElement.classList.add("error-field");
    if(key == 'motto') this.mottoInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.nameInput.nativeElement.classList.remove("error-field");
    this.mottoInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.duplicatedError.nativeElement.setAttribute('hidden', '');
  }

  create() {
    this.partyService.create(this.party).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/party');
      },
      error: (error) => {
        if(error.error.error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
