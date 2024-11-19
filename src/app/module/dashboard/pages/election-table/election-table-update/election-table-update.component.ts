import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { City, Department, ElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-election-table-update',
  templateUrl: './election-table-update.component.html',
  styleUrls: ['./election-table-update.component.scss']
})
export class ElectionTableUpdateComponent implements OnInit, OnDestroy {

  @ViewChild("numberIdsInput") numberIdsInput: ElementRef;
  @ViewChild("totalVotesInput") totalVotesInput: ElementRef;
  @ViewChild("departmentIdInput") departmentIdInput: ElementRef;
  @ViewChild("cityIdInput") cityIdInput: ElementRef;
  @ViewChild("serverError") serverError: ElementRef;
  @ViewChild("requestError") requestError: ElementRef;
  @ViewChild("noChangesError") noChangesError: ElementRef;

  id: number = 0;

  updateForm: FormGroup;
  electionTable: ElectionTable = new ElectionTable();

  departments: Department[] = [];
  cities: City[] = [];
  filteredCities: City[] = [];

  departmentSelected: boolean = true;

  departmentSubscription: Subscription;
  citySubscription: Subscription;
  electionTableSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private electionTableService: ElectionTableService,
    private departmentService: DepartmentService,
    private cityService: CityService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.openElectionTableSubscription();
    this.openDepartmentSubscription();
    this.openCitySubscription();
  }

  ngOnDestroy(): void {
    this.electionTableSubscription.unsubscribe();
    this.departmentSubscription.unsubscribe();
    this.citySubscription.unsubscribe();
  }

  openDepartmentSubscription() {
    this.departmentSubscription = this.departmentService.departments$.subscribe({
      next: (departments) => {
        this.departments = departments;
        this.fillForm();
      },
      error: (response) => {
        if(response.error.error.code === 404) this.departments = [];
        this.hasServerError = true;
      }
    })
  }

  openCitySubscription() {
    this.citySubscription = this.cityService.cities$.subscribe({
      next: (cities) => {
        this.cities = cities;
        if(cities.length > 0) {
          this.electionTable.city = cities.find(city => city.id == this.electionTable.cityId);
          this.filteredCities = cities.filter(city => city.departmentId == this.electionTable.city?.departmentId);
          this.departmentSelected = true;
          this.fillForm();
        }
      }
    })
  }

  openElectionTableSubscription() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.electionTableSubscription = this.electionTableService.electionTables$.subscribe({
      next: (electionTables) => {
        if(electionTables.length > 0){
          this.electionTable = electionTables.find(electionTable => electionTable.id == this.id)!;
          this.fillForm();
        }
      },
      error: (error) => this.hasServerError = true
    })
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      numberIds: ['', [Validators.required]],
      totalVotes: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      cityId: ['', [Validators.required]]
    });
  }

  fillForm() {
    this.updateForm.patchValue({
      numberIds: this.electionTable.numberIds,
      totalVotes: this.electionTable.totalVotes,
      departmentId: this.electionTable.city?.departmentId,
      cityId: this.electionTable.cityId
    });
  }

  findCitiesByDepartment() {
    this.filteredCities = this.cities.filter(city => city.departmentId == this.updateForm.value.departmentId);
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
    this.spinnerService.changeState(true);
    this.electionTableService.update(this.electionTable).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/election-table');
        this.spinnerService.changeState(false);
      },
      error: (error) => {
        if(error.error.error.code == 400) this.requestError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 406) this.noChangesError.nativeElement.removeAttribute('hidden');
        if(error.error.error.code == 500) this.serverError.nativeElement.removeAttribute('hidden');
        this.hasServerError = true;
        this.spinnerService.changeState(false);
        console.log("error: ", error.statusText);
      }
    })
  }

}
