import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/response.model';
import { DocumentType } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../utils/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  apigatewayUrl = `${environment.APIGATEWAY_URL}${environment.APIGATEWAY_PATH}${environment.SECURITY_PATH}`;

  private docTypeSubject = new BehaviorSubject<DocumentType[]>([]);
  docTypes$: Observable<DocumentType[]> = this.docTypeSubject.asObservable();

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

  findAll() {
    this.spinnerService.changeState(true);
    this.http.get<ApiResponse<DocumentType[]>>(`${this.apigatewayUrl}/doc-type`)
      .pipe(
        map(response => response.data)
      )
      .subscribe({
        next: (docTypes) => {
          this.docTypeSubject.next(docTypes);
          this.spinnerService.changeState(false);
        },
        error: (err) => {
          this.docTypeSubject.error(this.mapError(err));
          this.spinnerService.changeState(false);
        }
      });
  }

  findById(id: number): Observable<DocumentType> {
    return this.http.get<ApiResponse<DocumentType>>(`${this.apigatewayUrl}/doc-type/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

}
