import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { ElectionTable } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectionTableService {

  apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;

  private electionTableSubject = new BehaviorSubject<ElectionTable[]>([]);
  electionTables$: Observable<ElectionTable[]> = this.electionTableSubject.asObservable();

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
    this.http.get<ApiResponse<ElectionTable[]>>(`${this.apigatewayUrl}/election-table`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (electionTables) => this.electionTableSubject.next(electionTables),
        error: (err) => this.electionTableSubject.error(this.mapError(err))
      });
  }

  findById(id: number): Observable<ElectionTable> {
    return this.http.get<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  create(electionTable: ElectionTable): Observable<ElectionTable> {
    return this.http.post<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table`, electionTable)
      .pipe(
        map(response => response.data),
        tap(newElectionTable => this.electionTableSubject.next([...this.electionTableSubject.value, newElectionTable])),
        catchError(error => this.handleError(error))
      );
  }

  update(electionTable: ElectionTable): Observable<ElectionTable> {
    return this.http.put<ApiResponse<ElectionTable>>(`${this.apigatewayUrl}/election-table`, electionTable)
      .pipe(
        map(response => response.data),
        tap(updatedElectionTable => {
          const electionTables = this.electionTableSubject.value.map(electionTable => electionTable.id === updatedElectionTable.id ? updatedElectionTable : electionTable);
          this.electionTableSubject.next(electionTables);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/election-table/delete/${id}`)
      .pipe(
        tap(() => {
          const electionTables = this.electionTableSubject.value.filter(electionTable => electionTable.id !== id);
          this.electionTableSubject.next(electionTables);
        })
      );
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/election-table/change-state/${id}`)
      .pipe(catchError(err => this.handleError(err)));
  }

}
