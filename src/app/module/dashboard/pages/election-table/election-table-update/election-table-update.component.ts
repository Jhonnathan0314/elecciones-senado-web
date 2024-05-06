import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectionTable } from 'src/app/core/models/results.model';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-update',
  templateUrl: './election-table-update.component.html',
  styleUrls: ['./election-table-update.component.scss']
})
export class ElectionTableUpdateComponent implements OnInit {

  @ViewChild("numberIdsInput") numberIdsInput: ElementRef;
  @ViewChild("totalVotesInput") totalVotesInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  electionTable: ElectionTable = new ElectionTable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private electionTableService: ElectionTableService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.findElectionTableById();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      numberIds: ['', [Validators.required]],
      totalVotes: ['', [Validators.required]]
    });
  }

  findElectionTableById() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.electionTableService.findById(this.id).subscribe({
      next: (response) => {
        this.electionTable = response.data;
        this.fillForm();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  fillForm() {
    this.updateForm.patchValue({
      numberIds: this.electionTable.numberIds,
      totalVotes: this.electionTable.totalVotes
    });
  }

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.electionTable.numberIds = this.updateForm.value.numberIds;
    this.electionTable.totalVotes = this.updateForm.value.totalVotes;

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
    if(key == 'numberIds') this.numberIdsInput.nativeElement.classList.add("error-field");
    if(key == 'totalVotes') this.totalVotesInput.nativeElement.classList.add("error-field");
  }

  cleanErrors() {
    this.numberIdsInput.nativeElement.classList.remove("error-field");
    this.totalVotesInput.nativeElement.classList.remove("error-field");
    
    this.serverError.nativeElement.setAttribute('hidden', '');
    this.noChangesError.nativeElement.setAttribute('hidden', '');
  }

  update() {
    this.electionTableService.update(this.electionTable).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/election-table');
      },
      error: (error) => {
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        console.log("error: ", error.statusText);
      }
    })
  }

}
