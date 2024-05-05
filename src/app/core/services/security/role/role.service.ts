import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { Role } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apigatewayUrl}/role`);
  }

  findById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apigatewayUrl}/role/${id}`);
  }

  create(role: Role): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.apigatewayUrl}/role`, role);
  }

  update(role: Role): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apigatewayUrl}/role`, role);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/role/delete/${id}`);
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/role/change-state/${id}`);
  }

}
