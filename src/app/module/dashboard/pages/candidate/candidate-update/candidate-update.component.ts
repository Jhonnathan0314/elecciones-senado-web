import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate, Party } from 'src/app/core/models/results.model';
import { CandidateService } from 'src/app/core/services/results/candidate/candidate.service';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-candidate-update',
  templateUrl: './candidate-update.component.html',
  styleUrls: ['./candidate-update.component.scss']
})
export class CandidateUpdateComponent implements OnInit {

  @ViewChild("cardNumberInput") cardNumberInput: ElementRef;
  @ViewChild("resolutionNumberInput") resolutionNumberInput: ElementRef;
  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("lastNameInput") lastNameInput: ElementRef;
  @ViewChild("partyInput") partyInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  candidate: Candidate = new Candidate();
  parties: Party[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    this.findAllParties();
    this.initializeForm();
    this.findCandidateById();
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
    this.updateForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.minLength(2)]],
      resolutionNumber: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      party: ['', [Validators.required]]
    });
  }

  findCandidateById() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.candidateService.findById(this.id).subscribe({
      next: (response) => {
        this.candidate = response.data;
        this.fillForm();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  fillForm() {
    this.updateForm.patchValue({
      cardNumber: this.candidate.cardNumber,
      resolutionNumber: this.candidate.resolutionNumber,
      name: this.candidate.name,
      lastName: this.candidate.lastName,
      party: this.candidate.party.id
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.candidate.cardNumber = this.updateForm.value.cardNumber;
    this.candidate.resolutionNumber = this.updateForm.value.resolutionNumber;
    this.candidate.name = this.updateForm.value.name;
    this.candidate.lastName = this.updateForm.value.lastName;
    this.candidate.party = this.parties.find(party => party.id == this.updateForm.value.party)!;

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
    this.noChangesError.nativeElement.setAttribute('hidden', '');
  }

  update() {
    this.candidateService.update(this.candidate).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/candidate');
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
