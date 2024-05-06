import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Candidate, Party } from 'src/app/core/models/results.model';
import { CandidateService } from 'src/app/core/services/results/candidate/candidate.service';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.scss']
})
export class CandidateCreateComponent implements OnInit {

  @ViewChild("cardNumberInput") cardNumberInput: ElementRef;
  @ViewChild("resolutionNumberInput") resolutionNumberInput: ElementRef;
  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("lastNameInput") lastNameInput: ElementRef;
  @ViewChild("partyInput") partyInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  createForm: FormGroup;
  candidate: Candidate = new Candidate();
  parties: Party[] =[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    this.findAllParties();
    this.initializeForm();
  }

  findAllParties() {
    this.partyService.findAll().subscribe({
      next: (response) => {
        this.parties = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.minLength(2)]],
      resolutionNumber: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      party: ['', [Validators.required]]
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.createForm.invalid) {
      this.maskErrors();
      return;
    }

    this.candidate = {
      cardNumber: this.createForm.value.cardNumber,
      resolutionNumber: this.createForm.value.resolutionNumber,
      name: this.createForm.value.name,
      lastName: this.createForm.value.lastName,
      party: this.parties.find(party => party.id == this.createForm.value.party)!
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
    if(key == 'cardNumber') this.cardNumberInput.nativeElement.classList.add("error-field");
    if(key == 'resolutionNumber') this.resolutionNumberInput.nativeElement.classList.add("error-field");
    if(key == 'name') this.nameInput.nativeElement.classList.add("error-field");
    if(key == 'lastName') this.lastNameInput.nativeElement.classList.add("error-field");
    if(key == 'party') this.partyInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.cardNumberInput.nativeElement.classList.remove("error-field");
    this.resolutionNumberInput.nativeElement.classList.remove("error-field");
    this.nameInput.nativeElement.classList.remove("error-field");
    this.lastNameInput.nativeElement.classList.remove("error-field");
    this.partyInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.duplicatedError.nativeElement.setAttribute('hidden', '');
  }

  create() {
    this.candidateService.create(this.candidate).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/candidate');
      },
      error: (error) => {
        if(error.error.error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
