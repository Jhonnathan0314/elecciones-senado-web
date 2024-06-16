import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { City, Department, ElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-update',
  templateUrl: './election-table-update.component.html',
  styleUrls: ['./election-table-update.component.scss']
})
export class ElectionTableUpdateComponent implements OnInit {

  @ViewChild("numberIdsInput") numberIdsInput: ElementRef;
  @ViewChild("totalVotesInput") totalVotesInput: ElementRef;
  @ViewChild("departmentIdInput") departmentIdInput: ElementRef;
  @ViewChild("cityIdInput") cityIdInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  electionTable: ElectionTable = new ElectionTable();

  departments: Department[] = [];
  cities: City[] = [];

  departmentSelected: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private electionTableService: ElectionTableService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.findElectionTableById();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      numberIds: ['', [Validators.required]],
      totalVotes: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      cityId: ['', [Validators.required]]
    });
  }

  findElectionTableById() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.electionTableService.findById(this.id).subscribe({
      next: (response) => {
        this.electionTable = response.data;
        this.findAllDepartments();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  findAllDepartments() {
    this.departmentService.findAll().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.findCityById();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  findCityById() {
    this.cityService.findById(this.electionTable.cityId).subscribe({
      next: (res) => {
        this.electionTable.city = res.data;
        this.findCitiesByDepartmentId(this.electionTable.city.departmentId);
        this.fillForm();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  fillForm() {
    this.updateForm.patchValue({
      numberIds: this.electionTable.numberIds,
      totalVotes: this.electionTable.totalVotes,
      departmentId: this.electionTable.city?.departmentId,
      cityId: this.electionTable.cityId
    });
  }

  findCitiesByDepartmentId(id: number) {
    this.cityService.findByDepartment(id).subscribe({
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

  findCitiesByDepartment() {
    this.cityService.findByDepartment(this.updateForm.value.departmentId).subscribe({
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

  validateForm() {
    this.cleanErrors();
    if(this.updateForm.invalid) {
      this.maskErrors();
      return;
    }

    this.electionTable.numberIds = this.updateForm.value.numberIds;
    this.electionTable.totalVotes = this.updateForm.value.totalVotes;
    this.electionTable.cityId = this.updateForm.value.cityId;

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
