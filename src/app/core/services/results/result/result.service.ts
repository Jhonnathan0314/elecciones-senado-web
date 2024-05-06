import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { Result } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<Result[]>> {
    return this.http.get<ApiResponse<Result[]>>(`${this.apigatewayUrl}/result`);
  }

  findById(id: number): Observable<ApiResponse<Result>> {
    return this.http.get<ApiResponse<Result>>(`${this.apigatewayUrl}/result/${id}`);
  }

  create(result: Result): Observable<ApiResponse<Result>> {
    return this.http.post<ApiResponse<Result>>(`${this.apigatewayUrl}/result`, result);
  }

  update(result: Result): Observable<ApiResponse<Result>> {
    return this.http.put<ApiResponse<Result>>(`${this.apigatewayUrl}/result`, result);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/result/delete/${id}`);
  }

}
