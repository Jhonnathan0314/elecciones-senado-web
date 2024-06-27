import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Party } from 'src/app/core/models/results.model';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-party-update',
  templateUrl: './party-update.component.html',
  styleUrls: ['./party-update.component.scss']
})
export class PartyUpdateComponent implements OnInit, OnDestroy {

  @ViewChild("nameInput") nameInput: ElementRef;
  @ViewChild("mottoInput") mottoInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  party: Party = new Party();

  documentTypes: DocumentType[] = [];

  partySuscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.openPartySubscription();
  }

  ngOnDestroy(): void {
    this.partySuscription.unsubscribe();
  }

  openPartySubscription() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.partySuscription = this.partyService.parties$.subscribe({
      next: (parties) => {
        if(parties.length > 0) {
          this.party = parties.find(party => party.id == this.id)!;
          this.fillForm();
        }
      },
      error: (error) => this.hasServerError = true
    })
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      motto: ['', [Validators.required, Validators.minLength(2)]],
      logo: ['']
    });
  }

  fillForm() {
    this.updateForm.patchValue({
      name: this.party.name,
      motto: this.party.motto,
      logo: this.party.logo
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.party.name = this.updateForm.value.name;
    this.party.motto = this.updateForm.value.motto;
    this.party.logo = this.updateForm.value.logo

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
    if(key == 'motto') this.mottoInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.nameInput.nativeElement.classList.remove("error-field");
    this.mottoInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.noChangesError.nativeElement.setAttribute('hidden', '');
  }

  update() {
    this.partyService.update(this.party).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/party');
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
