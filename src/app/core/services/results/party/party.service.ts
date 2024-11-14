import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { Party } from 'src/app/core/models/results.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.RESULTS_PATH}`;

  private partySubject = new BehaviorSubject<Party[]>([]);
  parties$: Observable<Party[]> = this.partySubject.asObservable();

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
    this.http.get<ApiResponse<Party[]>>(`${this.apigatewayUrl}/party`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (parties) => {
          this.partySubject.next(parties);
          this.spinnerService.changeState(false);
        },
        error: (err) => {
          this.partySubject.error(this.mapError(err));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<Party> {
    return this.http.get<ApiResponse<Party>>(`${this.apigatewayUrl}/party/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  create(party: Party): Observable<Party> {
    return this.http.post<ApiResponse<Party>>(`${this.apigatewayUrl}/party`, party)
      .pipe(
        map(response => response.data),
        tap(newParty => this.partySubject.next([...this.partySubject.value, newParty])),
        catchError(error => this.handleError(error))
      );
  }

  update(party: Party): Observable<Party> {
    return this.http.put<ApiResponse<Party>>(`${this.apigatewayUrl}/party`, party)
      .pipe(
        map(response => response.data),
        tap(updatedParty => {
          const parties = this.partySubject.value.map(party => party.id === updatedParty.id ? updatedParty : party);
          this.partySubject.next(parties);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/party/delete/${id}`)
      .pipe(
        tap(() => {
          const parties = this.partySubject.value.filter(party => party.id !== id);
          this.partySubject.next(parties);
        }),
        catchError(error => this.handleError(error))
      );
  }

  changeStateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apigatewayUrl}/party/change-state/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }

}
