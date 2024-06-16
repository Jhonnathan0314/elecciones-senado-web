import { Component, OnInit } from '@angular/core';
import { Report } from 'src/app/core/models/results.model';
import { ReportService } from 'src/app/core/services/results/report/report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  reports: Report[] = [];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.findReports();
  }

  findReports() {
    this.reportService.findReport().subscribe({
      next: (data) => {
        this.reports = data.data;
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    })
  }

}
