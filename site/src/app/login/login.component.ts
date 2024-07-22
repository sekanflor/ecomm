import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // To store error message

  constructor(private serviceService: ServiceService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    const data = {
      email: this.email,
      password: this.password
    };

    this.serviceService.userLogin(data).subscribe(
      (response: any) => {
        console.log('Login Successful.', response);
        if (response.status.remarks === 'success') {
          this.router.navigate(['/homepage']);
        } else {
          alert('There is an error, try again!');
        }
      },
      (error: any) => {
        if (error.status === 401) {
          alert('Email or Password is Incorrect.');
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    );
  }
}
