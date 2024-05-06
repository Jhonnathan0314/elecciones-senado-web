import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { Party } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<Party[]>> {
    return this.http.get<ApiResponse<Party[]>>(`${this.apigatewayUrl}/party`);
  }

  findById(id: number): Observable<ApiResponse<Party>> {
    return this.http.get<ApiResponse<Party>>(`${this.apigatewayUrl}/party/${id}`);
  }

  create(party: Party): Observable<ApiResponse<Party>> {
    return this.http.post<ApiResponse<Party>>(`${this.apigatewayUrl}/party`, party);
  }

  update(party: Party): Observable<ApiResponse<Party>> {
    return this.http.put<ApiResponse<Party>>(`${this.apigatewayUrl}/party`, party);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/party/delete/${id}`);
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/party/change-state/${id}`);
  }

}
