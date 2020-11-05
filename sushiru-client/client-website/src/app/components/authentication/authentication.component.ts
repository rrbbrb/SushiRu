import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  loggedInUsername: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  isAuthenticated(): boolean {
    this.loggedInUsername = this.authService.getUsername();
    return this.authService.isAuthenticated();
  }

  onLogOut() {
    this.authService.logOut();
  }

}
