import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
          console.log(response)
          Swal.fire('Email or Password is Incorrect.');
        }
      },
      (error: any) => {
        if (error.status === 401) {
          Swal.fire('Email or Password is Incorrect.');
        } else {
          Swal.fire('An unexpected error occurred. Please try again later.');
        }
      }
    );
  }
}
