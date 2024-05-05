import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/response.model';
import { DocumentType } from 'src/app/core/models/security.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  apigatewayUrl = '';

  constructor(private http: HttpClient) {
    this.apigatewayUrl = environment.APIGATEWAY_URL + environment.APIGATEWAY_PATH + environment.RESULTS_PATH;
  }

  findAll(): Observable<ApiResponse<DocumentType[]>> {
    return this.http.get<ApiResponse<DocumentType[]>>(`${this.apigatewayUrl}/doc-type`);
  }

  findById(id: number): Observable<ApiResponse<DocumentType>> {
    return this.http.get<ApiResponse<DocumentType>>(`${this.apigatewayUrl}/doc-type/${id}`);
  }

}
