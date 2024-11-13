import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Candidate, ElectionTable, Result } from 'src/app/core/models/results.model';
import { CandidateService } from 'src/app/core/services/results/candidate/candidate.service';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';
import { ResultService } from 'src/app/core/services/results/result/result.service';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-result-create',
  templateUrl: './result-create.component.html',
  styleUrls: ['./result-create.component.scss']
})
export class ResultCreateComponent implements OnInit, OnDestroy {

  @ViewChild("votesInput") votesInput: ElementRef;
  @ViewChild("electionTableInput") electionTableInput: ElementRef;
  @ViewChild("candidateInput") candidateInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;

  createForm: FormGroup;
  result: Result = new Result();

  electionTables: ElectionTable[] = [];
  candidates: Candidate[] = [];

  electionTableSubscription: Subscription;
  candidateSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private resultService: ResultService,
    private electionTableService: ElectionTableService,
    private candidateService: CandidateService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.openElectionTableSubscription();
    this.openCandidateSubscription();
    this.initializeForm();
  }

  ngOnDestroy(): void {
      this.electionTableSubscription.unsubscribe();
      this.candidateSubscription.unsubscribe();
  }

  openElectionTableSubscription() {
    this.electionTableSubscription = this.electionTableService.electionTables$.subscribe({
      next: (electionTables) => this.electionTables = electionTables,
      error: (error) => this.hasServerError = true
    })
  }

  openCandidateSubscription() {
    this.candidateSubscription = this.candidateService.candidates$.subscribe({
      next: (candidates) => this.candidates = candidates,
      error: (error) => this.hasServerError = true
    })
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      votes: ['', [Validators.required]],
      electionTable: ['', [Validators.required]],
      candidate: ['', [Validators.required]]
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.createForm.invalid) {
      this.maskErrors();
      return;
    }

    this.result = {
      id: 0,
      votes: this.createForm.value.votes,
      electionTable: this.electionTables.find(electionTable => electionTable.id == this.createForm.value.electionTable)!,
      candidate: this.candidates.find(candidate => candidate.id == this.createForm.value.candidate)!
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
    if(key == 'votes') this.votesInput.nativeElement.classList.add("error-field");
    if(key == 'electionTable') this.electionTableInput.nativeElement.classList.add("error-field");
    if(key == 'candidate') this.candidateInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.votesInput.nativeElement.classList.remove("error-field");
    this.electionTableInput.nativeElement.classList.remove("error-field");
    this.candidateInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
  }

  create() {
    this.spinnerService.changeState(true);
    this.resultService.create(this.result).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/result');
        this.spinnerService.changeState(false);
      },
      error: (error) => {
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        this.spinnerService.changeState(false);
        console.log("error: ", error.statusText);
      }
    })
  }

}
