import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LogInRequest } from '../common/log-in-request';
import { JwtAuthenticationResponse } from '../common/jwt-authentication-response';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { SignUpRequest } from '../common/sign-up-request';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService, 
    private shoppingCartService: ShoppingCartService) { }

  private authURL: string = 'http://localhost:8080/api/auth';

  signUp(signUpRequest: SignUpRequest): Observable<any> {
    return this.httpClient.post(`${this.authURL}/sign-up`, signUpRequest);
  }  

  logIn(logInRequest: LogInRequest): Observable<boolean> {
    return this.httpClient.post<JwtAuthenticationResponse>(`${this.authURL}/log-in`, logInRequest).pipe(
      map( data => {
        this.localStorageService.store('authenticationToken', data.authenticationToken);
        this.localStorageService.store('username', data.username);
        console.log(`logged in as ${data.username}`);
        return true;
      }));
  }

  isAuthenticated(): boolean {
    return this.localStorageService.retrieve('username') != null;
  }

  getUsername(): string {
    return this.localStorageService.retrieve('username');
  }

  logOut() {
    this.localStorageService.clear('username');
    this.localStorageService.clear('authenticationToken');
    this.shoppingCartService.injectQuanity(0);
  }

}
