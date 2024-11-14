import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { RegisterRequest } from 'src/app/core/models/authentication.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { User } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.SECURITY_PATH}`;

  private userSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.userSubject.asObservable();

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
    this.http.get<ApiResponse<User[]>>(`${this.apigatewayUrl}/user`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (users) => {
          this.userSubject.next(users);
          this.spinnerService.changeState(false);
        },
        error: (error) => {
          this.userSubject.error(this.mapError(error));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apigatewayUrl}/user/${id}`)
      .pipe(
        map(response => response.data),
        catchError(err => this.handleError(err))
      );
  }

  create(user: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apigatewayUrl}/user`, user)
      .pipe(
        map(response => response.data),
        tap(newUser => this.userSubject.next([...this.userSubject.value, newUser])),
        catchError(err => this.handleError(err))
      );
  }

  update(user: User): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apigatewayUrl}/user`, user)
      .pipe(
        map(response => response.data),
        tap(updatedUser => {
          const users = this.userSubject.value.map(user => user.id === updatedUser.id ? updatedUser : user);
          this.userSubject.next(users);
        }),
        catchError(err => this.handleError(err))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/user/delete/${id}`)
      .pipe(
        tap(() => {
          const users = this.userSubject.value.filter(user => user.id !== id);
          this.userSubject.next(users);
        }),
        catchError(err => this.handleError(err))
      );
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/user/change-state/${id}`)
      .pipe(catchError(err => this.handleError(err)));
  }

}
