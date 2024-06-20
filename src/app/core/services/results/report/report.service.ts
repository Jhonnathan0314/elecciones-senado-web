import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { ReportCandidate, ReportElectionTable } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findCandidateReport(): Observable<ApiResponse<ReportCandidate[]>> {
    return this.http.get<ApiResponse<ReportCandidate[]>>(`${this.apigatewayUrl}/report/candidate`);
  }

  findElectionTableReport(): Observable<ApiResponse<ReportElectionTable[]>> {
    return this.http.get<ApiResponse<ReportElectionTable[]>>(`${this.apigatewayUrl}/report/election-table`);
  }

}
