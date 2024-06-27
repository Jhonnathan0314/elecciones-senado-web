import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ElectionTableAllComponent implements OnInit, OnDestroy {

  electionTables: ElectionTable[] = [];

  departments: Department[] = [];
  cities: City[] = [];

  electionTableSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private electionTableService: ElectionTableService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.openElectionTableSubscription();
  }

  ngOnDestroy(): void {
      this.electionTableSubscription.unsubscribe();
  }

  openElectionTableSubscription() {
    this.electionTableSubscription = this.electionTableService.electionTables$.subscribe({
      next: (electionTables) => {
        this.electionTables = electionTables;
        if(electionTables.length > 0 && this.cities.length === 0) this.findAllCities();
      },
      error: (error) => this.hasServerError = true
    })
  }

  async findAllDepartments() {
    this.departmentService.findAll().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.addCitiesDepartments();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  async findAllCities() {
    this.cityService.findAll().subscribe({
      next: (res) => {
        this.cities = res.data;
        this.findAllDepartments();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  async addCitiesDepartments() {
    let department = new Department();
    let city = new City();
    this.electionTables.forEach(electionTable => {
      city = this.cities.find(city => city.id === electionTable.cityId) || new City();
      department = this.departments.find(department => department.id === city.departmentId) || new Department();
      electionTable.city = city;
      electionTable.city.department = department;
    })
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
