import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { City, Department, ElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-all',
  templateUrl: './election-table-all.component.html',
  styleUrls: ['./election-table-all.component.scss']
})
export class ElectionTableAllComponent implements OnInit, OnChanges, OnDestroy {

  electionTables: ElectionTable[] = [];

  departments: Department[] = [];
  cities: City[] = [];

  electionTableSubscription: Subscription;
  departmentSubscription: Subscription;
  citySubscription: Subscription;

  hasServerError: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private electionTableService: ElectionTableService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.openElectionTableSubscription();
    this.openDepartmentSubscription();
    this.openCitySubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
      console.log("recibi cambios");
  }

  ngOnDestroy(): void {
    this.electionTableSubscription.unsubscribe();
    this.departmentSubscription.unsubscribe();
    this.citySubscription.unsubscribe();
  }

  openElectionTableSubscription() {
    this.electionTableSubscription = this.electionTableService.electionTables$.subscribe({
      next: (electionTables) => {
        this.electionTables = electionTables;
        this.addCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  openDepartmentSubscription() {
    this.departmentSubscription = this.departmentService.departments$.subscribe({
      next: (departments) => {
        this.departments = departments;
        this.addCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  openCitySubscription() {
    this.citySubscription = this.cityService.cities$.subscribe({
      next: (cities) => {
        this.cities = cities;
        this.addCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  addCitiesDepartments() {
    if(this.electionTables.length > 0 && this.cities.length > 0 && this.departments.length > 0){
      let department = new Department();
      let city = new City();
      this.electionTables.forEach(electionTable => {
        city = this.cities.find(city => city.id === electionTable.cityId) || new City();
        department = this.departments.find(department => department.id === city.departmentId) || new Department();
        electionTable.city = city;
        electionTable.city.department = department;
      })
    }
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/election-table/update/${id}`);
  }

  delete(id: number) {
    this.electionTableService.deleteById(id).subscribe({
      error: (error) => this.hasServerError = true
    })
  }

}
