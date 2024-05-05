import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../../services/security/session/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes("auth")) return next.handle(request.clone());
        
        const token = this.sessionService.getToken();

        const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });

        return next.handle(authReq);
  }
}
