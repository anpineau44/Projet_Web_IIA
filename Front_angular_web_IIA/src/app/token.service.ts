import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string | null = null;
  private tokenKey = 'auth_token';

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if(this.token==null){
      return localStorage.getItem(this.tokenKey);
    }
    return this.token;
  }
}
