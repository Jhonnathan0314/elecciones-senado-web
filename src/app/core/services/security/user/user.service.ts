import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from 'src/app/core/models/authentication.model';
import { ApiResponse } from 'src/app/core/models/response.model';
import { User } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.SECURITY_PATH;
  }

  findAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apigatewayUrl}/user`);
  }

  findById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apigatewayUrl}/user/${id}`);
  }

  create(user: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apigatewayUrl}/user`, user);
  }

  update(user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apigatewayUrl}/user`, user);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/user/delete/${id}`);
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/user/change-state/${id}`);
  }

}
