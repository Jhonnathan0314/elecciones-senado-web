import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/models/authentication.model';
import { SessionData } from 'src/app/core/models/session.model';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private router: Router, private cryptoService: CryptoService) {
    this.validateSession();
  }


  saveSession(loginRequest: LoginRequest, token: string) {
    const sessionData = {
      token: token,
      username: loginRequest.username,
      role: this.getTokenAttribute(token, "user_role")
    };
    localStorage.setItem("object", this.cryptoService.encryptObject(sessionData));
    this.validateSession();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/security/login');
  }

  validateSession() {
    if (this.isLogged()) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.logout();
    }
  }

  isValidSessionData(): boolean {
    return this.getSessionData().isValid();
  }

  isLogged(): boolean {
    return localStorage.getItem("object") != null && this.isValidSessionData() && !this.isTokenExpired();
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
    const localStorageValue = this.cryptoService.decryptObject(localStorage.getItem("object") ?? "");

    let sessionData: SessionData = new SessionData();
    sessionData.token = localStorageValue.token;
    sessionData.username = localStorageValue.username;
    sessionData.role = localStorageValue.role;
    
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

  getUsername() { return this.getSessionData().username; }

  getRole() { return this.getSessionData().role; }
  
  getToken() { return this.getSessionData().token; }

}
