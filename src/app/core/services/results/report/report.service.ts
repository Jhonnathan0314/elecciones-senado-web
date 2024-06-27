import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { ReportCandidate, ReportElectionTable } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;

  private candidatesReportSubject = new BehaviorSubject<ReportCandidate[]>([]);
  private electionTableReportSubject = new BehaviorSubject<ReportElectionTable[]>([]);
  candidatesReport$: Observable<ReportCandidate[]> = this.candidatesReportSubject.asObservable();
  electionTableReport$: Observable<ReportElectionTable[]> = this.electionTableReportSubject.asObservable();

  constructor(private http: HttpClient) {
    this.findAll();
  }

  private mapError(error: any): ErrorMessage {
    if(error.error.error.code) return error.error.error;
    
    return {
      code: error.status,
      title: error.statusText,
      detail: error.message
    }
  }

  findAll() {
    this.findCandidateReport();
    this.findElectionTableReport();
  }

  private findCandidateReport() {
    this.http.get<ApiResponse<ReportCandidate[]>>(`${this.apigatewayUrl}/report/candidate`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (report) => this.candidatesReportSubject.next(report),
        error: (err) => this.candidatesReportSubject.error(this.mapError(err))
      });
  }

  private findElectionTableReport() {
    this.http.get<ApiResponse<ReportElectionTable[]>>(`${this.apigatewayUrl}/report/election-table`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (report) => this.electionTableReportSubject.next(report),
        error: (err) => this.electionTableReportSubject.error(this.mapError(err))
      });
  }

}
