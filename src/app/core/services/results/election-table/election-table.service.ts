import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { ElectionTable } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectionTableService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<ElectionTable[]>> {
    return this.http.get<ApiResponse<ElectionTable[]>>(`${this.apigatewayUrl}/election-table`);
  }

  findById(id: number): Observable<ApiResponse<ElectionTable>> {
    return this.http.get<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table/${id}`);
  }

  create(electionTable: ElectionTable): Observable<ApiResponse<ElectionTable>> {
    return this.http.post<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table`, electionTable);
  }

  update(electionTable: ElectionTable): Observable<ApiResponse<ElectionTable>> {
    return this.http.put<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table`, electionTable);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/election-table/delete/${id}`);
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/election-table/change-state/${id}`);
  }

}
