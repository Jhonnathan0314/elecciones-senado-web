import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { City } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;

  private citySubject = new BehaviorSubject<City[]>([]);
  cities$: Observable<City[]> = this.citySubject.asObservable();

  constructor(private http: HttpClient) {
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

  findAll() {
    this.http.get<ApiResponse<City[]>>(`${this.apigatewayUrl}/city`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (cities) => this.citySubject.next(cities),
        error: (err) => this.citySubject.error(this.mapError(err))
      });
  }

  findById(id: number): Observable<City> {
    return this.http.get<ApiResponse<City>>(`${this.apigatewayUrl}/city/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  findByDepartment(id: number): Observable<City[]> {
    return this.http.get<ApiResponse<City[]>>(`${this.apigatewayUrl}/city/department/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

}
