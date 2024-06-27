import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { City, Department, ReportCandidate, ReportElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ReportService } from 'src/app/core/services/results/report/report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit, OnDestroy {

  candidateReport: ReportCandidate[] = [];
  electionTableReport: ReportElectionTable[] = [];

  departments: Department[] = [];
  cities: City[] = [];

  reportSelected: number = 1;

  candidateReportSubscription: Subscription;
  electionTableReportSubscription: Subscription;
  departmentSubscription: Subscription;
  citySubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private reportService: ReportService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.openCandidateReportSubscription();
    this.openElectionTableReportSubscription();
    this.openCitySubscription();
    this.openDepartmentSubscription();
  }

  ngOnDestroy(): void {
      this.candidateReportSubscription.unsubscribe();
      this.electionTableReportSubscription.unsubscribe();
      this.citySubscription.unsubscribe();
      this.departmentSubscription.unsubscribe();
  }

  openCandidateReportSubscription() {
    this.candidateReportSubscription = this.reportService.candidatesReport$.subscribe({
      next: (report) => this.candidateReport = report,
      error: (error) => this.hasServerError = true
    })
  }

  openElectionTableReportSubscription() {
    this.electionTableReportSubscription = this.reportService.electionTableReport$.subscribe({
      next: (report) => {
        this.electionTableReport = report;
        this.fillCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  openCitySubscription() {
    this.citySubscription = this.cityService.cities$.subscribe({
      next: (cities) => {
        this.cities = cities
        this.fillCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  openDepartmentSubscription() {
    this.departmentSubscription = this.departmentService.departments$.subscribe({
      next: (departments) => {
        this.departments = departments;
        this.fillCitiesDepartments();
      },
      error: (error) => this.hasServerError = true
    })
  }

  fillCitiesDepartments() {
    if(this.electionTableReport.length > 0 && this.cities.length > 0 && this.departments.length > 0){
      this.electionTableReport.forEach(report => {
        report.city = this.cities.find(city => city.id == report.cityId);
        report.department = this.departments.find(department => department.id == report.city?.departmentId);
      });
    }
  }

}
