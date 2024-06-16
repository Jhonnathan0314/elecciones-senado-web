import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { City, Department, ElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-create',
  templateUrl: './election-table-create.component.html',
  styleUrls: ['./election-table-create.component.scss']
})
export class ElectionTableCreateComponent implements OnInit {

  @ViewChild("numberIdsInput") numberIdsInput: ElementRef;
  @ViewChild("totalVotesInput") totalVotesInput: ElementRef;
  @ViewChild("departmentIdInput") departmentIdInput: ElementRef;
  @ViewChild("cityIdInput") cityIdInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("duplicatedError") duplicatedError: ElementRef;

  createForm: FormGroup;
  electionTable: ElectionTable = new ElectionTable();

  departments: Department[] = [];
  cities: City[] = [];

  departmentSelected: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private electionTableService: ElectionTableService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.findAllDepartments();
  }

  findAllDepartments() {
    this.departmentService.findAll().subscribe({
      next: (res) => {
        this.departments = res.data;
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  findCitiesByDepartments() {
    this.cityService.findByDepartment(this.createForm.value.departmentId).subscribe({
      next: (res) => {
        this.cities = res.data;
        this.departmentSelected = true;
      },
      error: (error) => {
        console.log("Error: ", error);
        this.departmentSelected = false;
      }
    })
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      numberIds: ['', [Validators.required]],
      totalVotes: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      cityId: ['', [Validators.required]]
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
      totalVotes: this.createForm.value.totalVotes,
      cityId: this.createForm.value.cityId
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
    if(key == 'departmentId') this.departmentIdInput.nativeElement.classList.add("error-field");
    if(this.departmentSelected){
      if(key == 'cityId') this.cityIdInput.nativeElement.classList.add("error-field");
    }
  }

  cleanErrors() {
    this.numberIdsInput.nativeElement.classList.remove("error-field");
    this.totalVotesInput.nativeElement.classList.remove("error-field");
    this.departmentIdInput.nativeElement.classList.remove("error-field");
    if(this.departmentSelected){
      this.cityIdInput.nativeElement.classList.remove("error-field");
    }
    
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
