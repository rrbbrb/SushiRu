import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { audit } from 'rxjs/operators';
import { Address } from 'src/app/common/address';
import { ChangePasswordRequest } from 'src/app/common/change-password-request';
import { User } from 'src/app/common/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  changePassword: boolean = false;
  editAddress: boolean = false;
  changePasswordForm: FormGroup;
  changePasswordRequest: ChangePasswordRequest;
  addressForm: FormGroup;
  user: User;
  address: Address
  username: string;

  constructor(private authService: AuthService, private accountService: AccountService) {

    const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
      const password = control.get('newPassword');
      const confirmPassword = control.get('confirmNewPassword');
      return password.value  != confirmPassword.value ? { 'passwordError': true } : null;
    }
    
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmNewPassword: new FormControl('')
    }, { validators: passwordErrorValidator });

    this.addressForm = new FormGroup({
      fullName: new FormControl(),
      contactNumber: new FormControl(),
      address: new FormControl(),
      district: new FormControl(),
      city: new FormControl('Taipei City')
    });
   }

  ngOnInit(): void {
    this.fetchUserInfo();
    this.addressForm.disable();
    this.changePasswordRequest = {
      oldPassword: '',
      newPassword: ''
    }
  }

  fetchUserInfo() {
    this.accountService.getUserInfo().subscribe( data => {
      this.user = data;
      this.address = data.addressDto;
      this.username = this.user.username;
      this.addressForm.patchValue({
        fullName: this.address.fullName,
        contactNumber: this.address.contactNumber,
        address: this.address.address,
        district: this.address.district,
      })
    });
  }

  onChangePassword(changePassword: boolean) {
    if(changePassword == false) {
      this.changePasswordForm.reset();
    }
    this.changePassword = changePassword;
  }

  onEditAddress(editAddress: boolean) {
    if(editAddress == true) {
      this.addressForm.enable();
      this.addressForm.get('city').disable();
    } else {
      this.fetchUserInfo();
      this.addressForm.disable();
    }
    this.editAddress = editAddress;
  }

  onSubmitChangePassword() {
    this.changePasswordRequest.oldPassword = this.changePasswordForm.get('currentPassword').value;
    this.changePasswordRequest.newPassword = this.changePasswordForm.get('newPassword').value;

    this.accountService.updatePassword(this.changePasswordRequest).subscribe( data => {
      if(data) {
        console.log("password changed");
        this.onChangePassword(!this.changePassword);
        this.changePasswordForm.reset();
      } else {
        console.log("password not changed")
        window.alert("an error occurred");
      }
    })
  }

  onSubmitAddress() {
    this.address.fullName = this.addressForm.get('fullName').value;
    this.address.contactNumber = this.addressForm.get('contactNumber').value;
    this.address.address = this.addressForm.get('address').value;
    this.address.district = this.addressForm.get('district').value;
    this.address.city = 'Taipei City';
    this.accountService.updateAddress(this.address).subscribe( data => {
      if(data) {
        console.log(`address updated : ${this.address}`);
        this.accountService.injectUserAddress(this.address);
        this.onEditAddress(!this.editAddress);
      } else {
        console.log(`address not udpated`);
        window.alert("an error occurred");
      }
    }, error => {
      console.log(error);
    });
  }

}
