import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  changePassword: boolean = false;
  editAddress: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onChangePassword(changePassword: boolean) {
    this.changePassword = changePassword;
  }

  onEditAddress(editAddress: boolean) {
    this.editAddress = editAddress;
  }

}
