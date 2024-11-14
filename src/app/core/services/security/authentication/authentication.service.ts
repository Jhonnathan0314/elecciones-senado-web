import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from 'src/app/core/models/authentication.model';
import { ApiResponse } from 'src/app/core/models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.SECURITY_PATH}`;
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apigatewayUrl}/auth/login`, request);
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apigatewayUrl}/auth/register`, request);
  }

}
