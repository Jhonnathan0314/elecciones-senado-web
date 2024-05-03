import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/models/authentication.model';
import { SessionData } from 'src/app/core/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private router: Router) { }


  saveSession(loginRequest: LoginRequest, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", loginRequest.username);
    localStorage.setItem("role", this.getTokenAttribute(token, 'user_role'));
    if (this.isTokenExpired() || !this.isValidSessionData()) this.logout();
    this.validateSession();
  }

  logout() {
    localStorage.clear();
    this.redirect('/security/login');
  }

  validateSession() {
    if (this.isLogged()) {
      this.redirect('/dashboard');
    } else {
      this.logout();
    }
  }

  isValidSessionData(): boolean {
    return this.getSessionData().isValid();
  }

  isLogged(): boolean {
    return localStorage.getItem("token") != null && this.isValidSessionData();
  }

  isTokenExpired(): boolean {
    const sessionData = this.getSessionData();
    const token = sessionData.token;
    const tokenPayload = this.decodePayload(token)

    if (!tokenPayload) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return tokenPayload.exp < now;
  }

  getSessionData(): SessionData {
    let sessionData: SessionData = new SessionData();
    sessionData.token = localStorage.getItem('token') || '';
    sessionData.username = localStorage.getItem('username') || '';
    sessionData.role = localStorage.getItem('role') || '';
    
    return sessionData;
  }

  redirect(path: string) {
    this.router.navigateByUrl(path);
  }

  getTokenAttribute(token: string, attribute: string) {
    return this.decodePayload(token)[attribute];
  }

  private decodePayload(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

}
