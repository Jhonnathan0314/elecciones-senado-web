import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { Candidate } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.RESULTS_PATH}`;

  private candidateSubject = new BehaviorSubject<Candidate[]>([]);
  candidates$: Observable<Candidate[]> = this.candidateSubject.asObservable();

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
    this.http.get<ApiResponse<Candidate[]>>(`${this.apigatewayUrl}/candidate`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (candidates) => {
          this.candidateSubject.next(candidates);
          this.spinnerService.changeState(false);
        },
        error: (err) => {
          this.candidateSubject.error(this.mapError(err));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<Candidate> {
    return this.http.get<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  create(candidate: Candidate): Observable<Candidate> {
    return this.http.post<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate`, candidate)
      .pipe(
        map(response => response.data),
        tap(newCandidate => this.candidateSubject.next([...this.candidateSubject.value, newCandidate])),
        catchError(error => this.handleError(error))
      );
  }

  update(candidate: Candidate): Observable<Candidate> {
    return this.http.put<ApiResponse<Candidate>>(`${this.apigatewayUrl}/candidate`, candidate)
      .pipe(
        map(response => response.data),
        tap(updatedCandidate => {
          const candidates = this.candidateSubject.value.map(candidate => candidate.id === updatedCandidate.id ? updatedCandidate : candidate);
          this.candidateSubject.next(candidates);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/candidate/delete/${id}`)
      .pipe(
        tap(() => {
          const candidates = this.candidateSubject.value.filter(candidate => candidate.id !== id);
          this.candidateSubject.next(candidates);
        }),
        catchError(error => this.handleError(error))
      );
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/candidate/change-state/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }

}
