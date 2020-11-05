import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LogInRequest } from 'src/app/common/log-in-request';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  logInRequest: LogInRequest;
  previousPath: string = "";

  constructor(private authService: AuthService, private router: Router, private translateService: TranslateService, 
    private shoppingCartService: ShoppingCartService) { 
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.logInRequest = {
      username: '',
      password: ''
    }
  }

  username: string = this.authService.getUsername();

  ngOnInit(): void {
  }

  onSubmit() {
    this.logInRequest.username = this.loginForm.get('username').value;
    this.logInRequest.password = this.loginForm.get('password').value;

    this.authService.logIn(this.logInRequest).subscribe(data => {
      if(data) {
        if(this.shoppingCartService.hasLocalCart()) {
          this.shoppingCartService.migrateCartFromLocalToDB().subscribe( quantity => {
            if(quantity >= 0) {
              this.shoppingCartService.injectQuanity(quantity);
              console.log("cart migrated");
            } else {
              this.shoppingCartService.injectQuanity(0);
              console.log("cart not migrated");
            }
          }, error => {
            console.log(error);
          })
          this.shoppingCartService.clearLocalCart(); 
        }
        console.log("Login successful");
        this.router.navigateByUrl('');
      } else {
        console.log("Login failed");
      }
    }, error => {
      console.log(error);
      window.alert("Invalid username or password");
    });
  }

}
