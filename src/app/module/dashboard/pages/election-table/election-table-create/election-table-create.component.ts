import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElectionTable } from 'src/app/core/models/results.model';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-create',
  templateUrl: './election-table-create.component.html',
  styleUrls: ['./election-table-create.component.scss']
})
export class ElectionTableCreateComponent implements OnInit {

  @ViewChild("numberIdsInput") numberIdsInput: ElementRef;
  @ViewChild("totalVotesInput") totalVotesInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  createForm: FormGroup;
  electionTable: ElectionTable = new ElectionTable();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private electionTableService: ElectionTableService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      numberIds: ['', [Validators.required]],
      totalVotes: ['', [Validators.required]]
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.createForm.invalid) {
      this.maskErrors();
      return;
    }

    this.electionTable = {
      id: 0,
      numberIds: this.createForm.value.numberIds,
      totalVotes: this.createForm.value.totalVotes
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
    if(key == 'numberIds') this.numberIdsInput.nativeElement.classList.add("error-field");
    if(key == 'totalVotes') this.totalVotesInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.numberIdsInput.nativeElement.classList.remove("error-field");
    this.totalVotesInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.duplicatedError.nativeElement.setAttribute('hidden', '');
  }

  create() {
    this.electionTableService.create(this.electionTable).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/election-table');
      },
      error: (error) => {
        if(error.error.error.code == 409) this.duplicatedError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
