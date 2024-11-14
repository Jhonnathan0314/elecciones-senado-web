import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { Result } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.RESULTS_PATH}`;

  private resultSubject = new BehaviorSubject<Result[]>([]);
  results$: Observable<Result[]> = this.resultSubject.asObservable();

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
    this.http.get<ApiResponse<Result[]>>(`${this.apigatewayUrl}/result`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (results) => {
          this.resultSubject.next(results);
          this.spinnerService.changeState(false);
        },
        error: (err) => {
          this.resultSubject.error(this.mapError(err));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<Result> {
    return this.http.get<ApiResponse<Result>>(`${this.apigatewayUrl}/result/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  create(result: Result): Observable<Result> {
    return this.http.post<ApiResponse<Result>>(`${this.apigatewayUrl}/result`, result)
      .pipe(
        map(response => response.data),
        tap(newResult => this.resultSubject.next([...this.resultSubject.value, newResult])),
        catchError(error => this.handleError(error))
      );
  }

  update(result: Result): Observable<Result> {
    return this.http.put<ApiResponse<Result>>(`${this.apigatewayUrl}/result`, result)
      .pipe(
        map(response => response.data),
        tap(updatedResult => {
          const results = this.resultSubject.value.map(result => result.id === updatedResult.id ? updatedResult : result);
          this.resultSubject.next(results);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/result/delete/${id}`)
      .pipe(
        tap(() => {
          const results = this.resultSubject.value.filter(result => result.id !== id);
          this.resultSubject.next(results);
        })
      );
  }

}
