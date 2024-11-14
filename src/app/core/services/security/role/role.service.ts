import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, find, map, tap, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { Role } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.SECURITY_PATH}`;

  private roleSubject = new BehaviorSubject<Role[]>([]);
  roles$: Observable<Role[]> = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private spinnerService: SpinnerService) {
    this.findAll();
  }

  private handleError(error: any): Observable<never> {
    console.error("An error occurred:", error);
    return throwError(() => new ErrorMessage(this.mapError(error)));
  }

  private mapError(error: any): ErrorMessage {
    if(error.error.error.code) return error.error.error;
    
    return {
      code: error.status,
      title: error.statusText,
      detail: error.message
    }
  }

  private findAll() {
    this.spinnerService.changeState(true);
    this.http.get<ApiResponse<Role[]>>(`${this.apigatewayUrl}/role`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (roles) => {
          this.roleSubject.next(roles);
          this.spinnerService.changeState(false);
        },
        error: (error) => {
          this.roleSubject.error(this.mapError(error));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<Role> {
    return this.http.get<ApiResponse<Role>>(`${this.apigatewayUrl}/role/${id}`)
      .pipe(
        map(response => response.data),
        catchError(err => this.handleError(err))
      );
  }

  create(role: Role): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(`${this.apigatewayUrl}/role`, role)
      .pipe(
        map(response => response.data),
        tap(newRole => this.roleSubject.next([...this.roleSubject.value, newRole])),
        catchError(err => this.handleError(err))
      );
  }

  update(role: Role): Observable<Role> {
    return this.http.put<ApiResponse<Role>>(`${this.apigatewayUrl}/role`, role)
      .pipe(
        map(response => response.data),
        tap(updatedRole => {
          const roles = this.roleSubject.value.map(role => role.id === updatedRole.id ? updatedRole : role);
          this.roleSubject.next(roles);
        }),
        catchError(err => this.handleError(err))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/role/delete/${id}`)
      .pipe(
        tap(() => {
          const roles = this.roleSubject.value.filter(role => role.id !== id);
          this.roleSubject.next(roles);
        }),
        catchError(err => this.handleError(err))
      );
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/role/change-state/${id}`)
      .pipe(catchError(err => this.handleError(err)));
  }

}
