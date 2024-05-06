import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { Candidate } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<Candidate[]>> {
    return this.http.get<ApiResponse<Candidate[]>>(`${this.apigatewayUrl}/candidate`);
  }

  findById(id: number): Observable<ApiResponse<Candidate>> {
    return this.http.get<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate/${id}`);
  }

  create(candidate: Candidate): Observable<ApiResponse<Candidate>> {
    return this.http.post<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate`, candidate);
  }

  update(candidate: Candidate): Observable<ApiResponse<Candidate>> {
    return this.http.put<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate`, candidate);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/candidate/delete/${id}`);
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/candidate/change-state/${id}`);
  }

}
