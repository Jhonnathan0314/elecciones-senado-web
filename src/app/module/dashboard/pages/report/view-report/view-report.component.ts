import { Component, OnInit } from '@angular/core';
import { City, Department, ReportCandidate, ReportElectionTable } from 'src/app/core/models/results.model';
import { CityService } from 'src/app/core/services/results/city/city.service';
import { DepartmentService } from 'src/app/core/services/results/department/department.service';
import { ReportService } from 'src/app/core/services/results/report/report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  candidateReport: ReportCandidate[] = [];
  electionTableReport: ReportElectionTable[] = [];

  departments: Department[] = [];
  cities: City[] = [];

  reportSelected: number = 1;

  constructor(
    private reportService: ReportService,
    private departmentService: DepartmentService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.findCandidateReports();
    this.findElectionTableReports();
  }

  findCandidateReports() {
    this.reportService.findCandidateReport().subscribe({
      next: (data) => {
        this.candidateReport = data.data;
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

  findElectionTableReports() {
    this.reportService.findElectionTableReport().subscribe({
      next: (data) => {
        this.electionTableReport = data.data;
        this.findAllCities();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
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
