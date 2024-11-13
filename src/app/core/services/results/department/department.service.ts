import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { Department } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;

  private departmentSubject = new BehaviorSubject<Department[]>([]);
  departments$: Observable<Department[]> = this.departmentSubject.asObservable();

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
    this.http.get<ApiResponse<Department[]>>(`${this.apigatewayUrl}/department`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (departments) => {
          this.departmentSubject.next(departments);
          this.spinnerService.changeState(false);
        },
        error: (err) => {
          this.departmentSubject.error(this.mapError(err));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<Department> {
    return this.http.get<ApiResponse<Department>>(`${this.apigatewayUrl}/department/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

}
