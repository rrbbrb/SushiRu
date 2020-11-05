import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignUpRequest } from 'src/app/common/sign-up-request';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signUpRequest: SignUpRequest;


  constructor(private authService: AuthService, private router: Router, private translateService: TranslateService) {
    const passwordErrorValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      return password.value  != confirmPassword.value ? { 'passwordError': true } : null;
    }

    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: passwordErrorValidator });

    this.signUpRequest = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
  }
  
  onSubmit() {
    this.signUpRequest.username = this.signupForm.get('username').value;
    this.signUpRequest.password = this.signupForm.get('password').value;

    this.authService.signUp(this.signUpRequest).subscribe( data => {
      console.log('sign up successful');
      this.router.navigateByUrl('/signup-success');
    }, error => {
      console.log('sign up failed');
      // let usernameTaken: string;
      // this.translateService.get('login.usernameTaken').subscribe(translation => {
      //   usernameTaken = translation;
      // });
      // window.alert(usernameTaken);
    });
  }


}
