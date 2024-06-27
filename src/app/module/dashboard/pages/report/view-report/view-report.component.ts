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

  hasServerError: boolean = false;

  constructor(
    private reportService: ReportService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.openCandidateReportSubscription();
    this.openElectionTableReportSubscription();
  }

  ngOnDestroy(): void {
      this.candidateReportSubscription.unsubscribe();
      this.electionTableReportSubscription.unsubscribe();
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
        if(this.electionTableReport.length > 0 && this.cities.length === 0) this.findAllCities();
      },
      error: (error) => this.hasServerError = true
    })
  }

  findAllCities() {
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

  findAllDepartments() {
    this.departmentService.findAll().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.fillCities();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  fillCities() {
    this.electionTableReport.forEach(report => {
      report.city = this.cities.find(city => city.id == report.cityId);
    });
    this.fillDepartments();
  }

  fillDepartments() {
    this.electionTableReport.forEach(report => {
      report.department = this.departments.find(department => department.id == report.city?.departmentId);
    });
  }

}
