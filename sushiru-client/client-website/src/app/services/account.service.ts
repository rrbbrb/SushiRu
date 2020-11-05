import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../common/address';
import { ChangePasswordRequest } from '../common/change-password-request';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userAddress = new BehaviorSubject<Address>(null);
  currentUserAddress = this.userAddress.asObservable();
  userURL: string = 'http://localhost:8080/api/user';

  constructor(private httpClient: HttpClient) {
    this.getUserInfo().subscribe(data => {
      this.injectUserAddress(data.addressDto);
    })
  }

  injectUserAddress(address: Address) {
    this.userAddress.next(address);
  }

  getUserInfo(): Observable<any> {
    return this.httpClient.get<User>(this.userURL);
  }

  updatePassword(changePasswordRequest: ChangePasswordRequest): Observable<any> {
    return this.httpClient.put<boolean>(`${this.userURL}/change-password`, changePasswordRequest);
  }

  updateAddress(address: Address): Observable<any> {
    return this.httpClient.put<boolean>(`${this.userURL}/update-address`, address);
  }
}
